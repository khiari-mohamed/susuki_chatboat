import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateItemReferenceDto } from './dto/create-item-reference.dto';
import { UpdateItemReferenceDto } from './dto/update-item-reference.dto';

// Alternative / cross reference numbers for a part (e.g. OEM cross-refs,
// aftermarket equivalents) — used as a secondary search signal.
@Controller('admin/item-references')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminItemReferencesController extends AdminCrudController {
  protected readonly tableName = 'itemReferences';
  protected readonly searchFields = ['partReference', 'referenceNo', 'referenceType'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'itemReference', { part: true }), gateway);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateItemReferenceDto) {
    return this.createAndBroadcast(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemReferenceDto) {
    return this.updateAndBroadcast(id, dto);
  }
}
