-- ═══════════════════════════════════════════════════════════════════
-- check_csv_vs_db.sql
-- Compares every CSV row against the actual DB values.
-- Run this in your PostgreSQL client (psql, DBeaver, TablePlus, etc.)
-- ═══════════════════════════════════════════════════════════════════

WITH csv_data (reference, designation, designation_2, stock_disponible, stock_consolide, prix_ttc, prix_ht) AS (
  VALUES
    ('17700M81R00',     'RADIATORASSY',                  'RADIATEUR',     3,  41,  747.957,  628.535),
    ('35121M81R30',     'UNIT HEADLAMP',                 'OPTIQUE D',     2,  31,  762.652,  640.884),
    ('35321M81R30',     'UNIT HEADLAMP, LH',             'OPTIQUE G',    39,  39,  762.645,  640.878),
    ('57300M81R00',     'PANELCOMP,FRONTHOOD',           'CAPOT',         0,   8, 1036.880,  871.328),
    ('57611M81R00',     'PANEL,FRONT FENDER,R',          'AILE AV D',     7,  26,  419.709,  352.697),
    ('57711M81R00',     'PANEL,FRONT FENDER,L',          'AILE AV G',     0,  12,  419.709,  352.697),
    ('68001M81R20',     'PANEL ASSY, FRONT DOOR, R',     'PORTE AV D',    2,   2, 1619.630, 1361.034),
    ('68002M81R20',     'PANEL ASSY,FRONT DOOR,L',       'PORTE AV G',    0,   5, 1619.630, 1361.034),
    ('68003M81R00',     'PANEL ASSY,REAR DOOR,R',        'PORTE AR D',    2,   3, 1694.091, 1423.606),
    ('68004M81R00',     'PANEL ASSY,REAR DOOR,L',        'PORTE AR G',    4,   8, 1694.091, 1423.606),
    ('71711M81R00-799', 'BUMPER, FRONT',                 'PARE CHOC AV',  0,  17, 1087.321,  913.715),
    ('71811M81R10-799', 'BUMPER,REAR',                   'PARE CHOC AR',  0,  50, 1014.063,  852.154),
    ('17700M68P00',     'RADIATOR ASSY',                 'RADIATEUR',    13,  53,  798.146,  670.711),
    ('57300M75T00',     'PANEL COMP,FRONT HOOD',         'CAPOT',         0,  29,  940.309,  790.176),
    ('71711M75T00-799', 'BUMPER,FRONT',                  'PARECHOC AV',   0,   3, 1034.987,  869.737),
    ('71741M75T10-W9K', 'GRILLE,RADIATOR UPPER',         'CALANDRE',      0,  22,  831.464,  698.709),
    ('71811M75T00-799', 'BUMPER,REAR',                   'PARE CHOC AR',  0,   7,  849.157,  713.577),
    ('57611M55R10',     'PANEL,FRONT FENDER,R',          'AILE AV D',     0,  60,  501.610,  421.521),
    ('57711M55R10',     'AILE AV G',                     'AILE AV G',     0,  17,  501.612,  421.523),
    ('68001M55R00',     'PANEL ASSY, FRONT DOOR RH',     'PORTE AV D',    0,   0, 1639.726, 1377.921),
    ('68001M55R01',     'PANEL ASSY, FRONT DOOR RH',     'PORTE AV D',    0,   0, 1639.725, 1377.920),
    ('68001M55R02',     'PANEL ASSY, FRONT DOOR, R',     'PORTE AV D',    0,   4, 2049.423, 1722.205),
    ('71711M55R00-799', 'BUMPER, FR (PRIMARY)',           'PARE CHOC AV',  0,  19, 1079.117,  906.821),
    ('71740M55R00-C48', 'GRILLE',                        'CALANDRE',     10,  27,  410.308,  344.797),
    ('84501M55R00',     'GLASS, FRONT DOOR WINDOW RH',   'VITRE AV D',   10,  10,  359.437,  302.048),
    ('84570M55R10',     'GLASS, BACK WINDOW',            'LUNETTE AR',    0,   6,  890.323,  748.171),
    ('84701M55R50-ZHJ', 'MIRROR ASSY, OUT REAR VIEW',    'RETROVISEUR D', 0,   6,  629.171,  528.715)
)
SELECT
  c.reference,
  c.designation_2                          AS csv_designation_2,
  p.designation_2                          AS db_designation_2,
  CASE WHEN TRIM(p.designation_2) = TRIM(c.designation_2) THEN '✅' ELSE '❌ MISMATCH' END AS designation_2_ok,

  c.prix_ht                                AS csv_prix_ht,
  CAST(p.prix_ht AS NUMERIC(10,3))         AS db_prix_ht,
  CASE WHEN ROUND(CAST(p.prix_ht AS NUMERIC),3) = ROUND(c.prix_ht::NUMERIC,3) THEN '✅' ELSE '❌ MISMATCH' END AS prix_ht_ok,

  c.prix_ttc                               AS csv_prix_ttc,
  CAST(p.prix_ttc AS NUMERIC(10,3))        AS db_prix_ttc,
  CASE WHEN ROUND(CAST(p.prix_ttc AS NUMERIC),3) = ROUND(c.prix_ttc::NUMERIC,3) THEN '✅' ELSE '❌ MISMATCH' END AS prix_ttc_ok,

  c.stock_disponible                       AS csv_stock_disponible,
  s.stock_disponible                       AS db_stock_disponible,
  CASE WHEN s.stock_disponible = c.stock_disponible THEN '✅' ELSE '❌ MISMATCH' END AS stock_disponible_ok,

  c.stock_consolide                        AS csv_stock_consolide,
  s.stock_consolide                        AS db_stock_consolide,
  CASE WHEN s.stock_consolide = c.stock_consolide THEN '✅' ELSE '❌ MISMATCH' END AS stock_consolide_ok,

  CASE WHEN p.reference IS NULL THEN '❌ MISSING IN DB' ELSE '✅ EXISTS' END AS part_exists,
  CASE WHEN s.reference IS NULL THEN '❌ NO STOCK ROW'  ELSE '✅ HAS STOCK' END AS stock_exists

FROM csv_data c
LEFT JOIN parts p ON p.reference = c.reference
LEFT JOIN stock s ON s.reference = c.reference
ORDER BY c.reference;
