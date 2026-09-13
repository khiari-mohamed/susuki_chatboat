import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateStockDto {
  // Must match an existing parts.reference — Postgres will reject the
  // insert with a clear FK error otherwise.
  @IsString()
  @IsNotEmpty()
  reference: string;

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

  // Historically recalculated automatically — see project report §
  // "Champs legacy". Editable here for manual correction, but note it's
  // not treated as the source of truth by the search engine, which
  // reads stock_consolide directly.
  @IsOptional()
  @IsString()
  @MaxLength(20)
  statut?: string;
}
