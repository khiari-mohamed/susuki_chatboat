// src/services/response.service.ts
// ═══════════════════════════════════════════════════════════════════
// FIXES APPLIED (2026-06-25) aligned with advanced-search.service.ts:
//
// FIX-1: getDisplayName() helper — every place that previously used
//         p.designation (English OEM) now calls getDisplayName(p)
//         which returns designation_2 (French) when available, with
//         designation as the automatic fallback. The user always sees
//         the French name in formatted responses.
//
// FIX-2: getPrice() helper — safely coerces prixHt from string,
//         number, or Decimal to a formatted TND string. Previously
//         Number(p.prixHt).toFixed(3) threw when prixHt was already
//         a string returned by mapProductForResponse().
//
// FIX-3: buildProductResponse() and all list-building methods now
//         show source label ("CarPro Parts" vs "Suzuki OEM") when
//         the product comes from source 02_CARPRO, so users can see
//         which supplier the part comes from.
//
// FIX-4: buildReferenceResponse() uses displayName and shows both
//         the French name and reference clearly.
//
// FIX-5: buildPriceResponse() uses displayName and getPrice() for
//         consistent formatting.
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  private static readonly RESPONSE_PRODUCT_LIMIT = 1;

  // ─────────────────────────────────────────────────────────────────
  // FIX-1: Always return French name (designation_2) first
  // ─────────────────────────────────────────────────────────────────
  private getDisplayName(p: any): string {
    // After mapProductForResponse() in orchestrator, displayName is already set.
    // Handle both pre-mapped and raw Prisma rows.
    if (p.displayName && p.displayName.trim().length > 0) return p.displayName.trim();
    const french  = (p.designation2 ?? p.designation_2 ?? '').trim();
    const english = (p.designation ?? '').trim();
    return french.length > 0 ? french : english;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-2: Safe price formatter — handles string, number, or Decimal
  // ─────────────────────────────────────────────────────────────────
  private getPrice(p: any): string | null {
    // Always show prix_ttc (TTC) — client-facing price includes all taxes
    const raw = p.prixTtc ?? p.prix_ttc ?? p.prixHt ?? p.prix_ht ?? null;
    if (raw == null) return null;
    const num = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
    if (isNaN(num)) return null;
    return `${num.toFixed(3)} TND`;
  }

  // FIX-3: Source label for CarPro Parts
  private getSourceSuffix(p: any): string {
    const source = p.source ?? p.sourceLabel ?? '';
    if (source === '02_CARPRO' || source === 'CarPro Parts') return ' [CarPro]';
    return '';
  }

  private dedupeProductsByReference(products: any[]): any[] {
    const seen = new Set<string>();
    return products.filter((p) => {
      const ref = (p.reference ?? '').toString().trim();
      if (!ref) return true;
      if (seen.has(ref)) return false;
      seen.add(ref);
      return true;
    });
  }

  private isAvailable(p: any): boolean {
    const stock = p?.stock ?? {};
    const consolidated = stock.stockConsolide ?? stock.stock_consolide ?? p?.stockConsolide ?? p?.stock_consolide;
    if (consolidated !== undefined && consolidated !== null) {
      return Number(consolidated) > 2;
    }
    const fallbackQuantity = stock.totalQuantity ?? stock.total_quantity ?? p?.totalQuantity ?? p?.total_quantity ?? 0;
    return Number(fallbackQuantity) > 2;
  }

  selectPrimaryProduct(products: any[]): any | null {
    if (!Array.isArray(products) || products.length === 0) return null;

    const available = products.filter(
      (p) =>
        this.isAvailable(p) &&
        (p.prixHt != null || p.prix_ht != null),
    );

    if (available.length > 0) {
      return this.dedupeProductsByReference(available)[0] ?? null;
    }

    const unavailable = products.filter((p) => !this.isAvailable(p));
    if (unavailable.length === 0) {
      return products[0] ?? null;
    }

    const sorted = [...unavailable].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return this.dedupeProductsByReference(sorted)[0] ?? null;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-1 + FIX-2 + FIX-3: buildProductResponse
  // ─────────────────────────────────────────────────────────────────
  buildProductResponse(products: any[], query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';

    // BUGFIX-1: stock may be null for parts missing a stock row.
    // Treat null stock as Indisponible (safe default, matches DB behaviour).
    const available = products.filter(
      (p) =>
        this.isAvailable(p) &&
        (p.prixTtc != null || p.prix_ttc != null || p.prixHt != null || p.prix_ht != null),
    );
    const unavailable = products.filter(
      (p) => !this.isAvailable(p),
    );

    if (available.length > 0) {
      const uniqueAvailable = this.dedupeProductsByReference(available);
      const list = uniqueAvailable
        .slice(0, ResponseService.RESPONSE_PRODUCT_LIMIT)
        .map((p) => {
          const name   = this.getDisplayName(p);
          const price  = this.getPrice(p);
          const source = this.getSourceSuffix(p);
          return `• ${name}${source} — ${price}`;
        })
        .join('\n');
      return (
        `Pièces disponibles${vehicleInfo} :\n\n` +
        `${list}\n\n` +
        `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
      );
    }

    if (unavailable.length > 0) {
      // BUGFIX: show the most relevant unavailable part (highest score, or first)
      // Previously dedupeProductsByReference could surface a low-score part first.
      const sorted = [...unavailable].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      const uniqueUnavailable = this.dedupeProductsByReference(sorted);
      const list = uniqueUnavailable
        .slice(0, ResponseService.RESPONSE_PRODUCT_LIMIT)
        .map((p) => {
          const name   = this.getDisplayName(p);
          const source = this.getSourceSuffix(p);
          return `• ${name}${source} — Indisponible`;
        })
        .join('\n');
      return (
        `Pièces trouvées${vehicleInfo} :\n\n` +
        `${list}\n\n` +
        `💡 Contactez CarPro au ☎️ 70 603 500 pour vérifier les délais.`
      );
    }

    return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-5: buildPriceResponse
  // ─────────────────────────────────────────────────────────────────
  buildPriceResponse(
    products: any[],
    query: string,
    vehicle: any,
    lastTopic: string,
  ): string {
    const vehicleInfo = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';

    const available = products.filter(
      (p) =>
        this.isAvailable(p) &&
        (p.prixTtc != null || p.prix_ttc != null || p.prixHt != null || p.prix_ht != null),
    );

    if (available.length === 0) {
      const anyProduct = products[0];
      if (anyProduct) {
        const name = this.getDisplayName(anyProduct);
        return (
          `${name}${vehicleInfo}\n` +
          `Statut: Indisponible — prix non communiqué.\n\n` +
          `💡 Contactez CarPro au ☎️ 70 603 500 pour les délais et tarifs.`
        );
      }
      return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }

    const uniqueAvailable = this.dedupeProductsByReference(available);
    const list = uniqueAvailable
      .slice(0, ResponseService.RESPONSE_PRODUCT_LIMIT)
      .map((p) => {
        const name   = this.getDisplayName(p);
        const price  = this.getPrice(p);
        const source = this.getSourceSuffix(p);
        return `• ${name}${source} — ${price}`;
      })
      .join('\n');

    return (
      `Prix${vehicleInfo} :\n\n` +
      `${list}\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // FIX-4: buildReferenceResponse — French name + source label
  // ─────────────────────────────────────────────────────────────────
  buildReferenceResponse(reference: string, product: any, vehicle: any): string {
    const vehicleInfo  = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';
    const isAvailable  = this.isAvailable(product);
    const price        = isAvailable ? this.getPrice(product) : null;
    const name         = this.getDisplayName(product);       // FIX-4: French first
    const source       = this.getSourceSuffix(product);      // FIX-3: source label
    const stockLine    = isAvailable ? 'Disponible' : 'Indisponible';
    const priceLine    = price ? `\nPrix: ${price}` : '';

    return (
      `Bonjour! Référence trouvée${vehicleInfo} :\n\n` +
      `• ${name}${source} (Réf: ${product.reference})${priceLine}\n` +
      `Statut: ${stockLine}\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  buildReferenceNotFoundResponse(reference: string, vehicle?: any): string {
    const vehicleInfo = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';
    return (
      `Bonjour! Aucun produit trouvé pour la référence "${reference}"${vehicleInfo}.\n\n` +
      `💡 Vérifiez l'orthographe ou contactez CarPro au ☎️ 70 603 500 pour assistance.`
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // buildFilteredResponse — FIX-1 applied
  // ─────────────────────────────────────────────────────────────────
  buildFilteredResponse(products: any[], query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';

    const available = products.filter(
      (p) =>
        this.isAvailable(p) &&
        (p.prixTtc != null || p.prix_ttc != null || p.prixHt != null || p.prix_ht != null),
    );

    if (available.length === 0) {
      return (
        `Aucun résultat disponible avec les filtres appliqués${vehicleInfo}.\n\n` +
        `Contactez CarPro au ☎️ 70 603 500.`
      );
    }

    const uniqueAvailable = this.dedupeProductsByReference(available);
    const list = uniqueAvailable
      .slice(0, ResponseService.RESPONSE_PRODUCT_LIMIT)
      .map((p) => {
        const name   = this.getDisplayName(p);
        const price  = this.getPrice(p);
        const source = this.getSourceSuffix(p);
        return `• ${name}${source} — ${price}`;
      })
      .join('\n');

    return (
      `Résultats filtrés${vehicleInfo} :\n\n` +
      `${list}\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Static responses — unchanged content, no product text involved
  // ─────────────────────────────────────────────────────────────────

  buildGreetingResponse(): string {
    return "Bonjour, comment puis-je vous aider aujourd'hui ?";
  }

  buildThanksResponse(): string {
    return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
  }

  buildComplaintResponse(): string {
    return (
      'Bonjour, je suis désolé pour ce désagrément. ' +
      'Notre service client CarPro au ☎️ 70 603 500 pourra vous aider à résoudre ce problème rapidement.'
    );
  }

  buildServiceQuestionResponse(): string {
    return (
      'Bonjour ! Je suis spécialisé dans les pièces automobiles Suzuki. ' +
      'Pour les questions sur les horaires, livraisons, garanties ou notre localisation, ' +
      'veuillez contacter CarPro au ☎️ 70 603 500. ' +
      'Comment puis-je vous aider avec des pièces ?'
    );
  }

  buildDiagnosticRedirectResponse(): string {
    return (
      `Bonjour! Pour tout problème technique ou diagnostic, contactez directement notre équipe d'experts CarPro.\n\n` +
      `☎️ Téléphone: 70 603 500\n` +
      `🔹 Service disponible 7j/7\n` +
      `🔹 Diagnostic professionnel sur place\n\n` +
      `Pour rechercher des pièces de rechange, je reste à votre disposition!`
    );
  }

  buildErrorResponse(message: string): string {
    return (
      `Bonjour! Je rencontre une difficulté technique temporaire.\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour assistance immédiate.`
    );
  }

  buildNoContextFilterResponse(): string {
    return (
      `Aucune recherche précédente à filtrer. Veuillez d'abord rechercher une pièce.\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour assistance.`
    );
  }

  buildNoResultsResponse(query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele
      ? ` pour votre ${vehicle.marque} ${vehicle.modele}`
      : '';
    return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
  }

  buildModelMismatchResponse(vehicleModel: string, requestedModel: string): string {
    return (
      `Votre carte grise indique ${vehicleModel}. Vous demandez des pièces pour ${requestedModel}.\n\n` +
      `Je peux vous aider avec ${vehicleModel}. Voulez‑vous changer de modèle ?`
    );
  }
}
