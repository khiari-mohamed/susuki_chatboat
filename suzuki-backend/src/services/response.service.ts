import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  buildProductResponse(products: any[], query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';

    // Prefer available products; fall back to unavailable ones so we can still show the part exists
    const available = products.filter(
      (p) => (p.stock?.statut === 'Disponible' || p.available) && p.prixHt != null,
    );
    const unavailable = products.filter(
      (p) => p.stock?.statut !== 'Disponible' && !p.available,
    );

    if (available.length > 0) {
      const product = available[0];
      return (
        `${product.designation}${vehicleInfo}\n` +
        `Réf: ${product.reference}\n` +
        `Prix: ${Number(product.prixHt).toFixed(3)} TND\n\n` +
        `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
      );
    }

    if (unavailable.length > 0) {
      const product = unavailable[0];
      return (
        `${product.designation}${vehicleInfo}\n` +
        `Réf: ${product.reference}\n` +
        `Statut: Indisponible\n\n` +
        `💡 Contactez CarPro au ☎️ 70 603 500 pour vérifier les délais.`
      );
    }

    return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
  }

  buildPriceResponse(products: any[], query: string, vehicle: any, lastTopic: string): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';

    const available = products.filter(
      (p) => (p.stock?.statut === 'Disponible' || p.available) && p.prixHt != null,
    );

    if (available.length === 0) {
      // Part exists but not in stock — show part name, no price
      const anyProduct = products[0];
      if (anyProduct) {
        return (
          `${anyProduct.designation}${vehicleInfo}\n` +
          `Statut: Indisponible — prix non communiqué.\n\n` +
          `💡 Contactez CarPro au ☎️ 70 603 500 pour les délais et tarifs.`
        );
      }
      return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }

    const product = available[0];
    return (
      `${product.designation}${vehicleInfo}\n` +
      `Prix: ${Number(product.prixHt).toFixed(3)} TND\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  buildReferenceResponse(reference: string, product: any, vehicle: any): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    const isAvailable = product.stock?.statut === 'Disponible' || product.available === true;
    const priceStr = isAvailable && product.prixHt != null
      ? `${Number(product.prixHt).toFixed(3)} TND`
      : null;

    const stockLine = isAvailable ? 'Disponible' : 'Indisponible';
    const priceLine = priceStr ? `\nPrix: ${priceStr}` : '';

    return (
      `Bonjour! Référence trouvée${vehicleInfo} :\n\n` +
      `• ${product.designation} (Réf: ${product.reference})${priceLine}\n` +
      `Statut: ${stockLine}\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  buildReferenceNotFoundResponse(reference: string, vehicle?: any): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    return `Bonjour! Aucun produit trouvé pour la référence "${reference}"${vehicleInfo}.\n\n💡 Vérifiez l'orthographe ou contactez CarPro au ☎️ 70 603 500 pour assistance.`;
  }

  buildGreetingResponse(): string {
    return 'Bonjour, comment puis-je vous aider aujourd\'hui ?';
  }

  buildThanksResponse(): string {
    return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
  }

  buildComplaintResponse(): string {
    return 'Bonjour, je suis désolé pour ce désagrément. Notre service client CarPro au ☎️ 70 603 500 pourra vous aider à résoudre ce problème rapidement.';
  }

  buildServiceQuestionResponse(): string {
    return 'Bonjour ! Je suis spécialisé dans les pièces automobiles Suzuki. Pour les questions sur les horaires, livraisons, garanties ou notre localisation, veuillez contacter CarPro au ☎️ 70 603 500. Comment puis-je vous aider avec des pièces ?';
  }

  buildDiagnosticRedirectResponse(): string {
    return `Bonjour! Pour tout problème technique ou diagnostic, contactez directement notre équipe d'experts CarPro.\n\n☎️ Téléphone: 70 603 500\n🔹 Service disponible 7j/7\n🔹 Diagnostic professionnel sur place\n\nPour rechercher des pièces de rechange, je reste à votre disposition!`;
  }

  buildErrorResponse(message: string): string {
    return `Bonjour! Je rencontre une difficulté technique temporaire.\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour assistance immédiate.`;
  }

  buildNoContextFilterResponse(): string {
    return `Aucune recherche précédente à filtrer. Veuillez d'abord rechercher une pièce.\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour assistance.`;
  }

  buildNoResultsResponse(query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
  }

  buildFilteredResponse(products: any[], query: string, vehicle: any): string {
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';

    const available = products.filter(
      (p) => (p.stock?.statut === 'Disponible' || p.available) && p.prixHt != null,
    );

    if (available.length === 0) {
      return `Aucun résultat disponible avec les filtres appliqués${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }

    const product = available[0];
    return (
      `Résultat filtré${vehicleInfo}:\n` +
      `${product.designation}\n` +
      `Réf: ${product.reference}\n` +
      `Prix: ${Number(product.prixHt).toFixed(3)} TND\n\n` +
      `💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`
    );
  }

  buildModelMismatchResponse(vehicleModel: string, requestedModel: string): string {
    return `Votre carte grise indique ${vehicleModel}. Vous demandez des pièces pour ${requestedModel}.\n\nJe peux vous aider avec ${vehicleModel}. Voulez‑vous changer de modèle ?`;
  }
}
