import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// Fitment = compatibility link "this part fits this vehicle type_code".
// ERP-sourced: read-only.
@Controller('admin/fitments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminFitmentsController extends AdminReadOnlyController {
  protected readonly tableName = 'fitments';
  protected readonly searchFields = ['partReference', 'typeCode', 'modelName'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'fitment', { part: true, vehicleType: true }), gateway);
  }
}