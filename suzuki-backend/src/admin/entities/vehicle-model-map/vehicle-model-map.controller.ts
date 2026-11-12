import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// Bridge (modele ↔ typeCode). ERP-sourced: read-only.
@Controller('admin/vehicle-model-map')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehicleModelMapController extends AdminReadOnlyController {
  protected readonly tableName = 'vehicleModelMap';
  protected readonly searchFields = ['modele', 'typeCode'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'vehicleModelMap', { vehicleType: true }), gateway);
  }
}