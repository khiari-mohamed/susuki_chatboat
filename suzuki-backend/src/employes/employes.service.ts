import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.employe.create({ data });
  }

  async findAll() {
    return this.prisma.employe.findMany({
      include: { ventes: true, reparations: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.employe.findUnique({
      where: { id },
      include: { ventes: true, reparations: true }
    });
  }
}
