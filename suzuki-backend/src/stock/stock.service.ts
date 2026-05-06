import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Returns Disponible/Indisponible for a single reference.
   * Never exposes raw quantities.
   */
  async getStockStatus(reference: string): Promise<{ reference: string; statut: string }> {
    const stock = await this.prisma.stock.findUnique({
      where: { reference },
      select: { reference: true, statut: true },
    });
    // Return Indisponible for unknown references — never expose null to callers
    return stock ?? { reference, statut: 'Indisponible' };
  }

  /**
   * Bulk lookup for multiple references in one query.
   * Returns a Map<reference, statut>.
   */
  async getBulkStockStatus(references: string[]): Promise<Map<string, string>> {
    if (references.length === 0) return new Map();

    const stocks = await this.prisma.stock.findMany({
      where: { reference: { in: references } },
      select: { reference: true, statut: true },
    });

    // Seed all requested references with Indisponible as the safe default
    const map = new Map<string, string>(references.map((r) => [r, 'Indisponible']));
    for (const s of stocks) {
      map.set(s.reference, s.statut);
    }
    return map;
  }
}