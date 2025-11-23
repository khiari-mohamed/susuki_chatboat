import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS with proper file upload support
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Increase payload size limit for large file uploads
  app.use(require('express').json({ limit: '25mb' }));
  app.use(require('express').urlencoded({ limit: '25mb', extended: true }));
  
  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 8000}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📷 Max file upload: 20MB`);
  console.log(`📝 Supported formats: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG, HEIC, PDF`);
}
bootstrap();
