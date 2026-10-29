import { describe, expect, it, jest } from '@jest/globals';
import { ContextService } from './context.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ContextService.buildSearchQuery', () => {
  const contextService = new ContextService({} as PrismaService);

  it('preserves a new explicit part request instead of replacing it with the previous part', () => {
    const message = 'Pour le véhicule associé à ce VIN, cherche un filtre à air.';

    expect(contextService.buildSearchQuery(message, { lastPart: 'amortisseur' }, true)).toBe(message);
  });

  it('reuses the previous part and side for a genuine follow-up without a new part identity', () => {
    expect(
      contextService.buildSearchQuery('Et pour le véhicule, à l’arrière ?', {
        lastPart: 'amortisseur',
        lastSide: 'droite',
      }),
    ).toBe('amortisseur arriere droite');
  });

  it('completes a bare position answer with the previous part', () => {
    expect(contextService.buildSearchQuery('avg', { lastPart: 'porte' })).toBe('porte avant gauche');
    expect(contextService.buildSearchQuery('droite', { lastPart: 'porte' })).toBe('porte droite');
  });

  it('does not treat a message introducing another noun as a follow-up', () => {
    const message = 'aileron arrière sport';
    expect(contextService.buildSearchQuery(message, { lastPart: 'porte' })).toBe(message);
  });

  it('returns the previous part for a follow-up that carries no position', () => {
    expect(contextService.buildSearchQuery('pareil', { lastPart: 'porte' })).toBe('porte');
  });

  it('reuses the full last query for a price or availability-only follow-up', () => {
    const lastQuery = 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON';
    expect(contextService.buildSearchQuery("D'accord. Et le prix, s'il vous plaît ?", {
      lastPart: 'coussinet',
      lastQuery,
    })).toBe(lastQuery);
    expect(contextService.buildSearchQuery('W ch7al ? Mawjoud ?', {
      lastPart: 'coussinet',
      lastQuery,
    })).toBe(lastQuery);
  });

  it('uses the previous query when no synonym-backed part name was stored', () => {
    const lastQuery = 'RETROV INT VITARA';
    expect(contextService.buildSearchQuery("D'accord. Et le prix, s'il vous plaît ?", {
      lastQuery,
    })).toBe(lastQuery);
    expect(contextService.buildSearchQuery('Vous l’avez en stock ?', {
      lastQuery,
    })).toBe(lastQuery);
  });

  it('returns the message untouched when there is nothing to complete', () => {
    expect(contextService.buildSearchQuery('bonjour', {})).toBe('bonjour');
    expect(contextService.buildSearchQuery('', { lastPart: 'porte' })).toBe('');
  });
});

describe('ContextService.get', () => {
  it('reads the last side from the customer and the last part from the bot metadata', async () => {
    const findMany = jest.fn<() => Promise<{ sender: string; message: string; metadata: any }[]>>().mockResolvedValue([
      { sender: 'bot', message: 'réponse', metadata: { part: 'retroviseur' } },
      { sender: 'user', message: 'retroviseur gauche', metadata: null },
    ]);
    const service = new ContextService({ chatMessage: { findMany } } as unknown as PrismaService);

    await expect(service.get('s1')).resolves.toEqual({ lastPart: 'retroviseur', lastSide: 'gauche' });
  });

  it('prefers the in-memory part over the persisted one', async () => {
    const findMany = jest.fn<() => Promise<{ sender: string; message: string; metadata: any }[]>>().mockResolvedValue([
      { sender: 'bot', message: 'réponse', metadata: { part: 'retroviseur' } },
    ]);
    const service = new ContextService({ chatMessage: { findMany } } as unknown as PrismaService);
    service.setLastPart('s1', 'aile');

    await expect(service.get('s1')).resolves.toMatchObject({ lastPart: 'aile' });
  });

  it('returns the current in-memory last query for follow-up resolution', async () => {
    const findMany = jest.fn<() => Promise<{ sender: string; message: string; metadata: any }[]>>().mockResolvedValue([]);
    const service = new ContextService({ chatMessage: { findMany } } as unknown as PrismaService);
    service.setLastQuery('s1', 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON');

    await expect(service.get('s1')).resolves.toMatchObject({
      lastQuery: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON',
    });
  });
});