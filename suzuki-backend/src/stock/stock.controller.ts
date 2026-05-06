import { Controller, Get, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Returns Disponible/Indisponible for a single part reference.
   * Never exposes raw stock quantities.
   * TODO: Protect with an API key guard before public deployment.
   */
  @Get(':reference')
  @HttpCode(HttpStatus.OK)
  async getStockStatus(@Param('reference') reference: string) {
    if (!reference || reference.trim().length < 3) {
      throw new NotFoundException('Référence invalide.');
    }
    return this.stockService.getStockStatus(reference.trim().toUpperCase());
  }
}
