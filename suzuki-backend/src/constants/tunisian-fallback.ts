/**
 * TUNISIAN DIALECT FALLBACK MAPPINGS
 * 
 * Used ONLY when AI normalization fails (1% of cases)
 * AI handles 99% of Tunisian understanding automatically
 * 
 * Combines essential words + full dictionary for comprehensive fallback
 */

import { tunisianDictionary } from '../chat/tunisian-dictionary';

// Essential core words (most common)
const CORE_TUNISIAN: Record<string, string> = {
  // Core verbs
  'n7eb': 'je veux',
  'bghit': 'je veux',
  'nchri': 'acheter',
  'chouf': 'regarde',
  'choufli': 'montre-moi',
  
  // Common words
  'behi': 'ok',
  'yezzi': 'ok',
  'famma': 'disponible',
  'mawjoud': 'disponible',
  
  // Questions
  'ch7al': 'combien',
  '9ad': 'combien',
  'kifech': 'comment',
  'chnowa': 'quoi',
  'wach': 'est-ce que',
  
  // Prepositions
  'mte3': 'de',
  'ta3': 'de',
  'lel': 'pour',
  
  // Objects
  'karhba': 'voiture',
  
  // Greetings
  'ahla': 'bonjour',
  'salem': 'bonjour',
  'salam': 'bonjour',
  
  // Thanks
  '3aychek': 'merci',
  'ya3tik': 'merci',
  'barcha': 'beaucoup',
  
  // Negation
  'mouch': 'pas',
  'mech': 'pas',
  
  // Other
  'ken': 'si',
  'zeda': 'aussi',
  'w': 'et'
};

// Combine core + full dictionary
export const TUNISIAN_FALLBACK: Record<string, string> = {
  ...CORE_TUNISIAN,
  ...tunisianDictionary
};

/**
 * Apply fallback normalization (emergency only)
 */
export function applyTunisianFallback(query: string): string {
  let normalized = query.toLowerCase();
  
  for (const [tunisian, french] of Object.entries(TUNISIAN_FALLBACK)) {
    const regex = new RegExp(`\\b${tunisian}\\b`, 'gi');
    normalized = normalized.replace(regex, french);
  }
  
  return normalized !== query.toLowerCase() ? normalized : '';
}
