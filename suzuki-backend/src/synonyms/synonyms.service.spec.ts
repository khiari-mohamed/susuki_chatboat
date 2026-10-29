import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from './synonyms.service';

describe('SynonymsService catalog designation validation', () => {
  it('corrects a transposed word using repeated catalog vocabulary', async () => {
    const findMany = jest.fn<() => Promise<{ designation: string; designation2: string }[]>>().mockResolvedValue([
      { designation: 'SEAT FRAME CONDUCTEUR', designation2: 'CADRE SIEGE CONDUCTEUR' },
      { designation: 'SUPPORT CONDUCTEUR', designation2: 'SUPPORT CONDUCTEUR' },
    ]);
    const service = new SynonymsService({ part: { findMany } } as unknown as PrismaService);

    await expect(service.findClosestCatalogWord('condutceur')).resolves.toBe('conducteur');
    await expect(service.findClosestCatalogWord('conducteur')).resolves.toBeNull();
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('matches catalog aliases against actual French and English part names', async () => {
    const findMany = jest.fn<() => Promise<{ designation: string; designation2: string }[]>>().mockResolvedValue([
      { designation: 'WINDSHIELD ASSY', designation2: 'PAREBRISE' },
      { designation: 'FILTER ELEMENT AIR', designation2: 'FILTRE A AIR' },
    ]);
    const service = new SynonymsService({ part: { findMany } } as unknown as PrismaService);

    await expect(service.hasCatalogDesignationConcept('pare brise', ['windshield', 'pare-brise'])).resolves.toBe(true);
    await expect(service.hasCatalogDesignationConcept('filtre carburant', ['fuel filter'])).resolves.toBe(false);
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('ignores the invalid French palier-to-tablier mapping', async () => {
    const findMany = jest.fn<() => Promise<{ mot: string; canonical: string; langue: string }[]>>().mockResolvedValue([
      { mot: 'palier', canonical: 'tablier', langue: 'fr' },
      { mot: 'tablier', canonical: 'tablier', langue: 'fr' },
    ]);
    const service = new SynonymsService({
      synonym: { findMany },
    } as unknown as PrismaService);

    await service.onModuleInit();

    expect(service.findCanonical('palier')).toBeNull();
    expect(service.findCanonical('tablier')).toBe('tablier');
    expect(service.getCategoryVariants().tablier).not.toContain('palier');
  });

  it('uses fallback vocabulary only when the DB synonym index is unavailable', async () => {
    const databaseBacked = new SynonymsService({
      synonym: { findMany: jest.fn<() => Promise<{ mot: string; canonical: string; langue: string }[]>>().mockResolvedValue([
        { mot: 'filtre', canonical: 'filtre', langue: 'fr' },
      ]) },
    } as unknown as PrismaService);
    await databaseBacked.onModuleInit();

    expect(databaseBacked.getInterpretationCandidates()).not.toHaveProperty('retroviseur');
    expect(databaseBacked.isKnownAutomotiveTerm('retroviseur')).toBe(false);

    const unavailable = new SynonymsService({
      synonym: { findMany: jest.fn<() => Promise<never>>().mockRejectedValue(new Error('database unavailable') as unknown) },
    } as unknown as PrismaService);
    await unavailable.onModuleInit();

    expect(unavailable.getInterpretationCandidates()).toHaveProperty('retroviseur');
    expect(unavailable.isKnownAutomotiveTerm('retroviseur')).toBe(true);
  });
});
