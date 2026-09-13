import { IsOptional, IsString, MaxLength } from 'class-validator';

// partReference / referenceNo form the unique pair — not editable.
export class UpdateItemReferenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  referenceType?: string;
}
