import { describe, expect, it } from '@jest/globals';
import { hasKnownStock, isQuantityAvailable } from './business-rules.constants';

describe('consolidated stock rules', () => {
  it('treats exactly two units as available', () => {
    expect(isQuantityAvailable(2)).toBe(true);
    expect(isQuantityAvailable('2')).toBe(true);
    expect(isQuantityAvailable(1)).toBe(false);
  });

  it.each([null, undefined, {}, { stockConsolide: null }, { stockConsolide: '' }, { stockConsolide: '  ' }, { stockConsolide: true }])(
    'treats missing or invalid consolidated stock as unknown: %p',
    (stock) => {
      expect(hasKnownStock(stock)).toBe(false);
    },
  );

  it('treats an explicit zero as known but unavailable', () => {
    expect(hasKnownStock({ stockConsolide: 0 })).toBe(true);
    expect(isQuantityAvailable(0)).toBe(false);
  });
});