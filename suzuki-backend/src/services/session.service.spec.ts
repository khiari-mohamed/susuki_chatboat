import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from './session.service';

describe('SessionService.getHistory', () => {
  it('returns the latest turns in chronological order', async () => {
    const newestFirst = [
      { sender: 'bot', message: 'Dernière réponse', metadata: null },
      { sender: 'user', message: 'Dernière demande', metadata: null },
    ];
    const findMany = jest.fn().mockResolvedValue(newestFirst);
    const service = new SessionService({ chatMessage: { findMany } } as unknown as PrismaService);

    const history = await service.getHistory('session-1', 2);

    expect(findMany).toHaveBeenCalledWith({
      where: { sessionId: 'session-1' },
      orderBy: { timestamp: 'desc' },
      take: 2,
    });
    expect(history.map((message) => message.content)).toEqual(['Dernière demande', 'Dernière réponse']);
  });
});