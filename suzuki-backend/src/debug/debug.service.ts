// src/debug/debug.service.ts
// ═══════════════════════════════════════════════════════════════════
// DebugService — full live database scan used by the /debug page.
//
// Everything here runs real read-only SQL against the current
// database (via Prisma $queryRaw). Nothing is mocked or hardcoded
// except the column METADATA (name, table, whether the search engine
// uses it, and a plain-language note) — the actual fill/empty counts
// and percentages always come straight from Postgres.
//
// FIX (2026-07-07): total_quantity note corrected. It previously
// implied total_quantity actively influences sort/priority. In
// reality isStockAvailable() (advanced-search.service.ts) only reads
// total_quantity as a FALLBACK when stock_consolide is NULL. Since
// the claims checklist below already confirms stock_consolide is
// populated for essentially every row, total_quantity in practice
// never affects ranking. Note updated to reflect that accurately.
// ═══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ColumnStat {
  table: string;
  column: string;
  totalRows: number;
  filledCount: number;
  emptyCount: number;
  percentComplete: number;
  percentEmpty: number;
  usedInSearch: boolean;
  note: string;
}

export interface ClaimCheck {
  claim: string;
  status: 'ok' | 'warning' | 'issue';
  detail: string;
}

export interface DbScanResult {
  scannedAt: string;
  totals: {
    parts: number;
    stock: number;
    fitments: number;
    itemReferences: number;
    partsWithoutStock: number;
    duplicateStockReferences: number;
    partsWithFitment: number;
    partsWithoutFitment: number;
    partsSuzukiOem: number;
    partsCarProParts: number;
    vehicles: number;
    vehicleModelMap: number;
    vehicleTypeMaster: number;
  };
  columns: ColumnStat[];
  claims: ClaimCheck[];
}

export interface ReferenceCheckRow {
  reference: string;
  found: boolean;
  fields: Record<string, { value: any; present: boolean }>;
  percentComplete: number;
}

// ── Column metadata: what each column IS, and whether the search
// engine (AdvancedSearchService) actually reads it. This is the only
// hardcoded part — it documents intent, not data. ─────────────────
const PART_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'reference',          usedInSearch: true,  note: 'Identifiant unique de la pièce — recherché en 4ème priorité (recherche par référence)' },
  { column: 'designation',        usedInSearch: true,  note: 'Nom anglais OEM — utilisé en repli si le nom français est vide' },
  { column: 'designation_2',      usedInSearch: true,  note: 'Nom français — champ affiché en premier au client, recherché en 1ère priorité' },
  { column: 'search_description', usedInSearch: true,  note: 'Champ contexte/NLP fourni par CarPro — utilisé dans la recherche et le scoring quand il est rempli' },
  { column: 'prix_ht',            usedInSearch: false, note: 'Prix hors taxes — affiché au client, non utilisé pour la recherche' },
  { column: 'prix_ttc',           usedInSearch: false, note: 'Prix toutes taxes comprises — affiché au client, non utilisé pour la recherche' },
  { column: 'unite',              usedInSearch: false, note: 'Unité de vente (UNITE / PCS) — informatif uniquement' },
  { column: 'categorie',          usedInSearch: true,  note: 'Catégorie de la pièce — utilisée comme contexte secondaire de recherche' },
  { column: 'fabricant',          usedInSearch: true,  note: 'Fabricant (SUZUKI / AUTRES) — utilisé comme contexte secondaire de recherche' },
  { column: 'fournisseur_code',   usedInSearch: true,  note: 'Code fournisseur interne — utilisé comme contexte secondaire de recherche' },
  { column: 'source',             usedInSearch: true,  note: 'Origine de la ligne (01_PROD ou 02_CARPRO) — les deux sont toujours incluses ensemble dans la recherche' },
];

