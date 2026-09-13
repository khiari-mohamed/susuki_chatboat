import { IsOptional, IsString, MaxLength } from 'class-validator';

// typeCode is not editable — it's the FK target for both fitment.type_code
// and vehicle_model_map.type_code (the "pivot" per the CarPro Q/R doc).
export class UpdateVehicleTypeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelName?: string;
}
