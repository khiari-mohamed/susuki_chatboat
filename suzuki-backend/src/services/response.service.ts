// ═══════════════════════════════════════════════════════════════════
// Customer-facing texts. Business rules (CarPro emails 2026-09-11/18):
//   - public price (prix_ttc), never the wholesale price
//   - available when consolidated stock >= 2 (shared rule from the verifier)
//   - when a part cannot be confirmed: no guess, the exact sentence below
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { COMPTOIR_PR_PHONES, COMPTOIR_REDIRECT_MESSAGE, hasKnownStock } from '../constants/business-rules.constants';
import { publicPrice, stockIsAvailable } from '../chat/catalog-verifier';
import { formatCodeLabel, formatPositionLabel } from '../chat/part-constraints';
import type { ConstraintOutcome } from '../chat/part-constraints';

// Re-exported so existing imports keep working; the values live in one place.
export const PR_COUNTER_PHONE = COMPTOIR_PR_PHONES;
export const SECURISATION_MESSAGE = COMPTOIR_REDIRECT_MESSAGE;

const RESPONSE_PRODUCT_LIMIT = 1;
const CONTACT_LINE = `💡 ${SECURISATION_MESSAGE}`;
const RESERVE_LINE = `💡 Contactez le Comptoir Pièces de Rechange CarPro au ☎️ ${PR_COUNTER_PHONE} pour réserver.`;

@Injectable()
export class ResponseService {
  // ─── helpers ────────────────────────────────────────────────────
  /** French name first (already mapped rows carry displayName), English OEM name as last resort. */
  private getDisplayName(product: any): string {
    if (product.displayName && product.displayName.trim().length > 0) return product.displayName.trim();
    const french = (product.designation2 ?? product.designation_2 ?? '').trim();
    return french.length > 0 ? french : (product.designation ?? '').trim();
  }

  /** Public price only: a missing prix_ttc shows no price rather than the wholesale one. */
  private getPrice(product: any): string | null {
    const value = publicPrice(product);
    return value === null ? null : `${value.toFixed(3)} TND`;
  }

  private getSourceSuffix(product: any): string {
    const source = product.source ?? product.sourceLabel ?? '';
    return source === '02_CARPRO' || source === 'CarPro Parts' ? ' [CarPro]' : '';
  }

  private vehicleSuffix(vehicle: any): string {
    if (!vehicle?.modele) return '';
    return ` pour votre ${[vehicle.marque, vehicle.modele].filter(Boolean).join(' ')}`;
  }

  private dedupeProductsByReference(products: any[]): any[] {
    const seen = new Set<string>();
    return products.filter((product) => {
      const reference = (product.reference ?? '').toString().trim();
      if (!reference) return true;
      if (seen.has(reference)) return false;
      seen.add(reference);
      return true;
    });
  }

  private availableList(products: any[]): string {
    return this.dedupeProductsByReference(products.filter((product) => stockIsAvailable(product)))
      .slice(0, RESPONSE_PRODUCT_LIMIT)
      .map((product) => `• ${this.getDisplayName(product)}${this.getSourceSuffix(product)} — ${this.getPrice(product) ?? 'prix non communiqué'}`)
      .join('\n');
  }

  /** In stock first, then the most relevant row. */
  selectPrimaryProduct(products: any[]): any | null {
    if (!Array.isArray(products) || products.length === 0) return null;
    const unique = this.dedupeProductsByReference(products);
    const available = unique.filter((product) => stockIsAvailable(product));
    if (available.length > 0) return available[0];
    return [...unique].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? null;
  }

  /** No consolidated stock value: availability cannot be stated either way. */
  private stockUnknown(product: any): boolean {
    return !hasKnownStock(product?.stock);
  }

  /** Unknown stock: no "Indisponible", no guess, exact Comptoir sentence. */
  buildUnknownStockResponse(vehicle?: any): string {
    return `Je ne peux pas confirmer la disponibilité de cette pièce${this.vehicleSuffix(vehicle)}.\n\n${CONTACT_LINE}`;
  }

