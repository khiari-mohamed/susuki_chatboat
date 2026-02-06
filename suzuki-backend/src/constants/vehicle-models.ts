
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
  'S-CROSS'
] as const;

export type SuzukiModel = typeof SUZUKI_MODELS[number];

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
