import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Validates the "Authorization: Bearer <token>" header against the
// 'jwt' passport strategy registered in JwtStrategy. Populates
// request.user with { id, email, name, role } on success.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