  // ─── product answers ────────────────────────────────────────────
  buildProductResponse(products: any[], vehicle: any): string {
    const primary = this.selectPrimaryProduct(products);
    if (!primary) return this.buildNoResultsResponse(vehicle);
    if (this.stockUnknown(primary)) return this.buildUnknownStockResponse(vehicle);

    const suffix = this.vehicleSuffix(vehicle);
    if (stockIsAvailable(primary)) {
      return `Pièces disponibles${suffix} :\n\n${this.availableList([primary])}\n\nStatut: Disponible\n\n${RESERVE_LINE}`;
    }
    return (
      `Pièces trouvées${suffix} :\n\n` +
      `• ${this.getDisplayName(primary)}${this.getSourceSuffix(primary)} — Indisponible\n\n` +
      `💡 Contactez le Comptoir Pièces de Rechange CarPro au ☎️ ${PR_COUNTER_PHONE} pour vérifier les délais.`
    );
  }

  buildPriceResponse(products: any[], vehicle: any): string {
    const suffix = this.vehicleSuffix(vehicle);
    const primary = this.selectPrimaryProduct(products);
    if (!primary) return this.buildNoResultsResponse(vehicle);
    if (this.stockUnknown(primary)) return this.buildUnknownStockResponse(vehicle);
    if (!stockIsAvailable(primary)) {
      return `${this.getDisplayName(primary)}${suffix}\nStatut: Indisponible — prix non communiqué.\n\n${CONTACT_LINE}`;
    }
    return `Prix${suffix} :\n\n${this.availableList([primary])}\n\nStatut: Disponible\n\n${RESERVE_LINE}`;
  }

  buildFilteredResponse(products: any[], vehicle: any): string {
    const suffix = this.vehicleSuffix(vehicle);
    if (!products.some((product) => stockIsAvailable(product))) {
      return `Aucun résultat disponible avec les filtres appliqués${suffix}.\n\n${CONTACT_LINE}`;
    }
    return `Résultats filtrés${suffix} :\n\n${this.availableList(products)}\n\n${RESERVE_LINE}`;
  }

  buildStockCheckResponse(partLabel: string, product: any, vehicle: any): string {
    if (this.stockUnknown(product)) return this.buildUnknownStockResponse(vehicle);
    const suffix = this.vehicleSuffix(vehicle);
    if (stockIsAvailable(product)) {
      return (
        `Oui, ${partLabel} est disponible${suffix}.\n\n` +
        `Produit disponible :\n${this.availableList([product])}\n\n` +
        `💡 Contactez le Comptoir Pièces de Rechange CarPro au ☎️ ${PR_COUNTER_PHONE} pour réserver.`
      );
    }
    return `Désolé, ${partLabel} n'est pas disponible actuellement${suffix}.\n\n${CONTACT_LINE}`;
  }

  buildReferenceResponse(reference: string, product: any, vehicle: any): string {
    if (this.stockUnknown(product)) return this.buildUnknownStockResponse(vehicle);
    const available = stockIsAvailable(product);
    const price = available ? this.getPrice(product) : null;
    return (
      `Bonjour! Référence trouvée${this.vehicleSuffix(vehicle)} :\n\n` +
      `• ${this.getDisplayName(product)}${this.getSourceSuffix(product)} (Réf: ${product.reference})${price ? `\nPrix: ${price}` : ''}\n` +
      `Statut: ${available ? 'Disponible' : 'Indisponible'}\n\n` +
      RESERVE_LINE
    );
  }

  buildReferenceNotFoundResponse(reference: string, vehicle?: any): string {
    return (
      `Bonjour! Aucun produit trouvé pour la référence "${reference}"${this.vehicleSuffix(vehicle)}.\n\n` +
      `Vérifiez l'orthographe de la référence.\n\n${CONTACT_LINE}`
    );
  }