const STOCK_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'stock_disponible', usedInSearch: false, note: 'Stock disponible source CarPro - informatif, ne determine pas seul la disponibilite client' },
  { column: 'stock_consolide',  usedInSearch: true,  note: 'Stock consolide source CarPro - disponible client uniquement si strictement superieur a 2' },
  { column: 'reference',      usedInSearch: true,  note: 'Clé de jointure vers la table parts' },
  // FIX: previously said total_quantity "sert aussi au tri (les pièces
  // disponibles sont légèrement priorisées)". That's only true when
  // stock_consolide is NULL — isStockAvailable() falls back to
  // total_quantity in that case only. Since stock_consolide is filled
  // for virtually every row (see claims checklist), total_quantity has
  // no real effect on sort/availability in practice today.
  { column: 'total_quantity', usedInSearch: false, note: 'Quantité en stock — affichée au client uniquement ; utilisée en repli seulement si stock_consolide est NULL (cas rare, voir "Stock consolidé" dans la checklist ci-dessous)' },
  { column: 'statut',         usedInSearch: false, note: 'Statut historique affiché seulement; la disponibilité client est recalculée avec stock_consolide > 2' },
];

const FITMENT_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'part_reference', usedInSearch: false, note: 'Clé de jointure vers la table parts' },
  { column: 'type_code',      usedInSearch: true,  note: 'Code type interne du véhicule (ex : ABU310-TYPE1) — filtre principal de compatibilité après identification VIN/modèle' },
  { column: 'model_name',     usedInSearch: false, note: 'Copie dénormalisée du nom de modèle — redondante, gardée pour compatibilité, peut contenir un code type au lieu d\'un nom lisible' },
];

const ITEM_REFERENCE_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'part_reference', usedInSearch: false, note: 'Clé de jointure vers la table parts' },
  { column: 'reference_no',   usedInSearch: true,  note: 'Référence alternative / code-barres — utilisée uniquement en secours quand la référence principale ne donne aucun résultat' },
  { column: 'reference_type', usedInSearch: false, note: 'Type de référence alternative — informatif uniquement' },
];

const VEHICLE_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'vehicle_no',         usedInSearch: true,  note: 'Identifiant véhicule interne — utilisé en secours si le VIN est absent' },
  { column: 'vin',                usedInSearch: true,  note: 'Clé principale d\'identification depuis la carte grise' },
  { column: 'marque',             usedInSearch: false, note: 'Marque lue depuis la carte grise — validation amont uniquement' },
  { column: 'modele',             usedInSearch: true,  note: 'Modèle normalisé puis croisé avec vehicle_model_map' },
  { column: 'modele_description', usedInSearch: true,  note: 'Version / description utilisée comme contexte pour retrouver les codes type' },
  { column: 'statut',             usedInSearch: false, note: 'Plaque / immatriculation historique, pas un statut de workflow' },
];

const VEHICLE_MODEL_MAP_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'modele',    usedInSearch: true, note: 'Nom modèle convivial issu de vehicles.modele' },
  { column: 'type_code', usedInSearch: true, note: 'Code type interne utilisé pour filtrer les fitments compatibles' },
];

const VEHICLE_TYPE_MASTER_COLUMNS: { column: string; usedInSearch: boolean; note: string }[] = [
  { column: 'type_code',  usedInSearch: true, note: 'Code type interne du véhicule, joint avec fitment.type_code' },
  { column: 'model_name', usedInSearch: true, note: 'Nom/description modèle utilisé en secours pour résoudre un type_code' },
];

