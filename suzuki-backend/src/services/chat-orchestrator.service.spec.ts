import { describe, expect, it, jest } from '@jest/globals';
import { OpenAIService } from '../chat/openai.service';
import { ChatOrchestratorService } from './chat-orchestrator.service';
import { ResponseService } from './response.service';
import { COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';
import type { ConstraintOutcome } from '../chat/part-constraints';
import type { StructuredQueryInterpretation } from './ai-query-normalizer.service';

const interpretation = (over: Partial<StructuredQueryInterpretation> = {}): StructuredQueryInterpretation => ({
  normalized: 'retroviseur droite',
  intent: 'SEARCH',
  catalogPart: 'retroviseur',
  catalogAliases: ['retroviseur', 'miroir'],
  positions: { axes: [], sides: ['D'], levels: [] },
  qualifiers: [],
  confidence: 0.9,
  uncertainty: 0.1,
  isGreeting: false,
  isThanks: false,
  source: 'ai',
  ...over,
});

const vehicle = { marque: 'SUZUKI', modele: 'NEW CELERIO', typeCode: 'T1' };
const row = (over: any = {}) => ({
  reference: 'REF-1',
  designation: 'MIRROR OUTER RH',
  designation2: 'RETROVISEUR EXTERIEUR D',
  source: '01_PROD',
  prixTtc: '45.5',
  stock: { stockConsolide: 3 },
  fitments: [{ typeCode: 'T1' }],
  ...over,
});

function setup(aiResponse = JSON.stringify({ flags: [] }), resolvedTypeCodes = ['T1']) {
  const completeJson = jest.fn<(systemPrompt: string, userPrompt: string, maxTokens?: number) => Promise<string>>()
    .mockResolvedValue(aiResponse);
  const orchestrator = Object.create(ChatOrchestratorService.prototype) as any;
  orchestrator.openaiService = { completeJson } as unknown as OpenAIService;
  orchestrator.advancedSearch = {
    resolveVehicleTypeCodes: jest.fn(async () => resolvedTypeCodes),
    resolveVehicleScope: jest.fn(async () => ({
      active: resolvedTypeCodes.length > 0,
      vin: null,
      vehicleNo: null,
      model: 'NEW CELERIO',
      modelDescription: null,
      typeCodes: resolvedTypeCodes,
      primaryTypeCodes: resolvedTypeCodes,
      typeCodeSource: 'explicit' as const,
    })),
  };
  orchestrator.responseService = new ResponseService();
  orchestrator.logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

  const run = (
    products: any[],
    options: {
      build?: (shown: any[]) => string;
      interpretation?: Partial<StructuredQueryInterpretation>;
      requireUnderstanding?: boolean;
      identityMode?: ConstraintOutcome['identityMode'];
      constraint?: ConstraintOutcome | null;
      vehicle?: any;
      message?: string;
    } = {},
  ) => {
    const requestVehicle = options.vehicle ?? vehicle;
    return orchestrator.answerFromVerifiedProducts({
      message: options.message ?? 'retroviseur droite',
      interpretation: interpretation(options.interpretation),
      vehicle: requestVehicle,
      products,
      constraint: options.constraint,
      identityMode: options.identityMode,
      requireUnderstanding: options.requireUnderstanding,
      build: options.build ?? ((shown: any[]) => orchestrator.responseService.buildProductResponse(shown, requestVehicle)),
    });
  };
  return { orchestrator, run, completeJson };
}

describe('chat message part-mention detection', () => {
  it('distinguishes translated price/availability intent from an explicit Tunisian part request', () => {
    const orchestrator = Object.create(ChatOrchestratorService.prototype) as any;
    orchestrator.synonymsService = {
      getTunisianMap: () => ({
        ch7al: 'prix', mawjoud: 'disponible', n7eb: 'je veux', lel: 'pour',
      }),
      getNormalizedLookup: () => ({
        prix: 'prix', disponible: 'disponible', coussinet: 'coussinet',
        palier: 'palier', vilebrequin: 'vilebrequin',
      }),
      getStopWords: () => new Set<string>(),
      isKnownAutomotiveTerm: (word: string) => /prix|disponible|coussinet|palier|vilebrequin/.test(word),
    };

    expect(orchestrator.hasExplicitPartConcept('W ch7al ? Mawjoud ?')).toBe(false);
    expect(orchestrator.hasExplicitPartConcept(
      'Salem, n7eb COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON lel BALENO. Mawjoud ? W ch7al ?',
    )).toBe(true);
  });
});

describe('answerFromVerifiedProducts: DB decides, AI only flags', () => {
  it('builds the response from a verified DB row and sends its evidence to the advisory pass', async () => {
    const { run, completeJson } = setup();
    const result = await run([row()]);

    expect(result.accepted).toBe(true);
    expect(result.response).toContain('RETROVISEUR EXTERIEUR D');
    expect(result.response).toContain('45.500 TND');
    expect(result.products.map((product: any) => product.reference)).toEqual(['REF-1']);
    expect(result.verification.compatibility).toBe('CONFIRMEE');
    expect(result.verification.aiAudit).toBe('ran');
    expect(completeJson.mock.calls[0][0]).toContain('cannot approve');
    expect(completeJson.mock.calls[0][1]).toContain('T1');
  });

  it('answers the compound-bearing request with the exact color-matched catalog row', async () => {
    const { run, completeJson } = setup();
    const query = 'Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET pour ma BALENO ?';
    const result = await run([row({
      reference: '12341M74L00-0BA',
      designation: 'BEARING,CRANK UPR(US:0.25,T:2.125)',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET',
      prixTtc: '33.06177',
      stock: { stockConsolide: 10 },
    })], {
      message: query,
      interpretation: {
        normalized: query,
        catalogPart: 'coussinet palier vilebrequin rouge violet',
        catalogAliases: [],
        positions: { axes: [], sides: [], levels: ['SUP'] },
        qualifiers: ['rouge', 'violet'],
        confidence: 0.75,
      },
      vehicle: { marque: 'SUZUKI', modele: 'BALENO', typeCode: 'T1' },
    });

    expect(result.accepted).toBe(true);
    expect(result.verification.checks).toMatchObject({
      identity: 'confirmed',
      position: 'confirmed',
      qualifiers: 'not-applicable',
      vehicle: 'confirmed',
    });
    expect(result.products.map((product: any) => product.reference)).toEqual(['12341M74L00-0BA']);
    expect(result.response).toContain('33.062 TND');
    expect(result.response).toContain('Pièces disponibles pour votre SUZUKI BALENO');
    const audit = JSON.parse(completeJson.mock.calls[0][1]);
    expect(audit.customerMessage).not.toMatch(/rouge|violet/i);
    expect(audit.databaseRows[0].frenchName).not.toMatch(/rouge|violet/i);
  });

  it('answers the Tunisian bearing request when deterministic catalog evidence resolves low AI confidence', async () => {
    const { run } = setup();
    const query = 'Salem, n7eb COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON lel BALENO. Mawjoud ? W ch7al ?';
    const result = await run([row({
      reference: '12341M74L00-0CA',
      designation: 'BEARING,CRANK UPR(US:0.25,T:2.125)',
      designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON',
      prixTtc: '33.06177',
      stock: { stockConsolide: 8 },
    })], {
      message: query,
      interpretation: {
        normalized: 'coussinet palier vilebrequin 0 25 rouge marron sup',
        catalogPart: 'vilebrequin',
        catalogAliases: ['vilebrequin'],
        positions: { axes: [], sides: [], levels: ['SUP'] },
        qualifiers: ['0,25', 'rouge', 'marron'],
        confidence: 0.55,
      },
      constraint: {
        applied: true,
        requestedPart: 'coussinet palier vilebrequin',
        requestedPositions: { axes: [], sides: [], levels: ['SUP'] },
        identityMode: 'inactive-no-standalone-form',
        candidatesBefore: 1,
        rejectedByIdentity: 0,
        rejectedByPosition: 0,
        kept: 1,
        availablePositions: ['SUP'],
        noExactMatch: false,
      },
      vehicle: { marque: 'SUZUKI', modele: 'BALENO', typeCode: 'T1' },
    });

    expect(result.accepted).toBe(true);
    expect(result.verification.checks).toMatchObject({
      identity: 'confirmed',
      position: 'confirmed',
      qualifiers: 'confirmed',
      vehicle: 'confirmed',
    });
    expect(result.products.map((product: any) => product.reference)).toEqual(['12341M74L00-0CA']);
    expect(result.response).toContain('33.062 TND');
    expect(result.response).toContain('Pièces disponibles pour votre SUZUKI BALENO');
  });

  it('keeps a short part identity when the constrained designation is long', async () => {
    const { run } = setup();
    const result = await run([row({
      reference: '37373M55T00',
      designation2: 'BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE HUD',
      designation: 'SWITCH ASSY,HEAD UP DISPLAY',
      stock: { stockConsolide: 1 },
    })], {
      message: 'Je cherche BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) pour une FRONX. C\'est disponible ?',
      interpretation: {
        normalized: 'bouton commande affichage tete haute hud',
        catalogPart: 'bouton commande affichage tete haute hud',
        catalogAliases: ['bouton', 'switch'],
        positions: { axes: [], sides: [], levels: [] },
        qualifiers: [],
        confidence: 0.9,
      },
      identityMode: 'inactive-no-standalone-form',
    });

    expect(result.accepted).toBe(true);
    expect(result.verification.checks.identity).toBe('confirmed');
    expect(result.verification.checks.vehicle).toBe('confirmed');
    expect(result.products.map((product: any) => product.reference)).toEqual(['37373M55T00']);
    expect(result.response).toContain('Indisponible');
  });

  it('accepts DB-resolved fitment codes even when model-name normalization is unavailable', async () => {
    const { orchestrator, run } = setup();
    orchestrator.vehicleModels = { normalize: () => null };

    const result = await run([row()]);

    expect(result.accepted).toBe(true);
    expect(result.verification.checks.vehicle).toBe('confirmed');
  });

  it('rejects a conflicting model designation only when no fitment evidence exists', async () => {
    const { orchestrator, run } = setup();
    orchestrator.vehicleModels = {
      normalize: () => 'CELERIO',
      hasModelInDesignation: () => true,
      matchesModel: () => false,
    };

    const result = await run([row({ fitments: [] })]);

    expect(result.accepted).toBe(false);
    expect(result.verification.checks.vehicle).toBe('failed');
  });

  it('blocks a non-head-noun candidate when search found a standalone requested part', async () => {
    const { run, completeJson } = setup();

    const result = await run([row({ designation2: 'SUPPORT RETROVISEUR EXTERIEUR D' })], {
      identityMode: 'strict-head',
    });

    expect(result.accepted).toBe(false);
    expect(result.verification.checks.identity).toBe('failed');
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('does not treat a model-map code as resolved compatibility for a VIN request', async () => {
    const { orchestrator, run } = setup();
    orchestrator.advancedSearch.resolveVehicleScope = jest.fn(async () => ({
      active: true,
      vin: 'VIN-1',
      vehicleNo: null,
      model: 'NEW CELERIO',
      modelDescription: null,
      typeCodes: ['T1'],
      primaryTypeCodes: ['T1'],
      typeCodeSource: 'model-map',
    }));

    const result = await run([row()], { vehicle: { marque: 'SUZUKI', vin: 'VIN-1' } });

    expect(result.accepted).toBe(false);
    expect(result.verification.reasons).toContain('model code missing for VIN-scoped request');
  });

  it('withholds a wrong-position row without calling the AI', async () => {
    const { run, completeJson } = setup();
    const result = await run([row({ designation2: 'RETROVISEUR EXTERIEUR G' })]);

    expect(result.accepted).toBe(false);
    expect(result.products).toEqual([]);
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('drops the wrong-position row and builds only from the verified subset', async () => {
    const { run } = setup();
    const result = await run([
      row({ reference: 'REF-G', designation2: 'RETROVISEUR EXTERIEUR G', stock: { stockConsolide: 8 } }),
      row({ reference: 'REF-D' }),
    ]);

    expect(result.accepted).toBe(true);
    expect(result.products.map((product: any) => product.reference)).toEqual(['REF-D']);
    expect(result.response).toContain('RETROVISEUR EXTERIEUR D');
    expect(result.response).not.toContain('RETROVISEUR EXTERIEUR G');
  });

  it('withholds an incompatible vehicle fitment and records NON_CONFORME', async () => {
    const { run } = setup();
    const result = await run([row({ fitments: [{ typeCode: 'OTHER' }] })]);

    expect(result.accepted).toBe(false);
    expect(result.verification.compatibility).toBe('NON_CONFORME');
  });

  it('does not withhold when a cosmetic color qualifier is absent from the catalog name', async () => {
    const { run } = setup(JSON.stringify({ flags: [] }));
    const result = await run([row()], {
      interpretation: { normalized: 'retroviseur noir', qualifiers: ['noir'] },
    });

    expect(result.accepted).toBe(true);
    expect(result.verification.checks.qualifiers).toBe('not-applicable');
  });

  it('rejects a missing qualifier when a same-identity sibling confirms it', async () => {
    const { run } = setup();
    const result = await run([
      row({ reference: 'AIR', designation2: 'FILTRE A AIR', designation: 'AIR FILTER' }),
      row({ reference: 'CABIN', designation2: 'FILTRE HABITACLE', designation: 'CABIN FILTER' }),
    ], {
      message: 'filtre à air',
      interpretation: {
        normalized: 'filtre a air',
        catalogPart: 'filtre',
        catalogAliases: ['filtre', 'filter'],
        positions: { axes: [], sides: [], levels: [] },
        qualifiers: ['air'],
      },
    });

    expect(result.accepted).toBe(true);
    expect(result.products.map((product: any) => product.reference)).toEqual(['AIR']);
  });

  it('withholds when no candidate is fully verified (no French name, unconfirmed qualifier)', async () => {
    const { run } = setup();
    const result = await run([
      row({ reference: 'NO-FRENCH', designation2: null, designation: 'AIR BRACKET', stock: { stockConsolide: 1 } }),
      row({ reference: 'CABIN', designation2: 'FILTRE HABITACLE', designation: 'CABIN FILTER' }),
    ], {
      message: 'filtre à air',
      interpretation: {
        normalized: 'filtre a air',
        catalogPart: 'filtre',
        catalogAliases: ['filtre', 'filter'],
        positions: { axes: [], sides: [], levels: [] },
        qualifiers: ['air'],
      },
    });

    expect(result.accepted).toBe(false);
    expect(result.products).toEqual([]);
  });

  it('withholds an identity-unverifiable row without even calling the AI', async () => {
    const { run, completeJson } = setup();
    const result = await run([row({ designation2: 'SUPPORT RETROVISEUR D' })]);

    expect(result.accepted).toBe(false);
    expect(result.response).toContain('Comptoir Pièces de Rechange');
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('honours an AI semantic flag when the database has nothing to check against', async () => {
    const { run } = setup(JSON.stringify({ flags: [
      { type: 'PART_IDENTITY', reference: 'REF-1', detail: 'Possible bracket, not mirror' },
    ] }));
    const result = await run([row()], { interpretation: { catalogPart: null, catalogAliases: [] } });

    expect(result.accepted).toBe(false);
    expect(result.verification.aiFlags.effective).toHaveLength(1);
  });

  it('ignores an AI flag when deterministic evidence already confirmed the check', async () => {
    const { run } = setup(JSON.stringify({ flags: [
      { type: 'PART_IDENTITY', reference: 'REF-1', detail: 'wrong part' },
    ] }));
    const result = await run([row()]);

    expect(result.accepted).toBe(true);
    expect(result.verification.aiFlags.ignored).toHaveLength(1);
  });

  it('ignores flags citing a reference that was not returned by the DB', async () => {
    const { run } = setup(JSON.stringify({ flags: [
      { type: 'PART_IDENTITY', reference: 'INVENTED', detail: 'wrong part' },
    ] }));
    const result = await run([row()]);

    expect(result.accepted).toBe(true);
    expect(result.verification.aiFlags.ignored).toHaveLength(1);
  });

  it('keeps the deterministic result when AI is unavailable or malformed', async () => {
    const unavailable = setup();
    unavailable.completeJson.mockRejectedValue(new Error('OpenAI unavailable'));
    const unavailableResult = await unavailable.run([row()]);
    expect(unavailableResult.accepted).toBe(true);
    expect(unavailableResult.verification.aiAudit).toBe('unavailable');

    const malformedResult = await setup('not json').run([row()]);
    expect(malformedResult.accepted).toBe(true);
    expect(malformedResult.verification.aiAudit).toBe('unavailable');
  });

  it('withholds when the generated response prints a price not present in the DB row', async () => {
    const { run, completeJson } = setup();
    const result = await run([row()], { build: () => 'RETROVISEUR — 99.000 TND' });

    expect(result.accepted).toBe(false);
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('does not display wholesale TTC from a 02_CARPRO row as a public price', () => {
    const response = new ResponseService().buildProductResponse(
      [row({ source: '02_CARPRO' })],
      vehicle,
    );

    expect(response).toContain('prix non communiqué');
    expect(response).not.toContain('45.500 TND');
  });

  it('accepts a truthful unavailable-stock response without requiring exact wording', async () => {
    const { run } = setup();
    const result = await run([row({ stock: { stockConsolide: 1 } })], {
      build: () => "Désolé, rétroviseur n'est pas disponible actuellement pour votre SUZUKI NEW CELERIO.",
    });

    expect(result.accepted).toBe(true);
  });

  it('allows low AI confidence after deterministic checks and exempts exact reference lookups', async () => {
    const { run } = setup();
    const low = await run([row()], { interpretation: { confidence: 0.5 } });
    expect(low.accepted).toBe(true);

    const exactReference = await run([row()], {
      interpretation: { confidence: 0.5 },
      requireUnderstanding: false,
      build: (shown) => new ResponseService().buildReferenceResponse('REF-1', shown[0], vehicle),
    });
    expect(exactReference.accepted).toBe(true);
  });
});

  describe('CarPro anomalies (18/09/2026): the customer is redirected, never shown the wrong part', () => {
    it('anomaly 2: only a bumper grille found for "pare choc avant" → Comptoir redirect', async () => {
      const { run, completeJson } = setup();
      const result = await run(
        [row({ designation2: 'GRILLE PARE CHOC AV', designation: 'GRILLE BUMPER FR' })],
        {
          message: 'pare choc avant',
          interpretation: {
            normalized: 'pare choc avant',
            catalogPart: 'pare choc',
            catalogAliases: ['pare choc', 'bumper'],
            positions: { axes: ['AV'], sides: [], levels: [] },
          },
        },
      );

      expect(result.accepted).toBe(false);
      expect(result.products).toEqual([]);
      expect(result.response).toContain(COMPTOIR_REDIRECT_MESSAGE);
      expect(result.verification.checks.identity).toBe('unverifiable');
      expect(completeJson).not.toHaveBeenCalled();
    });

    it('anomaly 3: only a cabin filter found for "filtre à air" → Comptoir redirect', async () => {
      const { run } = setup();
      const result = await run(
        [row({ designation2: 'FILTRE HABITACLE', designation: 'CABIN FILTER' })],
        {
          message: 'filtre à air',
          interpretation: {
            normalized: 'filtre a air',
            catalogPart: 'filtre',
            catalogAliases: ['filtre', 'filter'],
            positions: { axes: [], sides: [], levels: [] },
            qualifiers: ['air'],
          },
        },
      );

      expect(result.accepted).toBe(false);
      expect(result.products).toEqual([]);
      expect(result.response).toContain(COMPTOIR_REDIRECT_MESSAGE);
    });

    it('anomaly 4: only a window seal found for "vitre avant gauche" → Comptoir redirect', async () => {
      const { run } = setup();
      const interpretationOverride = {
        normalized: 'vitre avant gauche',
        catalogPart: 'vitre',
        catalogAliases: ['vitre', 'glass', 'window'],
        positions: { axes: ['AV'], sides: ['G'], levels: [] },
      };
      const seal = row({ designation2: 'JOINT LECHE VITRE AV G', designation: 'SEAL GLASS RUN FR LH' });

      const unverified = await run([seal], { message: 'vitre avant gauche', interpretation: interpretationOverride });
      expect(unverified.accepted).toBe(false);
      expect(unverified.response).toContain(COMPTOIR_REDIRECT_MESSAGE);

      const strict = await run([seal], {
        message: 'vitre avant gauche',
        interpretation: interpretationOverride,
        identityMode: 'strict-head',
      });
      expect(strict.accepted).toBe(false);
      expect(strict.verification.checks.identity).toBe('failed');
    });

    it('anomaly 4: the real window wins over its seal when both are candidates', async () => {
      const { run } = setup();
      const result = await run(
        [
          row({ reference: 'SEAL', designation2: 'JOINT LECHE VITRE AV G', designation: 'SEAL GLASS RUN FR LH', stock: { stockConsolide: 9 } }),
          row({ reference: 'GLASS', designation2: 'VITRE AV G', designation: 'GLASS FR DOOR LH' }),
        ],
        {
          message: 'vitre avant gauche',
          interpretation: {
            normalized: 'vitre avant gauche',
            catalogPart: 'vitre',
            catalogAliases: ['vitre', 'glass', 'window'],
            positions: { axes: ['AV'], sides: ['G'], levels: [] },
          },
        },
      );

      expect(result.accepted).toBe(true);
      expect(result.products.map((product: any) => product.reference)).toEqual(['GLASS']);
    });

    it('unknown stock: an article without a stock row is never presented as "Indisponible"', async () => {
      const { run } = setup();
      const result = await run([row({ stock: null })]);

      expect(result.accepted).toBe(false);
      expect(result.response).toContain(COMPTOIR_REDIRECT_MESSAGE);
      expect(result.response).not.toContain('Indisponible');
    });
  });

  describe('position rule: no-exact-match message lists only positions that exist', () => {
    const outcome = (over: any) => ({
      applied: true, requestedPart: 'charniere capot',
      requestedPositions: { axes: ['AV'], sides: [], levels: [] },
      identityMode: 'strict-head', candidatesBefore: 3, rejectedByIdentity: 1,
      rejectedByPosition: 2, kept: 0, availablePositions: ['G', 'D'], noExactMatch: true,
      ...over,
    });

    it('hood hinge: proposes left/right only', () => {
      const text = new ResponseService().buildNoExactMatchResponse(outcome({}) as any, vehicle);
      expect(text).toContain('Positions existantes pour cette pièce : gauche, droite.');
      expect(text).toContain(COMPTOIR_REDIRECT_MESSAGE);
    });

    it('hood: proposes no position at all', () => {
      const text = new ResponseService().buildNoExactMatchResponse(
        outcome({ requestedPart: 'capot', availablePositions: [] }) as any, vehicle);
      expect(text).not.toContain('Positions existantes');
    });
  });

  describe('processMessage vehicle-first candidate pipeline', () => {
    it('searches compatible rows before normalization and returns only those references', async () => {
      const events: string[] = [];
      const candidate = row({ reference: 'COMPATIBLE-1' });
      const searchResult = {
        products: [candidate],
        scope: {
          active: true,
          vin: null,
          vehicleNo: null,
          model: 'NEW CELERIO',
          modelDescription: null,
          typeCodes: ['T1'],
          primaryTypeCodes: ['T1'],
          typeCodeSource: 'explicit',
        },
        constraint: null,
        truncated: false,
      };
      const normalized = interpretation({
        normalized: 'retroviseur droite',
        confidence: 0.9,
        intent: 'SEARCH',
      });
      const orchestrator = Object.create(ChatOrchestratorService.prototype) as any;
      orchestrator.sessionService = {
        getOrCreate: jest.fn(async () => ({ id: 'session-1' })),
        getHistory: jest.fn(async () => []),
        saveUserMessage: jest.fn(async () => 'message-1'),
        saveBotResponse: jest.fn(async () => undefined),
      };
      orchestrator.contextService = {
        get: jest.fn(async () => ({})),
        getLastPart: jest.fn(() => undefined),
        getLastQuery: jest.fn(() => undefined),
        buildSearchQuery: jest.fn((message: string) => message),
        clearFilters: jest.fn(),
        setLastQuery: jest.fn(),
        setLastPart: jest.fn(),
      };
      orchestrator.searchService = {
        searchWithDiagnostics: jest.fn(async (_query: string, _vehicle: unknown, options?: { validate?: boolean }) => {
          events.push(options?.validate === false ? 'preflight' : 'search');
          return searchResult;
        }),
        isReferenceQuery: jest.fn(() => false),
      };
      orchestrator.aiNormalizer = {
        repairTypos: jest.fn(async (message: string) => message),
        normalizeQuery: jest.fn(async (_message: string, _history: unknown[], _vehicle: unknown, candidates: any[]) => {
          events.push('interpret');
          expect(candidates.map((item) => item.reference)).toEqual(['COMPATIBLE-1']);
          return normalized;
        }),
      };
      orchestrator.clarificationService = {
        getPending: jest.fn(() => undefined),
        checkNeeded: jest.fn(() => ({ needed: false })),
      };
      orchestrator.responseService = new ResponseService();
      orchestrator.intelligenceService = {
        detectIntentWithAI: jest.fn(async () => ({ type: 'SEARCH', confidence: 0.9 })),
        analyzeQueryClarity: jest.fn(() => 10),
        calculateConfidence: jest.fn(() => ({ score: 90, level: 'HIGH' })),
      };
      orchestrator.vehicleModels = {
        normalize: jest.fn(() => 'CELERIO'),
        detectModelInText: jest.fn(() => null),
      };
      orchestrator.synonymsService = {
        isKnownAutomotiveTerm: jest.fn((text: string) => text.includes('retroviseur')),
      };
      orchestrator.advancedSearch = {
        getSynonymMap: jest.fn(() => ({ retroviseur: ['retroviseur'] })),
      };
      orchestrator.logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
      orchestrator.answerFromVerifiedProducts = jest.fn(async ({ products }: { products: any[] }) => ({
        accepted: true,
        response: 'Pièce confirmée',
        products: [products[0]],
        verification: {
          compatibility: 'CONFIRMEE',
          checks: { identity: 'confirmed', position: 'confirmed', qualifiers: 'not-applicable', vehicle: 'confirmed', stockPrice: 'confirmed' },
          reasons: [],
          aiAudit: 'skipped',
          aiFlags: { effective: [], ignored: [] },
        },
        trace: { identifiedPart: 'retroviseur', modelCode: 'T1', proposedReferences: [] },
      }));

      const result = await orchestrator.processMessage('retroviseur droite', vehicle, 'session-1');

      expect(events.slice(0, 2)).toEqual(['preflight', 'interpret']);
      expect(result.products.map((product: any) => product.reference)).toEqual(['COMPATIBLE-1']);
    });
  });
