import { Injectable } from '@nestjs/common';

@Injectable()
export class TunisianNormalizerService {
  private readonly mappings: Record<string, string> = {
    'ahla': 'bonjour', 'n7eb': 'je veux acheter', 'nchri': 'acheter', 'filtere': 'filtre', 'filtr': 'filtre', 'filter': 'filtre',
    'lel': 'pour le', 'mte3': 'de', 'mte3i': 'de mon', 'karhba': 'voiture', 'karhabti': 'ma voiture',
    't9allek': 'fait du bruit', 't9alet': 'cassé', 'mkasra': 'fait du bruit', 'famma': 'disponible stock',
    'chnowa': 'quel', 'chneya': 'quoi', 'wach': 'est-ce que', 'barcha': 'beaucoup', '9ad': 'combien',
    'stok': 'stock disponible', 'dispo': 'disponible stock', 'mawjoud': 'disponible stock',
    'prix': 'prix', 'pris': 'prix', 'choufli': 'regarder prix', 'gosh': 'gauche', 'avent': 'avant',
    'celirio': 'celerio', 'celario': 'celerio', 'plakete': 'plaquette', 'plaq': 'plaquette',
    'frain': 'frein', 'frin': 'frein', 'combein': 'combien', 'cout': 'coût', 'ya3tik': 'merci',
    'ken': 'si', 'chouf': 'regarde', 'zeda': 'aussi', 'w': 'et', 'fil': 'dans le', 'el': 'le'
  };

  normalize(query: string): string {
    let normalized = query.toLowerCase();
    for (const [tunisian, french] of Object.entries(this.mappings)) {
      const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
      normalized = normalized.replace(regex, french);
    }
    return normalized !== query.toLowerCase() ? normalized : '';
  }
}
