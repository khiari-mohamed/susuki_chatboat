import { IsOptional, IsString, MaxLength } from 'class-validator';

// vehicleNo is not editable — it's the unique natural key for this
// table. Delete + recreate if it was mistyped.
export class UpdateVehicleDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(20)
  immatriculation?: string;
}
