import { describe, expect, it } from '@jest/globals';
import { publicPrice, publicPriceSource } from './catalog-verifier';

describe('publicPrice', () => {
  it('quotes the public TTC price (prix_ttc) of 01_PROD rows', () => {
    expect(publicPrice({ source: '01_PROD', prixTtc: '99.9' })).toBe(99.9);
    expect(publicPrice({ source: '01_PROD', prix_ttc: 120 })).toBe(120);
  });

  it('never quotes the relay prixPublic (it is the amount before VAT)', () => {
    expect(publicPrice({ source: '01_PROD', prixPublic: 100, prixTtc: 119 })).toBe(119);
    expect(publicPrice({ source: '01_PROD', prixPublic: 100 })).toBeNull();
    expect(publicPrice({ source: '02_CARPRO', prixPublic: 100 })).toBeNull();
  });

  it('never exposes a wholesale price', () => {
    expect(publicPrice({ source: '02_CARPRO', prixTtc: 99.9 })).toBeNull();
    expect(publicPrice({ source: 'BC-ERP', prixTtc: 99.9 })).toBeNull();
  });

  it('treats a zero or missing price as no price', () => {
    expect(publicPrice({ source: '01_PROD', prixTtc: 0 })).toBeNull();
    expect(publicPrice({ source: '01_PROD', prixTtc: null })).toBeNull();
    expect(publicPrice({ source: '01_PROD' })).toBeNull();
  });

  it('exposes the stored value so cards print it as stored', () => {
    expect(publicPriceSource({ source: '01_PROD', prixTtc: '99.90' })).toBe('99.90');
    expect(publicPriceSource({ source: '02_CARPRO', prixTtc: '99.90' })).toBeNull();
  });
});
