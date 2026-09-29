import { describe, expect, it, jest } from '@jest/globals';
import { OpenAIService } from '../chat/openai.service';
import { ChatOrchestratorService } from './chat-orchestrator.service';
import { ResponseService } from './response.service';
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
  orchestrator.advancedSearch = { resolveVehicleTypeCodes: jest.fn(async () => resolvedTypeCodes) };
  orchestrator.responseService = new ResponseService();
  orchestrator.logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };

  const run = (
    products: any[],
    options: {
      build?: (shown: any[]) => string;
      interpretation?: Partial<StructuredQueryInterpretation>;
      requireUnderstanding?: boolean;
    } = {},
  ) => orchestrator.answerFromVerifiedProducts({
    message: 'retroviseur droite',
    interpretation: interpretation(options.interpretation),
    vehicle,
    products,
    requireUnderstanding: options.requireUnderstanding,
    build: options.build ?? ((shown: any[]) => orchestrator.responseService.buildProductResponse(shown, 'retroviseur droite', vehicle)),
  });
  return { orchestrator, run, completeJson };
}

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

  it('does not hard-fail a model-supplied qualifier missing from the designation', async () => {
    const { run } = setup(JSON.stringify({ flags: [] }));
    const result = await run([row()], {
      interpretation: { normalized: 'retroviseur noir', qualifiers: ['noir'] },
    });

    expect(result.accepted).toBe(true);
    expect(result.verification.checks.qualifiers).toBe('unverifiable');
  });

  it('honours an AI semantic flag only when deterministic evidence is inconclusive', async () => {
    const { run } = setup(JSON.stringify({ flags: [
      { type: 'PART_IDENTITY', reference: 'REF-1', detail: 'Possible bracket, not mirror' },
    ] }));
    const result = await run([row({ designation2: 'SUPPORT RETROVISEUR D' })]);

    expect(result.accepted).toBe(false);
    expect(result.response).toContain('Comptoir Pièces de Rechange');
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
    const result = await run([row({ designation2: 'SUPPORT RETROVISEUR D' })]);

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

  it('accepts a truthful unavailable-stock response without requiring exact wording', async () => {
    const { run } = setup();
    const result = await run([row({ stock: { stockConsolide: 1 } })], {
      build: () => "Désolé, rétroviseur n'est pas disponible actuellement pour votre SUZUKI NEW CELERIO.",
    });

    expect(result.accepted).toBe(true);
  });

  it('requires confidence for catalog interpretation but exempts exact reference lookups', async () => {
    const { run } = setup();
    const lowConfidence = await run([row()], { interpretation: { confidence: 0.5 } });
    expect(lowConfidence.accepted).toBe(false);

    const exactReference = await run([row()], {
      interpretation: { confidence: 0.5 },
      requireUnderstanding: false,
      build: (shown) => new ResponseService().buildReferenceResponse('REF-1', shown[0], vehicle),
    });
    expect(exactReference.accepted).toBe(true);
  });
});
