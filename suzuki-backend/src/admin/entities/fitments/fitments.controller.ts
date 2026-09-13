import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateFitmentDto } from './dto/create-fitment.dto';
import { UpdateFitmentDto } from './dto/update-fitment.dto';

// Fitment = compatibility link "this part fits this vehicle type_code".
@Controller('admin/fitments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminFitmentsController extends AdminCrudController {
  protected readonly tableName = 'fitments';
  protected readonly searchFields = ['partReference', 'typeCode', 'modelName'];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    super(new PrismaCrudService(prisma, 'fitment', { part: true, vehicleType: true }), gateway);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateFitmentDto) {
    return this.createAndBroadcast(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFitmentDto) {
    return this.updateAndBroadcast(id, dto);
  }
}
