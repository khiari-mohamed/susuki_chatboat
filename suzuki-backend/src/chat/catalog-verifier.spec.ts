import { describe, expect, it } from '@jest/globals';
import {
  checkResponseAgainstCatalog,
  verifyProductAgainstCatalog,
} from './catalog-verifier';

const noPosition = { axes: [], sides: [], levels: [] };
const vehicleScope = { scoped: true, compatibleTypeCodes: ['T1'] };
const row = (over: any = {}) => ({
  reference: 'REF-1',
  designation: 'MIRROR OUTER RH',
  designation2: 'RETROVISEUR EXTERIEUR D',
  source: '01_PROD',
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

  it('confirms a compound head noun when position and numeric qualifiers split the designation', () => {
    const result = verifyProductAgainstCatalog(
      row({ designation2: 'COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON' }),
      interpretation({
        catalogPart: 'coussinet palier vilebrequin rouge violet',
        catalogAliases: [],
        positions: { axes: [], sides: [], levels: ['SUP'] },
        qualifiers: ['rouge violet'],
      }),
      vehicleScope,
    );

    expect(result.identity).toBe('confirmed');
    expect(result.position).toBe('confirmed');
    expect(result.vehicle).toBe('confirmed');
    expect(result.qualifiers).toBe('not-applicable');
  });

  it('uses the catalog head when the AI selected a component word from an inactive compound request', () => {
    const result = verifyProductAgainstCatalog(
      row({
        reference: '37290M56R00',
        designation2: 'BOUTON DEMARRAGE MOTEUR START/STOP',
        designation: 'SWITCH ASSY, ENGINE START',
      }),
      interpretation({
        catalogPart: 'moteur',
        catalogAliases: ['moteur', 'bouton demarrage moteur start feu stop'],
        positions: { axes: [], sides: [], levels: [] },
        identityMode: 'inactive-no-standalone-form',
      }),
      vehicleScope,
    );

    expect(result.identity).toBe('confirmed');
    expect(result.vehicle).toBe('confirmed');
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

  it('ignores a missing cosmetic color qualifier', () => {
    const result = verifyProductAgainstCatalog(row(), interpretation({ qualifiers: ['noir'] }), vehicleScope);
    expect(result.qualifiers).toBe('not-applicable');
    expect(result.verified).toBe(true);
  });

  it('ignores request words mistakenly returned as qualifiers', () => {
    const result = verifyProductAgainstCatalog(
      row(),
      interpretation({ qualifiers: ['prix', 'combien', 'stock'] }),
      vehicleScope,
    );
    expect(result.qualifiers).toBe('not-applicable');
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

  it('strips position tokens from catalogPart before head-identity comparison', () => {
    const result = verifyProductAgainstCatalog(
      row({ designation2: 'PARE CHOC AR' }),
      interpretation({
        catalogPart: 'pare choc av',
        catalogAliases: [],
        identityMode: 'strict-head',
        positions: { axes: ['AV'], sides: [], levels: [] },
      }),
      vehicleScope,
    );

    expect(result.identity).toBe('confirmed');
    expect(result.position).toBe('failed');
  });

  it('normalizes TYPE-2 and TYPE2 to the same fitment code', () => {
    const result = verifyProductAgainstCatalog(
      row({ fitments: [{ typeCode: 'AVH310-TYPE-2' }] }),
      interpretation(),
      { scoped: true, compatibleTypeCodes: ['AVH310 TYPE2'] },
    );

    expect(result.vehicle).toBe('confirmed');
  });

  describe('CarPro anomalies (18/09/2026)', () => {
    const bumperRequest = (over: any = {}) =>
      interpretation({
        catalogPart: 'pare choc',
        catalogAliases: ['pare choc', 'bumper'],
        positions: { axes: ['AV'], sides: [], levels: [] },
        ...over,
      });

    it('anomaly 2: a bumper grille is identity-unverifiable, and failed when a real bumper exists', () => {
      const grille = row({ designation2: 'GRILLE PARE CHOC AV', designation: 'GRILLE BUMPER FR' });
      expect(verifyProductAgainstCatalog(grille, bumperRequest(), vehicleScope).identity).toBe('unverifiable');

      const strict = verifyProductAgainstCatalog(grille, bumperRequest({ identityMode: 'strict-head' }), vehicleScope);
      expect(strict.identity).toBe('failed');
      expect(strict.verified).toBe(false);
    });

    it('anomaly 3: a cabin filter does not confirm the "air" qualifier, an air filter does', () => {
      const request = interpretation({
        catalogPart: 'filtre',
        catalogAliases: ['filtre', 'filter'],
        positions: { axes: [], sides: [], levels: [] },
        qualifiers: ['air'],
      });
      const cabin = verifyProductAgainstCatalog(
        row({ designation2: 'FILTRE HABITACLE', designation: 'CABIN FILTER' }), request, vehicleScope);
      expect(cabin.identity).toBe('confirmed');
      expect(cabin.qualifiers).toBe('unverifiable');

      const air = verifyProductAgainstCatalog(
        row({ designation2: 'FILTRE A AIR', designation: 'AIR FILTER' }), request, vehicleScope);
      expect(air.qualifiers).toBe('confirmed');
    });

    it('anomaly 4: a window seal is not the window', () => {
      const request = interpretation({
        catalogPart: 'vitre',
        catalogAliases: ['vitre', 'glass', 'window'],
        positions: { axes: ['AV'], sides: ['G'], levels: [] },
      });
      const seal = row({ designation2: 'JOINT LECHE VITRE AV G', designation: 'SEAL GLASS RUN FR LH' });
      expect(verifyProductAgainstCatalog(seal, request, vehicleScope).identity).toBe('unverifiable');
      expect(
        verifyProductAgainstCatalog(seal, { ...request, identityMode: 'strict-head' as const }, vehicleScope).identity,
      ).toBe('failed');

      const glass = row({ designation2: 'VITRE AV G', designation: 'GLASS FR DOOR LH' });
      expect(verifyProductAgainstCatalog(glass, request, vehicleScope)).toMatchObject({
        identity: 'confirmed', position: 'confirmed', verified: true,
      });
    });
  });
});

describe('checkResponseAgainstCatalog', () => {
  it('accepts a public TTC price belonging to the available displayed row', () => {
    expect(checkResponseAgainstCatalog('RETROVISEUR — 45.500 TND', [row()]).status).toBe('confirmed');
  });

  it('does not treat 02_CARPRO wholesale TTC as a public customer price', () => {
    expect(checkResponseAgainstCatalog(
      'RETROVISEUR — 45.500 TND',
      [row({ source: '02_CARPRO' })],
    ).status).toBe('failed');
  });

  it('does not merge a reference-like number adjacent to a printed price', () => {
    expect(checkResponseAgainstCatalog(
      'Référence 30010, prix 125,500 TND',
      [row({ prixTtc: '125.5' })],
    ).status).toBe('confirmed');
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
