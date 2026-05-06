import { Global, Module } from '@nestjs/common';
import { VehicleModelsService } from './vehicle-models.service';

@Global()
@Module({
  providers: [VehicleModelsService],
  exports: [VehicleModelsService],
})
export class VehicleModelsModule {}
