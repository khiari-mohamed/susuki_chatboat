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
});
