
export const SUZUKI_MODELS = [
  'CELERIO',
  'S-PRESSO',
  'SWIFT',
  'VITARA',
  'JIMNY',
  'BALENO',
  'IGNIS',
  'ALTO',
  'ERTIGA',
  'DZIRE',
  'CIAZ',
  'WAGON R',
  'S-CROSS',
  'FRONX'
] as const;

export type SuzukiModel = typeof SUZUKI_MODELS[number];

export const MODEL_ALIASES: Record<string, string> = {
  'NEW CIAZ': 'CIAZ',
  'NEW CELERIO POP 6AB': 'CELERIO',
  'SWIFT IV': 'SWIFT',
  'JIMNY 5D AT': 'JIMNY',
  'FRONX': 'FRONX',
  'SPRESSO': 'S-PRESSO',
  'S PRESSO': 'S-PRESSO',
  'WAGONR': 'WAGON R'
};

export function normalizeModel(model?: string): string | null {
  if (!model) return null;
  const up = model.toUpperCase().trim();
  return MODEL_ALIASES[up] || up;
}

export function detectModelInText(text: string): string | null {
  const up = text.toUpperCase();
  if (up.includes('SPRESSO') || up.includes('S-PRESSO')) return 'S-PRESSO';
  if (up.includes('WAGONR')) return 'WAGON R';
  for (const model of Object.values(MODEL_ALIASES)) {
    if (up.includes(model)) return model;
  }
  for (const model of SUZUKI_MODELS) {
    if (up.includes(model)) return model;
  }
  return null;
}

/**
 * Check if a designation contains any Suzuki model name
 */
export function hasModelInDesignation(designation: string): boolean {
  const upper = designation.toUpperCase();
  // Check for SPRESSO (without hyphen) as well
  if (upper.includes('SPRESSO')) return true;
  return SUZUKI_MODELS.some(model => upper.includes(model));
}

/**
 * Check if a designation matches a specific model
 */
export function matchesModel(designation: string, model: string): boolean {
  const designationUpper = designation.toUpperCase();
  const modelUpper = model.toUpperCase();
  
  // Handle S-PRESSO vs SPRESSO mismatch
  if (modelUpper === 'S-PRESSO' || modelUpper === 'SPRESSO') {
    return designationUpper.includes('SPRESSO') || designationUpper.includes('S-PRESSO');
  }
  
  return designationUpper.includes(modelUpper);
}
