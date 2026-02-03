import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  // Rate limiting
  private readonly RATE_LIMIT_DELAY = 1000; // ms between calls
  private lastCallTime = 0;

  // Simple in-memory cache
  private readonly responseCache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Metrics
  private metrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    cacheHits: 0,
  };


  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('GEMINI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.error('❌ GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY not configured');
    }
    this.logger.log('✅ GeminiService initialized');
  }

  // Chat method removed - OpenAI handles all chat responses
  // GeminiService is now dedicated to OCR only

  async extractVehicleInfo(imageBase64: string, mimeType?: string): Promise<any> {
    const prompt = GEMINI_OCR_PROMPT;

    console.log('🔍 Starting OCR extraction...');
    
    try {
      // Detect mime type from base64 or use provided
      let detectedMimeType = mimeType;
      if (!detectedMimeType) {
        if (imageBase64.startsWith('data:image/png')) detectedMimeType = 'image/png';
        else if (imageBase64.startsWith('data:image/webp')) detectedMimeType = 'image/webp';
        else if (imageBase64.startsWith('data:image/heic')) detectedMimeType = 'image/heic';
        else if (imageBase64.startsWith('data:application/pdf')) detectedMimeType = 'application/pdf';
        else detectedMimeType = 'image/jpeg';
      }

      console.log('📷 Detected MIME type:', detectedMimeType);
      const base64Data = imageBase64.split(',')[1];
      console.log('📦 Base64 data size:', `${(base64Data.length / 1024).toFixed(2)} KB`);

      console.log('🚀 Calling Gemini Vision API...');
      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: detectedMimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Low temperature for accurate OCR
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout for large files
      });

      console.log('✅ Gemini API response received');
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      console.log('📝 Raw OCR text:', text);
      
      // Better JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('❌ No JSON found in response');
        throw new Error('OCR_FAILED');
      }
      
      const jsonText = jsonMatch[0];
      console.log('📦 Extracted JSON:', jsonText);
      
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
        console.log('✅ JSON parsed successfully:', parsed);
      } catch (e) {
        console.log('❌ JSON parse error:', e.message);
        throw new Error('OCR_FAILED');
      }

      if (parsed.error === 'invalid_brand') {
        console.log('❌ Invalid brand detected by Gemini');
        throw new Error('INVALID_BRAND');
      }

      // Normalize data
      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      console.log('🔍 Validating brand:', marque);
      
      if (!marque.includes('SUZUKI')) {
        console.log('❌ Brand validation failed - Not SUZUKI');
        console.log('📊 Match percentage: 0% (Wrong brand)');
        throw new Error('INVALID_BRAND');
      }
      console.log('✅ Brand validated: SUZUKI');

      // Accept ALL Suzuki models
      const modeleRaw = (parsed.modele || '').toString().trim();
      const modeleNorm = modeleRaw.toUpperCase().replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
      console.log('🔍 Model detected:', modeleRaw, '(normalized:', modeleNorm + ')');
      
      // Known Suzuki models for normalization
      const suzukiModels: Record<string, string> = {
        'CELERIO': 'CELERIO', 'SPRESSO': 'S-PRESSO', 'SWIFT': 'SWIFT',
        'VITARA': 'VITARA', 'JIMNY': 'JIMNY', 'BALENO': 'BALENO',
        'IGNIS': 'IGNIS', 'ALTO': 'ALTO', 'ERTIGA': 'ERTIGA',
        'DZIRE': 'DZIRE', 'CIAZ': 'CIAZ', 'SCROSS': 'S-CROSS',
        'WAGON': 'WAGON R', 'WAGONR': 'WAGON R'
      };
      
      let modeleCanon = modeleRaw.toUpperCase();
      let matchPercentage = 90;
      
      for (const [key, value] of Object.entries(suzukiModels)) {
        if (modeleNorm.includes(key)) {
          modeleCanon = value;
          matchPercentage = 95;
          console.log(`✅ Model validated: ${modeleCanon}`);
          break;
        }
      }
      
      if (matchPercentage === 90) {
        console.log(`✅ Suzuki model accepted: ${modeleCanon}`);
      }

      const result = {
        immatriculation: parsed.immatriculation?.trim().toUpperCase() || null,
        marque: 'SUZUKI',
        modele: modeleCanon || modeleRaw.toUpperCase(),
        typeMoteur: parsed.typeMoteur?.trim() || null,
        annee: parsed.annee || null
      };

      console.log('🎯 FINAL RESULT:');
      console.log('  • Immatriculation:', result.immatriculation || 'N/A');
      console.log('  • Marque:', result.marque);
      console.log('  • Modèle:', result.modele);
      console.log('  • Type Moteur:', result.typeMoteur || 'N/A');
      console.log('  • Année:', result.annee || 'N/A');
      console.log(`📊 Match Confidence: ${matchPercentage}%`);

      return result;
    } catch (error) {
      console.error('Gemini vision error:', error.response?.data || error.message);
      throw error;
    }
  }
}
