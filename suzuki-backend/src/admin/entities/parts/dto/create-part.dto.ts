import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reference: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

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

  // '01_PROD' = catalogue Suzuki OEM · '02_CARPRO' = stock de gros CarPro
  @IsIn(['01_PROD', '02_CARPRO'])
  source: string;
}
