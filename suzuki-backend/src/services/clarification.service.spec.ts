import { describe, expect, it } from '@jest/globals';
import { ClarificationService } from './clarification.service';

const p = (designation2: string) => ({ reference: designation2, designation2, designation: '' });
const service = new ClarificationService();

describe('ClarificationService: positions come from the candidates', () => {
  it('anomaly 1: a generic "pare choc" asks front/rear instead of returning the rear bumper', () => {
    const need = service.checkNeeded([p('PARE CHOC AV'), p('PARE CHOC AR')], 'pare choc');
    expect(need).toEqual({ needed: true, dimension: 'position', variants: ['avant', 'arrière'] });
  });

  it('does not ask again once the position is typed', () => {
    expect(service.checkNeeded([p('PARE CHOC AV'), p('PARE CHOC AR')], 'pare choc avant')).toEqual({ needed: false });
  });

  it('hood: a single candidate generates no position question', () => {
    expect(service.checkNeeded([p('CAPOT')], 'capot')).toEqual({ needed: false });
  });

  it('hood hinge: asks only left/right', () => {
    const need = service.checkNeeded([p('CHARNIERE CAPOT G'), p('CHARNIERE CAPOT D')], 'charniere capot');
    expect(need).toEqual({ needed: true, dimension: 'side', variants: ['gauche', 'droite'] });
  });
});