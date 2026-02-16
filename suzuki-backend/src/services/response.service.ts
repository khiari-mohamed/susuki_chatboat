import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  private extractQuantity(query: string): number {
    const frenchNumbers: Record<string, number> = {
      'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4,
      'cinq': 5, 'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10
    };
    
    const lower = query.toLowerCase();
    
    for (const [word, num] of Object.entries(frenchNumbers)) {
      if (new RegExp(`\\b${word}\\b`).test(lower)) return num;
    }
    
    const match = query.match(/(\d+)\s*(?:jeux?|sets?|paires?|kits?)/i);
    return match ? parseInt(match[1]) : 1;
  }

  buildProductResponse(products: any[], query: string, vehicle: any): string {
    // Show products even if stock is 0 - let user contact CarPro
    const withPrice = products.filter(p => p.prixHt != null);
    
    if (withPrice.length === 0) {
      const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
      return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }
    
    // Show ONLY 1 exact product
    const product = withPrice[0];
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    return `${product.designation}${vehicleInfo}\nRéf: ${product.reference}\nPrix: ${product.prixHt} TND\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`;
  }

  buildPriceResponse(products: any[], query: string, vehicle: any, lastTopic: string): string {
    // Show products even if stock is 0 - let user contact CarPro
    const withPrice = products.filter(p => p.prixHt != null);
    
    if (withPrice.length === 0) {
      const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
      return `Indisponible${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }
    
    // Show ONLY 1 exact product
    const product = withPrice[0];
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    return `${product.designation}${vehicleInfo}\nPrix: ${product.prixHt} TND\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`;
  }

  buildReferenceResponse(reference: string, product: any, vehicle: any): string {
    const isAvailable = product.stock > 0;
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    
    if (!isAvailable) {
      return `Bonjour! Référence "${reference}" indisponible${vehicleInfo}.\n\n💡 Contactez CarPro au ☎️ 70 603 500.`;
    }
    
    const price = product.prixHt != null ? `${product.prixHt} TND` : 'Prix sur demande';
    return `Bonjour! Référence trouvée${vehicleInfo} :\n\n• ${product.designation} (Réf: ${product.reference}) — ${price}\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`;
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
    const available = products.filter(p => p.stock > 0 && p.prixHt != null);
    
    if (available.length === 0) {
      const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
      return `Aucun résultat avec les filtres appliqués${vehicleInfo}.\n\nContactez CarPro au ☎️ 70 603 500.`;
    }
    
    const product = available[0];
    const vehicleInfo = vehicle?.modele ? ` pour votre ${vehicle.marque} ${vehicle.modele}` : '';
    return `Résultat filtré${vehicleInfo}:\n${product.designation}\nRéf: ${product.reference}\nPrix: ${product.prixHt} TND\n\n💡 Contactez CarPro au ☎️ 70 603 500 pour réserver.`;
  }
}
