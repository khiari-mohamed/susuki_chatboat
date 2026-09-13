import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.prisma.adminUser.findUnique({ where: { email: normalizedEmail } });

    // Same error for "no such user" and "wrong password" — never leak
    // which one it was, that would let an attacker enumerate accounts.
    if (!user || !user.isActive) {
      this.logger.warn(`Login attempt for unknown/inactive account: ${normalizedEmail}`);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      this.logger.warn(`Wrong password for account: ${normalizedEmail}`);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload);

    this.logger.log(`✅ Login: ${user.email} (${user.role})`);

    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async me(userId: number) {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Compte désactivé ou introuvable');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
