import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminReadOnlyController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

// ERP-sourced: read-only. Changes are made in the ERP, then synchronized.
@Controller('admin/parts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminPartsController extends AdminReadOnlyController {
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
    // Linked stock row + a light count of fitments/references so the grid needs no second round-trip per row.
    super(
      new PrismaCrudService(prisma, 'part', {
        stock: true,
        _count: { select: { fitments: true, itemReferences: true } },
      }),
      gateway,
    );
  }
}