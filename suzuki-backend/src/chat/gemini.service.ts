import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GEMINI_CHAT_PROMPT, GEMINI_OCR_PROMPT } from './prompt-templates';
import { SUZUKI_MODELS } from '../constants/vehicle-models';

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
    
    try {
      const detectedMimeType = mimeType || 
        (imageBase64.startsWith('data:image/png') ? 'image/png' :
         imageBase64.startsWith('data:image/webp') ? 'image/webp' :
         imageBase64.startsWith('data:image/heic') ? 'image/heic' :
         imageBase64.startsWith('data:application/pdf') ? 'application/pdf' : 'image/jpeg');

      const base64Data = imageBase64.split(',')[1];

      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: detectedMimeType, data: base64Data } }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1024
        }
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('OCR_FAILED');
      
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error === 'invalid_brand') throw new Error('INVALID_BRAND');

      const marque = (parsed.marque || '').toString().toUpperCase().trim();
      if (!marque.includes('SUZUKI')) throw new Error('INVALID_BRAND');

      const modeleRaw = (parsed.modele || '').toString().trim();
      const modeleNorm = modeleRaw.toUpperCase().replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
      
      // Normalize extracted model against centralized SUZUKI_MODELS list
      let modeleCanon = modeleRaw.toUpperCase();
      for (const model of SUZUKI_MODELS) {
        const modelNorm = model.replace(/\s+/g, '').replace(/-/g, '');
        if (modeleNorm.includes(modelNorm)) {
          modeleCanon = model;
          break;
        }
      }
      
      // Special cases for common variations
      if (modeleNorm.includes('SPRESSO')) modeleCanon = 'S-PRESSO';
      if (modeleNorm.includes('SCROSS')) modeleCanon = 'S-CROSS';
      if (modeleNorm.includes('WAGON')) modeleCanon = 'WAGON R';

      return {
        immatriculation: parsed.immatriculation?.trim().toUpperCase() || null,
        marque: 'SUZUKI',
        modele: modeleCanon || modeleRaw.toUpperCase(),
        typeMoteur: parsed.typeMoteur?.trim() || null,
        annee: parsed.annee || null
      };
    } catch (error) {
      throw error;
    }
  }
}
