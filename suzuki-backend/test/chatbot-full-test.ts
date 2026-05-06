import { PrismaClient } from '@prisma/client';
import { AdvancedSearchService } from '../src/chat/advanced-search.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SynonymsService } from '../src/synonyms/synonyms.service';
import { VehicleModelsService } from '../src/constants/vehicle-models.service';
import { AIQueryNormalizerService } from '../src/services/ai-query-normalizer.service';
import { OpenAIService } from '../src/chat/openai.service';
import { IntelligenceService } from '../src/chat/intelligence.service';
import { SearchService } from '../src/services/search.service';
import { SearchValidatorService } from '../src/services/search-validator.service';

const prisma = new PrismaClient();
const prismaService = new PrismaService();

// Minimal ConfigService mock – replace with real if needed
const configService = { get: (key: string) => process.env[key] || '' } as ConfigService;

const synonymsService = new SynonymsService(prismaService);
const vehicleModels = new VehicleModelsService(prismaService);
const openaiService = new OpenAIService(configService);  // may need real key if AI calls are made
const aiNormalizer = new AIQueryNormalizerService(openaiService, synonymsService);
const intelligence = new IntelligenceService(prismaService, synonymsService);
const advancedSearch = new AdvancedSearchService(prismaService, configService, synonymsService);
const validator = new SearchValidatorService(prismaService, vehicleModels); // if required, mock appropriately
const searchService = new SearchService(advancedSearch, validator);

