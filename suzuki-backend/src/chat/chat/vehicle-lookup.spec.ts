import { normalizeVinText, pickBestVehicleRow, vinLookupVariants } from './vehicle-lookup';

describe('vehicle lookup helpers', () => {
  it('normalizes VIN text', () => {
    expect(normalizeVinText(' js-aft b1s2 ')).toBe('JSAFTB1S2');
  });

  it('adds the OCR-corrected spelling only when it differs', () => {
    expect(vinLookupVariants('JSAFTB1S2OO123456')).toEqual(['JSAFTB1S2OO123456', 'JSAFTB1S2001234561'.slice(0, 17)]);
    expect(vinLookupVariants('JSAFTB1S200123456')).toEqual(['JSAFTB1S200123456']);
  });

  it('prefers the duplicate that has a model code, then a model name, then the newest', () => {
    const rows = [
      { id: 3, modele: 'SWIFT', typeCode: null },
      { id: 1, modele: null, typeCode: 'AVH310-TYPE1' },
      { id: 2, modele: 'SWIFT', typeCode: 'AVH310-TYPE1' },
    ];
    expect(pickBestVehicleRow(rows)?.id).toBe(2);
    expect(pickBestVehicleRow([])).toBeNull();
  });
});