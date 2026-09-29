import { describe, expect, it } from '@jest/globals';
import {
  checkResponseAgainstCatalog,
  decideAfterAiFlags,
  verifyProductAgainstCatalog,
} from './catalog-verifier';
import type { ProductVerification } from './catalog-verifier';

const noPosition = { axes: [], sides: [], levels: [] };
const vehicleScope = { scoped: true, compatibleTypeCodes: ['T1'] };
const row = (over: any = {}) => ({
  reference: 'REF-1',
  designation: 'MIRROR OUTER RH',
  designation2: 'RETROVISEUR EXTERIEUR D',
  prixTtc: '45.5',
  stock: { stockConsolide: 3 },
  fitments: [{ typeCode: 'T1' }],
  ...over,
});
const interpretation = (over: any = {}) => ({
  catalogPart: 'retroviseur',
  catalogAliases: ['retroviseur', 'miroir'],
  positions: { axes: [], sides: ['D'], levels: [] },
  qualifiers: [],
  ...over,
});

describe('verifyProductAgainstCatalog', () => {
  it('confirms the catalog concept, requested position, and vehicle fitment', () => {
    expect(verifyProductAgainstCatalog(row(), interpretation(), vehicleScope)).toMatchObject({
      identity: 'confirmed', position: 'confirmed', vehicle: 'confirmed', verified: true,
    });
  });

  it('fails when the requested concept is absent from the customer-facing designation', () => {
    const result = verifyProductAgainstCatalog(
      row({ designation2: 'PLAQUETTE FREIN AV', designation: 'BRAKE PAD' }),
      interpretation(),
      vehicleScope,
    );
    expect(result.identity).toBe('failed');
    expect(result.verified).toBe(false);
  });

  it('fails when the catalog French designation states the opposite position', () => {
    const result = verifyProductAgainstCatalog(row({ designation2: 'RETROVISEUR EXTERIEUR G' }), interpretation(), vehicleScope);
    expect(result.position).toBe('failed');
    expect(result.verified).toBe(false);
  });

  it('marks missing catalog position as unverifiable rather than incorrect', () => {
    const result = verifyProductAgainstCatalog(
      row({ designation2: 'RETROVISEUR EXTERIEUR', designation: 'MIRROR' }),
      interpretation(),
      vehicleScope,
    );
    expect(result.position).toBe('unverifiable');
    expect(result.verified).toBe(true);
  });

  it('marks a related accessory as identity-unverifiable for the AI advisory check', () => {
    const result = verifyProductAgainstCatalog(row({ designation2: 'SUPPORT RETROVISEUR D' }), interpretation(), vehicleScope);
    expect(result.identity).toBe('unverifiable');
    expect(result.verified).toBe(true);
  });

  it('fails when the fitment type codes do not match the resolved vehicle', () => {
    const result = verifyProductAgainstCatalog(row({ fitments: [{ typeCode: 'OTHER' }] }), interpretation(), vehicleScope);
    expect(result.vehicle).toBe('failed');
    expect(result.verified).toBe(false);
  });

  it('fails a scoped vehicle when no DB type code resolved', () => {
    expect(verifyProductAgainstCatalog(row(), interpretation(), {
      scoped: true,
      compatibleTypeCodes: [],
    }).vehicle).toBe('failed');
  });

  it('treats a missing qualifier as unverifiable, not a DB-proven mismatch', () => {
    const result = verifyProductAgainstCatalog(row(), interpretation({ qualifiers: ['noir'] }), vehicleScope);
    expect(result.qualifiers).toBe('unverifiable');
    expect(result.verified).toBe(true);
  });

  it('does not claim vehicle compatibility when no vehicle was supplied', () => {
    expect(verifyProductAgainstCatalog(row(), interpretation(), {
      scoped: false,
      compatibleTypeCodes: [],
    }).vehicle).toBe('not-applicable');
  });

  it('does not use the English OEM designation to override a conflicting French name', () => {
    const result = verifyProductAgainstCatalog(
      row({ designation2: 'PLAQUETTE FREIN AV', designation: 'MIRROR RH' }),
      interpretation(),
      vehicleScope,
    );
    expect(result.identity).toBe('failed');
  });
});

describe('checkResponseAgainstCatalog', () => {
  it('accepts a public TTC price belonging to the available displayed row', () => {
    expect(checkResponseAgainstCatalog('RETROVISEUR — 45.500 TND', [row()]).status).toBe('confirmed');
  });

  it('rejects a price absent from the displayed DB row', () => {
    expect(checkResponseAgainstCatalog('RETROVISEUR — 99.000 TND', [row()]).status).toBe('failed');
  });

  it('rejects a price for an unavailable row', () => {
    expect(checkResponseAgainstCatalog('45.500 TND', [row({ stock: { stockConsolide: 1 } })]).status).toBe('failed');
  });

  it('rejects an availability claim that contradicts stock', () => {
    expect(checkResponseAgainstCatalog('RETROVISEUR disponible', [row({ stock: { stockConsolide: 1 } })]).status).toBe('failed');
    expect(checkResponseAgainstCatalog("RETROVISEUR n'est pas disponible", [row()]).status).toBe('failed');
  });

  it('accepts no-results wording when the shown row is unavailable', () => {
    expect(checkResponseAgainstCatalog(
      'Aucun résultat disponible avec les filtres appliqués',
      [row({ stock: { stockConsolide: 1 } })],
    ).status).toBe('confirmed');
  });

  it('does not require a particular wording when the response makes no false claim', () => {
    expect(checkResponseAgainstCatalog("Désolé, RETROVISEUR n'est pas disponible", [row({ stock: { stockConsolide: 0 } })]).status).toBe('confirmed');
  });
});

describe('decideAfterAiFlags', () => {
  const verification = (over: Partial<ProductVerification> = {}): ProductVerification => ({
    reference: 'REF-1',
    identity: 'confirmed',
    position: 'confirmed',
    qualifiers: 'not-applicable',
    vehicle: 'confirmed',
    stockPrice: 'confirmed',
    verified: true,
    issues: [],
    ...over,
  });

  it('ignores an AI flag when deterministic DB evidence already confirmed the check', () => {
    const result = decideAfterAiFlags([verification()], [{ type: 'PART_IDENTITY', reference: 'REF-1' }]);
    expect(result.accept).toBe(true);
    expect(result.ignored).toHaveLength(1);
  });

  it('honours a semantic flag for an unverifiable DB check', () => {
    expect(decideAfterAiFlags(
      [verification({ identity: 'unverifiable' })],
      [{ type: 'PART_IDENTITY', reference: 'REF-1' }],
    ).accept).toBe(false);
  });

  it('ignores flags for invented references and non-semantic OTHER flags', () => {
    const result = decideAfterAiFlags(
      [verification({ identity: 'unverifiable' })],
      [{ type: 'PART_IDENTITY', reference: 'INVENTED' }, { type: 'OTHER' }],
    );
    expect(result.accept).toBe(true);
    expect(result.ignored).toHaveLength(2);
  });

  it('does not let AI decide vehicle or price/stock facts', () => {
    const result = decideAfterAiFlags([verification()], [
      { type: 'VEHICLE', reference: 'REF-1' },
      { type: 'PRICE_STOCK', reference: 'REF-1' },
    ]);
    expect(result.accept).toBe(true);
    expect(result.ignored).toHaveLength(2);
  });
});