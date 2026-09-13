import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAdminUser } from './jwt.strategy';

// Usage: create(@CurrentUser() user: AuthenticatedAdminUser)
// Must run behind JwtAuthGuard — that's what populates request.user.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdminUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
