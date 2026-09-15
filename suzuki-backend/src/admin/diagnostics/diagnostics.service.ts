import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EXPLORER_TABLES } from '../explorer/table-manifest';

export interface IntegrityCheckResult {
  key: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  count: number;
  samples: unknown[];
}

@Injectable()
export class DiagnosticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Overview: row/column counts across every table ────────────
  async getOverview() {
    const tables = await Promise.all(
      EXPLORER_TABLES.map(async (t) => {
        const delegate = (this.prisma as any)[t.prismaModel];
        const rowCount: number = await delegate.count();
        return { key: t.key, label: t.label, rowCount, columnCount: t.columns.length };
      }),
    );

    return {
      tables,
      totals: {
        tableCount: tables.length,
        totalRows: tables.reduce((sum, t) => sum + t.rowCount, 0),
        totalColumns: tables.reduce((sum, t) => sum + t.columnCount, 0),
      },
    };
  }

  // ─── Per-column profile for one table: fill rate, distinct count,
  // top values, min/max — the standard "data profiling" pass. ─────
  async getColumnProfile(key: string) {
    const table = EXPLORER_TABLES.find((t) => t.key === key);
    if (!table) return null;

    const delegate = (this.prisma as any)[table.prismaModel];
    const totalRows: number = await delegate.count();

    const columns = await Promise.all(
      table.columns.map(async (col) => {
        const base: Record<string, unknown> = { key: col.key, type: col.type };

        if (col.type === 'string') {
          const groups: any[] = await delegate.groupBy({
            by: [col.key],
            _count: { _all: true },
          });
          const nullGroup = groups.find((g) => g[col.key] === null);
          const emptyGroup = groups.find((g) => g[col.key] === '');
          const realGroups = groups.filter((g) => g[col.key] !== null && g[col.key] !== '');

          const nullCount = nullGroup?._count._all ?? 0;
          const emptyCount = emptyGroup?._count._all ?? 0;

          base.nullCount = nullCount;
          base.emptyCount = emptyCount;
          base.distinctCount = realGroups.length;
          base.filledPct =
            totalRows > 0 ? Math.round(((totalRows - nullCount - emptyCount) / totalRows) * 1000) / 10 : 0;
          base.topValues = [...realGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .slice(0, 8)
            .map((g) => ({ value: g[col.key], count: g._count._all }));
        } else if (col.type === 'number') {
          const [nullCount, agg] = await Promise.all([
            delegate.count({ where: { [col.key]: null } }),
            delegate.aggregate({ _min: { [col.key]: true }, _max: { [col.key]: true }, _avg: { [col.key]: true } }),
          ]);
          base.nullCount = nullCount;
          base.filledPct = totalRows > 0 ? Math.round(((totalRows - nullCount) / totalRows) * 1000) / 10 : 0;
          base.min = agg._min[col.key];
          base.max = agg._max[col.key];
          base.avg = agg._avg[col.key];
        } else if (col.type === 'datetime') {
          const [nullCount, agg] = await Promise.all([
            delegate.count({ where: { [col.key]: null } }),
            delegate.aggregate({ _min: { [col.key]: true }, _max: { [col.key]: true } }),
          ]);
          base.nullCount = nullCount;
          base.filledPct = totalRows > 0 ? Math.round(((totalRows - nullCount) / totalRows) * 1000) / 10 : 0;
          base.min = agg._min[col.key];
          base.max = agg._max[col.key];
        } else if (col.type === 'boolean') {
          const trueCount: number = await delegate.count({ where: { [col.key]: true } });
          base.trueCount = trueCount;
          base.falseCount = totalRows - trueCount;
        } else if (col.type === 'json') {
          const nullCount: number = await delegate.count({ where: { [col.key]: null } });
          base.nullCount = nullCount;
          base.filledPct = totalRows > 0 ? Math.round(((totalRows - nullCount) / totalRows) * 1000) / 10 : 0;
        }

        return base;
      }),
    );

    return { table: { key: table.key, label: table.label }, totalRows, columns };
  }

  // ─── Integrity & sanity checks ───────────────────────────────────
  async getIntegrityChecks(): Promise<IntegrityCheckResult[]> {
    const checks: IntegrityCheckResult[] = [];
    const p = this.prisma;

    async function push(
      key: string,
      title: string,
      description: string,
      countQuery: Promise<Array<{ count: number }>>,
      sampleQuery: Promise<unknown[]>,
      severityIfPositive: 'error' | 'warning',
    ) {
      const [countRows, samples] = await Promise.all([countQuery, sampleQuery]);
      const count = Number(countRows[0]?.count ?? 0);
      checks.push({
        key,
        title,
        description,
        count,
        samples,
        severity: count > 0 ? severityIfPositive : 'info',
      });
    }

    // 1–5: referential integrity — these 5 relations have a real DB-level
    // foreign key (see schema.prisma), so a positive count here would mean
    // the constraint was bypassed (e.g. via a raw import script) — should
    // always read 0. Kept as a running sanity check, not a hypothetical.
    await push(
      'orphan_stock',
      'Stock sans pièce correspondante',
      "Lignes de stock.reference introuvables dans parts.reference. Protégé par une contrainte FK — un chiffre > 0 signalerait une import contournant la contrainte.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM stock s LEFT JOIN parts p ON s.reference = p.reference WHERE p.reference IS NULL`,
      p.$queryRaw`SELECT s.reference FROM stock s LEFT JOIN parts p ON s.reference = p.reference WHERE p.reference IS NULL LIMIT 5`,
      'error',
    );

    await push(
      'orphan_fitment_part',
      'Compatibilités liées à une pièce inexistante',
      'fitment.part_reference introuvable dans parts.reference.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM fitment f LEFT JOIN parts p ON f.part_reference = p.reference WHERE p.reference IS NULL`,
      p.$queryRaw`SELECT f.id, f.part_reference FROM fitment f LEFT JOIN parts p ON f.part_reference = p.reference WHERE p.reference IS NULL LIMIT 5`,
      'error',
    );

    await push(
      'orphan_fitment_type',
      'Compatibilités liées à un type_code inexistant',
      'fitment.type_code introuvable dans vehicle_type_master.type_code.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM fitment f LEFT JOIN vehicle_type_master v ON f.type_code = v.type_code WHERE v.type_code IS NULL`,
      p.$queryRaw`SELECT f.id, f.type_code FROM fitment f LEFT JOIN vehicle_type_master v ON f.type_code = v.type_code WHERE v.type_code IS NULL LIMIT 5`,
      'error',
    );

    await push(
      'orphan_item_reference',
      'Références croisées liées à une pièce inexistante',
      'item_references.part_reference introuvable dans parts.reference.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM item_references ir LEFT JOIN parts p ON ir.part_reference = p.reference WHERE p.reference IS NULL`,
      p.$queryRaw`SELECT ir.id, ir.part_reference FROM item_references ir LEFT JOIN parts p ON ir.part_reference = p.reference WHERE p.reference IS NULL LIMIT 5`,
      'error',
    );

    await push(
      'orphan_vehicle_model_map',
      'Modèle↔Type code lié à un type_code inexistant',
      'vehicle_model_map.type_code introuvable dans vehicle_type_master.type_code.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicle_model_map m LEFT JOIN vehicle_type_master v ON m.type_code = v.type_code WHERE v.type_code IS NULL`,
      p.$queryRaw`SELECT m.id, m.type_code FROM vehicle_model_map m LEFT JOIN vehicle_type_master v ON m.type_code = v.type_code WHERE v.type_code IS NULL LIMIT 5`,
      'error',
    );

    // 6–7: real gaps — Vehicle.typeCode is a plain string with NO
    // enforced FK (see schema.prisma), so this one is genuinely likely
    // to find real, previously-invisible data gaps.
    await push(
      'vehicle_typecode_unknown',
      'Véhicules avec un type_code introuvable',
      "vehicles.type_code renseigné mais absent de vehicle_type_master — cette colonne n'a pas de contrainte FK, donc ce chiffre peut être > 0 en pratique.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicles ve LEFT JOIN vehicle_type_master v ON ve.type_code = v.type_code WHERE ve.type_code IS NOT NULL AND v.type_code IS NULL`,
      p.$queryRaw`SELECT ve.vehicle_no, ve.type_code FROM vehicles ve LEFT JOIN vehicle_type_master v ON ve.type_code = v.type_code WHERE ve.type_code IS NOT NULL AND v.type_code IS NULL LIMIT 5`,
      'warning',
    );

    // FIX 2026-09-13: this check used to compare vehicles.modele alone
    // against vehicle_model_map.modele. But vehicle_model_map is
    // deliberately fed from TWO different sources at two different
    // granularities — a manual seed using short names ("BALENO",
    // "SWIFT") and sync-vehicles-csv.js using long modele_description
    // values ("NEW CELERIO POP 6AB") — and AdvancedSearchService's
    // resolveVehicleScope() already queries BOTH fields. The old check
    // therefore over-counted: a vehicle resolvable via modele_description
    // looked "unresolved" just because its short modele had no match.
    // This version checks both fields, and scopes to Suzuki only.
    await push(
      'vehicle_unresolvable_suzuki',
      "Véhicules Suzuki réellement non résolvables (ni modèle ni description ne matchent)",
      "vehicles.marque = 'SUZUKI' et ni modele ni modele_description ne trouvent de ligne dans vehicle_model_map — reproduit exactement la logique de resolveVehicleScope() du moteur de recherche, contrairement à l'ancien contrôle qui ne testait que modele.",
      p.$queryRaw`
        SELECT COUNT(*)::int AS count FROM vehicles ve
        WHERE UPPER(ve.marque) = 'SUZUKI'
          AND NOT EXISTS (SELECT 1 FROM vehicle_model_map m WHERE UPPER(m.modele) = UPPER(ve.modele))
          AND NOT EXISTS (SELECT 1 FROM vehicle_model_map m WHERE UPPER(m.modele) = UPPER(ve.modele_description))`,
      p.$queryRaw`
        SELECT DISTINCT ve.modele, ve.modele_description FROM vehicles ve
        WHERE UPPER(ve.marque) = 'SUZUKI'
          AND NOT EXISTS (SELECT 1 FROM vehicle_model_map m WHERE UPPER(m.modele) = UPPER(ve.modele))
          AND NOT EXISTS (SELECT 1 FROM vehicle_model_map m WHERE UPPER(m.modele) = UPPER(ve.modele_description))
        LIMIT 8`,
      'warning',
    );

    // 8: known format issue explicitly flagged in schema.prisma's own
    // comments (space vs hyphen in type_code).
    await push(
      'typecode_space_format',
      'type_code au format incohérent (espace au lieu de tiret)',
      "vehicle_type_master.type_code contenant un espace — le rapport et le schéma signalent ce format hétérogène ; normaliser en tiret.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicle_type_master WHERE type_code LIKE '% %'`,
      p.$queryRaw`SELECT type_code FROM vehicle_type_master WHERE type_code LIKE '% %' LIMIT 5`,
      'warning',
    );

    // 9–10: price sanity.
    await push(
      'price_ttc_below_ht',
      'Prix TTC inférieur au prix HT',
      'parts où prix_ttc < prix_ht — normalement impossible (TTC ≥ HT).',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM parts WHERE prix_ht IS NOT NULL AND prix_ttc IS NOT NULL AND prix_ttc < prix_ht`,
      p.$queryRaw`SELECT reference, prix_ht, prix_ttc FROM parts WHERE prix_ht IS NOT NULL AND prix_ttc IS NOT NULL AND prix_ttc < prix_ht LIMIT 5`,
      'warning',
    );

    await push(
      'price_negative',
      'Prix négatif',
      'parts où prix_ht < 0 ou prix_ttc < 0.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM parts WHERE prix_ht < 0 OR prix_ttc < 0`,
      p.$queryRaw`SELECT reference, prix_ht, prix_ttc FROM parts WHERE prix_ht < 0 OR prix_ttc < 0 LIMIT 5`,
      'error',
    );

    // 11: stock sanity — disponible should never exceed consolidé.
    await push(
      'stock_disponible_gt_consolide',
      'Stock disponible supérieur au stock consolidé',
      'stock où stock_disponible > stock_consolide — incohérence entre les deux sources agrégées.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM stock WHERE stock_disponible > stock_consolide`,
      p.$queryRaw`SELECT reference, stock_disponible, stock_consolide FROM stock WHERE stock_disponible > stock_consolide LIMIT 5`,
      'warning',
    );

    await push(
      'stock_negative',
      'Quantité de stock négative',
      'stock où total_quantity, stock_disponible ou stock_consolide < 0.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM stock WHERE total_quantity < 0 OR stock_disponible < 0 OR stock_consolide < 0`,
      p.$queryRaw`SELECT reference, total_quantity, stock_disponible, stock_consolide FROM stock WHERE total_quantity < 0 OR stock_disponible < 0 OR stock_consolide < 0 LIMIT 5`,
      'error',
    );

    // 12–14: normalization candidates.
    checks.push(await this.duplicateVariantsCheck('categorie', 'parts', 'Variantes de casse dans "catégorie"'));
    checks.push(await this.duplicateVariantsCheck('fabricant', 'parts', 'Variantes de casse dans "fabricant"'));
    checks.push(await this.duplicateVariantsCheck('unite', 'parts', 'Variantes de casse dans "unité"'));

    // 15: rows with zero usable display text at all.
    await push(
      'parts_fully_blank_display',
      'Pièces sans aucun texte affichable',
      'parts où designation_2 ET search_description sont tous les deux vides — le chatbot retombe alors uniquement sur la désignation anglaise brute.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM parts WHERE (designation_2 IS NULL OR designation_2 = '') AND (search_description IS NULL OR search_description = '')`,
      p.$queryRaw`SELECT reference, designation FROM parts WHERE (designation_2 IS NULL OR designation_2 = '') AND (search_description IS NULL OR search_description = '') LIMIT 5`,
      'warning',
    );

    // 16: source-confirmed data-quality issue — 109 duplicate VINs were
    // found directly in CarPro's own raw CSV export (2026-09-13 audit).
    await push(
      'duplicate_vin',
      'VIN dupliqués',
      "Un même VIN attribué à plusieurs véhicules (vehicle_no différents) — confirmé présent directement dans l'export CarPro brut, donc un problème côté source, pas côté import.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM (SELECT vin FROM vehicles WHERE vin IS NOT NULL GROUP BY vin HAVING COUNT(*) > 1) d`,
      p.$queryRaw`SELECT vin, ARRAY_AGG(vehicle_no) AS vehicle_numbers FROM vehicles WHERE vin IS NOT NULL GROUP BY vin HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC LIMIT 5`,
      'warning',
    );

    // 17: pollution from placeholder/artifact text ("NAN", "N/A", ...).
    await push(
      'junk_placeholder_values',
      'Valeurs artefact ("NAN", "N/A"...) au lieu de NULL',
      'vehicles.marque contenant une valeur de type placeholder Excel/export au lieu de NULL — voir scripts/cleanup-junk-values.sql pour le correctif (non exécuté automatiquement).',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicles WHERE UPPER(TRIM(marque)) IN ('NAN','N/A','NA','NULL','NONE','-','--','#N/A','UNDEFINED','#REF!','#VALUE!')`,
      p.$queryRaw`SELECT marque, COUNT(*)::int AS count FROM vehicles WHERE UPPER(TRIM(marque)) IN ('NAN','N/A','NA','NULL','NONE','-','--','#N/A','UNDEFINED','#REF!','#VALUE!') GROUP BY marque`,
      'warning',
    );

    // 18: "phantom" vehicle rows — a vehicle_no with literally every
    // other field null. Found 2026-09-13 while reviewing a live sample
    // export (16% of the 50 most-recently-added vehicles!).
    await push(
      'vehicle_phantom_rows',
      'Véhicules "fantômes" (aucun champ rempli à part le n° de série)',
      "vehicles où marque, modele, modele_description, vin, type_code ET l'immatriculation sont tous NULL — probablement une réservation de numéro de série avant import complet côté CarPro.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicles WHERE marque IS NULL AND modele IS NULL AND modele_description IS NULL AND vin IS NULL AND type_code IS NULL AND statut IS NULL`,
      p.$queryRaw`SELECT vehicle_no FROM vehicles WHERE marque IS NULL AND modele IS NULL AND modele_description IS NULL AND vin IS NULL AND type_code IS NULL AND statut IS NULL ORDER BY id DESC LIMIT 5`,
      'warning',
    );

    // 19: ambiguous bridge rows — the same modele text resolving to more
    // than one type_code.
    await push(
      'vehicle_model_map_ambiguous',
      'Modèles ambigus dans vehicle_model_map (plusieurs type_code pour le même nom)',
      'Un même texte de modèle pointe vers 2+ type_code différents — élargit la recherche du chatbot au lieu de la restreindre à un seul type_code pour ce modèle.',
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM (SELECT modele FROM vehicle_model_map GROUP BY modele HAVING COUNT(DISTINCT type_code) > 1) d`,
      p.$queryRaw`SELECT modele, ARRAY_AGG(DISTINCT type_code) AS type_codes FROM vehicle_model_map GROUP BY modele HAVING COUNT(DISTINCT type_code) > 1 ORDER BY modele LIMIT 8`,
      'warning',
    );

    // 20: data misplaced across columns — a marque value that's actually
    // a known model name (e.g. "JIMNY" typed into Code marque).
    await push(
      'marque_looks_like_model',
      'Valeur de marque qui ressemble à un nom de modèle',
      "vehicles.marque correspond exactement à une valeur déjà vue dans vehicles.modele ailleurs dans la table — signale probablement une saisie dans la mauvaise colonne côté source.",
      p.$queryRaw`SELECT COUNT(*)::int AS count FROM vehicles v WHERE v.marque IS NOT NULL AND EXISTS (SELECT 1 FROM vehicles v2 WHERE v2.modele IS NOT NULL AND UPPER(v2.modele) = UPPER(v.marque))`,
      p.$queryRaw`SELECT DISTINCT vehicle_no, marque FROM vehicles v WHERE v.marque IS NOT NULL AND EXISTS (SELECT 1 FROM vehicles v2 WHERE v2.modele IS NOT NULL AND UPPER(v2.modele) = UPPER(v.marque)) LIMIT 5`,
      'warning',
    );

    return checks;
  }

  private async duplicateVariantsCheck(column: string, table: string, title: string): Promise<IntegrityCheckResult> {
    // $queryRawUnsafe is used here only because column/table names can't
    // be parameterized in Prisma's tagged-template $queryRaw. Safe:
    // column/table are always hardcoded literals, never request input.
    const rows: Array<{ normalized: string; variants: string[]; total: number }> = await this.prisma.$queryRawUnsafe(
      `SELECT LOWER(TRIM(${column})) AS normalized, ARRAY_AGG(DISTINCT ${column}) AS variants, COUNT(*)::int AS total
       FROM ${table}
       WHERE ${column} IS NOT NULL AND ${column} != ''
       GROUP BY LOWER(TRIM(${column}))
       HAVING COUNT(DISTINCT ${column}) > 1
       ORDER BY total DESC
       LIMIT 10`,
    );

    return {
      key: `duplicate_variants_${table}_${column}`,
      severity: rows.length > 0 ? 'warning' : 'info',
      title,
      description: `Groupes de valeurs de "${column}" qui ne diffèrent que par la casse ou les espaces — candidats à une normalisation (ex. table de référence dédiée).`,
      count: rows.length,
      samples: rows.map((r) => ({ variants: r.variants, occurrences: r.total })),
    };
  }
}