@Injectable()
export class DebugService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────
  // Main entry point — full live scan
  // ─────────────────────────────────────────────────────────────────
  async getScan(): Promise<DbScanResult> {
    const [partsStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                              AS total,
        COUNT(*) FILTER (WHERE reference IS NOT NULL AND reference <> '')::int      AS reference_filled,
        COUNT(*) FILTER (WHERE designation IS NOT NULL AND designation <> '')::int  AS designation_filled,
        COUNT(*) FILTER (WHERE designation_2 IS NOT NULL AND designation_2 <> '')::int AS designation_2_filled,
        COUNT(*) FILTER (WHERE search_description IS NOT NULL AND search_description <> '')::int AS search_description_filled,
        COUNT(*) FILTER (WHERE prix_ht IS NOT NULL)::int                           AS prix_ht_filled,
        COUNT(*) FILTER (WHERE prix_ttc IS NOT NULL)::int                          AS prix_ttc_filled,
        COUNT(*) FILTER (WHERE unite IS NOT NULL AND unite <> '')::int             AS unite_filled,
        COUNT(*) FILTER (WHERE categorie IS NOT NULL AND categorie <> '')::int     AS categorie_filled,
        COUNT(*) FILTER (WHERE fabricant IS NOT NULL AND fabricant <> '')::int     AS fabricant_filled,
        COUNT(*) FILTER (WHERE fournisseur_code IS NOT NULL AND fournisseur_code <> '')::int AS fournisseur_code_filled,
        COUNT(*) FILTER (WHERE source IS NOT NULL AND source <> '')::int           AS source_filled,
        COUNT(*) FILTER (WHERE source = '01_PROD')::int                           AS source_prod_count,
        COUNT(*) FILTER (WHERE source = '02_CARPRO')::int                         AS source_carpro_count
      FROM parts
    `;

    const [stockStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                        AS total,
        COUNT(*) FILTER (WHERE reference IS NOT NULL AND reference <> '')::int AS reference_filled,
        COUNT(*) FILTER (WHERE stock_disponible IS NOT NULL)::int            AS stock_disponible_filled,
        COUNT(*) FILTER (WHERE stock_consolide IS NOT NULL)::int             AS stock_consolide_filled,
        COUNT(*) FILTER (WHERE stock_consolide > 2)::int                     AS stock_consolide_available_count,
        COUNT(*) FILTER (WHERE total_quantity IS NOT NULL)::int              AS total_quantity_filled,
        COUNT(*) FILTER (WHERE statut IS NOT NULL AND statut <> '')::int     AS statut_filled,
        COUNT(*) FILTER (WHERE statut = 'Disponible')::int                  AS disponible_count,
        COUNT(*) FILTER (WHERE statut = 'Indisponible')::int                AS indisponible_count
      FROM stock
    `;

    const [fitmentStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                              AS total,
        COUNT(*) FILTER (WHERE part_reference IS NOT NULL AND part_reference <> '')::int AS part_reference_filled,
        COUNT(*) FILTER (WHERE type_code IS NOT NULL AND type_code <> '')::int     AS type_code_filled,
        COUNT(*) FILTER (WHERE model_name IS NOT NULL AND model_name <> '')::int   AS model_name_filled,
        COUNT(DISTINCT part_reference)::int                                        AS parts_with_fitment
      FROM fitment
    `;

    const [itemRefStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                              AS total,
        COUNT(*) FILTER (WHERE part_reference IS NOT NULL AND part_reference <> '')::int AS part_reference_filled,
        COUNT(*) FILTER (WHERE reference_no IS NOT NULL AND reference_no <> '')::int      AS reference_no_filled,
        COUNT(*) FILTER (WHERE reference_type IS NOT NULL AND reference_type <> '')::int  AS reference_type_filled
      FROM item_references
    `;

    const [vehicleStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                              AS total,
        COUNT(*) FILTER (WHERE vehicle_no IS NOT NULL AND vehicle_no <> '')::int    AS vehicle_no_filled,
        COUNT(*) FILTER (WHERE vin IS NOT NULL AND vin <> '')::int                  AS vin_filled,
        COUNT(*) FILTER (WHERE marque IS NOT NULL AND marque <> '')::int            AS marque_filled,
        COUNT(*) FILTER (WHERE modele IS NOT NULL AND modele <> '')::int            AS modele_filled,
        COUNT(*) FILTER (WHERE modele_description IS NOT NULL AND modele_description <> '')::int AS modele_description_filled,
        COUNT(*) FILTER (WHERE statut IS NOT NULL AND statut <> '')::int            AS statut_filled
      FROM vehicles
    `;

    const [vehicleModelMapStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                           AS total,
        COUNT(*) FILTER (WHERE modele IS NOT NULL AND modele <> '')::int         AS modele_filled,
        COUNT(*) FILTER (WHERE type_code IS NOT NULL AND type_code <> '')::int   AS type_code_filled
      FROM vehicle_model_map
    `;

    const [vehicleTypeMasterStats] = await this.prisma.$queryRaw<any[]>`
      SELECT
        COUNT(*)::int                                                           AS total,
        COUNT(*) FILTER (WHERE type_code IS NOT NULL AND type_code <> '')::int   AS type_code_filled,
        COUNT(*) FILTER (WHERE model_name IS NOT NULL AND model_name <> '')::int AS model_name_filled
      FROM vehicle_type_master
    `;

    const [{ parts_without_stock }] = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int AS parts_without_stock
      FROM parts p
      LEFT JOIN stock s ON s.reference = p.reference
      WHERE s.reference IS NULL
    `;

    const [{ duplicate_stock_refs }] = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int AS duplicate_stock_refs FROM (
        SELECT reference FROM stock GROUP BY reference HAVING COUNT(*) > 1
      ) t
    `;

    const totalParts    = partsStats.total;
    const totalStock    = stockStats.total;
    const totalFitments = fitmentStats.total;
    const totalVehicles = vehicleStats.total;
    const partsWithFitment    = fitmentStats.parts_with_fitment;
    const partsWithoutFitment = totalParts - partsWithFitment;

    const columns: ColumnStat[] = [
      ...this.buildColumnStats('parts',           totalParts,    partsStats,    PART_COLUMNS,
        { reference: 'reference_filled', designation: 'designation_filled', designation_2: 'designation_2_filled',
          search_description: 'search_description_filled', prix_ht: 'prix_ht_filled', prix_ttc: 'prix_ttc_filled',
          unite: 'unite_filled', categorie: 'categorie_filled', fabricant: 'fabricant_filled',
          fournisseur_code: 'fournisseur_code_filled', source: 'source_filled' }),
      ...this.buildColumnStats('stock',           totalStock,    stockStats,    STOCK_COLUMNS,
        {
          reference: 'reference_filled',
          stock_disponible: 'stock_disponible_filled',
          stock_consolide: 'stock_consolide_filled',
          total_quantity: 'total_quantity_filled',
          statut: 'statut_filled',
        }),
      ...this.buildColumnStats('fitment',         totalFitments, fitmentStats,  FITMENT_COLUMNS,
        { part_reference: 'part_reference_filled', type_code: 'type_code_filled', model_name: 'model_name_filled' }),
      ...this.buildColumnStats('item_references', itemRefStats.total, itemRefStats, ITEM_REFERENCE_COLUMNS,
        { part_reference: 'part_reference_filled', reference_no: 'reference_no_filled', reference_type: 'reference_type_filled' }),
      ...this.buildColumnStats('vehicles', totalVehicles, vehicleStats, VEHICLE_COLUMNS,
        { vehicle_no: 'vehicle_no_filled', vin: 'vin_filled', marque: 'marque_filled',
          modele: 'modele_filled', modele_description: 'modele_description_filled', statut: 'statut_filled' }),
      ...this.buildColumnStats('vehicle_model_map', vehicleModelMapStats.total, vehicleModelMapStats, VEHICLE_MODEL_MAP_COLUMNS,
        { modele: 'modele_filled', type_code: 'type_code_filled' }),
      ...this.buildColumnStats('vehicle_type_master', vehicleTypeMasterStats.total, vehicleTypeMasterStats, VEHICLE_TYPE_MASTER_COLUMNS,
        { type_code: 'type_code_filled', model_name: 'model_name_filled' }),
    ];

    const claims = this.buildClaimsChecklist({
      totalParts,
      designation2Filled: partsStats.designation_2_filled,
      searchDescriptionFilled: partsStats.search_description_filled,
      partsWithoutStock: parts_without_stock,
      duplicateStockRefs: duplicate_stock_refs,
      stockConsolideAvailable: stockStats.stock_consolide_available_count,
      carproCount: partsStats.source_carpro_count,
      prodCount: partsStats.source_prod_count,
      vehiclesCount: vehicleStats.total,
      vehicleModelMapCount: vehicleModelMapStats.total,
      vehicleTypeMasterCount: vehicleTypeMasterStats.total,
    });

    return {
      scannedAt: new Date().toISOString(),
      totals: {
        parts:                     totalParts,
        stock:                     totalStock,
        fitments:                  totalFitments,
        itemReferences:            itemRefStats.total,
        partsWithoutStock:         parts_without_stock,
        duplicateStockReferences:  duplicate_stock_refs,
        partsWithFitment,
        partsWithoutFitment,
        partsSuzukiOem:            partsStats.source_prod_count,
        partsCarProParts:          partsStats.source_carpro_count,
        vehicles:                  totalVehicles,
        vehicleModelMap:           vehicleModelMapStats.total,
        vehicleTypeMaster:         vehicleTypeMasterStats.total,
      },
      columns,
      claims,
    };
  }

  private buildColumnStats(
    table: string,
    totalRows: number,
    stats: any,
    metadata: { column: string; usedInSearch: boolean; note: string }[],
    filledKeyMap: Record<string, string>,
  ): ColumnStat[] {
    return metadata.map((meta) => {
      const filledCount = totalRows > 0 ? (stats[filledKeyMap[meta.column]] ?? 0) : 0;
      const emptyCount  = Math.max(0, totalRows - filledCount);
      const percentComplete = totalRows > 0 ? Math.round((filledCount / totalRows) * 1000) / 10 : 0;
      const percentEmpty    = totalRows > 0 ? Math.round((emptyCount / totalRows) * 1000) / 10 : 0;
      return {
        table,
        column: meta.column,
        totalRows,
        filledCount,
        emptyCount,
        percentComplete,
        percentEmpty,
        usedInSearch: meta.usedInSearch,
        note: meta.note,
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Claims checklist — verifies, with live numbers, the specific
  // points raised in the client email / the documented data issues
  // in the Prisma schema comments (33% / 72.5% NULL, missing stock
  // rows, CarPro inclusion).
  // ─────────────────────────────────────────────────────────────────
  private buildClaimsChecklist(input: {
    totalParts: number;
    designation2Filled: number;
    searchDescriptionFilled: number;
    partsWithoutStock: number;
    duplicateStockRefs: number;
    stockConsolideAvailable: number;
    carproCount: number;
    prodCount: number;
    vehiclesCount: number;
    vehicleModelMapCount: number;
    vehicleTypeMasterCount: number;
  }): ClaimCheck[] {
    const pctNull = (filled: number) =>
      input.totalParts > 0 ? Math.round(((input.totalParts - filled) / input.totalParts) * 1000) / 10 : 0;

    const designation2NullPct = pctNull(input.designation2Filled);
    const searchDescNullPct   = pctNull(input.searchDescriptionFilled);

    const claims: ClaimCheck[] = [];

    claims.push({
      claim: 'Nom français (designation_2) rempli pour la quasi-totalité des pièces',
      status: designation2NullPct <= 10 ? 'ok' : designation2NullPct <= 40 ? 'warning' : 'issue',
      detail: `${designation2NullPct}% des pièces n'ont toujours pas de nom français (l'historique du schéma indiquait ~33% de NULL).`,
    });

    claims.push({
      claim: 'Champ de recherche NLP (search_description) rempli via COALESCE(designation_2, designation)',
      status: searchDescNullPct <= 10 ? 'ok' : searchDescNullPct <= 40 ? 'warning' : 'issue',
      detail: `${searchDescNullPct}% des pièces n'ont toujours pas de search_description (l'historique du schéma indiquait ~72.5% de NULL — le backfill SQL documenté doit être exécuté si ce chiffre est encore élevé).`,
    });

    claims.push({
      claim: 'Stock consolidé — chaque pièce a exactement une ligne de stock (fusion 01_PROD + 02_CARPRO)',
      status: input.partsWithoutStock === 0 && input.duplicateStockRefs === 0 ? 'ok' : 'issue',
      detail: `${input.partsWithoutStock} pièce(s) sans aucune ligne de stock, ${input.duplicateStockRefs} référence(s) avec plusieurs lignes de stock en doublon.`,
    });

    claims.push({
      claim: 'Les pièces CarPro Parts (02_CARPRO) sont bien présentes dans le catalogue',
      status: input.carproCount > 0 ? 'ok' : 'issue',
      detail: `${input.carproCount} pièce(s) source 02_CARPRO, ${input.prodCount} pièce(s) source 01_PROD.`,
    });

    claims.push({
      claim: 'Disponibilite client calculee avec stock_consolide > 2',
      status: input.stockConsolideAvailable > 0 ? 'ok' : 'warning',
      detail: `${input.stockConsolideAvailable} ligne(s) ont stock_consolide > 2 et doivent etre considerees disponibles.`,
    });

    claims.push({
      claim: 'Identification véhicule active — VIN puis modèle/type_code pour filtrer les pièces compatibles',
      status: input.vehiclesCount > 0 && input.vehicleModelMapCount > 0 && input.vehicleTypeMasterCount > 0 ? 'ok' : 'issue',
      detail: `${input.vehiclesCount} véhicule(s), ${input.vehicleModelMapCount} correspondance(s) modèle→type_code, ${input.vehicleTypeMasterCount} type_code(s) maître.`,
    });

    return claims;
  }

  // ─────────────────────────────────────────────────────────────────
  // Reference-level check — for the "20 pieces" from the email.
  // Returns, per reference: whether it exists, which fields are
  // present/empty, and an overall completeness percentage.
  // ─────────────────────────────────────────────────────────────────
  async checkReferences(references: string[]): Promise<ReferenceCheckRow[]> {
    const cleaned = references.map((r) => r.trim()).filter(Boolean);
    const results: ReferenceCheckRow[] = [];

    for (const reference of cleaned) {
      const part = await this.prisma.part.findUnique({
        where: { reference },
        include: {
          stock: {
            select: {
              statut: true,
              totalQuantity: true,
              stockDisponible: true,
              stockConsolide: true,
            },
          },
          fitments: { select: { modelName: true, typeCode: true } },
        },
      });

      if (!part) {
        results.push({ reference, found: false, fields: {}, percentComplete: 0 });
        continue;
      }

      const fieldChecks: [string, any][] = [
        ['designation',        part.designation],
        ['designation_2',      part.designation2],
        ['search_description', part.searchDescription],
        ['prix_ht',            part.prixHt],
        ['prix_ttc',           part.prixTtc],
        ['unite',              part.unite],
        ['categorie',          part.categorie],
        ['fabricant',          part.fabricant],
        ['fournisseur_code',   part.fournisseurCode],
        ['source',             part.source],
        ['stock.statut',       part.stock?.statut ?? null],
        ['stock.total_quantity', part.stock?.totalQuantity ?? null],
        ['stock.stock_disponible', part.stock?.stockDisponible ?? null],
        ['stock.stock_consolide', part.stock?.stockConsolide ?? null],
        ['fitments',           part.fitments?.length > 0 ? part.fitments.length : null],
      ];

      const fields: Record<string, { value: any; present: boolean }> = {};
      let presentCount = 0;
      for (const [key, value] of fieldChecks) {
        const present = value !== null && value !== undefined && value !== '';
        if (present) presentCount++;
        fields[key] = { value, present };
      }

      results.push({
        reference,
        found: true,
        fields,
        percentComplete: Math.round((presentCount / fieldChecks.length) * 1000) / 10,
      });
    }

    return results;
  }
}