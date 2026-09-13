import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum AdminRoleDto {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export class CreateAdminUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Nom trop court' })
  name: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @IsOptional()
  @IsEnum(AdminRoleDto, { message: 'role doit être ADMIN ou EDITOR' })
  role?: AdminRoleDto;
}
