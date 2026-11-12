import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// Named AdminStockController to avoid clashing with the public StockController
// (src/stock/stock.controller.ts) used by the chatbot widget.
// ERP-sourced: read-only.
@Controller('admin/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminStockController extends AdminReadOnlyController {
  protected readonly tableName = 'stock';
  protected readonly searchFields = ['reference', 'statut'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'stock', { part: true }), gateway);
  }
}