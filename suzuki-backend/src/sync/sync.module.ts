import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { ErpSyncService } from './erp-sync.service';
import { SyncController } from './sync.controller';
import { ERP_SOURCE } from './erp-source';
import { RelayErpSource } from './relay-erp-source';

@Module({
  imports: [AdminModule], // AdminGateway + ExplorerService (dashboard notifications and cache invalidation)
  controllers: [SyncController],
  providers: [ErpSyncService, RelayErpSource, { provide: ERP_SOURCE, useExisting: RelayErpSource }],
})
export class SyncModule {}