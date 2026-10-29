import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { SynonymsService } from '../synonyms/synonyms.service';
import { VehicleModelsService } from '../constants/vehicle-models.service';
import { IntelligenceService } from './intelligence.service';

function createService() {
  const countMessages = jest.fn(async () => 120);
  const aggregateFeedback = jest.fn(async () => ({ _avg: { rating: 4 }, _count: { rating: 2 } }));
  const countPositive = jest.fn(async () => 1);
  const findManyMessages = jest.fn(async () => []);
  const prisma = {
    chatMessage: { count: countMessages, findMany: findManyMessages },
    chatFeedback: { aggregate: aggregateFeedback, count: countPositive },
  } as unknown as PrismaService;
  const synonyms = {
    isKnownAutomotiveTerm: jest.fn((text: string) => text.includes('retroviseur')),
    getTunisianMap: () => ({}),
  } as unknown as SynonymsService;
  const vehicleModels = {
    detectModelInText: jest.fn((text: string) => text.includes('celerio') ? 'CELERIO' : null),
  } as unknown as VehicleModelsService;

  return {
    service: new IntelligenceService(prisma, synonyms, vehicleModels),
    countMessages,
    aggregateFeedback,
    countPositive,
    findManyMessages,
    synonyms,
    vehicleModels,
  };
}

describe('IntelligenceService conservative fallback', () => {
  it('does not guess complaint, service, or price intents when the normalizer is unsure', async () => {
    const { service } = createService();

    await expect(service.detectIntentWithAI('ma voiture fait un bruit')).resolves.toMatchObject({
      type: 'SEARCH',
      confidence: 0.5,
    });
    await expect(service.detectIntentWithAI('quels sont vos horaires ?')).resolves.toMatchObject({
      type: 'SEARCH',
      confidence: 0.5,
    });
  });

  it('recognizes a bare position reply only when clarification is pending', async () => {
    const { service } = createService();

    await expect(service.detectIntentWithAI('arrière droite', [], true)).resolves.toMatchObject({
      type: 'SEARCH',
      confidence: 0.95,
    });
    await expect(service.detectIntentWithAI('arrière droite')).resolves.toMatchObject({
      type: 'SEARCH',
      confidence: 0.5,
    });
  });

  it('calculates query clarity from catalog, position, model, reference, and linguistic signals', () => {
    const { service, synonyms, vehicleModels } = createService();

    expect(service.analyzeQueryClarity('je veux retroviseur droit CELERIO 09482-30010, 2 pieces?')).toBe(20);
    expect(synonyms.isKnownAutomotiveTerm).toHaveBeenCalled();
    expect(vehicleModels.detectModelInText).toHaveBeenCalled();
  });

  it('uses database aggregates instead of loading every feedback row for metrics', async () => {
    const { service, countMessages, aggregateFeedback, countPositive, findManyMessages } = createService();

    await expect(service.getPerformanceMetrics()).resolves.toEqual({
      avgResponseTime: 0,
      avgConfidence: 80,
      successRate: 50,
      learningRate: 12,
      totalInteractions: 120,
    });
    expect(countMessages).toHaveBeenCalledTimes(1);
    expect(aggregateFeedback).toHaveBeenCalledTimes(1);
    expect(countPositive).toHaveBeenCalledTimes(1);
    expect(findManyMessages).not.toHaveBeenCalled();
  });
});
