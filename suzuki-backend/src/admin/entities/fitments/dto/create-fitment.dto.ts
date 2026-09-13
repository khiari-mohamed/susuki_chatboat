import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFitmentDto {
  // Must match an existing parts.reference (FK).
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  partReference: string;

  // Must match an existing vehicle_type_master.type_code (FK).
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  typeCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  modelName: string;
}
