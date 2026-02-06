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
    const startTime = Date.now();
    
    try {
      // Parallel: Check upload limit + Prepare image
      const [ipUploadCount, imageBase64] = await Promise.all([
        userIp ? this.getMonthlyUploadCount(userIp) : Promise.resolve(0),
        Promise.resolve(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`)
      ]);
      
      if (userIp && ipUploadCount >= 3) {
        return {
          success: false,
          message: 'Limite mensuelle atteinte. Vous avez déjà téléchargé 3 cartes grises ce mois-ci.',
          uploadCount: ipUploadCount,
          limitReached: true
        };
      }

      // OCR extraction
      const geminiResult = await this.gemini.extractVehicleInfo(imageBase64, file.mimetype);
      const vehicleInfo = { ...geminiResult, confidence: 'HIGH', source: 'Gemini 2.5-flash' };
      
      // Check carte grise limit
      if (vehicleInfo.immatriculation) {
        const carteGriseCount = await this.getMonthlyCarteGriseUploadCount(vehicleInfo.immatriculation);
        if (carteGriseCount >= 3) {
          return {
            success: false,
            message: `Cette carte grise (${vehicleInfo.immatriculation}) a déjà été téléchargée 3 fois ce mois-ci.`,
            uploadCount: carteGriseCount,
            limitReached: true,
            limitType: 'carte_grise'
          };
        }
      }
      
      // Track upload (non-blocking)
      if (userIp) this.trackUpload(userIp, vehicleInfo).catch(() => {});
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        vehicleInfo,
        uploadCount: ipUploadCount + 1,
        debug: {
          processingTime: `${processingTime}ms`,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          confidence: vehicleInfo.confidence,
          model: 'Gemini 2.5-flash'
        }
      };
      
    } catch (error) {
      return {
        success: false,
        message: error.message === 'INVALID_BRAND' 
          ? 'Seules les cartes grises Suzuki sont acceptées.'
          : error.message === 'OCR_FAILED'
          ? 'Impossible de lire le document. Veuillez utiliser une image plus claire.'
          : 'Erreur lors de la vérification. Veuillez réessayer.'
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

  private async getMonthlyCarteGriseUploadCount(immatriculation: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const count = await this.prisma.uploadTracking.count({
      where: {
        vehicleInfo: {
          path: ['immatriculation'],
          equals: immatriculation
        },
        uploadedAt: {
          gte: startOfMonth
        },
        success: true
      }
    });
    
    return count;
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
