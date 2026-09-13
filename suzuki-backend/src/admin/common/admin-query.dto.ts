import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // Excel-like grids page in fairly large chunks so scrolling feels
  // continuous; 500 keeps a single response light (<~300KB for these tables).
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize: number = 100;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  // Free-text search — matched against each entity's configured
  // searchFields with a case-insensitive "contains".
  @IsOptional()
  @IsString()
  search?: string;
}
