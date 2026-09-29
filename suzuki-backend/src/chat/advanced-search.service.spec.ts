import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService scoring query words', () => {
  const createService = () => new AdvancedSearchService(
    {} as PrismaService,
    { get: () => undefined } as unknown as ConfigService,
    { getCategoryVariants: () => ({}), getNormalizedLookup: () => ({}) } as unknown as SynonymsService,
    { getAll: () => [] } as unknown as VehicleModelsService,
  );

  it('ignores courtesy words without dropping requested part details', () => {
    const service = createService();

    expect((service as any).filterScoringQueryWords([
      'bonjour', 'vous', 'avez', 'coussinet', 'palier', 'vilebrequin', 'sup',
      'rouge', 'violet', 'pour', 'baleno',
    ])).toEqual(['coussinet', 'palier', 'vilebrequin', 'sup', 'rouge', 'violet']);
  });

  it('does not reject the available Baleno bearing because of courtesy wording', () => {
    const service = createService();
    const query = 'Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET pour ma BALENO ?';
    const tokens = ['bonjour', 'vous', 'avez', 'coussinet', 'palier', 'vilebrequin', 'sup', 'rouge', 'violet', 'pour', 'baleno'];
    const filteredQueryWords = (service as any).filterScoringQueryWords(tokens);
    const context = {
      filteredQueryWords,
      originalQuery: query,
      userTypedTokens: new Set(tokens),
      mainPartType: 'sup',
    };
    const part = {
      reference: '12341M74L00-0BA',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET',
      searchDescription: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET ; BEARING,CRANK UPR(US:0.25,T:2.125)',
      designation: 'BEARING,CRANK UPR(US:0.25,T:2.125)',
      categorie: 'MÉCANIQUE',
      fabricant: 'SUZUKI',
      fournisseurCode: 'CAR PRO PARTS',
      itemReferences: [],
    };

    expect((service as any).calculateContentMatches(part, context)).toBeGreaterThan(-1_000_000);
  });
});