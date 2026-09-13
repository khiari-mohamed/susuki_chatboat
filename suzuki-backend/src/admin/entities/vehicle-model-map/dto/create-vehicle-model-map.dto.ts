import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVehicleModelMapDto {
  // Friendly vehicle name, matches vehicles.modele (e.g. "SWIFT IV").
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modele: string;

  // Must match an existing vehicle_type_master.type_code (FK).
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  typeCode: string;
}
