// ═══════════════════════════════════════════════════════════════════
// Clarification questions, derived from the CANDIDATES (the catalog), not
// from part-name lists:
//   - position / side: asked only when the SAME part exists in several
//     positions among the candidates. A capot yields no question, a
//     charnière de capot yields only gauche/droite, a bare "pare-chocs"
//     yields avant/arrière (CarPro email 2026-09-18, anomaly 1).
//   - type: asked for a one-word query whose candidates are genuinely
//     different parts, using the words that distinguish them.
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import {
  compactKey,
  contentTokens,
  extractRequestedPositions,
  formatPositionLabel,
  getCatalogPositions,
  getCoreTokens,
  hasAnyPosition,
  isFillerToken,
  isPositionToken,
  keysMatch,
  positionsSatisfy,
  tokenizeName,
} from '../chat/part-constraints';
import type { Axis, Side } from '../chat/part-constraints';

export type ClarificationDimension = 'position' | 'side' | 'type';

export interface ClarificationContext {
  originalQuery: string;
  dimension: ClarificationDimension;
  products: any[];
  timestamp: number;
}

export type ClarificationNeed =
  | { needed: false }
  | { needed: true; variants: string[]; dimension: ClarificationDimension };

const PENDING_TTL_MS = 600_000;
const MAX_TYPE_VARIANTS = 5;
const GENERIC_QUERY_EXAMPLES = ['Filtre à air', 'Plaquettes frein', 'Amortisseur', 'Batterie', 'Phare'];

/** Words that turn an answer into "same as before" without naming anything new. */
const FOLLOW_UP_WORDS = new Set(['aussi', 'egalement', 'pareil', 'idem', 'meme', 'chose']);
/** Catalog words that never distinguish one part from another. */
const NOISE_TOKENS = new Set(['assy', 'comp', 'set', 'oem']);

const GENERIC_QUERY_PATTERNS = [
  /^je cherche des pi[èe]ces/i,
  /pi[èe]ces pour (?:ma|mon)?\s*suzuki/i,
  /^besoin de pi[èe]ces/i,
  /^quelles? pi[èe]ces/i,
  /^aide.*pi[èe]ces/i,
  /^des pi[èe]ces pour/i,
  /^pi[èe]ces.*suzuki/i,
];

const AXIS_ORDER: Axis[] = ['AV', 'AR'];
const SIDE_ORDER: Side[] = ['G', 'D'];

interface PositionGroup {
  key: string;
  axes: Set<Axis>;
  sides: Set<Side>;
}

@Injectable()
export class ClarificationService {
  private readonly pending = new Map<string, ClarificationContext>();

  // ─── pending state ──────────────────────────────────────────────
  setPending(sessionId: string, query: string, dimension: ClarificationDimension, products: any[]): void {
    this.pending.set(sessionId, { originalQuery: query, dimension, products, timestamp: Date.now() });
  }

  getPending(sessionId: string): ClarificationContext | undefined {
    return this.pending.get(sessionId);
  }

