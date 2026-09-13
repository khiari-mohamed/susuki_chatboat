import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateVehicleModelMapDto } from './dto/create-vehicle-model-map.dto';

// Pure bridge table: (modele, typeCode) IS the entire content of the
// row — there is no third field to "update". If the CarPro team gets a
// mapping wrong, they delete the row and add the correct one; there is
// no PUT route here on purpose.
@Controller('admin/vehicle-model-map')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehicleModelMapController extends AdminCrudController {
  protected readonly tableName = 'vehicleModelMap';
  protected readonly searchFields = ['modele', 'typeCode'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'vehicleModelMap', { vehicleType: true }), gateway);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateVehicleModelMapDto) {
    return this.createAndBroadcast(dto);
  }
}
