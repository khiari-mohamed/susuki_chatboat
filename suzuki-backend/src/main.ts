import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS with proper file upload support
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000',
    'https://susuki-chatboat.vercel.app' // Ajout explicite
  ];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Increase payload size limit for large file uploads
  app.use(require('express').json({ limit: '25mb' }));
  app.use(require('express').urlencoded({ limit: '25mb', extended: true }));
  
  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 8000}`);
  console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📷 Max file upload: 25MB`);
  console.log(`📝 Supported formats: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG, HEIC, PDF`);
}
bootstrap();
