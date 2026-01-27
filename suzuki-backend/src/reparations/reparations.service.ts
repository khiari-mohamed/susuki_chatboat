import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReparationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.reparation.create({ data });
  }

  async findAll() {
    return this.prisma.reparation.findMany({
      include: { client: true, vehicule: true, employe: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.reparation.findUnique({
      where: { id },
      include: { client: true, vehicule: true, employe: true }
    });
  }
}
