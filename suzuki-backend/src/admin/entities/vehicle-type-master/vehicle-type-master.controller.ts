import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';

// vehicle_type_master = the technical "source of truth" table: one row
// per real vehicle configuration (type_code), referenced by both
// fitment and vehicle_model_map (see CarPro Q/R doc, question 2).
@Controller('admin/vehicle-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVehicleTypeMasterController extends AdminCrudController {
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

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateVehicleTypeDto) {
    return this.createAndBroadcast(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleTypeDto) {
    return this.updateAndBroadcast(id, dto);
  }
}
