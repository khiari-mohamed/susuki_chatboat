import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Controller('admin/parts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminPartsController extends AdminCrudController {
  protected readonly tableName = 'parts';
  protected readonly searchFields = [
    'reference',
    'designation',
    'designation2',
    'searchDescription',
    'categorie',
    'fabricant',
    'fournisseurCode',
  ];

  constructor(prisma: PrismaService, gateway: AdminGateway) {
    // Pull the linked stock row + a light count of fitments/references
    // along with every part so the grid can show "en stock" / nb
    // compatibilités without a second round-trip per row.
    super(
      new PrismaCrudService(prisma, 'part', {
        stock: true,
        _count: { select: { fitments: true, itemReferences: true } },
      }),
      gateway,
    );
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreatePartDto) {
    return this.createAndBroadcast(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePartDto) {
    return this.updateAndBroadcast(id, dto);
  }
}