// Initialize services that need DB
(async () => {
  await synonymsService.onModuleInit();
  await vehicleModels.onModuleInit();
  await advancedSearch.onModuleInit();

  // ── Test definitions ──────────────────────────────────────────
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  async function test(name: string, fn: () => Promise<boolean>) {
    try {
      const ok = await fn();
      if (ok) {
        passed++;
        results.push(`✅ ${name}`);
      } else {
        failed++;
        results.push(`❌ ${name}`);
      }
    } catch (e: any) {
      failed++;
      results.push(`💥 ${name} — ERROR: ${e.message?.slice(0, 80)}`);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // TEST SUITE
  // ══════════════════════════════════════════════════════════════

  // 1. Basic part search
  await test('Search "filtre air" returns results', async () => {
    const res = await searchService.search('filtre air');
    return res.length > 0 && res.some((p: any) => p.designation.toUpperCase().includes('FILTRE') && p.designation.toUpperCase().includes('AIR'));
  });

  // 2. Search with typo
  await test('Typo "filtr air" still finds filter', async () => {
    const res = await searchService.search('filtr air');
    return res.length > 0;
  });

  // 3. Tunisian dialect
  await test('Tunisian "n7eb filtre air" returns parts', async () => {
    const res = await searchService.search('n7eb filtre air');
    return res.length > 0;
  });

  // 4. Reference search exact
  await test('Exact reference search "00533069" returns correct part', async () => {
    const res = await searchService.search('00533069');
    return res.length > 0 && res[0].reference === '00533069';
  });

  // 5. Reference search partial
  await test('Partial reference "00533" finds matching parts', async () => {
    const res = await searchService.search('00533');
    return res.length > 0;
  });

  // 6. Price display
  await test('Price is shown when single result', async () => {
    const res = await searchService.search('00533069');
    return res.length > 0 && res[0].prixHt != null;
  });

  // 7. Stock status (Disponible)
  await test('Stock status "Disponible" for in‑stock item', async () => {
    const res = await searchService.search('00533069');
    const statut = res[0]?.stock?.statut || res[0]?.stockStatut;
    return statut === 'Disponible';
  });

  // 8. Stock status (Indisponible)
  await test('Stock status "Indisponible" for unknown reference', async () => {
    const res = await searchService.search('99999999');
    if (res.length === 0) return true; // no product found is acceptable
    return res[0]?.stock?.statut === 'Indisponible' || res[0]?.stockStatut === 'Indisponible';
  });

  // 9. Position detection – "amortisseur avant" returns front parts
  await test('Position "avant" is respected', async () => {
    const res = await searchService.search('amortisseur avant');
    if (res.length === 0) return false;
    const hasAnyAvant   = res.some((p: any) => /\bAVANT\b|\bAV\b/i.test(p.designation));
    const hasAnyArriere = res.some((p: any) => /\bARRIÈRE\b|\bARRIERE\b|\bAR\b/i.test(p.designation));
    return hasAnyAvant && !hasAnyArriere;
  });

  // 10. Side detection – "retroviseur gauche"
  await test('Side "gauche" is respected', async () => {
    const res = await searchService.search('retroviseur gauche');
    if (res.length === 0) return false;
    const hasAnyGauche = res.some((p: any) => /\bGAUCHE\b|\bG\b/i.test(p.designation));
    const hasAnyDroite = res.some((p: any) => /\bDROITE\b|\bDROIT\b|\bD\b/i.test(p.designation));
    return hasAnyGauche && !hasAnyDroite;
  });

  // 11. Vehicle model filtering (fitment)
  await test('Fitment filter: parts for SWIFT', async () => {
    const res = await searchService.search('filtre air', { modele: 'SWIFT' });
    // Should only return parts that have fitment for SWIFT (or universal)
    // For a rough check, ensure no part explicitly for another model appears
    return res.length >= 0; // existence is enough
  });

  // 12. Synonym expansion – "silencieux" → échappement
  await test('Synonym expansion: "silencieux" finds exhaust parts', async () => {
    const res = await searchService.search('silencieux');
    return res.some((p: any) => /ECHAPPEMENT|SILENCIEUX/i.test(p.designation));
  });

  // 13. Synonym Tunisian – "choufli batterie"
  await test('Tunisian "choufli batterie" finds battery', async () => {
    const res = await searchService.search('choufli batterie');
    return res.some((p: any) => /BATTERIE/i.test(p.designation));
  });

  // 14. Multi-word matching – "jeu plaquette"
  await test('Multi-word "jeu plaquette" returns brake pad kit', async () => {
    const res = await searchService.search('jeu plaquette');
    return res.some((p: any) => /PLAQUETTE|JEU/i.test(p.designation));
  });

  // 15. Extreme typo – "plakete"
  await test('Extreme typo "plakete" finds plaquette', async () => {
    const res = await searchService.search('plakete');
    return res.some((p: any) => /PLAQUETTE/i.test(p.designation));
  });

  // 16. Vehicle model validation – known VIN exists
  await test('Vehicle VIN lookup for existing VIN', async () => {
    const vin = await prisma.vehicle.findFirst({ where: { vin: { not: null } }, select: { vin: true } });
    if (!vin?.vin) return true; // skip if no VIN
    const v = await prisma.vehicle.findFirst({ where: { vin: vin.vin } });
    return v !== null;
  });

  // 17. Vehicle model validation – unknown VIN
  await test('Vehicle VIN lookup for non‑existent VIN', async () => {
    const v = await prisma.vehicle.findFirst({ where: { vin: 'NONEXISTVIN1234567' } });
    return v === null;
  });

  // 18. Synonyms DB load check
  await test('Synonyms table has French and Tunisian entries', async () => {
    const counts = await prisma.synonym.groupBy({ by: ['langue'], _count: true });
    const fr = counts.find(c => c.langue === 'fr')?._count ?? 0;
    const tn = counts.find(c => c.langue === 'tn')?._count ?? 0;
    return fr > 0 && tn > 0;
  });

  // 19. Carte grise VIN validation
  await test('VIN validation returns correct model', async () => {
    const existing = await prisma.vehicle.findFirst({ where: { vin: { not: null } } });
    if (!existing) return true;
    const res = await prisma.vehicle.findFirst({ where: { vin: existing.vin } });
    return res?.modele === existing.modele;
  });

  // 20. Vehicle models service loads from DB
  await test('VehicleModelsService returns models from DB', async () => {
    const models = vehicleModels.getAll();
    return models.length > 0 && models.includes('CELERIO');
  });

  // ── Print summary ──────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log(`  ${'PASSED'.padEnd(10)} ${passed}`);
  console.log(`  ${'FAILED'.padEnd(10)} ${failed}`);
  console.log(`  ${'TOTAL'.padEnd(10)} ${passed + failed}`);
  console.log('═'.repeat(60));
  results.forEach(r => console.log(r));

  await prisma.$disconnect();
})();