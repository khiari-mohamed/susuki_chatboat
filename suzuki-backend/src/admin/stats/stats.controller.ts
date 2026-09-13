import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminStatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async overview() {
    const [
      parts,
      stock,
      fitments,
      vehicles,
      vehicleModelMap,
      vehicleTypeMaster,
      itemReferences,
      synonyms,
      partsWithoutStock,
      partsWithoutDesignation2,
      partsWithoutSearchDescription,
    ] = await Promise.all([
      this.prisma.part.count(),
      this.prisma.stock.count(),
      this.prisma.fitment.count(),
      this.prisma.vehicle.count(),
      this.prisma.vehicleModelMap.count(),
      this.prisma.vehicleTypeMaster.count(),
      this.prisma.itemReference.count(),
      this.prisma.synonym.count(),
      this.prisma.part.count({ where: { stock: null } }),
      this.prisma.part.count({ where: { OR: [{ designation2: null }, { designation2: '' }] } }),
      this.prisma.part.count({
        where: { OR: [{ searchDescription: null }, { searchDescription: '' }] },
      }),
    ]);

    return {
      counts: {
        parts,
        stock,
        fitments,
        vehicles,
        vehicleModelMap,
        vehicleTypeMaster,
        itemReferences,
        synonyms,
      },
      // Data-quality flags straight out of the CarPro report §5 —
      // surfaced here so the team can watch the gaps shrink as they fill data in.
      dataQuality: {
        partsWithoutStock,
        partsWithoutDesignation2,
        partsWithoutSearchDescription,
        designation2CoveragePct:
          parts > 0 ? Math.round(((parts - partsWithoutDesignation2) / parts) * 1000) / 10 : 0,
        searchDescriptionCoveragePct:
          parts > 0 ? Math.round(((parts - partsWithoutSearchDescription) / parts) * 1000) / 10 : 0,
      },
    };
  }
}
