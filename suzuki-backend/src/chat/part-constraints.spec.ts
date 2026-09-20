import {
  applyCatalogConstraints,
  buildIdentityKeys,
  buildRequestedPartTokens,
  extractRequestedPositions,
  getCatalogPositions,
  keysMatch,
} from './part-constraints';

// Designations below are real catalog names (Base_Articles export / Sept-2026 backup).
const part = (designation2: string | null, designation = '') => ({ designation2, designation });

function run(query: string, catalog: any[], variants: Record<string, string[]> = {}) {
  const partTokens = buildRequestedPartTokens(query.split(/\s+/));
  const keys = buildIdentityKeys([partTokens], (p) => variants[p] ?? []);
  return applyCatalogConstraints(catalog, {
    requestedPositions: extractRequestedPositions(query),
    requestedPartTokens: partTokens,
    identityKeys: keys,
  });
}
const names = (r: { kept: any[] }) => r.kept.map((p) => p.designation2 ?? p.designation);

describe('position parsing', () => {
  it('reads AV/AR/G/D and combined tokens from the customer text', () => {
    expect(extractRequestedPositions('aile avant gauche')).toEqual({ axes: ['AV'], sides: ['G'], levels: [] });
    expect(extractRequestedPositions('amortisseur avd')).toEqual({ axes: ['AV'], sides: ['D'], levels: [] });
    expect(extractRequestedPositions('pare choc ar')).toEqual({ axes: ['AR'], sides: [], levels: [] });
  });

  it('never reads a French elision as "droite"', () => {
    expect(extractRequestedPositions("filtre d'air").sides).toEqual([]);
    expect(extractRequestedPositions("bougie d'allumage").sides).toEqual([]);
    expect(getCatalogPositions(part("BOUGIE D'ALLUMAGE")).sides).toEqual([]);
  });

  it('reads catalog position from the FRENCH name, not from the English OEM name', () => {
    const p = part('DURITE CARBURANT', 'PIPE FUEL FEED (LH)');
    expect(getCatalogPositions(p).sides).toEqual([]);
  });

  it('falls back to the English name only when there is no French name', () => {
    expect(getCatalogPositions(part(null, 'LAMP ASSY, REAR COMB, L'))).toMatchObject({ axes: ['AR'], sides: ['G'], origin: 'english' });
    // "REAR VIEW" is a mirror type, not a rear position
    expect(getCatalogPositions(part(null, 'MIRROR ASSY,OUT REAR VIEW,R')).axes).toEqual([]);
  });
});

describe('identity + position gate', () => {
  const bumpers = [
    part('SUPPORT PARE CHOC AV G'),
    part('SABOT PARE CHOC AR D'),
    part('GRILLE DE PARE CHOC'),
    part('SOUS PARE CHOC AV'),
    part('PARE CHOC AV'),
    part('PARE CHOC AR'),
    part('PARA CHOC AV'),
  ];
  const v = { 'pare choc': ['pare choc'] };

  it('"pare choc" returns bumpers only, never their brackets/plates/grilles', () => {
    const r = run('pare choc', bumpers, v);
    expect(names(r)).toEqual(['PARE CHOC AV', 'PARE CHOC AR', 'PARA CHOC AV']);
    expect(r.outcome.identityMode).toBe('strict-head');
  });

  it('"parachoc" (spelling variant) still finds the bumper family', () => {
    expect(keysMatch('parachoc', 'parechoc')).toBe(true);
    expect(names(run('parachoc', bumpers, v))).toContain('PARE CHOC AV');
  });

  it('a requested position is a HARD constraint', () => {
    expect(names(run('pare choc avant', bumpers, v))).toEqual(['PARE CHOC AV', 'PARA CHOC AV']);
  });

  it('"pare choc gauche": no bumper has a side → no exact match, never the support', () => {
    const r = run('pare choc gauche', bumpers, v);
    expect(r.kept).toHaveLength(0);
    expect(r.outcome.noExactMatch).toBe(true);
    expect(r.outcome.availablePositions).toEqual(['AV', 'AR']);
  });

  it('stays inactive when the catalog has no standalone part of that kind', () => {
    const wipers = [part('BRAS ESSUIE GLACE'), part('BALAI ESSUIE GLACE AV'), part('MOTEUR ESSUIE GLACE')];
    const r = run('essuie glace', wipers);
    expect(r.outcome.identityMode).toBe('inactive-no-standalone-form');
    expect(r.kept).toHaveLength(3);
  });

  it('a part without the requested position is rejected ("bougie droite")', () => {
    const r = run('bougie droite', [part("BOUGIE D'ALLUMAGE")]);
    expect(r.kept).toHaveLength(0);
    expect(r.outcome.noExactMatch).toBe(true);
  });

  it('door: keeps the door in the requested position, drops lock/seal/handle', () => {
    const doors = [part('PORTE AV G'), part('PORTE AV D'), part('SERRURE PORTE AV G'), part('JOINT PORTE AV G')];
    expect(names(run('porte avant gauche', doors))).toEqual(['PORTE AV G']);
  });

  it('synonym variants: "phare" finds rows whose head is "OPTIQUE"', () => {
    const lamps = [part('OPTIQUE G'), part('SUPPORT OPTIQUE G'), part('OPTIQUE D')];
    expect(names(run('phare gauche', lamps, { phare: ['optique'] }))).toEqual(['OPTIQUE G']);
  });

  it('rows without a French name keep the legacy identity behaviour', () => {
    const rows = [part('PARE CHOC AV'), part(null, 'BUMPER,FR')];
    expect(run('pare choc', rows, { 'pare choc': ['pare choc'] }).kept).toHaveLength(2);
  });

  it('nothing typed → gate is a no-op', () => {
    const r = applyCatalogConstraints(bumpers, {
      requestedPositions: { axes: [], sides: [], levels: [] },
      requestedPartTokens: [],
      identityKeys: [],
    });
    expect(r.outcome.applied).toBe(false);
    expect(r.kept).toHaveLength(bumpers.length);
  });
});
