import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

// Named AdminStockController to avoid clashing with the existing
// public StockController (src/stock/stock.controller.ts) used by the
// chatbot widget — different route prefix, different purpose.
@Controller('admin/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminStockController extends AdminCrudController {
  protected readonly tableName = 'stock';
  protected readonly searchFields = ['reference', 'statut'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'stock', { part: true }), gateway);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateStockDto) {
    return this.createAndBroadcast(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStockDto) {
    return this.updateAndBroadcast(id, dto);
  }
}
