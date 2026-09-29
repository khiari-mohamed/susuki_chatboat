import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from './synonyms.service';

describe('SynonymsService catalog designation validation', () => {
  it('matches catalog aliases against actual French and English part names', async () => {
    const findMany = jest.fn().mockResolvedValue([
      { designation: 'WINDSHIELD ASSY', designation2: 'PAREBRISE' },
      { designation: 'FILTER ELEMENT AIR', designation2: 'FILTRE A AIR' },
    ]);
    const service = new SynonymsService({ part: { findMany } } as unknown as PrismaService);

    await expect(service.hasCatalogDesignationConcept('pare brise', ['windshield', 'pare-brise'])).resolves.toBe(true);
    await expect(service.hasCatalogDesignationConcept('filtre carburant', ['fuel filter'])).resolves.toBe(false);
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('ignores the invalid French palier-to-tablier mapping', async () => {
    const findMany = jest.fn().mockResolvedValue([
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
});
