import { describe, expect, it, jest } from '@jest/globals';
import type { Request } from 'express';
import { VerificationController } from './verification.controller';

 describe('VerificationController.verifyVin', () => {
  it('forwards the client IP so the VIN lookup throttle is enforced', async () => {
    const verifyVin = jest.fn(async () => ({ success: true }));
    const controller = new VerificationController({ verifyVin } as any);
    const request = {
      ip: '198.51.100.20',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    await controller.verifyVin({ vin: '1HGCM82633A004352' }, request);

    expect(verifyVin).toHaveBeenCalledWith('1HGCM82633A004352', '198.51.100.20');
  });

  it('falls back to the socket address when Express has no request IP', async () => {
    const verifyVin = jest.fn(async () => ({ success: true }));
    const controller = new VerificationController({ verifyVin } as any);
    const request = { socket: { remoteAddress: '192.0.2.10' } } as unknown as Request;

    await controller.verifyVin({ vin: '1HGCM82633A004352' }, request);

    expect(verifyVin).toHaveBeenCalledWith('1HGCM82633A004352', '192.0.2.10');
  });
});
