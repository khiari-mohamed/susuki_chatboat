import { SetMetadata } from '@nestjs/common';

export type AdminRoleName = 'ADMIN' | 'EDITOR';

export const ROLES_KEY = 'admin_roles';

// Usage: @Roles('ADMIN') or @Roles('ADMIN', 'EDITOR')
// Must be combined with RolesGuard (applied after JwtAuthGuard so
// request.user is already populated).
export const Roles = (...roles: AdminRoleName[]) => SetMetadata(ROLES_KEY, roles);
