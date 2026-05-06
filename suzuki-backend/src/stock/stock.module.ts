import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
// PrismaService is provided at AppModule level and available globally.
// Do NOT re-provide it here — that would create a second connection pool.

@Module({
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
