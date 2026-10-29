import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

// Fix BigInt JSON serialization globally
if (typeof (BigInt.prototype as any).toJSON !== 'function') {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

const BODY_LIMIT = '25mb';

function buildAllowedOrigins(): string[] {
  const env = process.env;
  const origins = [
    env.FRONTEND_URL || 'http://localhost:3000',
    env.DASHBOARD_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://5.199.136.2:3000',
    // Comma-separated extras, e.g. CORS_EXTRA_ORIGINS=https://chat.example.tn,https://admin.example.tn
    ...(env.CORS_EXTRA_ORIGINS ?? '').split(','),
  ];
  if (env.NODE_ENV === 'production') {
    origins.push(env.PRODUCTION_FRONTEND_URL ?? '', env.PRODUCTION_DASHBOARD_URL ?? '');
  }
  return [...new Set(origins.map((origin) => origin.trim()).filter(Boolean))];
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // whitelist + transform are required for the admin dashboard DTOs
  // (class-validator + class-transformer). Controllers that use plain inline
  // body types (no DTO class) are unaffected: Nest only validates parameters
  // whose reflected type is an actual class.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = buildAllowedOrigins();
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Carte grise uploads arrive as base64 JSON.
  app.useBodyParser('json', { limit: BODY_LIMIT });
  app.useBodyParser('urlencoded', { limit: BODY_LIMIT, extended: true });

  // Request log. The query string is deliberately NOT logged: it can carry
  // a customer's VIN (/admin/search-logs?vin=...).
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    const path = String(req.originalUrl ?? req.url ?? '').split('?')[0];
    res.on('finish', () => {
      const line = `${req.method} ${path} ${res.statusCode} ${Date.now() - start}ms`;
      if (res.statusCode >= 500) logger.error(line);
      else if (res.statusCode >= 400) logger.warn(line);
      else logger.log(line);
    });
    next();
  });

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 8000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Backend running on port ${port}`);
  logger.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`📷 Max request body: ${BODY_LIMIT}`);
}

bootstrap().catch((error) => {
  new Logger('Bootstrap').error('Failed to start the application', error?.stack ?? error);
  process.exit(1);
});