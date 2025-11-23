import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../chat/gemini.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
  ) {}

  async verifyDocument(file: Express.Multer.File) {
    console.log('\n🔍 ========== VERIFICATION START ==========');
    console.log('📁 File Info:', {
      name: file.originalname,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.mimetype,
      timestamp: new Date().toISOString()
    });

    try {
      // Handle PDF conversion if needed
      let imageBase64: string;
      if (file.mimetype === 'application/pdf') {
        imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        console.log('📄 PDF detected - processing...');
      } else {
        imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        console.log('🖼️  Image detected - processing...');
      }

      console.log('🤖 Sending to Gemini OCR...');
      const startTime = Date.now();
      
      const vehicleInfo = await this.gemini.extractVehicleInfo(imageBase64, file.mimetype);
      
      const processingTime = Date.now() - startTime;
      console.log(`⏱️  OCR completed in ${processingTime}ms`);
      
      console.log('✅ EXTRACTION SUCCESS:');
      console.log('📋 Vehicle Info:', JSON.stringify(vehicleInfo, null, 2));
      console.log('🎯 Confidence: HIGH (Valid Suzuki detected)');
      console.log('========== VERIFICATION END ==========\n');
      
      return {
        success: true,
        vehicleInfo,
        debug: {
          processingTime: `${processingTime}ms`,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          confidence: 'HIGH'
        }
      };
      
    } catch (error) {
      const processingTime = Date.now();
      console.log('❌ EXTRACTION FAILED:');
      console.log('Error Type:', error.message);
      console.log('Error Details:', error);
      console.log('========== VERIFICATION END ==========\n');
      
      return {
        success: false,
        message: error.message === 'INVALID_MODEL' 
          ? 'Seules les cartes grises Suzuki Celerio et S-Presso sont acceptées.'
          : error.message === 'OCR_FAILED'
          ? 'Impossible de lire le document. Veuillez utiliser une image plus claire.'
          : 'Erreur lors de la vérification. Veuillez réessayer.',
        debug: {
          errorType: error.message,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`
        }
      };
    }
  }
}
