import { Module } from '@nestjs/common';
import { ErpSyncService } from './erp-sync.service';
import { SyncController } from './sync.controller';
import { ERP_SOURCE, NotConfiguredErpSource } from './erp-source';

@Module({
  controllers: [SyncController],
  providers: [ErpSyncService, { provide: ERP_SOURCE, useClass: NotConfiguredErpSource }],
})
export class SyncModule {}