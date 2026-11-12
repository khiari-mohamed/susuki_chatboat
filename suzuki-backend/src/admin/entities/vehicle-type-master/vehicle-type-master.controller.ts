import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// vehicle_type_master = technical "source of truth": one row per real vehicle configuration
// (type_code), referenced by fitment and vehicle_model_map. ERP-sourced: read-only.
@Controller('admin/vehicle-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehicleTypeMasterController extends AdminReadOnlyController {
  protected readonly tableName = 'vehicleTypeMaster';
  protected readonly searchFields = ['typeCode', 'modelName'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(
      new PrismaCrudService(prisma, 'vehicleTypeMaster', {
        _count: { select: { fitments: true, modelMap: true } },
      }),
      gateway,
    );
  }
}