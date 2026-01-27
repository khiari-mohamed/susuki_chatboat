import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VentesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.vente.create({ data });
  }

  async findAll() {
    return this.prisma.vente.findMany({
      include: { client: true, vehicule: true, vendeur: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.vente.findUnique({
      where: { id },
      include: { client: true, vehicule: true, vendeur: true }
    });
  }
}
