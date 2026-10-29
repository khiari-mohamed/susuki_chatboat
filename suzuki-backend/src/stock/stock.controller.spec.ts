import { describe, expect, it, jest } from '@jest/globals';
import { COMPTOIR_REDIRECT_MESSAGE } from '../constants/business-rules.constants';
import { StockController } from './stock.controller';

describe('StockController unknown-stock responses', () => {
  it('returns an explicit unknown status and the shared redirect message', async () => {
    const stockService = {
      getStockStatus: jest.fn(async () => ({
        reference: 'REF-1',
        statut: 'Inconnue',
        stockKnown: false,
        displayName: 'Retroviseur',
        sourceLabel: 'Suzuki OEM',
        categorie: null,
      })),
    };
    const controller = new StockController(stockService as any);

    await expect(controller.getStockStatus('REF-1')).resolves.toMatchObject({
      statut: 'Inconnue',
      stockKnown: false,
      redirectMessage: COMPTOIR_REDIRECT_MESSAGE,
    });
  });

  it('does not label an unknown bulk row unavailable', async () => {
    const stockService = {
      getBulkStockStatus: jest.fn(async () => new Map([
        ['REF-1', {
          statut: 'Inconnue',
          stockKnown: false,
          displayName: 'Retroviseur',
          totalQuantity: 0,
          stockDisponible: 0,
          stockConsolide: 0,
        }],
      ])),
    };
    const controller = new StockController(stockService as any);

    await expect(controller.getBulkStatus({ references: ['REF-1'] })).resolves.toEqual({
      'REF-1': {
        reference: 'REF-1',
        statut: 'Inconnue',
        stockKnown: false,
        redirectMessage: COMPTOIR_REDIRECT_MESSAGE,
        displayName: 'Retroviseur',
        sourceLabel: null,
        categorie: null,
      },
    });
  });
});