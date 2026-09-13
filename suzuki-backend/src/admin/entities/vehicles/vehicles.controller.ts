import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VehicleModelsService } from '../../../constants/vehicle-models.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

// VehicleModelsService caches the distinct list of Suzuki `modele`
// values from this exact table at boot (see constants/vehicle-models.service.ts).
// The chatbot uses that in-memory list to detect/normalize model names
// in user messages, so any edit here that touches `modele` or `marque`
// must trigger .reload() or the chatbot's model detection goes stale.
@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehiclesController extends AdminCrudController {
  protected readonly tableName = 'vehicles';
  protected readonly searchFields = ['vehicleNo', 'vin', 'marque', 'modele', 'modeleDescription', 'immatriculation'];

  constructor(
    prisma: PrismaService,
    gateway: AdminGateway,
    private readonly vehicleModels: VehicleModelsService,
  ) {
    super(new PrismaCrudService(prisma, 'vehicle'), gateway);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  async create(@Body() dto: CreateVehicleDto) {
    const record = await this.createAndBroadcast(dto);
    await this.vehicleModels.reload();
    return record;
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleDto) {
    const record = await this.updateAndBroadcast(id, dto);
    await this.vehicleModels.reload();
    return record;
  }

  // Overrides AdminCrudController.remove only to add the cache reload —
  // guard/role/broadcast behaviour stays identical to the base class.
  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const record = await super.remove(id);
    await this.vehicleModels.reload();
    return record;
  }
}
