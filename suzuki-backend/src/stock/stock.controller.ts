import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('update')
  updateStock(@Body() data: { reference: string; quantity: number }) {
    return this.stockService.updateStock(data.reference, data.quantity);
  }

  @Post('decrement')
  decrementStock(@Body() data: { reference: string; amount?: number }) {
    return this.stockService.decrementStock(data.reference, data.amount);
  }

  @Get(':reference')
  getStockStatus(@Param('reference') reference: string) {
    return this.stockService.getStockStatus(reference);
  }
}
