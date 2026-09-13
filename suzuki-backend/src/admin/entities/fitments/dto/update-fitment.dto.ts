import { IsOptional, IsString, MaxLength } from 'class-validator';

// partReference / typeCode form the compatibility pair and its unique
// constraint — not editable after creation. To relink a part to a
// different vehicle type, delete this row and add a new one.
export class UpdateFitmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelName?: string;
}
