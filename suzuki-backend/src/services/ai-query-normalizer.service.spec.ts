import { describe, expect, it, jest } from '@jest/globals';
import { OpenAIService } from '../chat/openai.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { AIQueryNormalizerService } from './ai-query-normalizer.service';

function createNormalizer(
  isKnownAutomotiveTerm: (text: string) => boolean,
  catalogConceptExists = true,
  result = {
    normalized: 'retroviseur droit',
    intent: 'SEARCH',
    catalogPart: 'retroviseur',
    positions: { axes: [], sides: ['D'], levels: [] },
    qualifiers: [],
    isGreeting: false,
    isThanks: false,
    confidence: 0.85,
    uncertainty: 0.15,
  },
) {
  const completeJson = jest
    .fn<(systemPrompt: string, userPrompt: string, maxTokens?: number) => Promise<string>>()
    .mockResolvedValue(JSON.stringify(result));
  const openai = { completeJson } as unknown as OpenAIService;
  const synonyms = {
    isKnownAutomotiveTerm,
    getTunisianMap: () => ({}),
    getTypoMap: () => ({}),
    getStopWords: () => new Set<string>(),
    findClosestVocabularyWord: () => undefined,
    hasCatalogDesignationConcept: () => Promise.resolve(catalogConceptExists),
    getInterpretationCandidates: () => ({
      retroviseur: ['retroviseur', 'miroir'],
      filtre: ['filtre', 'filter'],
      'pare brise': ['pare brise', 'pare-brise', 'windshield'],
      'pare choc': ['pare choc', 'pare-choc', 'bumper'],
      joint: ['joint', 'seal'],
      vitre: ['vitre', 'glass', 'window'],
      lecheur: ['lecheur'],
    }),
  } as unknown as SynonymsService;
  return { service: new AIQueryNormalizerService(openai, synonyms), completeJson };
}

