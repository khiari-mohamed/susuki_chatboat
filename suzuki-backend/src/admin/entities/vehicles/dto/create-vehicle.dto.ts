import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  vehicleNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  vin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  marque?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  modele?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  modeleDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  typeCode?: string;

  // NOTE: this DB column is physically named "statut" but actually
  // stores the license-plate number (see schema.prisma comment / CarPro
  // report §5 — renamed here at the API level to avoid perpetuating
  // the confusion in the dashboard UI).
  @IsOptional()
  @IsString()
  @MaxLength(20)
  immatriculation?: string;
}
