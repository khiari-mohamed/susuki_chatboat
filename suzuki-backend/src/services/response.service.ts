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
    const available = products.filter(p => typeof p.stock === 'number' && p.stock > 0 && p.prixHt !== undefined && p.prixHt !== null);
    
    if (available.length === 0) {
      return `Bonjour. Cette pièce n'est actuellement pas disponible dans notre catalogue.\n\nPour une vérification manuelle ou une commande spéciale, contactez CarPro au ☎️ 70 603 500.`;
    }
    
    const lines = ['Bonjour, voici les produits disponibles :', '', 'PRODUITS DISPONIBLES:'];
    available.slice(0, 3).forEach(p => lines.push(`• ${p.designation} (Réf: ${p.reference}) — Prix: ${p.prixHt} TND`));
    if (available.length > 3) lines.push('', `... et ${available.length - 3} autres produits disponibles.`);
    lines.push('', 'Si vous voulez réserver une pièce, indiquez la référence.', '', '💡 Si vous avez besoin de plus de détails, nos spécialistes CarPro sont disponibles.');
    return lines.join('\n');
  }

  buildPriceResponse(products: any[], query: string, vehicle: any, lastTopic: string): string {
    const available = products.filter(p => typeof p.stock === 'number' && p.stock > 0 && p.prixHt !== undefined && p.prixHt !== null);
    
    // Parse quantity
    const quantity = this.extractQuantity(query);
    
    if (lastTopic === 'plaquettes frein' || lastTopic === 'frein') {
      const brakePads = available.filter(p => p.designation.toLowerCase().includes('plaquette') || p.designation.toLowerCase().includes('jeu de plaquettes'));
      
      if (brakePads.length > 0) {
        let response = `Bonjour! Voici les prix pour ${quantity > 1 ? quantity + ' jeux de' : 'les'} plaquettes de frein:\n\nPRODUITS DISPONIBLES:\n`;
        brakePads.slice(0, 3).forEach(p => response += `• ${p.designation} — ${p.prixHt} TND\n`);
        
        const front = brakePads.find(p => p.designation.toLowerCase().includes('av'));
        const rear = brakePads.find(p => p.designation.toLowerCase().includes('ar'));
        
        if (front && rear) {
          const unitTotal = parseFloat(front.prixHt) + parseFloat(rear.prixHt);
          const total = unitTotal * quantity;
          response += `\n💰 PRIX TOTAL (avant + arrière${quantity > 1 ? ' x ' + quantity : ''}): ${total.toFixed(3)} TND\n`;
          response += `\n📊 DÉTAIL:\n• Plaquettes avant: ${front.prixHt} TND${quantity > 1 ? ' x ' + quantity + ' = ' + (parseFloat(front.prixHt) * quantity).toFixed(3) + ' TND' : ''}\n• Plaquettes arrière: ${rear.prixHt} TND${quantity > 1 ? ' x ' + quantity + ' = ' + (parseFloat(rear.prixHt) * quantity).toFixed(3) + ' TND' : ''}`;
        } else if (brakePads.length > 0) {
          const unitPrice = parseFloat(brakePads[0].prixHt);
          const total = unitPrice * quantity;
          if (quantity > 1) {
            response += `\n💰 PRIX TOTAL (${quantity} jeux): ${total.toFixed(3)} TND`;
            response += `\n📊 Prix unitaire: ${unitPrice.toFixed(3)} TND`;
          } else {
            response += `\n💰 PRIX: ${unitPrice.toFixed(3)} TND`;
          }
        }
        
        response += '\n\n📦 STOCK:\nVérification disponibilité en cours\n';
        response += '\n💡 RECOMMANDATIONS:\n🔹 Remplacement plaquettes frein recommandé\n🔹 Vérification disques de frein conseillée\n🔹 Contactez CarPro au ☎️ 70 603 500';
        return response;
      }
      
      return 'Bonjour! Voici les informations de prix pour votre demande:\n\n⚠️ Aucun jeu de plaquettes de frein disponible actuellement.\n\n💰 PRIX:\nTarifs disponibles sur demande\n\n📦 STOCK:\nVérification disponibilité en cours\n\n💡 RECOMMANDATIONS:\n🔹 Remplacement plaquettes frein recommandé\n🔹 Vérification disques de frein conseillée\n🔹 Contactez CarPro au ☎️ 70 603 500';
    }
    
    let response = `Bonjour! Voici les informations de prix pour votre demande:\n\n🔍 CONTEXTE: Prix pour ${lastTopic}\n\n`;
    if (available.length > 0) {
      response += 'PRODUITS DISPONIBLES:\n';
      available.slice(0, 3).forEach(p => response += `• ${p.designation} — ${p.prixHt} TND\n`);
    } else {
      response += '⚠️ Aucun produit disponible actuellement.\n';
    }
    response += '\n💰 PRIX:\nTarifs détaillés disponibles sur demande\n';
    response += '\n📦 STOCK:\nVérification disponibilité en cours\n';
    response += '\n💡 Pour plus d\'informations, contactez CarPro au ☎️ 70 603 500';
    return response;
  }

  buildReferenceResponse(reference: string, product: any, vehicle: any): string {
    const isAvailable = typeof product.stock === 'number' && product.stock > 0;
    let response = `🎯 RÉFÉRENCE TROUVÉE: ${reference}\n\nPRODUITS TROUVÉS:\n• ${product.designation} (Réf: ${product.reference})`;
    if (isAvailable) {
      const price = product.prixHt !== undefined && product.prixHt !== null ? `${product.prixHt} TND` : 'Prix sur demande';
      response += `\n\n💰 PRIX:\n• ${product.designation}: ${price} (disponible)`;
    } else {
      response += ` (indisponible)`;
    }
    response += `\n\n✅ CORRESPONDANCE EXACTE confirmée pour votre ${vehicle?.marque || 'véhicule'} ${vehicle?.modele || ''}\n\n💡 Pour commander cette pièce, contactez CarPro au ☎️ 70 603 500`;
    return response;
  }

  buildReferenceNotFoundResponse(reference: string): string {
    return `🔍 RÉFÉRENCE RECHERCHÉE: ${reference}\n\nPRODUITS TROUVÉS:\nAucun produit trouvé pour cette référence\n\n💰 PRIX:\nRéférence introuvable dans notre base\n\n📦 STOCK:\nProduit non disponible\n\n⚠️ ATTENTION: Veuillez vérifier la référence ou contactez notre équipe\n\n💡 SUGGESTIONS:\n• Vérifiez l'orthographe de la référence\n• Contactez CarPro au ☎️ 70 603 500 pour assistance\n• Décrivez la pièce recherchée pour une recherche alternative`;
  }

  buildGreetingResponse(message: string): string {
    if (message.toLowerCase().includes('aide') || message.toLowerCase().includes('besoin') || message.toLowerCase().includes('pièces')) {
      return 'Bonjour ! Je suis ravi de pouvoir vous aider. Comment puis-je vous assister pour trouver des pièces pour votre véhicule ?';
    }
    return 'Bonjour, comment puis-je vous aider aujourd\'hui ?';
  }

  buildThanksResponse(): string {
    return 'Bonjour ! Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
  }

  buildComplaintResponse(): string {
    return 'Bonjour, je suis désolé pour ce désagrément. Notre service client CarPro au ☎️ 70 603 500 pourra vous aider à résoudre ce problème rapidement.';
  }

  buildServiceQuestionResponse(): string {
    return 'Bonjour ! Je suis spécialisé dans les pièces automobiles Suzuki. Pour les questions sur les horaires, livraisons, garanties ou notre localisation, veuillez contacter CarPro au ☎️ 70 603 500. Comment puis-je vous aider avec des pièces ?';
  }

  buildDiagnosticRedirectResponse(): string {
    return `Bonjour! Pour tout problème technique ou diagnostic de votre véhicule, nous vous recommandons de contacter directement notre équipe d'experts CarPro.\n\n☎️ CONTACT PROFESSIONNEL:\n🔹 Téléphone: 70 603 500\n🔹 Service disponible 7j/7\n🔹 Diagnostic professionnel sur place\n\n💡 Notre équipe technique pourra:\n• Diagnostiquer précisément le problème\n• Vous conseiller les pièces nécessaires\n• Effectuer les réparations si besoin\n\nPour rechercher des pièces de rechange, je reste à votre disposition!`;
  }

  buildErrorResponse(message: string): string {
    return `Bonjour! Je rencontre une difficulté technique temporaire.\n\nPRODUITS TROUVÉS:\nRecherche temporairement indisponible\n\n💰 PRIX:\nTarifs disponibles par téléphone\n\n📦 STOCK:\nVérification manuelle possible\n\n✅ RECOMMANDATIONS:\n🔹 Contactez CarPro au ☎️ 70 603 500\n🔹 Notre équipe vous assistera immédiatement\n🔹 Service disponible 7j/7`;
  }

  buildNoResultsResponse(query: string, vehicle: any): string {
    return `Désolé, je n'ai pas trouvé de pièce correspondant à "${query}" pour votre ${vehicle?.marque || 'véhicule'} ${vehicle?.modele || ''}.\n\nPour une recherche manuelle, contactez CarPro au ☎️ 70 603 500.`;
  }
}
