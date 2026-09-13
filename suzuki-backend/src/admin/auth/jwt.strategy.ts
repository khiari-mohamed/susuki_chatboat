import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface AuthenticatedAdminUser {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  // Called automatically by Passport once the JWT signature/expiry
  // check passes. We re-check the DB so a deactivated account is
  // rejected immediately, even with a still-valid token.
  async validate(payload: JwtPayload): Promise<AuthenticatedAdminUser> {
    const user = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Compte désactivé ou introuvable');
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
