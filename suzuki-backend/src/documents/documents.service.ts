import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.document.create({ data });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: { client: true, vehicule: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
      include: { client: true, vehicule: true }
    });
  }
}
