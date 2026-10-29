import { jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { OpenAIService } from './openai.service';
import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService retrieval and ranking', () => {
  const normalizedLookup: Record<string, string> = {
    coussinet: 'coussinet',
    palier: 'palier',
    vilebrequin: 'vilebrequin',
  };
  const createService = (openai: Partial<OpenAIService> = {}) => new AdvancedSearchService(
    {} as PrismaService,
    {
      getCategoryVariants: () => ({}),
      getNormalizedLookup: () => normalizedLookup,
      getStopWords: () => new Set<string>(),
      getTunisianMap: () => ({}),
      isKnownAutomotiveTerm: (text: string) => text.split(/\s+/).some((word) => normalizedLookup[word]),
      findClosestVocabularyWord: () => null,
    } as unknown as SynonymsService,
    { getNameTokens: () => new Set(['baleno']) } as unknown as VehicleModelsService,
    openai as OpenAIService,
  );

  it('ignores conversational, vehicle, and color words while keeping requested catalog terms', () => {
    const service = createService();

    const groups = (service as any).buildTermGroups([
      'bonjour', 'vous', 'avez', 'coussinet', 'palier', 'vilebrequin', 'sup',
      'rouge', 'violet', 'pour', 'baleno',
    ], (service as any).buildIdentityIgnoreSet());

    expect(groups).toEqual([
      ['coussinet'], ['palier'], ['vilebrequin'],
    ]);
  });

  it('derives identity terms from compatible catalog evidence instead of unknown chat filler', () => {
    const service = createService() as any;
    const query = 'Salem n7eb coussinet palier vilebrequin sup rouge marron lel baleno mawjoud ch7al';
    const candidates = [{
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON',
    }];

    expect(service.requestedPartTokensForCandidates(
      query.split(/\s+/),
      new Set(['baleno']),
      candidates,
    )).toEqual(['coussinet', 'palier', 'vilebrequin']);
  });

  it('ranks a partial lexical match without rejecting it before catalog verification', () => {
    const service = createService();
    const context = {
      groups: [['retroviseur'], ['droite'], ['bleu']],
      positionInfo: { avant: false, arriere: false, gauche: false, droite: true },
      compactQuery: '',
    };
    const part = {
      designation2: 'RETROVISEUR EXTERIEUR D',
      designation: 'MIRROR OUTER RH',
    };

    expect((service as any).rankRelevance(part, context)).toBeGreaterThan(0);
  });

  it('requires explicitly requested colors but keeps all variants when color is omitted', () => {
    const service = createService() as any;
    const violet = {
      reference: '12341M74L00-0BA',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET',
    };
    const rose = {
      reference: '12341M74L00-0AA',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/ROSE',
    };

    expect(service.filterByRequestedColors([rose, violet], ['rouge', 'violet']))
      .toEqual([violet]);
    expect(service.filterByRequestedColors([rose, violet], [])).toEqual([rose, violet]);
    expect(service.filterByNumericSpecifications([violet, rose], ['0.25'])).toEqual([violet, rose]);
  });

  it('filters a standard sibling when the customer specifies an oversize value', () => {
    const service = createService() as any;
    const standard = {
      reference: '12341M74L00-0A0',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP STD ROUGE/VIOLET',
    };
    const oversize = {
      reference: '12341M74L00-0BA',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON',
    };

    expect(service.filterByNumericSpecifications([standard, oversize], ['0.25']))
      .toEqual([oversize]);
  });

  it('uses the shared JSON OpenAI client only when vocabulary segmentation cannot split a token', async () => {
    const completeJson = jest.fn(async () => JSON.stringify({ segments: ['abc', 'defghi'] }));
    const service = createService({ completeJson } as unknown as OpenAIService);

    await expect((service as any).tokenize('abcdefghi')).resolves.toEqual(['abc', 'defghi']);
    expect(completeJson).toHaveBeenCalledTimes(1);
  });

  it('queries spaced, hyphenated, and compact forms of a multiword term', () => {
    const conditions = (createService() as any).termConditions(['pare brise']);
    const serialized = JSON.stringify(conditions);

    expect(serialized).toContain('pare brise');
    expect(serialized).toContain('pare-brise');
    expect(serialized).toContain('parebrise');
  });

  it('matches hyphenated and space-separated TYPE-n fitment spellings', () => {
    const where = (createService() as any).buildCompatibilityWhere({
      active: true,
      typeCodes: ['AVH310-TYPE-2'],
    });

    expect(where.fitments.some.typeCode.in).toEqual(expect.arrayContaining([
      'AVH310-TYPE2',
      'AVH310-TYPE-2',
      'AVH310 TYPE2',
      'AVH310 TYPE 2',
    ]));
  });

  it('exposes TTC only for the confirmed public-price source', () => {
    const service = createService();
    const part = {
      id: 1,
      reference: 'REF-1',
      designation: 'MIRROR',
      designation2: 'RETROVISEUR',
      prixTtc: '45.5',
      source: '02_CARPRO',
    };

    expect(service.formatPartResult(part, 100).prixTtc).toBeNull();
    expect(service.formatPartResult({ ...part, source: '01_PROD' }, 100).prixTtc).toBe('45.5');
  });

  it('returns the resolved scope with reference results without resolving it twice', async () => {
    const service = createService() as any;
    const scope = {
      active: true,
      vin: 'VIN-1',
      vehicleNo: null,
      model: 'CELERIO',
      modelDescription: null,
      typeCodes: ['T1'],
      primaryTypeCodes: ['T1'],
      typeCodeSource: 'vehicle-row',
    };
    service.resolveVehicleScope = jest.fn(async () => scope);
    service.searchByReference = jest.fn(async (_reference: string, receivedScope: unknown) => {
      expect(receivedScope).toBe(scope);
      return [];
    });
    service.logger = { log: jest.fn() };

    const result = await service.searchPartsDetailed('09482-30010', { vin: 'VIN-1' });

    expect(service.resolveVehicleScope).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ results: [], constraint: null, scope, truncated: false });
  });

  it('uses accent-folded database retrieval when the indexed AND query misses', async () => {
    const row = {
      id: 7,
      reference: 'REF-7',
      designation: 'CHROME',
      designation2: 'CHROMÉ',
      source: '02_CARPRO',
      stock: null,
      fitments: [],
      itemReferences: [],
    };
    const findMany = jest.fn<() => Promise<typeof row[]>>()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([row]);
    const queryRaw = jest.fn<(query: string, ...parameters: unknown[]) => Promise<{ id: number }[]>>()
      .mockResolvedValue([{ id: 7 }]);
    const service = new AdvancedSearchService(
      { part: { findMany }, $queryRawUnsafe: queryRaw } as unknown as PrismaService,
      {
        getCategoryVariants: () => ({}),
        getNormalizedLookup: () => ({}),
        getStopWords: () => new Set<string>(),
        getTunisianMap: () => ({}),
        isKnownAutomotiveTerm: () => false,
        findClosestVocabularyWord: () => null,
      } as unknown as SynonymsService,
      { getNameTokens: () => new Set<string>() } as unknown as VehicleModelsService,
      {} as OpenAIService,
    );

    const result = await (service as any).fetchCandidates([['chrome']], {
      active: false,
      typeCodes: [],
    });

    expect(result.parts).toEqual([row]);
    expect(queryRaw.mock.calls[0][0]).toContain('translate(lower(COALESCE(p.designation_2');
  });
});