  // ─── cannot answer ──────────────────────────────────────────────
  /** Nothing found: not proof of unavailability, so nothing is asserted. */
  buildNoResultsResponse(vehicle: any): string {
    return `Je n'ai trouvé aucune pièce correspondante${this.vehicleSuffix(vehicle)}.\n\n${CONTACT_LINE}`;
  }

  /**
   * The requested part exists but not in the requested position. Existing
   * positions are listed only when the part's identity was verified.
   */
  buildNoExactMatchResponse(constraint: ConstraintOutcome, vehicle: any): string {
    const part = constraint.requestedPart ?? 'cette pièce';
    const wanted = formatPositionLabel(constraint.requestedPositions);
    const existing =
      constraint.identityMode === 'strict-head' && constraint.availablePositions.length > 0
        ? `Positions existantes pour cette pièce : ${constraint.availablePositions.map((code) => formatCodeLabel(code)).join(', ')}.\n\n`
        : '';
    return (
      `Je n'ai pas trouvé « ${part} » en position ${wanted}${this.vehicleSuffix(vehicle)}.\n\n` +
      existing +
      `💡 Précisez une position existante ou contactez le Comptoir Pièces de Rechange.\n${SECURISATION_MESSAGE}`
    );
  }

  /**
   * Used when the decision engine withholds an answer, even if candidates
   * exist: the part may well be in stock, it just cannot be confirmed.
   */
  buildSecurisationResponse(vehicle?: any): string {
    return `Je ne peux pas confirmer cette pièce avec un niveau de fiabilité suffisant${this.vehicleSuffix(vehicle)}.\n\n${CONTACT_LINE}`;
  }

  // ─── static texts ───────────────────────────────────────────────
  buildGreetingResponse(): string {
    return "Bonjour, comment puis-je vous aider aujourd'hui ?";
  }

  buildThanksResponse(): string {
    return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
  }

  buildComplaintResponse(): string {
    return (
      'Bonjour, je suis désolé pour ce désagrément. ' +
      `Notre service client CarPro au ☎️ ${PR_COUNTER_PHONE} pourra vous aider à résoudre ce problème rapidement.`
    );
  }

  buildServiceQuestionResponse(): string {
    return (
      'Bonjour ! Je suis spécialisé dans les pièces automobiles Suzuki. ' +
      'Pour les questions sur les horaires, livraisons, garanties ou notre localisation, ' +
      `veuillez contacter CarPro au ☎️ ${PR_COUNTER_PHONE}. ` +
      'Comment puis-je vous aider avec des pièces ?'
    );
  }

  buildDiagnosticRedirectResponse(): string {
    return (
      `Bonjour! Pour tout problème technique ou diagnostic, contactez directement notre équipe d'experts CarPro.\n\n` +
      `☎️ Téléphone: ${PR_COUNTER_PHONE}\n` +
      `🔹 Service disponible 7j/7\n` +
      `🔹 Diagnostic professionnel sur place\n\n` +
      `Pour rechercher des pièces de rechange, je reste à votre disposition!`
    );
  }

  /** `_reason` is accepted for existing callers; the customer never sees technical details. */
  buildErrorResponse(_reason?: string): string {
    return (
      `Bonjour! Je rencontre une difficulté technique temporaire.\n\n` +
      CONTACT_LINE
    );
  }

  buildNoContextFilterResponse(): string {
    return (
      `Aucune recherche précédente à filtrer. Veuillez d'abord rechercher une pièce.\n\n` +
      CONTACT_LINE
    );
  }

  buildTooBroadResponse(): string {
    return 'Votre recherche correspond à de nombreuses références. Veuillez reformuler votre demande en ajoutant un mot distinctif (position, côté, version ou pièce concernée) afin de préciser la pièce recherchée.';
  }

  buildModelMismatchResponse(vehicleModel: string, requestedModel: string): string {
    return (
      `Votre carte grise indique ${vehicleModel}. Vous demandez des pièces pour ${requestedModel}.\n\n` +
      `Je peux vous aider avec ${vehicleModel}. Voulez‑vous changer de modèle ?`
    );
  }
}