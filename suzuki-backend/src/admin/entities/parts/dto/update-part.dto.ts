import { IsIn, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

// NOTE: `reference` is intentionally NOT editable here. It's the join
// key used by Stock/Fitment/ItemReference (FK on the string value, not
// on `id`) — changing it on an existing part would either be silently
// rejected by Postgres (FK violation, if related rows exist) or worse,
// orphan them. To "rename" a reference, delete and recreate the part.
export class UpdatePartDto {
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  designation2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  searchDescription?: string;

  @IsOptional()
  @IsNumber()
  prixHt?: number;

  @IsOptional()
  @IsNumber()
  prixTtc?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categorie?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fabricant?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fournisseurCode?: string;

  @IsOptional()
  @IsIn(['01_PROD', '02_CARPRO'])
  source?: string;
}