describe('AIQueryNormalizerService conversation context', () => {
  it('does not call OpenAI for a pure greeting or thanks', async () => {
    const { service, completeJson } = createNormalizer(() => false);

    await expect(service.normalizeQuery('Bonjour !')).resolves.toMatchObject({
      intent: 'GREETING',
      isGreeting: true,
      confidence: 1,
    });
    await expect(service.normalizeQuery('Merci beaucoup')).resolves.toMatchObject({
      intent: 'THANKS',
      isThanks: true,
      confidence: 1,
    });
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('still interprets a part request that includes courtesy thanks', async () => {
    const { service, completeJson } = createNormalizer(() => false);

    await service.normalizeQuery('Merci beaucoup, filtre à air');

    expect(completeJson).toHaveBeenCalledTimes(1);
  });

  it('does not call OpenAI for a pure service question', async () => {
    const { service, completeJson } = createNormalizer(() => false);

    await expect(service.normalizeQuery('Quels sont vos horaires ?')).resolves.toMatchObject({
      intent: 'SERVICE_QUESTION',
      confidence: 1,
    });
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('routes a broader unrelated service question without OpenAI', async () => {
    const { service, completeJson } = createNormalizer(() => false);

    await expect(service.normalizeQuery('Bonjour, vous êtes ouverts aujourd’hui ?')).resolves.toMatchObject({
      intent: 'SERVICE_QUESTION',
      confidence: 1,
    });
    expect(completeJson).not.toHaveBeenCalled();
  });

  it('sends recent turns to OpenAI for a short elliptical follow-up', async () => {
    const { service, completeJson } = createNormalizer(() => false);
    const history = [
      { role: 'user', content: 'Rétroviseur gauche' },
      { role: 'bot', content: 'Vous avez choisi le côté gauche.' },
    ];

    const result = await service.normalizeQuery('Et l’autre côté ?', history, {
      marque: 'SUZUKI',
      modele: 'SWIFT',
      typeCode: 'AVH310-TYPE1',
    });

    expect(result.normalized).toBe('retroviseur droite');
    expect(completeJson).toHaveBeenCalledTimes(1);
    expect(completeJson.mock.calls[0][1]).toContain('Rétroviseur gauche');
    expect(completeJson.mock.calls[0][1]).toContain('CURRENT MESSAGE: "Et l’autre côté ?"');
    expect(completeJson.mock.calls[0][1]).toContain('SUZUKI SWIFT AVH310-TYPE1');
  });

  it('recognizes whitespace-separated "l autre cote" as an elliptical follow-up', async () => {
    const { service, completeJson } = createNormalizer(() => false);

    const result = await service.normalizeQuery('Et l autre cote ?', [
      { role: 'user', content: 'Retroviseur gauche' },
    ]);

    expect(result.normalized).toBe('retroviseur droite');
    expect(completeJson.mock.calls[0][1]).toContain('Retroviseur gauche');
  });

  it('accepts a typo correction only when the interpreted part maps to a live catalog concept', async () => {
    const { service, completeJson } = createNormalizer(() => false, true, {
      normalized: 'pare brise',
      intent: 'SEARCH',
      catalogPart: 'pare brise',
      positions: { axes: [], sides: [], levels: [] },
      qualifiers: [],
      isGreeting: false,
      isThanks: false,
      confidence: 0.9,
      uncertainty: 0.1,
    });

    const result = await service.normalizeQuery('parbrize');

    expect(result.normalized).toBe('pare brise');
    expect(completeJson.mock.calls[0][0]).toContain('pare brise: pare brise, pare-brise, windshield');
  });

  it('rejects a model-selected part concept that is not in the catalog vocabulary', async () => {
    const { service } = createNormalizer(() => false, true, {
      normalized: 'pare choc',
      intent: 'SEARCH',
      catalogPart: 'windshield cover',
      positions: { axes: [], sides: [], levels: [] },
      qualifiers: [],
      isGreeting: false,
      isThanks: false,
      confidence: 0.99,
      uncertainty: 0.01,
    });

    const result = await service.normalizeQuery('parbrize');

    expect(result.normalized).toBe('parbrize');
    expect(result.confidence).toBe(0.5);
  });

  it('rejects a valid synonym concept when no real catalog designation contains it', async () => {
    const { service } = createNormalizer(() => false, false, {
      normalized: 'pare brise',
      intent: 'SEARCH',
      catalogPart: 'pare brise',
      positions: { axes: [], sides: [], levels: [] },
      qualifiers: [],
      isGreeting: false,
      isThanks: false,
      confidence: 0.99,
      uncertainty: 0.01,
    });

    const result = await service.normalizeQuery('parbrize');

    expect(result.normalized).toBe('parbrize');
    expect(result.confidence).toBe(0.5);
  });

  it('sends even a known explicit part request through structured OpenAI interpretation', async () => {
    const { service, completeJson } = createNormalizer(() => true, true, {
      normalized: 'filtre a air',
      intent: 'SEARCH',
      catalogPart: 'filtre',
      positions: { axes: [], sides: [], levels: [] },
      qualifiers: ['air'],
      isGreeting: false,
      isThanks: false,
      confidence: 0.92,
      uncertainty: 0.08,
    });

    const result = await service.normalizeQuery('Filtre à air', [
      { role: 'user', content: 'Amortisseur arrière' },
    ]);

    expect(result.normalized).toBe('filtre a air');
    expect(result.intent).toBe('SEARCH');
    expect(result.catalogPart).toBe('filtre');
    expect(result.qualifiers).toEqual(['air']);
    expect(completeJson).toHaveBeenCalledTimes(1);
    expect(completeJson.mock.calls[0][1]).toContain('CURRENT MESSAGE: "Filtre à air"');
  });

  it('returns only DB-grounded aliases for accepted OpenAI part interpretations', async () => {
    const { service } = createNormalizer(() => true);

    await expect(service.normalizeQuery('retroviseur droit')).resolves.toMatchObject({
      catalogPart: 'retroviseur',
      catalogAliases: ['retroviseur', 'miroir'],
      source: 'ai',
    });
  });

  it('keeps a DB-known part usable when OpenAI is unavailable', async () => {
    const { service, completeJson } = createNormalizer((text) => /retroviseur/.test(text));
    completeJson.mockRejectedValue(new Error('OpenAI unavailable'));

    await expect(service.normalizeQuery('retroviseur droit')).resolves.toMatchObject({
      intent: 'SEARCH',
      catalogPart: 'retroviseur',
      catalogAliases: ['retroviseur', 'miroir'],
      confidence: 0.75,
      source: 'deterministic',
    });
  });

  it('keeps unknown queries below the answer confidence gate when OpenAI is unavailable', async () => {
    const { service, completeJson } = createNormalizer(() => false);
    completeJson.mockRejectedValue(new Error('OpenAI unavailable'));

    await expect(service.normalizeQuery('zorglub truc')).resolves.toMatchObject({
      confidence: 0.5,
      source: 'deterministic',
      catalogPart: null,
    });
  });

  it('normalizes the catalog term lèche-vitre without fuzzy-changing it to lève-vitre', async () => {
    const { service, completeJson } = createNormalizer((text) =>
      ['joint', 'lecheur', 'vitre'].some((term) => text.includes(term)), true, {
        normalized: 'joint lecheur de vitre avant gauche',
        intent: 'SEARCH',
        catalogPart: 'joint',
        positions: { axes: ['AV'], sides: ['G'], levels: [] },
        qualifiers: [],
        isGreeting: false,
        isThanks: false,
        confidence: 0.9,
        uncertainty: 0.1,
      },
    );

    const result = await service.normalizeQuery('Joint de lèche-vitre avant gauche');

    expect(result.normalized).toBe('joint lecheur de vitre avant gauche');
    expect(completeJson).toHaveBeenCalledTimes(1);
  });
});