  clearPending(sessionId: string): void {
    this.pending.delete(sessionId);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [id, context] of this.pending.entries()) {
      if (now - context.timestamp > PENDING_TTL_MS) this.pending.delete(id);
    }
  }

  // ─── is this message the answer to the pending question? ───────
  /**
   * A position ("avant gauche", "et pour l'arrière") always answers. For a
   * type question the words that are not positions must come from the
   * candidates themselves. Anything else is a NEW request: "plaquettes
   * avant" must not be glued onto a pending bumper question.
   */
  isAnswer(message: string, context: ClarificationContext): boolean {
    const hasPosition = hasAnyPosition(extractRequestedPositions(message));
    const residual = this.contentWords(message).filter((token) => !FOLLOW_UP_WORDS.has(token));
    if (residual.length === 0) return hasPosition;
    if (context.dimension !== 'type') return false;

    return context.products.some((product) => this.containsAll(product, residual));
  }

  /** Keeps the articles whose designation contains every word of the type answer. */
  applyTypeAnswer(products: any[], answer: string): any[] {
    const wanted = this.contentWords(answer);
    if (wanted.length === 0) return products;
    const typed = products.filter((product) => this.containsAll(product, wanted));
    return typed.length > 0 ? typed : products;
  }

  // ─── is a question needed? ──────────────────────────────────────
  checkNeeded(products: any[], message: string): ClarificationNeed {
    if (!Array.isArray(products) || products.length === 0) return { needed: false };
    if (this.isGenericQuery(message)) {
      return { needed: true, variants: [...GENERIC_QUERY_EXAMPLES], dimension: 'type' };
    }

    const requested = extractRequestedPositions(message);
    let candidates = hasAnyPosition(requested)
      ? products.filter((product) => positionsSatisfy(requested, getCatalogPositions(product)))
      : products;
    if (candidates.length === 0) candidates = products;
    if (candidates.length === 1) return { needed: false };

    const existing = this.existingPositions(candidates);
    if (requested.axes.length === 0 && existing.axes.length > 1) {
      return {
        needed: true,
        variants: existing.axes.map((axis) => formatPositionLabel({ axes: [axis], sides: [], levels: [] })),
        dimension: 'position',
      };
    }
    if (requested.sides.length === 0 && existing.sides.length > 1) {
      return {
        needed: true,
        variants: existing.sides.map((side) => formatPositionLabel({ axes: [], sides: [side], levels: [] })),
        dimension: 'side',
      };
    }

    // Distinct parts behind a one-word query ("capot" → tige, serrure, calle…).
    // Request words ("je veux", "svp") and positions do not count as words of the query.
    const queryWords = this.contentWords(message);
    if (hasAnyPosition(requested) || queryWords.length > 1) return { needed: false };
    const variants = this.distinguishingWords(candidates, new Set(queryWords.map((word) => compactKey([word]))));
    return variants.length >= 2 ? { needed: true, variants, dimension: 'type' } : { needed: false };
  }

  buildQuestion(partLabel: string, variants: string[], dimension: ClarificationDimension): string {
    const variantList = variants.map((variant) => `• ${variant.charAt(0).toUpperCase()}${variant.slice(1)}`).join('\n');
    const dimensionLabel = dimension === 'position' ? 'la position' : dimension === 'side' ? 'le côté' : 'le type';
    const label = (partLabel ?? '').trim();
    const opening = label ? `Merci pour votre demande concernant ${label}.` : 'Merci pour votre demande.';
    return (
      `${opening}\n\n` +
      `Afin d'identifier précisément la pièce compatible, merci de préciser ${dimensionLabel} :\n` +
      `${variantList}\n\n` +
      `Dès confirmation, je pourrai vous communiquer la référence et le prix.`
    );
  }

  // ─── internals ──────────────────────────────────────────────────
  private isGenericQuery(message: string): boolean {
    const text = message.trim();
    return GENERIC_QUERY_PATTERNS.some((pattern) => pattern.test(text));
  }

  /**
   * Positions that really exist for the same part. Candidates are grouped by
   * their name without positions (spelling variants such as PARE / PARA CHOC
   * fall in the same group); a dimension counts only when one group exists
   * in several values of it.
   */
  private existingPositions(candidates: any[]): { axes: Axis[]; sides: Side[] } {
    const groups: PositionGroup[] = [];
    for (const product of candidates) {
      const key = this.groupKey(product);
      let group = groups.find((existing) => keysMatch(existing.key, key));
      if (!group) {
        group = { key, axes: new Set<Axis>(), sides: new Set<Side>() };
        groups.push(group);
      }
      const actual = getCatalogPositions(product);
      actual.axes.forEach((axis) => group.axes.add(axis));
      actual.sides.forEach((side) => group.sides.add(side));
    }

    const axes = new Set<Axis>();
    const sides = new Set<Side>();
    for (const group of groups) {
      if (group.axes.size > 1) group.axes.forEach((axis) => axes.add(axis));
      if (group.sides.size > 1) group.sides.forEach((side) => sides.add(side));
    }
    return {
      axes: AXIS_ORDER.filter((axis) => axes.has(axis)),
      sides: SIDE_ORDER.filter((side) => sides.has(side)),
    };
  }

  private groupKey(product: any): string {
    const core = getCoreTokens(product);
    if (core && core.length > 0) return compactKey(core);
    // English OEM names are comma-separated: "SHOCK ABSORBER, FR, L" → the head field.
    const head = tokenizeName(String(product.designation ?? '').split(',')[0]).filter((token) => !isPositionToken(token));
    return head.length > 0 ? `en:${compactKey(head)}` : `ref:${product.reference ?? ''}`;
  }

  /** Words present in some candidates but not in all: what makes them different parts. */
  private distinguishingWords(candidates: any[], queryKeys: ReadonlySet<string>): string[] {
    const counts = new Map<string, { label: string; count: number }>();
    for (const product of candidates) {
      const seen = new Set<string>();
      for (const raw of this.clarificationText(product).split(/[\s/(),-]+/)) {
        const tokens = contentTokens(raw);
        if (tokens.length !== 1) continue;
        const token = tokens[0];
        if (token.length < 3 || /\d/.test(token) || isPositionToken(token) || isFillerToken(token) || NOISE_TOKENS.has(token)) continue;
        const key = compactKey([token]);
        if (queryKeys.has(key) || seen.has(key)) continue;
        seen.add(key);
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { label: raw.toLowerCase(), count: 1 });
      }
    }
    return [...counts.values()]
      .filter((entry) => entry.count < candidates.length)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, MAX_TYPE_VARIANTS)
      .map((entry) => entry.label);
  }

  /** Words of a message that are neither positions nor conversational filler. */
  private contentWords(text: string): string[] {
    return contentTokens(text).filter(
      (token) => token.length >= 2 && !isPositionToken(token) && !isFillerToken(token),
    );
  }

  private containsAll(product: any, words: string[]): boolean {
    const tokens = this.tokenSet(`${this.clarificationText(product)} ${this.combinedText(product)}`);
    return words.every((word) => tokens.has(compactKey([word])));
  }

  private tokenSet(text: string): Set<string> {
    return new Set(contentTokens(text).map((token) => compactKey([token])));
  }

  /** Curated search description when available, otherwise the French display name. */
  private clarificationText(product: any): string {
    const description = (product.searchDescription ?? product.search_description ?? '').trim();
    if (description.length > 0) return description;
    const french = (product.designation2 ?? product.designation_2 ?? '').trim();
    return french.length > 0 ? french : (product.designation ?? '').trim();
  }

  private combinedText(product: any): string {
    const french = (product.designation2 ?? product.designation_2 ?? '').trim();
    const english = (product.designation ?? '').trim();
    return french.toLowerCase() === english.toLowerCase() ? french : `${french} ${english}`.trim();
  }
}