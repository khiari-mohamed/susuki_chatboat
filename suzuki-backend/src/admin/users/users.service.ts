import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Never let the password hash leave this service.
  private sanitize<T extends { passwordHash?: string }>(user: T): Omit<T, 'passwordHash'> {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async list() {
    const users = await this.prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } });
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return this.sanitize(user);
  }

  async create(dto: CreateAdminUserDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cet email');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        name: dto.name,
        passwordHash,
        role: dto.role ?? 'EDITOR',
      },
    });

    return this.sanitize(user);
  }

  async update(id: number, dto: UpdateAdminUserDto) {
    const existing = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Utilisateur introuvable');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.adminUser.update({ where: { id }, data });
    return this.sanitize(user);
  }

  async remove(id: number, requesterId: number) {
    if (id === requesterId) {
      throw new ConflictException('Vous ne pouvez pas supprimer votre propre compte');
    }
    const existing = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Utilisateur introuvable');

    await this.prisma.adminUser.delete({ where: { id } });
    return { success: true };
  }
}
