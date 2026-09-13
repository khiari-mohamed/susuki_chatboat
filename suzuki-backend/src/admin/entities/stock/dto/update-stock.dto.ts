import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

// `reference` is not editable — see CreatePartDto for the same reasoning
// (it's the FK to parts.reference).
export class UpdateStockDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockDisponible?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockConsolide?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  statut?: string;
}
