import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// mot / langue form the unique pair — not editable. Only the canonical
// category this word maps to can be corrected in place.
export class UpdateSynonymDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  canonical?: string;
}
