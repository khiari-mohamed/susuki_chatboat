import { describe, expect, it } from '@jest/globals';
import { StrictValidatorService } from './strict-validator.service';

describe('StrictValidatorService subordinate parts', () => {
  const validator = new StrictValidatorService();

  it('allows support amortisseur when support is explicitly requested', () => {
    const result = validator.validateResults(
      [{ reference: '41710M62S00', designation: 'SUPPORT,FRONT STRUT', designation2: 'TOCS AMORTISSEUR' }],
      'support amortisseur',
      null,
    );

    expect(result).toHaveLength(1);
  });

  it('rejects support amortisseur when only amortisseur is requested', () => {
    const result = validator.validateResults(
      [{ reference: '41710M62S00', designation: 'SUPPORT,FRONT STRUT', designation2: 'TOCS AMORTISSEUR' }],
      'amortisseur',
      null,
    );

    expect(result).toHaveLength(0);
  });
});
