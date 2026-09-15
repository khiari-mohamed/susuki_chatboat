import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: Redis | null = null;
  private available = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('REDIS_URL') || 'redis://localhost:6379';
    const client = new Redis(url, { lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 1 });

    client.on('connect', () => {
      this.available = true;
      this.logger.log('✅ Redis connected');
    });
    client.on('error', () => {
      if (this.available) this.logger.warn('⚠️  Redis unavailable — cache disabled');
      this.available = false;
    });

    client.connect().catch(() => {
      this.logger.warn('⚠️  Redis not reachable — running without cache');
    });

    this.client = client;
  }

  async onModuleDestroy() {
    await this.client?.quit().catch(() => {});
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available) return null;
    try {
      const raw = await this.client!.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!this.available) return;
    try {
      await this.client!.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.available) return;
    try {
      const keys = await this.client!.keys(pattern);
      if (keys.length > 0) await this.client!.del(...keys);
    } catch {}
  }
}
