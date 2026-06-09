import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../chat/gemini.service';
import { OpenAIService } from '../chat/openai.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private openai: OpenAIService,  // reserved for future cross-validation
  ) {}

  async verifyDocument(file: any, userIp?: string) {
    const startTime = Date.now();
    const fileHash = Buffer.from(file.buffer.slice(0, 100)).toString('base64').substring(0, 20);
    console.log(`📝 Processing file - Hash: ${fileHash}, Size: ${file.size}, Type: ${file.mimetype}`);
    
    try {
      // ========== RATE LIMITING - IP (TEMPORARILY DISABLED FOR TESTING) ==========
      // TODO: UNCOMMENT FOR PRODUCTION
      // Check upload limit for this IP (every 15 days)
      const ipUploadCount = userIp ? await this.get15DayUploadCount(userIp) : 0;

      // if (userIp && ipUploadCount >= 3) {
      //   return {
      //     success: false,
      //     message: 'Limite atteinte. Vous avez déjà téléchargé 3 cartes grises ces 15 derniers jours.',
      //     uploadCount: ipUploadCount,
      //     limitReached: true
      //   };
      // }
      // ========== END RATE LIMITING - IP ==========

      // Prepare image for OCR
      const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // OCR extraction
      const geminiResult = await this.gemini.extractVehicleInfo(imageBase64, file.mimetype);
      // Preserve any confidence set by Gemini; default to HIGH only if not provided.
      const vehicleInfo = {
        ...geminiResult,
        confidence: geminiResult.confidence ?? 'HIGH',
        source: geminiResult.source ?? 'Gemini 2.5-flash',
      };
      
      // Validate VIN against database (if VIN was extracted)
      if (vehicleInfo.vin) {
        const dbVehicle = await this.prisma.vehicle.findFirst({
          where: { vin: vehicleInfo.vin },
          select: {
            vin: true,
            marque: true,
            modele: true,
            modeleDescription: true,
            vehicleNo: true,
          },
        });
        
        if (dbVehicle) {
          // VIN found in database - enrich vehicleInfo with DB data
          vehicleInfo.marque = dbVehicle.marque || vehicleInfo.marque;
          vehicleInfo.modele = dbVehicle.modele || vehicleInfo.modele;
          vehicleInfo.modeleDescription = dbVehicle.modeleDescription || vehicleInfo.modeleDescription;
          vehicleInfo.vehicleNo = dbVehicle.vehicleNo;
          vehicleInfo.vinValidated = true;
          console.log(`✅ VIN ${vehicleInfo.vin} validated against database`);
        } else {
          // VIN not found - still allow (might be a new vehicle)
          vehicleInfo.vinValidated = false;
          console.log(`⚠️ VIN ${vehicleInfo.vin} not found in database (new vehicle?)`);
        }
      }
      
      // ========== RATE LIMITING - CARTE GRISE (TEMPORARILY DISABLED FOR TESTING) ==========
      // TODO: UNCOMMENT FOR PRODUCTION
      // Check carte grise limit (every 15 days)
      // if (vehicleInfo.immatriculation) {
      //   const carteGriseCount = await this.get15DayCarteGriseUploadCount(vehicleInfo.immatriculation);
      //   if (carteGriseCount >= 3) {
      //     return {
      //       success: false,
      //       message: `Cette carte grise (${vehicleInfo.immatriculation}) a déjà été téléchargée 3 fois ces 15 derniers jours.`,
      //       uploadCount: carteGriseCount,
      //       limitReached: true,
      //       limitType: 'carte_grise'
      //     };
      //   }
      // }
      // ========== END RATE LIMITING - CARTE GRISE ==========
      
      // Track upload (non-blocking) - still track IP for analytics
      if (userIp && vehicleInfo.immatriculation) {
        this.trackUpload(userIp, vehicleInfo).catch(() => {});
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        vehicleInfo,
        uploadCount: ipUploadCount,
        debug: {
          processingTime: `${processingTime}ms`,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          confidence: vehicleInfo.confidence,
          model: 'Gemini 2.5-flash'
        }
      };
      
    } catch (error: any) {
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

  /**
   * @deprecated Not currently wired — preserved for future dual-AI cross-validation.
   * To activate: replace the single gemini.extractVehicleInfo call in verifyDocument
   * with a Promise.all([gemini, openai]) and pass both results here.
   */
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

  private async get15DayUploadCount(userIp: string): Promise<number> {
    try {
      const now = new Date();
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

      const count = await this.prisma.uploadTracking.count({
        where: {
          userIp,
          uploadedAt: {
            gte: fifteenDaysAgo,
          },
          success: true,
        },
      });

      return count;
    } catch (error) {
      console.error('[VerificationService] Failed to get 15-day upload count:', error);
      return 0;
    }
  }

  private async get15DayCarteGriseUploadCount(immatriculation: string): Promise<number> {
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    
    const count = await this.prisma.uploadTracking.count({
      where: {
        vehicleInfo: {
          path: ['immatriculation'],
          equals: immatriculation
        },
        uploadedAt: {
          gte: fifteenDaysAgo
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
          vehicleInfo,
        },
      });
    } catch (error) {
      // Non-fatal: tracking failure must never block the user response.
      // Log with enough detail for ops to investigate if uploads are consistently lost.
      console.error('[VerificationService] Failed to track upload for IP', userIp, ':', error);
    }
  }
}
