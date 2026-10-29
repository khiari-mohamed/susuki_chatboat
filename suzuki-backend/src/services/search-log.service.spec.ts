import { describe, expect, it } from '@jest/globals';
import { buildSearchLogEntry, classifyRedirectReason, normalizeVin } from './search-log.service';
import type { LoggableAnswer } from './search-log.service';
import { ResponseService } from './response.service';
import { COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';

const responses = new ResponseService();
const vehicle = { marque: 'SUZUKI', modele: 'SWIFT', vin: 'jsaaaaa1234567890' };
const answer = (over: Partial<LoggableAnswer> = {}): LoggableAnswer => ({
  response: '',
  sessionId: 's1',
  products: [],
  intent: 'PARTS_SEARCH',
  metadata: { productsFound: 0, conversationLength: 0, queryClarity: 0 },
  ...over,
});
const shown = {
  reference: 'R1', designation: 'PARE CHOC AV', designation2: 'PARE CHOC AV', source: '01_PROD',
  prixTtc: '45.5', stock: { statut: 'Disponible', stockConsolide: 3 },
};

describe('buildSearchLogEntry', () => {
  it('does not log greetings', () => {
    expect(buildSearchLogEntry('bonjour', vehicle, answer({ intent: 'GREETING' }))).toBeNull();
  });

  it('logs a successful answer without treating "pour réserver" as a redirect', () => {
    const entry = buildSearchLogEntry('pare choc avant', vehicle, answer({
      response: responses.buildProductResponse([shown], vehicle),
      products: [shown],
      metadata: {
        productsFound: 1, conversationLength: 1, queryClarity: 0,
        trace: { identifiedPart: 'pare choc', modelCode: 'AVH310-TYPE1', proposedReferences: [{ reference: 'R1', designation: 'PARE CHOC AV' }] },
        verification: { compatibility: 'CONFIRMEE', checks: {} as any, reasons: [], aiAudit: 'ran', aiFlags: { effective: [], ignored: [] } },
      },
    }));

    expect(entry).toMatchObject({
      vin: 'JSAAAAA1234567890',
      modelCode: 'AVH310-TYPE1',
      identifiedPart: 'pare choc',
      compatibilityResult: 'CONFIRMEE',
      availabilityCommunicated: 'DISPONIBLE',
      redirectMessage: null,
      redirectReason: null,
    });
    expect(entry?.proposedReferences).toEqual([{ reference: 'R1', designation: 'PARE CHOC AV' }]);
  });

  it('logs a withheld answer as a redirect with its reason', () => {
    const entry = buildSearchLogEntry('pare choc', vehicle, answer({
      intent: 'SECURISATION',
      response: responses.buildSecurisationResponse(vehicle),
      metadata: {
        productsFound: 0, conversationLength: 1, queryClarity: 0,
        verification: {
          compatibility: 'NON_VERIFIEE', checks: {} as any, aiAudit: 'skipped',
          aiFlags: { effective: [], ignored: [] },
          reasons: ['stock unknown: no consolidated stock value for the proposed article'],
        },
      },
    }));

    expect(entry?.redirectMessage).toContain(COMPTOIR_REDIRECT_MESSAGE);
    expect(entry?.redirectReason).toBe('STOCK_UNKNOWN');
    expect(entry?.availabilityCommunicated).toBe('NON_COMMUNIQUEE');
  });

  it('logs "no exact match" (counter phone numbers, no exact sentence) as a redirect', () => {
    const entry = buildSearchLogEntry('capot gauche', vehicle, answer({
      intent: 'NO_RESULTS',
      response: responses.buildNoExactMatchResponse({
        applied: true, requestedPart: 'capot',
        requestedPositions: { axes: [], sides: ['G'], levels: [] },
        identityMode: 'strict-head', candidatesBefore: 1, rejectedByIdentity: 0,
        rejectedByPosition: 1, kept: 0, availablePositions: [], noExactMatch: true,
      }, vehicle),
    }));

    expect(entry?.redirectMessage).toContain('70 603 518');
    expect(entry?.redirectReason).toBe('POSITION_MISMATCH');
  });
});

describe('classifyRedirectReason', () => {
  it.each([
    ['stock unknown: no consolidated stock value for the proposed article', 'STOCK_UNKNOWN'],
    ['identity unverified by the catalog: redirect instead of guessing', 'IDENTITY_UNVERIFIED'],
    ['position unverified by the catalog: redirect instead of guessing', 'POSITION_UNVERIFIED'],
    ['qualifiers unverified by the catalog: redirect instead of guessing', 'QUALIFIER_UNVERIFIED'],
    ['model code inferred from the model name only, not from the VIN', 'MODEL_CODE_MISSING'],
    ['model code missing for VIN-scoped request', 'MODEL_CODE_MISSING'],
    ['vehicle compatibility not verified', 'VEHICLE_NOT_VERIFIED'],
    ['understanding confidence below 0.6', 'LOW_UNDERSTANDING'],
  ])('"%s" → %s', (reason, code) => {
    expect(classifyRedirectReason([reason], 'SECURISATION')).toBe(code);
  });

  it('falls back on the intent when no reason is given', () => {
    expect(classifyRedirectReason([], 'NO_RESULTS')).toBe('NO_RESULTS');
    expect(classifyRedirectReason([], 'SECURISATION')).toBe('NO_CANDIDATE');
  });
});

describe('normalizeVin', () => {
  it('uppercases, strips separators and rejects out-of-range values', () => {
    expect(normalizeVin(' js-aaa 12345 ')).toBe('JSAAA12345');
    expect(normalizeVin('abc')).toBeNull();
    expect(normalizeVin('A'.repeat(26))).toBeNull();
  });
});