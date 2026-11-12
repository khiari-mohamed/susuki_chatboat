import { describe, expect, it } from '@jest/globals';
import { publicPrice, publicPriceSource } from './catalog-verifier';

describe('publicPrice', () => {
  it('prefers the ERP public price whatever the source', () => {
    expect(publicPrice({ source: 'BC-ERP', prixPublic: 280, prixTtc: 222.5 })).toBe(280);
    expect(publicPrice({ source: '02_CARPRO', prixPublic: '280.00000' })).toBe(280);
    expect(publicPrice({ source: '01_PROD', prix_public: 150, prix_ttc: 120 })).toBe(150);
  });

  it('falls back to prix_ttc only for 01_PROD rows (not yet synced)', () => {
    expect(publicPrice({ source: '01_PROD', prixTtc: '99.9' })).toBe(99.9);
    expect(publicPrice({ source: '01_PROD', prixPublic: null, prixTtc: 99.9 })).toBe(99.9);
  });

  it('never exposes a wholesale price', () => {
    expect(publicPrice({ source: '02_CARPRO', prixTtc: 99.9 })).toBeNull();
    expect(publicPrice({ source: 'BC-ERP', prixTtc: 99.9 })).toBeNull();
  });

  it('treats a zero or missing public price as no price', () => {
    expect(publicPrice({ source: '02_CARPRO', prixPublic: 0 })).toBeNull();
    expect(publicPrice({ source: 'BC-ERP' })).toBeNull();
  });

  it('exposes the stored value so cards print it as stored', () => {
    expect(publicPriceSource({ source: 'BC-ERP', prixPublic: '280.00000', prixTtc: 1 })).toBe('280.00000');
    expect(publicPriceSource({ source: '01_PROD', prixPublic: null, prixTtc: '99.90' })).toBe('99.90');
    expect(publicPriceSource({ source: '02_CARPRO', prixTtc: '99.90' })).toBeNull();
  });
});
