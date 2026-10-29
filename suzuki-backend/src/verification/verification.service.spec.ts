import { describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../chat/gemini.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationService } from './verification.service';

const validVin = '1HGCM82633A004352';

function createService(options: {
  typeCode?: string | null;
  vinLookupsPerMinute?: string;
} = {}) {
  const vehicleFindMany = jest.fn().mockResolvedValue([{
    id: 1,
    vin: validVin,
    vehicleNo: 'CAR-1',
    marque: 'SUZUKI',
    modele: 'CELERIO',
    modeleDescription: 'NEW CELERIO',
    typeCode: options.typeCode === undefined ? 'T1' : options.typeCode,
    immatriculation: '123 TUN 456',
  }]);
  const uploadCount = jest.fn().mockResolvedValue(0);
  const ocrExtract = jest.fn().mockResolvedValue({
    immatriculation: '123 TUN 456',
    marque: 'SUZUKI',
    modele: 'CELERIO',
    typeMoteur: null,
    annee: 2022,
    vin: validVin,
  });
  const prisma = {
    vehicle: { findMany: vehicleFindMany },
    uploadTracking: { count: uploadCount, create: jest.fn().mockResolvedValue({}) },
  } as unknown as PrismaService;
  const gemini = { extractVehicleInfo: ocrExtract } as unknown as GeminiService;
  const config = {
    get: (key: string) => key === 'VIN_LOOKUPS_PER_MINUTE' ? options.vinLookupsPerMinute ?? '20' : '0',
  } as unknown as ConfigService;

  return {
    service: new VerificationService(prisma, gemini, config),
    vehicleFindMany,
    uploadCount,
    ocrExtract,
  };
}

describe('VerificationService', () => {
  it('applies the per-IP limit to manual VIN verification', async () => {
    const { service, vehicleFindMany } = createService({ vinLookupsPerMinute: '1' });

    const first = await service.verifyVin(validVin, '198.51.100.12');
    const limited = await service.verifyVin(validVin, '198.51.100.12');

    expect(first.success).toBe(true);
    expect(limited).toMatchObject({ success: false, limitReached: true });
    expect(vehicleFindMany).toHaveBeenCalledTimes(1);
  });

  it('refuses successful verification when the ERP vehicle has no model code', async () => {
    const { service } = createService({ typeCode: null });

    await expect(service.verifyVin(validVin, '198.51.100.13')).resolves.toMatchObject({
      success: false,
      message: expect.stringContaining('code modèle associé'),
    });
  });

  it('uses OpenAI OCR and reports the missing ERP model code at upload time', async () => {
    const { service, ocrExtract } = createService({ typeCode: '  ' });

    const result = await service.verifyDocument({
      buffer: Buffer.alloc(128),
      mimetype: 'image/png',
      size: 128,
    }, '198.51.100.14');

    expect(ocrExtract).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      success: false,
      message: expect.stringContaining('code modèle associé'),
    });
  });
});
