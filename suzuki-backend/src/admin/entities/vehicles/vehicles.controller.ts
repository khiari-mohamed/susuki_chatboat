import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// ERP-sourced: read-only. VehicleModelsService (cache of distinct `modele` values) is now
// reloaded by ErpSyncService at the end of each run, so no reload hook is needed here.
@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehiclesController extends AdminReadOnlyController {
  protected readonly tableName = 'vehicles';
  protected readonly searchFields = ['vehicleNo', 'vin', 'marque', 'modele', 'modeleDescription', 'immatriculation'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'vehicle'), gateway);
  }
}