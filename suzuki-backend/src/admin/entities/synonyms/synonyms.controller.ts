import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SynonymsService } from '../../../synonyms/synonyms.service';
import { AdvancedSearchService } from '../../../chat/advanced-search.service';
import { AdminCrudController } from '../../common/crud.controller';
import { PrismaCrudService } from '../../common/crud.service';
import { AdminGateway } from '../../gateway/admin.gateway';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateSynonymDto } from './dto/create-synonym.dto';
import { UpdateSynonymDto } from './dto/update-synonym.dto';

// SynonymsService loads this whole table into memory once at boot and
// AdvancedSearchService takes its own snapshot of that on top — every
// mutation here must reload both, or an edit "saves" in the DB but the
// chatbot keeps searching against the old, in-memory synonym index
// until the next server restart. This is exactly what the existing
// /chat/synonyms/reload endpoint does manually; we just do it inline.
@Controller('admin/synonyms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminSynonymsController extends AdminCrudController {
  protected readonly tableName = 'synonyms';
  protected readonly searchFields = ['mot', 'canonical'];

  constructor(
    prisma: PrismaService,
    gateway: AdminGateway,
    private readonly synonymsService: SynonymsService,
    private readonly advancedSearch: AdvancedSearchService,
  ) {
    super(new PrismaCrudService(prisma, 'synonym'), gateway);
  }

  private async reindex(): Promise<void> {
    await this.synonymsService.reload();
    this.advancedSearch.refreshSynonymIndex();
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  async create(@Body() dto: CreateSynonymDto) {
    const record = await this.createAndBroadcast(dto);
    await this.reindex();
    return record;
  }

  @Put(':id')
  @Roles('ADMIN', 'EDITOR')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSynonymDto) {
    const record = await this.updateAndBroadcast(id, dto);
    await this.reindex();
    return record;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const record = await super.remove(id);
    await this.reindex();
    return record;
  }
}
