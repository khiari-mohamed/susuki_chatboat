// src/synonyms/synonyms.module.ts

import { Global, Module } from '@nestjs/common';
import { SynonymsService } from './synonyms.service';

@Global()
@Module({
  providers: [SynonymsService],
  exports: [SynonymsService],
})
export class SynonymsModule {}