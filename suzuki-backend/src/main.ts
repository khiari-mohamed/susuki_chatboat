import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Fix BigInt JSON serialization globally
if (typeof (BigInt.prototype as any).toJSON !== 'function') {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  // whitelist + transform are required for the admin dashboard DTOs
  // (class-validator + class-transformer) to strip unknown fields and
  // coerce query-string numbers/booleans. Existing controllers that use
  // plain inline body types (no DTO class) are unaffected — Nest only
  // validates parameters whose reflected type is an actual class.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  // Enable CORS with proper file upload support
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:5173';
  const allowedOrigins = [
    frontendUrl,
    dashboardUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://5.199.136.2:3000'
  ];
  
  // Add production frontend if different from FRONTEND_URL
  if (process.env.NODE_ENV === 'production' && process.env.PRODUCTION_FRONTEND_URL) {
    allowedOrigins.push(process.env.PRODUCTION_FRONTEND_URL);
  }
  if (process.env.NODE_ENV === 'production' && process.env.PRODUCTION_DASHBOARD_URL) {
    allowedOrigins.push(process.env.PRODUCTION_DASHBOARD_URL);
  }
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Increase payload size limit for large file uploads
  app.use(require('express').json({ limit: '25mb' }));
  app.use(require('express').urlencoded({ limit: '25mb', extended: true }));
  
  // Request logging middleware for production debugging
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    const { method, originalUrl } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const logLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';
      console.log(`[${logLevel}] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    });
    
    next();
  });
  
  // Enable graceful shutdown
  app.enableShutdownHooks();
  
  await app.listen(process.env.PORT ?? 8000, '0.0.0.0');
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 8000}`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📷 Max file upload: 25MB`);
  console.log(`📝 Supported formats: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG, HEIC, PDF`);
  console.log(`✅ Health check available at /health`);
}
bootstrap();