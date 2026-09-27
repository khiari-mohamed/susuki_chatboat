import { describe, expect, it } from '@jest/globals';
import { ContextService } from './context.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ContextService.buildSearchQuery', () => {
  const contextService = new ContextService({} as PrismaService);

  it('preserves a new explicit part request instead of replacing it with the previous part', () => {
    const message = 'Pour le véhicule associé à ce VIN, cherche un filtre à air.';

    expect(contextService.buildSearchQuery(message, { lastPart: 'amortisseur' })).toBe(message);
  });

  it('reuses the previous part for a genuine follow-up without a new part identity', () => {
    expect(
      contextService.buildSearchQuery('Et pour le véhicule, à l’arrière ?', {
        lastPart: 'amortisseur',
        lastSide: 'droite',
      }),
    ).toBe('amortisseur arriere droite');
  });
});