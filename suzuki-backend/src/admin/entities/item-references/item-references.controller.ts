import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// Alternative / cross reference numbers for a part. ERP-sourced: read-only.
@Controller('admin/item-references')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminItemReferencesController extends AdminReadOnlyController {
  protected readonly tableName = 'itemReferences';
  protected readonly searchFields = ['partReference', 'referenceNo', 'referenceType'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'itemReference', { part: true }), gateway);
  }
}