import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AdminUsersController } from './users/users.controller';
import { AdminUsersService } from './users/users.service';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminStatsController } from './stats/stats.controller';
import { AdminPartsController } from './entities/parts/parts.controller';
import { AdminStockController } from './entities/stock/stock.controller';
import { AdminFitmentsController } from './entities/fitments/fitments.controller';
import { AdminVehiclesController } from './entities/vehicles/vehicles.controller';
import { AdminVehicleModelMapController } from './entities/vehicle-model-map/vehicle-model-map.controller';
import { AdminVehicleTypeMasterController } from './entities/vehicle-type-master/vehicle-type-master.controller';
import { AdminItemReferencesController } from './entities/item-references/item-references.controller';
import { AdminSynonymsController } from './entities/synonyms/synonyms.controller';
import { ExplorerController } from './explorer/explorer.controller';
import { ExplorerService } from './explorer/explorer.service';
import { DiagnosticsController } from './diagnostics/diagnostics.controller';
import { DiagnosticsService } from './diagnostics/diagnostics.service';
import { SearchLogsController } from './search-logs/search-logs.controller';
import { ChatModule } from '../chat/chat.module';

const MIN_JWT_SECRET_LENGTH = 32;

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET')?.trim();
        if (!secret) throw new Error('Missing required environment variable: JWT_SECRET');
        if (secret.length < MIN_JWT_SECRET_LENGTH) {
          new Logger('AdminModule').warn(`JWT_SECRET is shorter than ${MIN_JWT_SECRET_LENGTH} characters: use a longer random secret`);
        }
        return {
          secret,
          signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '12h') as any },
        };
      },
    }),
    ChatModule,
  ],
  controllers: [
    AuthController,
    AdminUsersController,
    AdminStatsController,
    AdminPartsController,
    AdminStockController,
    AdminFitmentsController,
    AdminVehiclesController,
    AdminVehicleModelMapController,
    AdminVehicleTypeMasterController,
    AdminItemReferencesController,
    AdminSynonymsController,
    ExplorerController,
    DiagnosticsController,
    SearchLogsController,
  ],
  providers: [AuthService, JwtStrategy, AdminUsersService, AdminGateway, ExplorerService, DiagnosticsService],
  exports: [AdminGateway],
})
export class AdminModule {}