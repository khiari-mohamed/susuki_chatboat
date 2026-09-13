import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AdminRoleDto } from './create-admin-user.dto';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nom trop court' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password?: string;

  @IsOptional()
  @IsEnum(AdminRoleDto, { message: 'role doit être ADMIN ou EDITOR' })
  role?: AdminRoleDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
