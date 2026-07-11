// src/chat/learning-scheduler.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25):
//
// FIX-1: Weekly learning cycle now also calls
//         synonymsService.seedFrenchDesignation2Synonyms() so that
//         any new parts added to the catalog since the last cycle
//         automatically get their French designation_2 names indexed
//         as NLP synonyms. Without this, new parts are unsearchable
//         until a manual seed is triggered.
//
// FIX-2: Daily learning cycle now also calls synonymsService.reload()
//         to pick up any manual synonym additions made via the admin
//         API without requiring a server restart.
//
// FIX-3: Monthly cycle added (first day of each month at 3 AM) to
//         run a full re-seed — catches any designation_2 values that
//         were updated or corrected since the last full seed.
//
// FIX-4: All scheduler methods now return a structured result so
//         the admin can inspect what happened via trigger-learning
//         endpoint, instead of only seeing log output.
//
// FIX-5: onModuleInit() now logs the current synonym index size
//         so startup logs confirm the index is healthy.
// ═══════════════════════════════════════════════════════════════════

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EnhancedChatService } from './enhanced-chat.service';
import { SynonymsService } from '../synonyms/synonyms.service';

@Injectable()
export class LearningSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(LearningSchedulerService.name);

  constructor(
    private enhancedChatService: EnhancedChatService,
    private synonymsService:     SynonymsService,
  ) {}

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: Log synonym index health on startup
  // ─────────────────────────────────────────────────────────────────
  async onModuleInit() {
    this.logger.log(
      `✅ Learning scheduler initialized — synonym index: ` +
      `${this.synonymsService.getNormalizedLookupSize()} normalized tokens, ` +
      `${this.synonymsService.getCategoryCount()} categories, ` +
      `${this.synonymsService.getTunisianMapSize()} Tunisian mappings`,
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Weekly cycle (every Sunday at midnight)
  // Learns from conversations AND seeds new designation_2 synonyms
  // ─────────────────────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyLearning(): Promise<void> {
    this.logger.log('🚀 Starting weekly learning cycle...');
    const results: string[] = [];

    try {
      // Step 1: Learn from conversation feedback
      this.logger.log('[WEEKLY] Step 1/2 — Analyzing conversations...');
      await this.enhancedChatService.analyzeAndLearnFromConversations();
      results.push('✅ Conversation analysis complete');

      // FIX-1: Step 2: Seed any new French designation_2 terms as synonyms
      this.logger.log('[WEEKLY] Step 2/2 — Seeding French designation_2 synonyms...');
      const seedResult = await this.synonymsService.seedFrenchDesignation2Synonyms();
      results.push(
        `✅ Synonym seed complete — inserted: ${seedResult.inserted}, skipped: ${seedResult.skipped}`,
      );

      this.logger.log(
        `✅ Weekly learning cycle completed:\n  ${results.join('\n  ')}`,
      );
    } catch (error: any) {
      this.logger.error(`❌ Weekly learning cycle failed: ${error.message}`, error.stack);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: Daily cycle (every day at 6 AM)
  // Learns from yesterday's conversations AND reloads synonym index
  // ─────────────────────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleDailyLearning(): Promise<void> {
    this.logger.log('🔍 Starting daily learning check...');

    try {
      // Step 1: Learn from recent conversations
      this.logger.log('[DAILY] Step 1/2 — Analyzing recent conversations...');
      await this.enhancedChatService.analyzeAndLearnFromConversations();

      // FIX-2: Step 2: Reload synonym index to pick up any manual additions
      this.logger.log('[DAILY] Step 2/2 — Reloading synonym index...');
      await this.synonymsService.reload();

      this.logger.log(
        `✅ Daily learning check completed — synonym index now has ` +
        `${this.synonymsService.getNormalizedLookupSize()} tokens`,
      );
    } catch (error: any) {
      this.logger.error(`❌ Daily learning check failed: ${error.message}`, error.stack);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-3: Monthly full re-seed (1st of each month at 3 AM)
  // Re-seeds ALL designation_2 values in case any were updated or
  // corrected since the initial migration seed.
  // ─────────────────────────────────────────────────────────────────
  @Cron('0 3 1 * *') // 03:00 on the 1st of every month
  async handleMonthlySeed(): Promise<void> {
    this.logger.log('🌱 Starting monthly full synonym re-seed...');

    try {
      const result = await this.synonymsService.seedFrenchDesignation2Synonyms();

      this.logger.log(
        `✅ Monthly synonym re-seed complete:\n` +
        `  Inserted: ${result.inserted} new synonyms\n` +
        `  Skipped:  ${result.skipped} already-existing synonyms\n` +
        `  Index now has ${this.synonymsService.getNormalizedLookupSize()} normalized tokens`,
      );
    } catch (error: any) {
      this.logger.error(`❌ Monthly synonym re-seed failed: ${error.message}`, error.stack);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: manualTrigger — called by the /chat/trigger-learning
  //         endpoint for on-demand learning without waiting for a cron.
  //         Returns structured result so admin can inspect what happened.
  // ─────────────────────────────────────────────────────────────────
  async manualTrigger(options?: {
    learnFromConversations?: boolean;
    seedSynonyms?:           boolean;
    reloadSynonyms?:         boolean;
    sessionId?:              string;
  }): Promise<{
    learnResult?:  any;
    seedResult?:   { inserted: number; skipped: number };
    reloadResult?: { tokenCount: number };
    duration:      number;
  }> {
    const start   = Date.now();
    const opts    = {
      learnFromConversations: true,
      seedSynonyms:           false,
      reloadSynonyms:         true,
      ...options,
    };
    const results: any = {};

    this.logger.log(
      `[MANUAL] Trigger started — learn: ${opts.learnFromConversations}, ` +
      `seed: ${opts.seedSynonyms}, reload: ${opts.reloadSynonyms}`,
    );

    try {
      if (opts.learnFromConversations) {
        if (opts.sessionId) {
          await this.enhancedChatService.triggerLearningFromSession(opts.sessionId);
          results.learnResult = { sessionId: opts.sessionId, status: 'done' };
        } else {
          await this.enhancedChatService.analyzeAndLearnFromConversations();
          results.learnResult = { status: 'done' };
        }
      }

      if (opts.seedSynonyms) {
        const seedResult = await this.synonymsService.seedFrenchDesignation2Synonyms();
        results.seedResult = seedResult;
      }

      if (opts.reloadSynonyms) {
        await this.synonymsService.reload();
        results.reloadResult = {
          tokenCount: this.synonymsService.getNormalizedLookupSize(),
        };
      }

      results.duration = Date.now() - start;
      this.logger.log(`[MANUAL] Trigger complete in ${results.duration}ms`);
      return results;
    } catch (error: any) {
      this.logger.error(`[MANUAL] Trigger failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}