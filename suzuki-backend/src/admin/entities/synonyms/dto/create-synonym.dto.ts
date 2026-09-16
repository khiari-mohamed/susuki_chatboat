import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSynonymDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mot!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  canonical!: string;

  // 'fr' = synonyme français normal · 'tn' = mot tunisien → traduction
  // française · 'stop' = mot vide de sens à ignorer dans la recherche ·
  // 'typo' = faute de frappe connue → orthographe correcte (mot = la
  // faute, canonical = la correction). Consommé par AIQueryNormalizerService.
  @IsOptional()
  @IsIn(['fr', 'tn', 'stop', 'typo'])
  langue?: string;
}