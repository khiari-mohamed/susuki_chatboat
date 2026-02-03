import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../chat/gemini.service';
import { OpenAIService } from '../chat/openai.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private openai: OpenAIService,
  ) {}

  async verifyDocument(file: Express.Multer.File, userIp?: string) {
    console.log('\n🔍 ========== VERIFICATION START ==========');
    console.log('📁 File Info:', {
      name: file.originalname,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.mimetype,
      timestamp: new Date().toISOString(),
      userIp: userIp || 'unknown'
    });

    try {
      // Check upload limit (3 per month)
      if (userIp) {
        const uploadCount = await this.getMonthlyUploadCount(userIp);
        console.log(`📊 Upload count for ${userIp}: ${uploadCount}/3 this month`);
        
        if (uploadCount >= 3) {
          console.log('❌ Upload limit exceeded');
          return {
            success: false,
            message: 'Limite mensuelle atteinte. Vous avez déjà téléchargé 3 cartes grises ce mois-ci.',
            uploadCount,
            limitReached: true
          };
        }
      }
      // Handle PDF conversion if needed
      let imageBase64: string;
      if (file.mimetype === 'application/pdf') {
        imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        console.log('📄 PDF detected - processing...');
      } else {
        imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        console.log('🖼️  Image detected - processing...');
      }

      // 🔹 GEMINI OCR ONLY (Fast & Accurate with 2.5-flash)
      console.log('🤖 Sending to Gemini 2.5-flash OCR...');
      const startTime = Date.now();
      
      const geminiResult = await this.gemini.extractVehicleInfo(imageBase64, file.mimetype);
      const geminiTime = Date.now() - startTime;
      console.log(`⏱️  Gemini OCR completed in ${geminiTime}ms`);
      console.log('📋 Gemini Result:', JSON.stringify(geminiResult, null, 2));
      
      const vehicleInfo = { ...geminiResult, confidence: 'HIGH', source: 'Gemini 2.5-flash' };
      
      console.log(`⏱️  Total OCR completed in ${geminiTime}ms`);
      console.log('✅ EXTRACTION SUCCESS:');
      console.log('📋 Final Vehicle Info:', JSON.stringify(vehicleInfo, null, 2));
      
      // Track successful upload
      if (userIp) {
        await this.trackUpload(userIp, vehicleInfo);
        const newCount = await this.getMonthlyUploadCount(userIp);
        console.log(`📊 New upload count: ${newCount}/3`);
      }
      
      console.log('========== VERIFICATION END ==========\n');
      
      return {
        success: true,
        vehicleInfo,
        uploadCount: userIp ? await this.getMonthlyUploadCount(userIp) : 0,
        debug: {
          processingTime: `${geminiTime}ms`,
          geminiTime: `${geminiTime}ms`,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          confidence: vehicleInfo.confidence,
          model: 'Gemini 2.5-flash'
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
        message: error.message === 'INVALID_BRAND' 
          ? 'Seules les cartes grises Suzuki sont acceptées.'
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

  private crossValidateResults(geminiResult: any, openaiResult: any): any {
    // If Gemini failed, use OpenAI only with HIGH confidence
    if (!geminiResult && openaiResult) {
      console.log('🔍 Cross-validation: Using OpenAI only (Gemini failed) - HIGH confidence');
      return { ...openaiResult, confidence: 'HIGH', source: 'OpenAI' };
    }

    // If OpenAI failed, return Gemini result with MEDIUM confidence
    if (geminiResult && !openaiResult) {
      console.log('🔍 Cross-validation: Using Gemini only (OpenAI unavailable) - MEDIUM confidence');
      return { ...geminiResult, confidence: 'MEDIUM', source: 'Gemini' };
    }

    // If both failed, throw error
    if (!geminiResult && !openaiResult) {
      throw new Error('OCR_FAILED');
    }

    // Both succeeded - Compare key fields
    const marqueMatch = geminiResult.marque === openaiResult.marque;
    const modeleMatch = geminiResult.modele === openaiResult.modele;
    const anneeMatch = geminiResult.annee === openaiResult.annee;

    console.log('🔍 Cross-validation results:');
    console.log(`  • Marque: ${marqueMatch ? '✅' : '❌'} (Gemini: ${geminiResult.marque}, OpenAI: ${openaiResult.marque})`);
    console.log(`  • Modèle: ${modeleMatch ? '✅' : '❌'} (Gemini: ${geminiResult.modele}, OpenAI: ${openaiResult.modele})`);
    console.log(`  • Année: ${anneeMatch ? '✅' : '❌'} (Gemini: ${geminiResult.annee}, OpenAI: ${openaiResult.annee})`);

    // Calculate confidence based on matches
    const matchCount = [marqueMatch, modeleMatch, anneeMatch].filter(Boolean).length;
    let confidence: string;
    
    if (matchCount === 3) {
      confidence = 'VERY_HIGH';
      console.log('✅ Perfect match! Both AI models agree 100%');
    } else if (matchCount === 2) {
      confidence = 'HIGH';
      console.log('✅ Good match! Both AI models mostly agree');
    } else {
      confidence = 'MEDIUM';
      console.log('⚠️  Partial match. Using Gemini as primary source');
    }

    // Return Gemini result with enhanced confidence
    return {
      ...geminiResult,
      confidence,
      source: 'Gemini + OpenAI',
      verification: {
        openaiMarque: openaiResult.marque,
        openaiModele: openaiResult.modele,
        openaiAnnee: openaiResult.annee,
        matchScore: `${matchCount}/3`
      }
    };
  }

  private async getMonthlyUploadCount(userIp: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const count = await this.prisma.uploadTracking.count({
      where: {
        userIp,
        uploadedAt: {
          gte: startOfMonth
        },
        success: true
      }
    });
    
    return count;
  }

  private async trackUpload(userIp: string, vehicleInfo: any): Promise<void> {
    try {
      await this.prisma.uploadTracking.create({
        data: {
          userIp,
          success: true,
          vehicleInfo
        }
      });
    } catch (error) {
      console.error('Failed to track upload:', error);
    }
  }
}
