import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVehicleTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  typeCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  modelName: string;
}
