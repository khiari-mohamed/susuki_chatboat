import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemReferenceDto {
  // Must match an existing parts.reference (FK).
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  partReference: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  referenceNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  referenceType?: string;
}
