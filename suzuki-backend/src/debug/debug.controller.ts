// src/debug/debug.controller.ts
import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DebugService, DbScanResult, ReferenceCheckRow } from './debug.service';

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  // GET /debug/scan — full live database scan
  @Get('scan')
  async scan(): Promise<DbScanResult> {
    try {
      return await this.debugService.getScan();
    } catch (err: any) {
      throw new HttpException(
        { error: err?.message || 'Database scan failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /debug/check-references  { references: string[] }
  @Post('check-references')
  async checkReferences(
    @Body() body: { references: string[] },
  ): Promise<ReferenceCheckRow[]> {
    if (!body || !Array.isArray(body.references) || body.references.length === 0) {
      throw new HttpException(
        { error: 'Body must include a non-empty `references` array of strings' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (body.references.length > 100) {
      throw new HttpException(
        { error: 'Maximum 100 references per request' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.debugService.checkReferences(body.references);
    } catch (err: any) {
      throw new HttpException(
        { error: err?.message || 'Reference check failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}