import { describe, expect, it } from '@jest/globals';
import { ResponseService } from './response.service';

describe('ResponseService.selectPrimaryProduct', () => {
  const service = new ResponseService();

  it('keeps the most relevant part even when a less relevant alternative is available', () => {
    const requested = {
      reference: 'REQUESTED',
      score: 200,
      stock: { stockConsolide: 1 },
    };
    const alternative = {
      reference: 'ALTERNATIVE',
      score: 100,
      stock: { stockConsolide: 5 },
    };

    expect(service.selectPrimaryProduct([alternative, requested])).toBe(requested);
  });

  it('uses availability only to break a relevance tie', () => {
    const unavailable = {
      reference: 'UNAVAILABLE',
      score: 100,
      stock: { stockConsolide: 1 },
    };
    const available = {
      reference: 'AVAILABLE',
      score: 100,
      stock: { stockConsolide: 2 },
    };

    expect(service.selectPrimaryProduct([unavailable, available])).toBe(available);
  });
});
