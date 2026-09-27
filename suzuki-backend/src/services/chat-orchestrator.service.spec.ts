import { describe, expect, it, jest } from '@jest/globals';
import { OpenAIService } from '../chat/openai.service';
import { ChatOrchestratorService } from './chat-orchestrator.service';
import type { StructuredQueryInterpretation } from './ai-query-normalizer.service';

const interpretation: StructuredQueryInterpretation = {
  normalized: 'retroviseur droite',
  intent: 'SEARCH',
  catalogPart: 'retroviseur',
  positions: { axes: [], sides: ['D'], levels: [] },
  qualifiers: [],
  confidence: 0.9,
  uncertainty: 0.1,
  isGreeting: false,
  isThanks: false,
};

function createOrchestrator(auditResponse: string | Error) {
  const completeJson = jest.fn<(systemPrompt: string, userPrompt: string, maxTokens?: number) => Promise<string>>();
  if (auditResponse instanceof Error) completeJson.mockRejectedValue(auditResponse);
  else completeJson.mockResolvedValue(auditResponse);

  const orchestrator = Object.create(ChatOrchestratorService.prototype) as any;
  orchestrator.openaiService = { completeJson } as unknown as OpenAIService;
  orchestrator.advancedSearch = {
    getLastSearchDebug: () => ({ vehicleScope: { typeCodes: ['ARL415-TYPE1'] } }),
  };
  orchestrator.logger = { warn: jest.fn(), error: jest.fn() };
  return { orchestrator, completeJson };
}

describe('ChatOrchestratorService catalog answer audit', () => {
  const product = {
    reference: 'REF-1',
    designation: 'MIRROR RH',
    designation2: 'RETROVISEUR D',
    prixTtc: '45.500',
    stock: { stockConsolide: 3 },
    fitments: [{ typeCode: 'ARL415-TYPE1' }],
  };

  it('approves only a response cross-checked against the supplied DB reference', async () => {
    const { orchestrator, completeJson } = createOrchestrator(JSON.stringify({
      consistent: true,
      confirmedReferences: ['REF-1'],
      issues: [],
    }));

    const approved = await orchestrator.verifyCatalogResponse(
      'retroviseur droite',
      interpretation,
      { marque: 'SUZUKI', modele: 'NEW CELERIO', typeCode: 'ARL415-TYPE1' },
      'Pièces disponibles pour votre SUZUKI : RETROVISEUR D — 45.500 TND',
      [product],
    );

    expect(approved).toBe(true);
    expect(completeJson.mock.calls[0][1]).toContain('RETROVISEUR D');
    expect(completeJson.mock.calls[0][1]).toContain('ARL415-TYPE1');
  });

  it('rejects a judge-proposed reference not present in DB candidates', async () => {
    const { orchestrator } = createOrchestrator(JSON.stringify({
      consistent: true,
      confirmedReferences: ['INVENTED-REF'],
      issues: [],
    }));

    await expect(orchestrator.verifyCatalogResponse(
      'retroviseur droite',
      interpretation,
      { modele: 'NEW CELERIO', typeCode: 'ARL415-TYPE1' },
      'RETROVISEUR D — Disponible',
      [product],
    )).resolves.toBe(false);
  });

  it('rejects a response claiming available when DB consolidated stock is below 2', async () => {
    const { orchestrator, completeJson } = createOrchestrator(JSON.stringify({
      consistent: true,
      confirmedReferences: ['REF-1'],
      issues: [],
    }));
    const unavailable = { ...product, stock: { stockConsolide: 1 } };

    await expect(orchestrator.verifyCatalogResponse(
      'retroviseur droite',
      interpretation,
      { modele: 'NEW CELERIO', typeCode: 'ARL415-TYPE1' },
      'Pièces disponibles : RETROVISEUR D — 45.500 TND',
      [unavailable],
    )).resolves.toBe(false);
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('fails closed when the OpenAI audit is unavailable', async () => {
    const { orchestrator } = createOrchestrator(new Error('OpenAI unavailable'));

    await expect(orchestrator.verifyCatalogResponse(
      'retroviseur droite',
      interpretation,
      { modele: 'NEW CELERIO', typeCode: 'ARL415-TYPE1' },
      'RETROVISEUR D — Disponible',
      [product],
    )).resolves.toBe(false);
  });
});
