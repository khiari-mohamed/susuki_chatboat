# Generated chatbot UI test prompts

Generated: 2026-10-06T07:23:10.601Z  |  seed: 67890  |  cases: 200

Run with: $env:CASES_FILE="ui-chatbot-generated-clean.md"; node test-ui-chatbot-20.js --count=100000

## Case 001

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00750412
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0101278
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche COUVERCLE INF G pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6710
- Référence DB: 73811M84M50-5PK
- Désignation française (designation2): COUVERCLE INF G
- Désignation OEM (designation): COVER,STRG COLUMN HOLE
- Search description: COUVERCLE INF G ; COVER,STRG COLUMN HOLE
- Public price TTC: 102.956 TND (raw DB=102.95642)
- Wholesale/pre-tax price HT: 86.518 TND (raw DB=86.518; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13731; reference=73811M84M50-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.726Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=7393; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0101278; VIN=MA3KFC42S00750412; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE2

## Case 002

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378454
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119764
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez capuchon verrou raccord cable embrayage pour spresso ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1721
- Référence DB: 23922M75J00
- Désignation française (designation2): CAPUCHON VERROU RACCORD CABLE EMBRAYAGE
- Désignation OEM (designation): CAP,CLUTCH CABLE JOINT LOCK
- Search description: CAPUCHON VERROU RACCORD CABLE EMBRAYAGE ; CAP,CLUTCH CABLE JOINT LOCK
- Public price TTC: 6.856 TND (raw DB=6.85564)
- Wholesale/pre-tax price HT: 5.761 TND (raw DB=5.76104; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9055; reference=23922M75J00; totalQuantity=50; stockDisponible=0; stockConsolide=50; statut=Disponible; updatedAt=2026-09-20T19:01:42.041Z
- Availability rule: stockConsolide >= 2; actual quantity=50; expected=available
- Fitment rows (5): id=2729; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2730; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2731; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2732; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2733; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119764; VIN=MA3RFL41S00378454; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 003

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D94499
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018277
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CAPTEUR TEMP INT pour une SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9052
- Référence DB: 95640M83PB0
- Désignation française (designation2): CAPTEUR TEMP INT
- Désignation OEM (designation): SENSOR ASSY, ROOM TEMP
- Search description: CAPTEUR TEMP INT ; SENSOR ASSY, ROOM TEMP
- Public price TTC: 218.233 TND (raw DB=218.23291)
- Wholesale/pre-tax price HT: 183.389 TND (raw DB=183.389; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4878; reference=95640M83PB0; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:41.973Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=9396; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=6832; referenceNo=95640M83PB0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018277; VIN=MA3GZC62S00D94499; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 004

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764262
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089420
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb TUYAUX FLEXIBLES DE FREIN AR G lel CELERIO BVA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4243
- Référence DB: 51520M76M00
- Désignation française (designation2): TUYAUX FLEXIBLES DE FREIN AR G
- Désignation OEM (designation): PIPERR BK HOSE TO RR W/C L
- Search description: TUYAUX FLEXIBLES DE FREIN AR G ; PIPERR BK HOSE TO RR W/C L
- Public price TTC: 44.204 TND (raw DB=44.20374)
- Wholesale/pre-tax price HT: 37.146 TND (raw DB=37.146; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2223; reference=51520M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.340Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5351; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5352; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3404; referenceNo=51520M76M00; referenceType=3.0 | id=3405; referenceNo=51520M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089420; VIN=MA3KFC42S00764262; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 005

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426866
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109883
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CACHE SORTIE VENTILATION pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 5242
- Référence DB: 64141M73R00
- Désignation française (designation2): CACHE SORTIE VENTILATION
- Désignation OEM (designation): COVER, VENTILATOR OUTLET
- Search description: CACHE SORTIE VENTILATION ; COVER, VENTILATOR OUTLET
- Public price TTC: 18.456 TND (raw DB=18.45571)
- Wholesale/pre-tax price HT: 15.509 TND (raw DB=15.509; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2808; reference=64141M73R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.277Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=6240; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=6241; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=4249; referenceNo=64141M73R00; referenceType=3.0 | id=4250; referenceNo=64141M73R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0109883; VIN=MA3BNC22S00426866; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 006

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00470830
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022147
Variant: typo (COLLIER -> COLLIIER)
Generated category: PR

**UI prompt**

Bonjour, vous avez COLLIIER DE SERRAGE A RESSORT Ø 17,8 MM pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 135
- Référence DB: 09401-18403-000
- Désignation française (designation2): COLLIER DE SERRAGE A RESSORT Ø 17,8 MM
- Désignation OEM (designation): CLIP
- Search description: COLLIER DE SERRAGE A RESSORT Ø 17,8 MM ; CLIP
- Public price TTC: 11.828 TND (raw DB=11.8279)
- Wholesale/pre-tax price HT: 9.939 TND (raw DB=9.93941; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7597; reference=09401-18403-000; totalQuantity=60; stockDisponible=0; stockConsolide=60; statut=Disponible; updatedAt=2026-09-20T19:01:42.986Z
- Availability rule: stockConsolide >= 2; actual quantity=60; expected=available
- Fitment rows (5): id=378; modelName=AON312; typeCode=AON312-TYPE1 | id=379; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=380; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=381; modelName=AXM310; typeCode=AXM310-TYPE1 | id=382; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0022147; VIN=TSMLYE21S00470830; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 007

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00512974
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189297
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CALCULATEUR ECM pour une CIAZ ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2227
- Référence DB: 33920M82R30
- Désignation française (designation2): CALCULATEUR ECM
- Désignation OEM (designation): CONTROLLER ASSY,EPI
- Search description: CALCULATEUR ECM ; CONTROLLER ASSY,EPI
- Public price TTC: 2208.905 TND (raw DB=2208.90537)
- Wholesale/pre-tax price HT: 1856.223 TND (raw DB=1856.223; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9516; reference=33920M82R30; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:41.569Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=3407; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3408; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189297; VIN=MA3AVC71S00512974; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 008

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443091
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018427
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez tube a huile pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1082
- Référence DB: 16170-69GE0-000
- Désignation française (designation2): TUBE A HUILE
- Désignation OEM (designation): PIPE, OIL GALLERY NO.2 RM413
- Search description: TUBE A HUILE ; PIPE, OIL GALLERY NO.2 RM413
- Public price TTC: 209.292 TND (raw DB=209.29244)
- Wholesale/pre-tax price HT: 175.876 TND (raw DB=175.876; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=550; reference=16170-69GE0-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.202Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=2047; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=983; referenceNo=16170-69GE0; referenceType=3.0 | id=984; referenceNo=16170-69GE0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018427; VIN=TSMLYD21S00443091; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 009

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448596
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019749
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb BAS DE CAISSE DROIT lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5130
- Référence DB: 64111-54P00-P41
- Désignation française (designation2): BAS DE CAISSE DROIT
- Désignation OEM (designation): PANEL, SIDE SILL RH
- Search description: BAS DE CAISSE DROIT ; PANEL, SIDE SILL RH
- Public price TTC: 1042.784 TND (raw DB=1042.78397)
- Wholesale/pre-tax price HT: 876.289 TND (raw DB=876.28905; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12272; reference=64111-54P00-P41; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:39.230Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=6163; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=4176; referenceNo=64111-54P00-P410; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019749; VIN=TSMLYD21S00448596; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 010

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E25998
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180848
Variant: exact
Generated category: PR

**UI prompt**

Je cherche GOUPILLE ELASTIQUE 3 × 10 MM pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 74
- Référence DB: 09205-03019-000
- Désignation française (designation2): GOUPILLE ELASTIQUE 3 × 10 MM
- Désignation OEM (designation): PIN,SPRING(3X10)
- Search description: GOUPILLE ELASTIQUE 3 × 10 MM ; PIN,SPRING(3X10)
- Public price TTC: 14.917 TND (raw DB=14.91678)
- Wholesale/pre-tax price HT: 12.535 TND (raw DB=12.53511; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7541; reference=09205-03019-000; totalQuantity=20; stockDisponible=0; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:46.318Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (11): id=9974; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=9975; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=9976; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=9977; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=262; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=263; modelName=AON312; typeCode=AON312-TYPE1 | id=264; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=265; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=266; modelName=AXM310; typeCode=AXM310-TYPE1 | id=267; modelName=AXM310; typeCode=AXM310-TYPE2 | id=268; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180848; VIN=MBHCZC63S00E25998; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 011

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587068
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189112
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de BOUTON CAPTEUR PARKING pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2934
- Référence DB: 37775M66R00
- Désignation française (designation2): BOUTON CAPTEUR PARKING
- Désignation OEM (designation): SWITCH ASSY, PARK SNSR
- Search description: BOUTON CAPTEUR PARKING ; SWITCH ASSY, PARK SNSR
- Public price TTC: 119.557 TND (raw DB=119.55692)
- Wholesale/pre-tax price HT: 100.468 TND (raw DB=100.468; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1513; reference=37775M66R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.228Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=16563; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16564; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=16565; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=4082; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4083; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (1): id=2366; referenceNo=37775M66R00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189112; VIN=MBHCZF63S00587068; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 012

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654920
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045578
Variant: typo (RESERVOIR -> REERVOIR)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez BOUCHON REERVOIR HUILE FRIEN pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 4211
- Référence DB: 51220M55R00
- Désignation française (designation2): BOUCHON RESERVOIR HUILE FRIEN
- Désignation OEM (designation): CAP, RESERVOIR
- Search description: BOUCHON RESERVOIR HUILE FRIEN ; CAP, RESERVOIR
- Public price TTC: 17.169 TND (raw DB=17.16932)
- Wholesale/pre-tax price HT: 14.428 TND (raw DB=14.428; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2204; reference=51220M55R00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:40.040Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (6): id=18657; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=18658; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=18659; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=18660; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=5311; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5312; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=3362; referenceNo=51220M55R00; referenceType=3.0 | id=3363; referenceNo=51220M55R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045578; VIN=MA3WB52S6LA654920; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 013

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D95127
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018502
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb SUPPORT SUSPENSION INF D lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4718
- Référence DB: 58320M79M00
- Désignation française (designation2): SUPPORT SUSPENSION INF D
- Désignation OEM (designation): BRACKET SUSPENSION UPR RH
- Search description: SUPPORT SUSPENSION INF D ; BRACKET SUSPENSION UPR RH
- Public price TTC: 79.753 TND (raw DB=79.75261)
- Wholesale/pre-tax price HT: 67.019 TND (raw DB=67.01900000000001; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2508; reference=58320M79M00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.287Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=5802; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=3847; referenceNo=58320M79M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018502; VIN=MA3GZC62S00D95127; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 014

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG510420
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203601
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez patin de pedale pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 4167
- Référence DB: 49751M58J00
- Désignation française (designation2): PATIN DE PEDALE
- Désignation OEM (designation): PAD, PEDAL
- Search description: PATIN DE PEDALE ; PAD, PEDAL
- Public price TTC: 17.738 TND (raw DB=17.73814)
- Wholesale/pre-tax price HT: 14.906 TND (raw DB=14.906; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11367; reference=49751M58J00; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:50.369Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (20): id=18576; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=18577; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=18578; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=18579; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=18580; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18581; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18582; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=18583; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=5263; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=5264; modelName=AON312; typeCode=AON312-TYPE1 | id=5265; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5266; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=5267; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5268; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5269; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=5270; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5271; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=5272; modelName=AXM310; typeCode=AXM310-TYPE1 | id=5273; modelName=AXM310; typeCode=AXM310-TYPE2 | id=5274; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203601; VIN=MBHKWDA3SSG510420; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 015

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764065
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089444
Variant: typo (CENTRALE -> CENTRLE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CEINTURE CENTRLE pour ma CELERIO BVA ?

**DB facts for comparison (do not paste)**

- Part DB id: 8785
- Référence DB: 84906M76M00-5PK
- Désignation française (designation2): CEINTURE CENTRALE
- Désignation OEM (designation): BELT ASSYRR CENTER
- Search description: CEINTURE CENTRALE ; BELT ASSYRR CENTER
- Public price TTC: 180.869 TND (raw DB=180.86929)
- Wholesale/pre-tax price HT: 151.991 TND (raw DB=151.991; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4753; reference=84906M76M00-5PK; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:42.341Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (2): id=9095; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9096; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=6661; referenceNo=84906M76M00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089444; VIN=MA3KFC42S00764065; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 016

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446180
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018455
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche BRAS DE SUPPORT AV DE DIFFERENTIEL AR pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2076
- Référence DB: 29651-61M30-000
- Désignation française (designation2): BRAS DE SUPPORT AV DE DIFFERENTIEL AR
- Désignation OEM (designation): ARM, DIFF MOUNT APK412
- Search description: BRAS DE SUPPORT AV DE DIFFERENTIEL AR ; ARM, DIFF MOUNT APK412
- Public price TTC: 534.512 TND (raw DB=534.5123)
- Wholesale/pre-tax price HT: 449.170 TND (raw DB=449.17; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1023; reference=29651-61M30-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.359Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=3268; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1671; referenceNo=29651-61M30-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018455; VIN=TSMLYD21S00446180; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 017

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378428
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119740
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez REVETTMENT DE TOIT pour une SPRESSO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 7241
- Référence DB: 78110M62S40-6GS
- Désignation française (designation2): REVETTMENT DE TOIT
- Désignation OEM (designation): LINING ROOF(GRAY)
- Search description: REVETTMENT DE TOIT ; LINING ROOF(GRAY)
- Public price TTC: 717.637 TND (raw DB=717.63664)
- Wholesale/pre-tax price HT: 603.056 TND (raw DB=603.056; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3942; reference=78110M62S40-6GS; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.384Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=7869; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (1): id=5593; referenceNo=78110M62S40-6GS; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119740; VIN=MA3RFL41S00378428; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 018

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446651
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019721
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de RETROV INT pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 8618
- Référence DB: 84703-71L00-000
- Désignation française (designation2): RETROV INT
- Désignation OEM (designation): MIRROR ASSY,INS RR VIEW
- Search description: RETROV INT ; MIRROR ASSY,INS RR VIEW
- Public price TTC: 448.086 TND (raw DB=448.08617)
- Wholesale/pre-tax price HT: 376.543 TND (raw DB=376.543; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: AUTRES FABRICANTS
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15571; reference=84703-71L00-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:52.161Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=8960; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0019721; VIN=TSMLYD21S00446651; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 019

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376205
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119748
Variant: typo (CAPTEUR -> CAPTUER)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CAPTUER ARBRE A CAMME pour ma SPRESSO ?

**DB facts for comparison (do not paste)**

- Part DB id: 2162
- Référence DB: 33220M55K20
- Désignation française (designation2): CAPTEUR ARBRE A CAMME
- Désignation OEM (designation): SENSOR ASSY CAM POSITION
- Search description: CAPTEUR ARBRE A CAMME ; SENSOR ASSY CAM POSITION
- Public price TTC: 150.070 TND (raw DB=150.06971)
- Wholesale/pre-tax price HT: 126.109 TND (raw DB=126.109; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1065; reference=33220M55K20; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:41.812Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=3336; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3337; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (2): id=1740; referenceNo=33220M55K20; referenceType=3.0 | id=1741; referenceNo=33220M55K20-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119748; VIN=MA3RFL41S00376205; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 020

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339985
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025106
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez ROULEMENT D DE DIFFERENTIEL AV pour une CIAZ ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1965
- Référence DB: 27521M86J20
- Désignation française (designation2): ROULEMENT D DE DIFFERENTIEL AV
- Désignation OEM (designation): BEARING, DIFF SIDE
- Search description: ROULEMENT D DE DIFFERENTIEL AV ; BEARING, DIFF SIDE
- Public price TTC: 253.512 TND (raw DB=253.51165)
- Wholesale/pre-tax price HT: 213.035 TND (raw DB=213.035; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9273; reference=27521M86J20; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:52.571Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=3174; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3175; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3176; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025106; VIN=MA3AVC41S00339985; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 021

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00343668
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0030815
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb RENFORT BAS DE CAISSE D lel CIAZ. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5026
- Référence DB: 63220M79M50
- Désignation française (designation2): RENFORT BAS DE CAISSE D
- Désignation OEM (designation): STRENGTH,SIDE SILL,R
- Search description: RENFORT BAS DE CAISSE D ; STRENGTH,SIDE SILL,R
- Public price TTC: 601.314 TND (raw DB=601.31414)
- Wholesale/pre-tax price HT: 505.306 TND (raw DB=505.306; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12176; reference=63220M79M50; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:51.995Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=6073; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6074; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6075; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0030815; VIN=MA3AVC41S00343668; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 022

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG513027
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203500
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de PULSEUR D'AIR HABITACLE pour une FRONX, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6779
- Référence DB: 74150M55TD0
- Désignation française (designation2): PULSEUR D'AIR HABITACLE
- Désignation OEM (designation): .MOTOR ASSY,W/FAN
- Search description: PULSEUR D'AIR HABITACLE ; .MOTOR ASSY,W/FAN
- Public price TTC: 1173.798 TND (raw DB=1173.79838)
- Wholesale/pre-tax price HT: 986.385 TND (raw DB=986.38519; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13792; reference=74150M55TD0; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:51.826Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=22131; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=22132; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203500; VIN=MBHKWDA3SSG513027; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 023

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG503050
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203514
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez cable de masse de batterie pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2201
- Référence DB: 33880M55T10
- Désignation française (designation2): CABLE DE MASSE DE BATTERIE
- Désignation OEM (designation): CABLE SET, BTRY GND
- Search description: CABLE DE MASSE DE BATTERIE ; CABLE SET, BTRY GND
- Public price TTC: 509.056 TND (raw DB=509.05582)
- Wholesale/pre-tax price HT: 427.778 TND (raw DB=427.778; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9491; reference=33880M55T10; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.575Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=15455; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=15456; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203514; VIN=MBHKWDA3SSG503050; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 024

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513775
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189293
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche ARBRE ENSEMBLE pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1974
- Référence DB: 27800M82R00
- Désignation française (designation2): ARBRE ENSEMBLE
- Désignation OEM (designation): SHAFT ASSY, DRIVE INTERMEDIATE
- Search description: ARBRE ENSEMBLE ; SHAFT ASSY, DRIVE INTERMEDIATE
- Public price TTC: 541.926 TND (raw DB=541.926)
- Wholesale/pre-tax price HT: 455.400 TND (raw DB=455.4; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9282; reference=27800M82R00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:38.652Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3192; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3193; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=1621; referenceNo=27800M82R00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189293; VIN=MA3AVC71S00513775; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 025

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00361861
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119794
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de RENFORT SUP MONTANT CHARNIERE AV D pour une SPRESSO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5077
- Référence DB: 63551M62S00
- Désignation française (designation2): RENFORT SUP MONTANT CHARNIERE AV D
- Désignation OEM (designation): REINF,HINGE PILLAR FR UPR,R
- Search description: RENFORT SUP MONTANT CHARNIERE AV D ; REINF,HINGE PILLAR FR UPR,R
- Public price TTC: 139.773 TND (raw DB=139.77288)
- Wholesale/pre-tax price HT: 117.456 TND (raw DB=117.4562; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12224; reference=63551M62S00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:52.072Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=6116; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119794; VIN=MA3RFL41S00361861; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 026

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449895
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019580
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez RACCORD DE CHAUFFAGE pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1384
- Référence DB: 17870-72L00-000
- Désignation française (designation2): RACCORD DE CHAUFFAGE
- Désignation OEM (designation): UNION,HEATER
- Search description: RACCORD DE CHAUFFAGE ; UNION,HEATER
- Public price TTC: 90.670 TND (raw DB=90.67013)
- Wholesale/pre-tax price HT: 76.193 TND (raw DB=76.19338999999999; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8745; reference=17870-72L00-000; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:51.838Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=2377; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0019580; VIN=TSMLYE21S00449895; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 027

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454759
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015744
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR DE CHOCK pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1540
- Référence DB: 18640M76M00
- Désignation française (designation2): CAPTEUR DE CHOCK
- Désignation OEM (designation): SENSOR ASSY,KNOCK
- Search description: CAPTEUR DE CHOCK ; SENSOR ASSY,KNOCK
- Public price TTC: 133.994 TND (raw DB=133.994)
- Wholesale/pre-tax price HT: 112.600 TND (raw DB=112.6; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=843; reference=18640M76M00; totalQuantity=11; stockDisponible=11; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:41.827Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (2): id=2596; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2597; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=1368; referenceNo=18640M76M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0015744; VIN=MA3KFC42S00454759; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 028

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG509520
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203613
Variant: typo (VITESSE -> VIETSSE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez PIGNON  BOITE VIETSSE pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 1963
- Référence DB: 27511M55KA2
- Désignation française (designation2): PIGNON  BOITE VITESSE
- Désignation OEM (designation): GEAR, FINAL
- Search description: PIGNON BOITE VITESSE ; GEAR, FINAL
- Public price TTC: 547.788 TND (raw DB=547.78794)
- Wholesale/pre-tax price HT: 460.326 TND (raw DB=460.326; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=991; reference=27511M55KA2; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:50.453Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=15041; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=15042; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3171; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3172; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3173; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=1612; referenceNo=27511M55KA2; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0203613; VIN=MBHKWDA3SSG509520; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 029

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513405
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189313
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez chromage defflecteure ar d pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6203
- Référence DB: 71832M82R00-0PG
- Désignation française (designation2): CHROMAGE DEFFLECTEURE AR D
- Désignation OEM (designation): .GARNISH,RR REFLECTOR BEZEL,R
- Search description: CHROMAGE DEFFLECTEURE AR D ; .GARNISH,RR REFLECTOR BEZEL,R
- Public price TTC: 54.807 TND (raw DB=54.80664)
- Wholesale/pre-tax price HT: 46.056 TND (raw DB=46.056; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3362; reference=71832M82R00-0PG; totalQuantity=11; stockDisponible=11; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:42.605Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (2): id=6893; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6894; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=4899; referenceNo=71832M82R00-0PG; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189313; VIN=MA3AVC71S00513405; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 030

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31232
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180833
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb CAPUCHON AMORTISSEUR AR lel NEW SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 3602
- Référence DB: 41951M55R00
- Désignation française (designation2): CAPUCHON AMORTISSEUR AR
- Désignation OEM (designation): CAP,REAR SHOCK ABSORBER
- Search description: CAPUCHON AMORTISSEUR AR ; CAP,REAR SHOCK ABSORBER
- Public price TTC: 18.393 TND (raw DB=18.39268)
- Wholesale/pre-tax price HT: 15.456 TND (raw DB=15.45603; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10819; reference=41951M55R00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:42.029Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (3): id=17713; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17714; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=4754; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180833; VIN=MBHCZC63S00E31232; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 031

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1KA599713
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037462
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche LAMPE LED pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 177
- Référence DB: 09471M12240
- Désignation française (designation2): LAMPE LED
- Désignation OEM (designation): BULB (12V25W)
- Search description: LAMPE LED ; BULB (12V25W)
- Public price TTC: 338.344 TND (raw DB=338.34437)
- Wholesale/pre-tax price HT: 284.323 TND (raw DB=284.323; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=103; reference=09471M12240; totalQuantity=6; stockDisponible=6; stockConsolide=6; statut=Disponible; updatedAt=2026-09-20T19:01:47.895Z
- Availability rule: stockConsolide >= 2; actual quantity=6; expected=available
- Fitment rows (1): id=10462; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (2): id=189; referenceNo=09471M12240; referenceType=3.0 | id=190; referenceNo=09471M12240-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0037462; VIN=MA3WB52S1KA599713; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 032

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00411693
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109245
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de CIRCLIP MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une ERTIGA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1828
- Référence DB: 24451M78L00
- Désignation française (designation2): CIRCLIP MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME
- Désignation OEM (designation): CIRCLIP, LOW SPEED SYNC HUB
- Search description: CIRCLIP MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME ; CIRCLIP, LOW SPEED SYNC HUB
- Public price TTC: 3.869 TND (raw DB=3.86869)
- Wholesale/pre-tax price HT: 3.251 TND (raw DB=3.251; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9155; reference=24451M78L00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:42.652Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (8): id=14706; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14707; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14708; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3006; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3007; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3008; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3009; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3010; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0109245; VIN=MA3BNC22S00411693; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 033

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589030
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189218
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CACHE EXT MECANISME INCLINAISON SIEGE AV G NOIR pour une DZIRE ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 8842
- Référence DB: 85720M52R00-5PK
- Désignation française (designation2): CACHE EXT MECANISME INCLINAISON SIEGE AV G NOIR
- Désignation OEM (designation): COVER, FR RCLNG OUT LH (BLACK)
- Search description: CACHE EXT MECANISME INCLINAISON SIEGE AV G NOIR ; COVER, FR RCLNG OUT LH (BLACK)
- Public price TTC: 37.299 TND (raw DB=37.29936)
- Wholesale/pre-tax price HT: 31.344 TND (raw DB=31.344; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15781; reference=85720M52R00-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:40.978Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (4): id=25024; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25025; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25026; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=25027; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189218; VIN=MBHCZF63S00589030; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 034

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378460
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119768
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez buse d'eau essuie glasse pour spresso ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3153
- Référence DB: 38480M62S00
- Désignation française (designation2): BUSE D'EAU ESSUIE GLASSE
- Désignation OEM (designation): NOZZLE, WASHER
- Search description: BUSE D'EAU ESSUIE GLASSE ; NOZZLE, WASHER
- Public price TTC: 4.221 TND (raw DB=4.22093)
- Wholesale/pre-tax price HT: 3.547 TND (raw DB=3.547; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1663; reference=38480M62S00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.454Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=4320; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119768; VIN=MA3RFL41S00378460; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 035

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471959
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022164
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CACHE-POUSSIERE D'OPTIQUE lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2340
- Référence DB: 35179-76F10-000
- Désignation française (designation2): CACHE-POUSSIERE D'OPTIQUE
- Désignation OEM (designation): COVER, SOCKET JB420W/GSX-R1000
- Search description: CACHE-POUSSIERE D'OPTIQUE ; COVER, SOCKET JB420W/GSX-R1000
- Public price TTC: 67.375 TND (raw DB=67.37542)
- Wholesale/pre-tax price HT: 56.618 TND (raw DB=56.618; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1163; reference=35179-76F10-000; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:41.387Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=3494; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3495; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1873; referenceNo=35179-76F10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022164; VIN=TSMLYE21S00471959; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 036

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448116
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019745
Variant: typo (THERMIQUE -> THERRMIQUE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez CACHE THERRMIQUE pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 914
- Référence DB: 14231-54P00-000
- Désignation française (designation2): CACHE THERMIQUE
- Désignation OEM (designation): INSULATOR, CHAMBER HEAT APK416
- Search description: CACHE THERMIQUE ; INSULATOR, CHAMBER HEAT APK416
- Public price TTC: 124.820 TND (raw DB=124.82029)
- Wholesale/pre-tax price HT: 104.891 TND (raw DB=104.891; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8319; reference=14231-54P00-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.360Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=1823; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=1824; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=844; referenceNo=14231-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019745; VIN=TSMLYD21S00448116; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 037

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG503861
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203537
Variant: typo (CRUCIFORME -> CRUCFORME)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez VIS CRUCFORME A TETE BOMBEE M4 × 12 MM pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 15
- Référence DB: 03141M0412E
- Désignation française (designation2): VIS CRUCIFORME A TETE BOMBEE M4 × 12 MM
- Désignation OEM (designation): SCREW,FUEL BOX
- Search description: VIS CRUCIFORME A TETE BOMBEE M4 × 12 MM ; SCREW,FUEL BOX
- Public price TTC: 3.171 TND (raw DB=3.17135)
- Wholesale/pre-tax price HT: 2.665 TND (raw DB=2.665; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7483; reference=03141M0412E; totalQuantity=150; stockDisponible=0; stockConsolide=150; statut=Disponible; updatedAt=2026-09-20T19:01:55.530Z
- Availability rule: stockConsolide >= 2; actual quantity=150; expected=available
- Fitment rows (2): id=9632; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=9633; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203537; VIN=MBHKWDA3SSG503861; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 038

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587603
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192983
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de SUPPORT PLANCHIER AR pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4932
- Référence DB: 61284M68P00
- Désignation française (designation2): SUPPORT PLANCHIER AR
- Désignation OEM (designation): REINF,MAIN FLOOR,L
- Search description: SUPPORT PLANCHIER AR ; REINF,MAIN FLOOR,L
- Public price TTC: 95.827 TND (raw DB=95.82749)
- Wholesale/pre-tax price HT: 80.527 TND (raw DB=80.5273; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12091; reference=61284M68P00; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:54.166Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (10): id=19761; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19762; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=19763; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=19764; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=19765; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=19766; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=19767; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5972; modelName=AON312; typeCode=AON312-TYPE1 | id=5973; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5974; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0192983; VIN=MBHCZF63S00587603; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 039

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00766379
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0093465
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb COMMUTATEUR MAINS LIBRES lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2864
- Référence DB: 37490M76M10
- Désignation française (designation2): COMMUTATEUR MAINS LIBRES
- Désignation OEM (designation): SWITCH ASSY,HANDS FREE
- Search description: COMMUTATEUR MAINS LIBRES ; SWITCH ASSY,HANDS FREE
- Public price TTC: 120.580 TND (raw DB=120.58032)
- Wholesale/pre-tax price HT: 101.328 TND (raw DB=101.328; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1472; reference=37490M76M10; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.208Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=3995; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3996; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=2304; referenceNo=37490M76M10; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0093465; VIN=MA3KFC42S00766379; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE2

## Case 040

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654951
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045585
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez JEU CALE LATERALE DE VILEBREQUIN COTE 0,125 pour une BALENO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 588
- Référence DB: 12351M58M00-012
- Désignation française (designation2): JEU CALE LATERALE DE VILEBREQUIN COTE 0,125
- Désignation OEM (designation): BEARING,CRANK THRUST US(US:0.125,T:2.563)
- Search description: JEU CALE LATERALE DE VILEBREQUIN COTE 0,125 ; BEARING,CRANK THRUST US(US:0.125,T:2.563)
- Public price TTC: 16.063 TND (raw DB=16.06262)
- Wholesale/pre-tax price HT: 13.498 TND (raw DB=13.498; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8010; reference=12351M58M00-012; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:46.668Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (16): id=11544; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11545; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11546; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11547; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11548; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11549; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11550; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11551; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1150; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1151; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=1152; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=1153; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1154; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1155; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=1156; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1157; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045585; VIN=MA3WB52S6LA654951; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 041

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443274
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018430
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche VITRE DE TOIT OUVRANT pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7321
- Référence DB: 78720-61M00-000
- Désignation française (designation2): VITRE DE TOIT OUVRANT
- Désignation OEM (designation): GLASS, SLIDING ROOF
- Search description: VITRE DE TOIT OUVRANT ; GLASS, SLIDING ROOF
- Public price TTC: 2172.831 TND (raw DB=2172.83052)
- Wholesale/pre-tax price HT: 1825.908 TND (raw DB=1825.908; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3992; reference=78720-61M00-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:55.696Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=7919; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7920; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5657; referenceNo=78720-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018430; VIN=TSMLYD21S00443274; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 042

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426599
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110398
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez agrafe plancher coffre pour ertiga ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6830
- Référence DB: 75139M70F00-5PK
- Désignation française (designation2): AGRAFE PLANCHER COFFRE
- Désignation OEM (designation): CLIP,LUGGAGE FLOOR
- Search description: AGRAFE PLANCHER COFFRE ; CLIP,LUGGAGE FLOOR
- Public price TTC: 4.559 TND (raw DB=4.55889)
- Wholesale/pre-tax price HT: 3.831 TND (raw DB=3.831; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3724; reference=75139M70F00-5PK; totalQuantity=100; stockDisponible=50; stockConsolide=100; statut=Disponible; updatedAt=2026-09-20T19:01:37.808Z
- Availability rule: stockConsolide >= 2; actual quantity=100; expected=available
- Fitment rows (5): id=7476; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=7477; modelName=APQ415; typeCode=APQ415-TYPE2 | id=7478; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7479; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=7480; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0110398; VIN=MA3BNC22S00426599; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 043

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E25285
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180835
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CAPTEUR DE ROUE ARR pour une NEW SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4503
- Référence DB: 56310M68P01
- Désignation française (designation2): CAPTEUR DE ROUE ARR
- Désignation OEM (designation): SENSOR, RR WHEEL
- Search description: CAPTEUR DE ROUE ARR ; SENSOR, RR WHEEL
- Public price TTC: 212.228 TND (raw DB=212.22817)
- Wholesale/pre-tax price HT: 178.343 TND (raw DB=178.343; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2374; reference=56310M68P01; totalQuantity=9; stockDisponible=0; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:41.909Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (3): id=19138; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=19139; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=19140; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180835; VIN=MBHCZC63S00E25285; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 044

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez entretoise 3eme et 4eme vitesse pour swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1765
- Référence DB: 24336M76M20
- Désignation française (designation2): ENTRETOISE 3ÈME ET 4ÈME VITESSE
- Désignation OEM (designation): SPACER,3RD & 4TH GEAR
- Search description: ENTRETOISE 3ÈME ET 4ÈME VITESSE ; SPACER,3RD & 4TH GEAR
- Public price TTC: 20.519 TND (raw DB=20.51917)
- Wholesale/pre-tax price HT: 17.243 TND (raw DB=17.243; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=937; reference=24336M76M20; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.832Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=14452; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14453; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2838; modelName=AON312; typeCode=AON312-TYPE1 | id=2839; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2840; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=1524; referenceNo=24336M76M20; referenceType=3.0 | id=1525; referenceNo=24336M76M20-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 045

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG520371
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204624
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche PROTECTION ANTI-PROJECTION PORTE AR D pour ma FRONX. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7176
- Référence DB: 77530M74T00-5PK
- Désignation française (designation2): PROTECTION ANTI-PROJECTION PORTE AR D
- Désignation OEM (designation): GUARD ASSY,RR DOOR SPLASH,R
- Search description: PROTECTION ANTI-PROJECTION PORTE AR D ; GUARD ASSY,RR DOOR SPLASH,R
- Public price TTC: 325.610 TND (raw DB=325.61018)
- Wholesale/pre-tax price HT: 273.622 TND (raw DB=273.622; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3908; reference=77530M74T00-5PK; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:51.813Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (2): id=22753; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=22754; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204624; VIN=MBHKWDA3SSG520371; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 046

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443565
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018434
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BAGUE EXT DU ROULEMENT pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1961
- Référence DB: 27481-54P10-000
- Désignation française (designation2): BAGUE EXT DU ROULEMENT
- Désignation OEM (designation): RACE,TAPER ROLLER BRG OUTER
- Search description: BAGUE EXT DU ROULEMENT ; RACE,TAPER ROLLER BRG OUTER
- Public price TTC: 207.475 TND (raw DB=207.47531)
- Wholesale/pre-tax price HT: 174.349 TND (raw DB=174.349; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9269; reference=27481-54P10-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:38.761Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=3167; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=3168; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018434; VIN=TSMLYD21S00443565; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 047

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA642590
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042647
Variant: typo (SWITCHER -> SWTICHER)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez SWTICHER RADAR DE RECULE pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 2935
- Référence DB: 37775M68P00
- Désignation française (designation2): SWITCHER RADAR DE RECULE
- Désignation OEM (designation): SWITCH ASSY, PARK SENSOR
- Search description: SWITCHER RADAR DE RECULE ; SWITCH ASSY, PARK SENSOR
- Public price TTC: 66.369 TND (raw DB=66.36868)
- Wholesale/pre-tax price HT: 55.772 TND (raw DB=55.772; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1514; reference=37775M68P00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.347Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (4): id=16568; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=16569; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=4084; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=4085; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=2367; referenceNo=37775M68P00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042647; VIN=MA3WB52S6LA642590; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 048

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D93485
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018269
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb CACHE MOYEU DE JANTE AVEC LOGO SUZUKI lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 3714
- Référence DB: 43252M75J01
- Désignation française (designation2): CACHE MOYEU DE JANTE AVEC LOGO SUZUKI
- Désignation OEM (designation): CAP,WHEEL CENTRE YN4
- Search description: CACHE MOYEU DE JANTE AVEC LOGO SUZUKI ; CAP,WHEEL CENTRE YN4
- Public price TTC: 2.601 TND (raw DB=2.60134)
- Wholesale/pre-tax price HT: 2.186 TND (raw DB=2.186; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10924; reference=43252M75J01; totalQuantity=13; stockDisponible=0; stockConsolide=13; statut=Disponible; updatedAt=2026-09-20T19:01:41.038Z
- Availability rule: stockConsolide >= 2; actual quantity=13; expected=available
- Fitment rows (2): id=4853; modelName=AON312; typeCode=AON312-TYPE1 | id=4854; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018269; VIN=MA3GZC62S00D93485; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 049

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG531372
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204666
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche LEVIER D'OUVERTURE DU LAQUET DE CAPOT pour ma FRONX. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7478
- Référence DB: 82150M55T00
- Désignation française (designation2): LEVIER D'OUVERTURE DU LAQUET DE CAPOT
- Désignation OEM (designation): LEVER ,HOOD LATCH RELEASE
- Search description: LEVIER D'OUVERTURE DU LAQUET DE CAPOT ; LEVER ,HOOD LATCH RELEASE
- Public price TTC: 61.364 TND (raw DB=61.36354)
- Wholesale/pre-tax price HT: 51.566 TND (raw DB=51.566; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14437; reference=82150M55T00; totalQuantity=9; stockDisponible=0; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:48.021Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (5): id=23181; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=23182; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=23183; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=8061; modelName=AON312; typeCode=AON312-TYPE1 | id=8062; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204666; VIN=MBHKWDA3SSG531372; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 050

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG532815
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204652
Variant: typo (GARNITURE -> GARNIITURE)
Generated category: PR

**UI prompt**

Bonjour, vous avez PROTECTEUR GARNIITURE MALLE AR pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 8198
- Référence DB: 83942M74T01
- Désignation française (designation2): PROTECTEUR GARNITURE MALLE AR
- Désignation OEM (designation): PROTECTOR, BACK DOOR GARNISH
- Search description: PROTECTEUR GARNITURE MALLE AR ; PROTECTOR, BACK DOOR GARNISH
- Public price TTC: 36.594 TND (raw DB=36.59369)
- Wholesale/pre-tax price HT: 30.751 TND (raw DB=30.751; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15154; reference=83942M74T01; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:51.786Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=24219; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=24220; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204652; VIN=MBHKWDA3SSG532815; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 051

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447043
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019728
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb MOTEUR VITRE DE TOIT lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 7331
- Référence DB: 78811-54P00-000
- Désignation française (designation2): MOTEUR VITRE DE TOIT
- Désignation OEM (designation): MOTOR,GLASSAPK416
- Search description: MOTEUR VITRE DE TOIT ; MOTOR,GLASSAPK416
- Public price TTC: 843.691 TND (raw DB=843.69096)
- Wholesale/pre-tax price HT: 708.984 TND (raw DB=708.984; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3998; reference=78811-54P00-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:48.967Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=7942; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7943; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5666; referenceNo=78811-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019728; VIN=TSMLYD21S00447043; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 052

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522395
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204660
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez ligne d'echappement pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 924
- Référence DB: 14250M55T50
- Désignation française (designation2): LIGNE D'ECHAPPEMENT
- Désignation OEM (designation): PIPE,EXH CENTER
- Search description: LIGNE D'ECHAPPEMENT ; PIPE,EXH CENTER
- Public price TTC: 1135.524 TND (raw DB=1135.52418)
- Wholesale/pre-tax price HT: 954.222 TND (raw DB=954.222; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8328; reference=14250M55T50; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.028Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=12770; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12771; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=12772; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204660; VIN=MBHKWDA3SSG522395; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 053

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E27747
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180840
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CONDUIT AERATION AR N 2 D pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6813
- Référence DB: 74662M56R00
- Désignation française (designation2): CONDUIT AERATION AR N 2 D
- Désignation OEM (designation): DUCT,REAR VENT NO.2 RH
- Search description: CONDUIT AERATION AR N 2 D ; DUCT,REAR VENT NO.2 RH
- Public price TTC: 73.569 TND (raw DB=73.56937)
- Wholesale/pre-tax price HT: 61.823 TND (raw DB=61.823; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3718; reference=74662M56R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.295Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22164; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22165; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=5339; referenceNo=74662M56R00; referenceType=3.0 | id=5340; referenceNo=74662M56R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180840; VIN=MBHCZC63S00E27747; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 054

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00452178
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113763
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de RACCORD COUDE DE DURITE DE LAVE-GLACE pour une ERTIGA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3165
- Référence DB: 38491M72R00
- Désignation française (designation2): RACCORD COUDE DE DURITE DE LAVE-GLACE
- Désignation OEM (designation): L-JOINT
- Search description: RACCORD COUDE DE DURITE DE LAVE-GLACE ; L-JOINT
- Public price TTC: 5.843 TND (raw DB=5.8429)
- Wholesale/pre-tax price HT: 4.910 TND (raw DB=4.91; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10410; reference=38491M72R00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:51.836Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (3): id=17012; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=4335; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4336; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113763; VIN=MA3BNC22S00452178; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 055

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339728
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025094
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de DOUILLE DE FEU DE RECUL pour une CIAZ, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2552
- Référence DB: 36258M79M00
- Désignation française (designation2): DOUILLE DE FEU DE RECUL
- Désignation OEM (designation): SOCKET
- Search description: DOUILLE DE FEU DE RECUL ; SOCKET
- Public price TTC: 71.628 TND (raw DB=71.62848)
- Wholesale/pre-tax price HT: 60.192 TND (raw DB=60.192; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9824; reference=36258M79M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:44.173Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=3686; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3687; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3688; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025094; VIN=MA3AVC41S00339728; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 056

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340038
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025067
Variant: typo (EMBRAYAGE -> EMBRRAYAGE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez SUPPORT DURITE HUILE EMBRRAYAGE pour ma CIAZ ?

**DB facts for comparison (do not paste)**

- Part DB id: 1719
- Référence DB: 23871M68L00
- Désignation française (designation2): SUPPORT DURITE HUILE EMBRAYAGE
- Désignation OEM (designation): BRACKET, CLUTCH OIL HOSE
- Search description: SUPPORT DURITE HUILE EMBRAYAGE ; BRACKET, CLUTCH OIL HOSE
- Public price TTC: 18.718 TND (raw DB=18.71751)
- Wholesale/pre-tax price HT: 15.729 TND (raw DB=15.729; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9053; reference=23871M68L00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:53.688Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=2724; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=2725; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2726; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025067; VIN=MA3AVC41S00340038; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 057

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588078
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192968
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez serrure de porte av g r82202m55r42 pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7530
- Référence DB: 82202M55R40
- Désignation française (designation2): SERRURE DE PORTE AV G R82202M55R42
- Désignation OEM (designation): LATCH ASSY, FRONT DOOR, LH
- Search description: SERRURE DE PORTE AV G R82202M55R42 ; LATCH ASSY, FRONT DOOR, LH
- Public price TTC: 240.283 TND (raw DB=240.2833)
- Wholesale/pre-tax price HT: 201.919 TND (raw DB=201.91874; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14488; reference=82202M55R40; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:53.046Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=23228; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=23229; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5813; referenceNo=82202M55R40; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0192968; VIN=MBHCZF63S00588078; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 058

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764109
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089548
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb ASSIETTE  RESSORT SOUPAPE lel CELERIO BVA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 718
- Référence DB: 12931M74L00
- Désignation française (designation2): ASSIETTE  RESSORT SOUPAPE
- Désignation OEM (designation): RETAINER, VALVE SPRING
- Search description: ASSIETTE RESSORT SOUPAPE ; RETAINER, VALVE SPRING
- Public price TTC: 13.601 TND (raw DB=13.60051)
- Wholesale/pre-tax price HT: 11.429 TND (raw DB=11.429; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8134; reference=12931M74L00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:38.678Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (21): id=12271; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12272; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=12273; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=12274; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=12275; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12276; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=12277; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=12278; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1540; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1541; modelName=AON312; typeCode=AON312-TYPE1 | id=1542; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1543; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=1544; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=1545; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1546; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1547; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=1548; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1549; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1550; modelName=AXM310; typeCode=AXM310-TYPE1 | id=1551; modelName=AXM310; typeCode=AXM310-TYPE2 | id=1552; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089548; VIN=MA3KFC42S00764109; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 059

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588237
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183497
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR DE LUMIÉRE pour une DZIRE ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9053
- Référence DB: 95642-64G20-000
- Désignation française (designation2): CAPTEUR DE LUMIÉRE
- Désignation OEM (designation): SENSOR,SUN LIGHT ATK412
- Search description: CAPTEUR DE LUMIÉRE ; SENSOR,SUN LIGHT ATK412
- Public price TTC: 302.603 TND (raw DB=302.60272)
- Wholesale/pre-tax price HT: 254.288 TND (raw DB=254.288; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4879; reference=95642-64G20-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:41.839Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (15): id=25438; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=25439; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25440; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25441; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25442; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9397; modelName=AON312; typeCode=AON312-TYPE1 | id=9398; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=9399; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=9400; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9401; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9402; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=9403; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=9404; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=9405; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=9406; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=6833; referenceNo=95642-64G20-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0183497; VIN=MBHCZF63S00588237; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 060

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche KIT MAINTIEN MACHOIRES DE FREIN D/G pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4287
- Référence DB: 53240M68P01
- Désignation française (designation2): KIT MAINTIEN MACHOIRES DE FREIN D/G
- Désignation OEM (designation): KIT SHOE HOLD DOWN(RH/LH)
- Search description: KIT MAINTIEN MACHOIRES DE FREIN D/G ; KIT SHOE HOLD DOWN(RH/LH)
- Public price TTC: 10.961 TND (raw DB=10.96109)
- Wholesale/pre-tax price HT: 9.211 TND (raw DB=9.211; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11480; reference=53240M68P01; totalQuantity=76; stockDisponible=0; stockConsolide=76; statut=Disponible; updatedAt=2026-09-20T19:01:47.779Z
- Availability rule: stockConsolide >= 2; actual quantity=76; expected=available
- Fitment rows (3): id=18838; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=5422; modelName=AXM310; typeCode=AXM310-TYPE1 | id=5423; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 061

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426159
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110404
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb LECHE-VITRE EXT PORTE AV lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 8009
- Référence DB: 83821M72R00
- Désignation française (designation2): LECHE-VITRE EXT PORTE AV
- Désignation OEM (designation): WEATHERSTRIP, FRONT DOOR OUTLH
- Search description: LECHE-VITRE EXT PORTE AV ; WEATHERSTRIP, FRONT DOOR OUTLH
- Public price TTC: 55.993 TND (raw DB=55.99307)
- Wholesale/pre-tax price HT: 47.053 TND (raw DB=47.053; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4352; reference=83821M72R00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:47.963Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=8534; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=8535; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=6158; referenceNo=83821M72R00; referenceType=3.0 | id=6159; referenceNo=83821M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110404; VIN=MA3BNC22S00426159; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 062

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339502
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025093
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ROULEMENT BV pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1759
- Référence DB: 24311M86JA0
- Désignation française (designation2): ROULEMENT BV
- Désignation OEM (designation): GEAR,CTSHFT 1ST
- Search description: ROULEMENT BV ; GEAR,CTSHFT 1ST
- Public price TTC: 286.809 TND (raw DB=286.80904)
- Wholesale/pre-tax price HT: 241.016 TND (raw DB=241.016; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9090; reference=24311M86JA0; totalQuantity=2; stockDisponible=1; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:52.569Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (6): id=14434; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14435; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14436; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=2827; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=2828; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2829; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025093; VIN=MA3AVC41S00339502; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 063

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E26095
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179256
Variant: typo (FERMETUR -> FERMEUTR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez ANTENNE FERMEUTR CENTRALE pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 2788
- Référence DB: 37175M55R00
- Désignation française (designation2): ANTENNE FERMETUR CENTRALE
- Désignation OEM (designation): ANTENNA ASSY,KLS INSIDE
- Search description: ANTENNE FERMETUR CENTRALE ; ANTENNA ASSY,KLS INSIDE
- Public price TTC: 99.866 TND (raw DB=99.86584)
- Wholesale/pre-tax price HT: 83.921 TND (raw DB=83.92086999999999; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10044; reference=37175M55R00; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:38.381Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (4): id=16250; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16251; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3892; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3893; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=2223; referenceNo=37175M55R00; referenceType=3.0 | id=2224; referenceNo=37175M55R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0179256; VIN=MBHCZC63S00E26095; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 064

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589009
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189145
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de BOULON DE TRAIN AR pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3987
- Référence DB: 46223M72R00
- Désignation française (designation2): BOULON DE TRAIN AR
- Désignation OEM (designation): BOLT RR TRAILING
- Search description: BOULON DE TRAIN AR ; BOLT RR TRAILING
- Public price TTC: 76.674 TND (raw DB=76.67408)
- Wholesale/pre-tax price HT: 64.432 TND (raw DB=64.432; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11190; reference=46223M72R00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:40.194Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (7): id=18291; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=18292; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=18293; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=18294; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=5094; modelName=AON312; typeCode=AON312-TYPE1 | id=5095; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5096; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189145; VIN=MBHCZF63S00589009; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 065

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG529363
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204668
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez protection anti-projection porte av d pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7168
- Référence DB: 77510M74T00-5PK
- Désignation française (designation2): PROTECTION ANTI-PROJECTION PORTE AV D
- Désignation OEM (designation): GUARD ASSY,FR DOOR SPLASH,R
- Search description: PROTECTION ANTI-PROJECTION PORTE AV D ; GUARD ASSY,FR DOOR SPLASH,R
- Public price TTC: 220.591 TND (raw DB=220.59149)
- Wholesale/pre-tax price HT: 185.371 TND (raw DB=185.371; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3905; reference=77510M74T00-5PK; totalQuantity=7; stockDisponible=0; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:51.818Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (2): id=22745; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=22746; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204668; VIN=MBHKWDA3SSG529363; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 066

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00451981
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113761
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez JOINT COLONE DE DIRECTION pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 4090
- Référence DB: 48451M52R00
- Désignation française (designation2): JOINT COLONE DE DIRECTION
- Désignation OEM (designation): PACKING,STRG GEAR
- Search description: JOINT COLONE DE DIRECTION ; PACKING,STRG GEAR
- Public price TTC: 30.212 TND (raw DB=30.21216)
- Wholesale/pre-tax price HT: 25.388 TND (raw DB=25.38837; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11289; reference=48451M52R00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:46.926Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (6): id=18409; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18410; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18411; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5169; modelName=AON312; typeCode=AON312-TYPE1 | id=5170; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5171; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113761; VIN=MA3BNC22S00451981; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 067

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG526856
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204669
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez capteur vitesse roue ar pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 4500
- Référence DB: 56310M55T00
- Désignation française (designation2): CAPTEUR VITESSE ROUE AR
- Désignation OEM (designation): SENSOR ,RR WHEEL
- Search description: CAPTEUR VITESSE ROUE AR ; SENSOR ,RR WHEEL
- Public price TTC: 146.979 TND (raw DB=146.97928)
- Wholesale/pre-tax price HT: 123.512 TND (raw DB=123.512; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11695; reference=56310M55T00; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:42.002Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (3): id=19133; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=19134; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=19135; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204669; VIN=MBHKWDA3SSG526856; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 068

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448689
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019750
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CONDUITE, CANALISATION D'HUILE pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1077
- Référence DB: 16140-69GE2-000
- Désignation française (designation2): CONDUITE, CANALISATION D'HUILE
- Désignation OEM (designation): PIPE,OIL GALLERY
- Search description: CONDUITE, CANALISATION D'HUILE ; PIPE,OIL GALLERY
- Public price TTC: 151.072 TND (raw DB=151.07169)
- Wholesale/pre-tax price HT: 126.951 TND (raw DB=126.951; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=545; reference=16140-69GE2-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.338Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=2034; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=975; referenceNo=16140-69GE2-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019750; VIN=TSMLYD21S00448689; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 069

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767456
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092418
Variant: typo (POIGNEE -> POIGENE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez JOINT POIGENE EXT PORTE pour ma CELERIO BVA ?

**DB facts for comparison (do not paste)**

- Part DB id: 7708
- Référence DB: 82815M75J00
- Désignation française (designation2): JOINT POIGNEE EXT PORTE
- Désignation OEM (designation): CUSHION,SIDE DOOR OUT
- Search description: JOINT POIGNEE EXT PORTE ; CUSHION,SIDE DOOR OUT
- Public price TTC: 2.588 TND (raw DB=2.58825)
- Wholesale/pre-tax price HT: 2.175 TND (raw DB=2.175; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4194; reference=82815M75J00; totalQuantity=13; stockDisponible=13; stockConsolide=13; statut=Disponible; updatedAt=2026-09-20T19:01:47.452Z
- Availability rule: stockConsolide >= 2; actual quantity=13; expected=available
- Fitment rows (3): id=8243; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=8244; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=8245; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=5941; referenceNo=82815M75J00; referenceType=3.0 | id=5942; referenceNo=82815M75J00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092418; VIN=MA3KFC42S00767456; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 070

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3STG620521
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE2
Vehicle number (DB cross-check only): VN0215940
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) lel FRONX. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2833
- Référence DB: 37373M55T00
- Désignation française (designation2): BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD)
- Désignation OEM (designation): SWITCH ASSY,HEAD UP DISPLAY
- Search description: BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) ; SWITCH ASSY,HEAD UP DISPLAY
- Public price TTC: 88.050 TND (raw DB=88.05048)
- Wholesale/pre-tax price HT: 73.992 TND (raw DB=73.992; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10088; reference=37373M55T00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.237Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=16366; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=16367; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3965; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0215940; VIN=MBHKWDA3STG620521; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE2

## Case 071

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E25083
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179254
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de VERRE COMBINÉ D'INSTRUMENT pour une NEW SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2265
- Référence DB: 34105M52R10
- Désignation française (designation2): VERRE COMBINÉ D'INSTRUMENT
- Désignation OEM (designation): VISOR, SPEEDOMETER
- Search description: VERRE COMBINÉ D'INSTRUMENT ; VISOR, SPEEDOMETER
- Public price TTC: 154.144 TND (raw DB=154.14427)
- Wholesale/pre-tax price HT: 129.533 TND (raw DB=129.533; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1116; reference=34105M52R10; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.506Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=15518; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1
- Alternate/item reference rows (1): id=1804; referenceNo=34105M52R10; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0179254; VIN=MBHCZC63S00E25083; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 072

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche RESERVOIR HUILE BV pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1650
- Référence DB: 2290TM66RE0
- Désignation française (designation2): RESERVOIR HUILE BV
- Désignation OEM (designation): TANK SET, OIL
- Search description: RESERVOIR HUILE BV ; TANK SET, OIL
- Public price TTC: 292.700 TND (raw DB=292.69954)
- Wholesale/pre-tax price HT: 245.966 TND (raw DB=245.966; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8985; reference=2290TM66RE0; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:52.105Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (3): id=14154; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14155; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2659; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 073

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E25662
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180838
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche SUPPORT TABLETTE AR G pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 8896
- Référence DB: 88917M54P00
- Désignation française (designation2): SUPPORT TABLETTE AR G
- Désignation OEM (designation): .HOLDER, REAR PARCEL LH
- Search description: SUPPORT TABLETTE AR G ; .HOLDER, REAR PARCEL LH
- Public price TTC: 6.677 TND (raw DB=6.67709)
- Wholesale/pre-tax price HT: 5.611 TND (raw DB=5.611; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15817; reference=88917M54P00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:54.293Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (10): id=25122; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25123; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25124; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25125; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=25126; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=25127; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=9200; modelName=AON312; typeCode=AON312-TYPE1 | id=9201; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9202; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9203; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180838; VIN=MBHCZC63S00E25662; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 074

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340078
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025083
Variant: exact (no typo possible)
Generated category: PR

**UI prompt**

Je cherche CACHE CABLE FREIN MAIN pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 919
- Référence DB: 14232M79M00
- Désignation française (designation2): CACHE CABLE FREIN MAIN
- Désignation OEM (designation): INSULATOR, PARKING CABLE HEAT
- Search description: CACHE CABLE FREIN MAIN ; INSULATOR, PARKING CABLE HEAT
- Public price TTC: 75.973 TND (raw DB=75.9733)
- Wholesale/pre-tax price HT: 63.843 TND (raw DB=63.84311; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8324; reference=14232M79M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:40.900Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=1830; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1831; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1832; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025083; VIN=MA3AVC41S00340078; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 075

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376226
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119774
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CACHE TROISIEME FEU DE STOP lel SPRESSO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2512
- Référence DB: 35821M62S00
- Désignation française (designation2): CACHE TROISIEME FEU DE STOP
- Désignation OEM (designation): COVER HIGH MOUNT STOP LAMP
- Search description: CACHE TROISIEME FEU DE STOP ; COVER HIGH MOUNT STOP LAMP
- Public price TTC: 21.460 TND (raw DB=21.46046)
- Wholesale/pre-tax price HT: 18.034 TND (raw DB=18.034; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1265; reference=35821M62S00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.365Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=3611; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=2005; referenceNo=35821M62S00; referenceType=3.0 | id=2006; referenceNo=35821M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119774; VIN=MA3RFL41S00376226; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 076

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454938
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015742
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez BOULON CARTER pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 354
- Référence DB: 11518-63J10-000
- Désignation française (designation2): BOULON CARTER
- Désignation OEM (designation): PLUG,OILDRAIN
- Search description: BOULON CARTER ; PLUG,OILDRAIN
- Public price TTC: 9.048 TND (raw DB=9.04757)
- Wholesale/pre-tax price HT: 7.603 TND (raw DB=7.603; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=180; reference=11518-63J10-000; totalQuantity=1750; stockDisponible=1750; stockConsolide=1750; statut=Disponible; updatedAt=2026-09-20T19:01:40.171Z
- Availability rule: stockConsolide >= 2; actual quantity=1750; expected=available
- Fitment rows (6): id=10785; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10786; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=755; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=756; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=757; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=758; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=327; referenceNo=11518-63J10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0015742; VIN=MA3KFC42S00454938; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 077

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D93701
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018270
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de BUSE D'AIR pour une SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6700
- Référence DB: 73640M74L00-5PK
- Désignation française (designation2): BUSE D'AIR
- Désignation OEM (designation): LOUVER SIDE VENT LH
- Search description: BUSE D'AIR ; LOUVER SIDE VENT LH
- Public price TTC: 58.026 TND (raw DB=58.02559)
- Wholesale/pre-tax price HT: 48.761 TND (raw DB=48.761; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3661; reference=73640M74L00-5PK; totalQuantity=7; stockDisponible=7; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:40.409Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (1): id=7377; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=5274; referenceNo=73640M74L00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018270; VIN=MA3GZC62S00D93701; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 078

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589110
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189179
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez bras essuie glace av pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3036
- Référence DB: 38330M55R00
- Désignation française (designation2): BRAS ESSUIE GLACE AV
- Désignation OEM (designation): ARM ASSY, FR WIPER ASST
- Search description: BRAS ESSUIE GLACE AV ; ARM ASSY, FR WIPER ASST
- Public price TTC: 60.745 TND (raw DB=60.74474)
- Wholesale/pre-tax price HT: 51.046 TND (raw DB=51.046; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1579; reference=38330M55R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.376Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=16769; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16770; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189179; VIN=MBHCZF63S00589110; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 079

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513244
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189303
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez harness assy,main pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2592
- Référence DB: 36601M82RB0
- Désignation française (designation2): HARNESS ASSY,MAIN
- Désignation OEM (designation): HARNESS ASSY,MAIN
- Search description: HARNESS ASSY,MAIN
- Public price TTC: 2596.037 TND (raw DB=2596.03736)
- Wholesale/pre-tax price HT: 2181.544 TND (raw DB=2181.544; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9859; reference=36601M82RB0; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:46.406Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=3731; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3732; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189303; VIN=MA3AVC71S00513244; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 080

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442470
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018417
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de PARE HUILE SOUPAPE pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 117
- Référence DB: 09289-05012-000
- Désignation française (designation2): PARE HUILE SOUPAPE
- Désignation OEM (designation): SEAL,OIL(5.5X11.5X9.3)
- Search description: PARE HUILE SOUPAPE ; SEAL,OIL(5.5X11.5X9.3)
- Public price TTC: 32.742 TND (raw DB=32.74166)
- Wholesale/pre-tax price HT: 27.514 TND (raw DB=27.514; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7581; reference=09289-05012-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:50.113Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=344; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018417; VIN=TSMLYD21S00442470; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 081

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG514481
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203487
Variant: typo (PROJECTION -> PRJOECTION)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez PROTECTION ANTI-PRJOECTION PORTE AR G pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 7182
- Référence DB: 77540M74T00-5PK
- Désignation française (designation2): PROTECTION ANTI-PROJECTION PORTE AR G
- Désignation OEM (designation): GUARD ASSY,RR DOOR SPLASH,L
- Search description: PROTECTION ANTI-PROJECTION PORTE AR G ; GUARD ASSY,RR DOOR SPLASH,L
- Public price TTC: 323.975 TND (raw DB=323.97512)
- Wholesale/pre-tax price HT: 272.248 TND (raw DB=272.248; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14180; reference=77540M74T00-5PK; totalQuantity=6; stockDisponible=0; stockConsolide=6; statut=Disponible; updatedAt=2026-09-20T19:01:51.816Z
- Availability rule: stockConsolide >= 2; actual quantity=6; expected=available
- Fitment rows (2): id=22759; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=22760; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203487; VIN=MBHKWDA3SSG514481; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 082

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426259
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110392
Variant: exact
Generated category: PR

**UI prompt**

Je cherche COUVERCLE COLONNE DE DIRECTION pour ma ERTIGA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4091
- Référence DB: 48452M52R50
- Désignation française (designation2): COUVERCLE COLONNE DE DIRECTION
- Désignation OEM (designation): COVER,STRG GEAR
- Search description: COUVERCLE COLONNE DE DIRECTION ; COVER,STRG GEAR
- Public price TTC: 18.193 TND (raw DB=18.19316)
- Wholesale/pre-tax price HT: 15.288 TND (raw DB=15.28837; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11290; reference=48452M52R50; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:43.709Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (6): id=18415; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18416; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18417; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5172; modelName=AON312; typeCode=AON312-TYPE1 | id=5173; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5174; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0110392; VIN=MA3BNC22S00426259; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 083

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426631
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110400
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez COMMANDE CLEF FERMETURE CENTRALE pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 2800
- Référence DB: 37182M55R10
- Désignation française (designation2): COMMANDE CLEF FERMETURE CENTRALE
- Désignation OEM (designation): .SWITCH ASSY, TRANSMITTER
- Search description: COMMANDE CLEF FERMETURE CENTRALE ; .SWITCH ASSY, TRANSMITTER
- Public price TTC: 165.771 TND (raw DB=165.77057)
- Wholesale/pre-tax price HT: 139.303 TND (raw DB=139.303; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1429; reference=37182M55R10; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.105Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (5): id=16271; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16272; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=16273; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=3903; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3904; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (1): id=2236; referenceNo=37182M55R10; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110400; VIN=MA3BNC22S00426631; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 084

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00411353
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109244
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb COUVERCLE LATERAL BOITE DE VITESSES lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1841
- Référence DB: 24730M86J00
- Désignation française (designation2): COUVERCLE LATERAL BOITE DE VITESSES
- Désignation OEM (designation): COVER COMP,TRANSAXLE SIDE
- Search description: COUVERCLE LATERAL BOITE DE VITESSES ; COVER COMP,TRANSAXLE SIDE
- Public price TTC: 108.877 TND (raw DB=108.87667)
- Wholesale/pre-tax price HT: 91.493 TND (raw DB=91.49299999999999; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9167; reference=24730M86J00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.727Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (8): id=14759; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14760; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14761; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3039; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3040; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3041; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3042; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3043; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0109244; VIN=MA3BNC22S00411353; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 085

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448391
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019747
Variant: typo (POIGNEE -> POGINEE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez COUVERCLE POGINEE  DE PORTE AV G pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 7685
- Référence DB: 82813-57L00-ZNL
- Désignation française (designation2): COUVERCLE POIGNEE  DE PORTE AV G
- Désignation OEM (designation): CAP, FRONT DOOR OUT LH (WHITE)
- Search description: COUVERCLE POIGNEE DE PORTE AV G ; CAP, FRONT DOOR OUT LH (WHITE)
- Public price TTC: 126.020 TND (raw DB=126.01981)
- Wholesale/pre-tax price HT: 105.899 TND (raw DB=105.899; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4177; reference=82813-57L00-ZNL; totalQuantity=23; stockDisponible=23; stockConsolide=23; statut=Disponible; updatedAt=2026-09-20T19:01:43.731Z
- Availability rule: stockConsolide >= 2; actual quantity=23; expected=available
- Fitment rows (2): id=8209; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8210; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5920; referenceNo=82813-57L00-ZNL0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019747; VIN=TSMLYD21S00448391; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 086

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378429
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119790
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de CLAVETTE SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une SPRESSO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1832
- Référence DB: 24471-60B00-000
- Désignation française (designation2): CLAVETTE SYNCHRO BASSES VITESSES 1ERE ET 2EME
- Désignation OEM (designation): KEY,LOW SPEED SYNCHRONIZER
- Search description: CLAVETTE SYNCHRO BASSES VITESSES 1ERE ET 2EME ; KEY,LOW SPEED SYNCHRONIZER
- Public price TTC: 16.251 TND (raw DB=16.25064)
- Wholesale/pre-tax price HT: 13.656 TND (raw DB=13.656; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9158; reference=24471-60B00-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:42.675Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=14722; modelName=A6G415-TYPE1; typeCode=A6G415-TYPE1 | id=3015; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3016; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119790; VIN=MA3RFL41S00378429; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 087

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00765217
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089473
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR SORTIE EVAPORATEUR pour ma CELERIO BVA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 9043
- Référence DB: 95541M76M00
- Désignation française (designation2): CAPTEUR SORTIE EVAPORATEUR
- Désignation OEM (designation): SENSOR,EVAP OUTLET
- Search description: CAPTEUR SORTIE EVAPORATEUR ; SENSOR,EVAP OUTLET
- Public price TTC: 97.774 TND (raw DB=97.77397)
- Wholesale/pre-tax price HT: 82.163 TND (raw DB=82.163; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4870; reference=95541M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.961Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=9367; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=9368; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9369; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=9370; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9371; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=6820; referenceNo=95541M76M00; referenceType=3.0 | id=6821; referenceNo=95541M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089473; VIN=MA3KFC42S00765217; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 088

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454862
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014469
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez PARE A HUILE DIFFERENTIEL G pour une CELERIO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1950
- Référence DB: 27432M74L00
- Désignation française (designation2): PARE A HUILE DIFFERENTIEL G
- Désignation OEM (designation): SEAL, DIFFERENTIAL SIDE LH
- Search description: PARE A HUILE DIFFERENTIEL G ; SEAL, DIFFERENTIAL SIDE LH
- Public price TTC: 54.036 TND (raw DB=54.03552)
- Wholesale/pre-tax price HT: 45.408 TND (raw DB=45.408; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=985; reference=27432M74L00; totalQuantity=13; stockDisponible=9; stockConsolide=13; statut=Disponible; updatedAt=2026-09-20T19:01:49.746Z
- Availability rule: stockConsolide >= 2; actual quantity=13; expected=available
- Fitment rows (4): id=3147; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3148; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3149; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3150; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=1601; referenceNo=27432M74L00; referenceType=3.0 | id=1602; referenceNo=27432M74L00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014469; VIN=MA3KFC42S00454862; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 089

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA654766
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045575
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache sous capot d pour baleno ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6555
- Référence DB: 72471M68P00
- Désignation française (designation2): CACHE SOUS CAPOT D
- Désignation OEM (designation): COVER, FR FENDER UPPER RH
- Search description: CACHE SOUS CAPOT D ; COVER, FR FENDER UPPER RH
- Public price TTC: 13.122 TND (raw DB=13.12213)
- Wholesale/pre-tax price HT: 11.027 TND (raw DB=11.027; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3580; reference=72471M68P00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:41.308Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=21740; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=21741; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (2): id=5158; referenceNo=72471M68P00; referenceType=3.0 | id=5159; referenceNo=72471M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045575; VIN=MA3WB52S0LA654766; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 090

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764297
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089521
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb RESSORT EMBRAYAGE lel CELERIO BVA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1683
- Référence DB: 23269M76M00
- Désignation française (designation2): RESSORT EMBRAYAGE
- Désignation OEM (designation): SPRING,RELEASE SHAFT RETURN
- Search description: RESSORT EMBRAYAGE ; SPRING,RELEASE SHAFT RETURN
- Public price TTC: 20.605 TND (raw DB=20.60485)
- Wholesale/pre-tax price HT: 17.315 TND (raw DB=17.315; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9019; reference=23269M76M00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:52.152Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (5): id=2686; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2687; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2688; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2689; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2690; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089521; VIN=MA3KFC42S00764297; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 091

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447130
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019730
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez FEU DE JOUR LED G pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 2584
- Référence DB: 36584-54P00-000
- Désignation française (designation2): FEU DE JOUR LED G
- Désignation OEM (designation): LAMP, DRL AP
- Search description: FEU DE JOUR LED G ; LAMP, DRL AP
- Public price TTC: 1561.270 TND (raw DB=1561.27048)
- Wholesale/pre-tax price HT: 1311.992 TND (raw DB=1311.992; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1307; reference=36584-54P00-000; totalQuantity=16; stockDisponible=14; stockConsolide=16; statut=Disponible; updatedAt=2026-09-20T19:01:45.220Z
- Availability rule: stockConsolide >= 2; actual quantity=16; expected=available
- Fitment rows (2): id=3725; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3726; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2066; referenceNo=36584-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019730; VIN=TSMLYD21S00447130; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 092

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654720
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045586
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de RESSORT MACHOIRE DE FREIN pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4289
- Référence DB: 53243M75J00
- Désignation française (designation2): RESSORT MACHOIRE DE FREIN
- Désignation OEM (designation): SPRING,HOLD DOWN
- Search description: RESSORT MACHOIRE DE FREIN ; SPRING,HOLD DOWN
- Public price TTC: 3.873 TND (raw DB=3.87345)
- Wholesale/pre-tax price HT: 3.255 TND (raw DB=3.255; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2254; reference=53243M75J00; totalQuantity=12; stockDisponible=12; stockConsolide=12; statut=Disponible; updatedAt=2026-09-20T19:01:52.153Z
- Availability rule: stockConsolide >= 2; actual quantity=12; expected=available
- Fitment rows (8): id=18845; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=18846; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=18847; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=5428; modelName=AON312; typeCode=AON312-TYPE1 | id=5429; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5430; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5431; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=5432; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=3454; referenceNo=53243M75J00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045586; VIN=MA3WB52S9LA654720; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 093

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00357869
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0115887
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb RENFORT CHARNIERE AR D lel SPRESSO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5030
- Référence DB: 63240M62S00
- Désignation française (designation2): RENFORT CHARNIERE AR D
- Désignation OEM (designation): REINF,RR DR HINGE,R
- Search description: RENFORT CHARNIERE AR D ; REINF,RR DR HINGE,R
- Public price TTC: 1259.811 TND (raw DB=1259.81135)
- Wholesale/pre-tax price HT: 1058.665 TND (raw DB=1058.665; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2684; reference=63240M62S00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:52.006Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=6079; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0115887; VIN=MA3RFL41S00357869; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 094

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454830
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015745
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ECROU HEXAGONAL M8 pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 25
- Référence DB: 08310M0008A
- Désignation française (designation2): ECROU HEXAGONAL M8
- Désignation OEM (designation): NUT
- Search description: ECROU HEXAGONAL M8 ; NUT
- Public price TTC: 14.117 TND (raw DB=14.11697)
- Wholesale/pre-tax price HT: 11.863 TND (raw DB=11.863; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7492; reference=08310M0008A; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:44.563Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (17): id=9704; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=9705; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=9706; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=9707; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=9708; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9709; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=9710; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=9711; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=100; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=101; modelName=AON312; typeCode=AON312-TYPE1 | id=102; modelName=APQ415; typeCode=APQ415-TYPE2 | id=103; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=104; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=105; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=106; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=107; modelName=AXM310; typeCode=AXM310-TYPE1 | id=108; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015745; VIN=MA3KFC42S00454830; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 095

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767390
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092410
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez demarreur pop pour celerio bva ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2112
- Référence DB: 31100M76M10
- Désignation française (designation2): DEMARREUR POP
- Désignation OEM (designation): MOTOR ASSY,STARTING
- Search description: DEMARREUR POP ; MOTOR ASSY,STARTING
- Public price TTC: 727.457 TND (raw DB=727.45652)
- Wholesale/pre-tax price HT: 611.308 TND (raw DB=611.308; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9408; reference=31100M76M10; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.959Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=3278; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=1698; referenceNo=31100M76M10; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092410; VIN=MA3KFC42S00767390; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 096

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2KA599123
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037465
Variant: exact (no typo possible)
Generated category: MÉCANIQUE

**UI prompt**

Je cherche MANCHON DE SYNCHRONISATION BAS VITESSE pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1806
- Référence DB: 24421M76M00
- Désignation française (designation2): MANCHON DE SYNCHRONISATION BAS VITESSE
- Désignation OEM (designation): SLEEVE,LOW SPEED SYNC
- Search description: MANCHON DE SYNCHRONISATION BAS VITESSE ; SLEEVE,LOW SPEED SYNC
- Public price TTC: 368.543 TND (raw DB=368.543)
- Wholesale/pre-tax price HT: 309.700 TND (raw DB=309.7; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9134; reference=24421M76M00; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:48.412Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (8): id=14602; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14603; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=2940; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2941; modelName=AON312; typeCode=AON312-TYPE1 | id=2942; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2943; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2944; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2945; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0037465; VIN=MA3WB52S2KA599123; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 097

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D95699
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018511
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche FENETRE D'AIR pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6694
- Référence DB: 73630M74L00-5PK
- Désignation française (designation2): FENETRE D'AIR
- Désignation OEM (designation): LOUVER SIDE VENT RH
- Search description: FENETRE D'AIR ; LOUVER SIDE VENT RH
- Public price TTC: 105.598 TND (raw DB=105.59822)
- Wholesale/pre-tax price HT: 88.738 TND (raw DB=88.738; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3656; reference=73630M74L00-5PK; totalQuantity=7; stockDisponible=7; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:45.042Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (1): id=7368; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=5269; referenceNo=73630M74L00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018511; VIN=MA3GZC62S00D95699; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 098

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E28878
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180824
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de MECANISME LEVE-VITRE AR pour une NEW SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 7842
- Référence DB: 83501M55R01
- Désignation française (designation2): MECANISME LEVE-VITRE AR
- Désignation OEM (designation): REGULATOR ASSY REAR WIND
- Search description: MECANISME LEVE-VITRE AR ; REGULATOR ASSY REAR WIND
- Public price TTC: 126.827 TND (raw DB=126.82663)
- Wholesale/pre-tax price HT: 106.577 TND (raw DB=106.577; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4266; reference=83501M55R01; totalQuantity=2; stockDisponible=1; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:48.529Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (3): id=23694; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=23695; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=8368; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180824; VIN=MBHCZC63S00E28878; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 099

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454965
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015750
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CABLE ABS AR G lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4514
- Référence DB: 56315M76M00
- Désignation française (designation2): CABLE ABS AR G
- Désignation OEM (designation): HARNESS COMPRR WHEEL SENSOR
- Search description: CABLE ABS AR G ; HARNESS COMPRR WHEEL SENSOR
- Public price TTC: 111.248 TND (raw DB=111.24834)
- Wholesale/pre-tax price HT: 93.486 TND (raw DB=93.486; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2381; reference=56315M76M00; totalQuantity=4; stockDisponible=2; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:40.515Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (2): id=5634; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5635; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3675; referenceNo=56315M76M00; referenceType=3.0 | id=3676; referenceNo=56315M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0015750; VIN=MA3KFC42S00454965; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 100

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760238
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089243
Variant: typo (SOUPAPE -> SOUUPAPE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez GUIDE SOUUPAPE pour ma CELERIO BVA ?

**DB facts for comparison (do not paste)**

- Part DB id: 254
- Référence DB: 11115M74L00-001
- Désignation française (designation2): GUIDE SOUPAPE
- Désignation OEM (designation): GUIDE VALVE
- Search description: GUIDE SOUPAPE ; GUIDE VALVE
- Public price TTC: 6.613 TND (raw DB=6.61283)
- Wholesale/pre-tax price HT: 5.557 TND (raw DB=5.557; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=126; reference=11115M74L00-001; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:46.403Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (17): id=10532; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10533; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10534; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10535; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=10536; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10537; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10538; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=10539; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=599; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=600; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=601; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=602; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=603; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=604; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=605; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=606; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=607; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=229; referenceNo=11115M74L00-001; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089243; VIN=MA3KFC42S00760238; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 101

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588989
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192982
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez AERATEUR LATERAL D pour une DZIRE ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6691
- Référence DB: 73630M55R00-5PK
- Désignation française (designation2): AERATEUR LATERAL D
- Désignation OEM (designation): LOUVER, SIDE VENT RH
- Search description: AERATEUR LATERAL D ; LOUVER, SIDE VENT RH
- Public price TTC: 104.344 TND (raw DB=104.34396)
- Wholesale/pre-tax price HT: 87.684 TND (raw DB=87.684; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3653; reference=73630M55R00-5PK; totalQuantity=11; stockDisponible=10; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:37.747Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (2): id=21978; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=21979; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5266; referenceNo=73630M55R00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0192982; VIN=MBHCZF63S00588989; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 102

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588696
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189161
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez butee laterale tablette ar pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 8891
- Référence DB: 88914M68K00
- Désignation française (designation2): BUTEE LATERALE TABLETTE AR
- Désignation OEM (designation): CUSHION,REAR PARCEL SIDE
- Search description: BUTEE LATERALE TABLETTE AR ; CUSHION,REAR PARCEL SIDE
- Public price TTC: 4.474 TND (raw DB=4.4744)
- Wholesale/pre-tax price HT: 3.760 TND (raw DB=3.76; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15812; reference=88914M68K00; totalQuantity=20; stockDisponible=0; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:40.489Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (8): id=25108; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25109; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25110; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9191; modelName=AON312; typeCode=AON312-TYPE1 | id=9192; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9193; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9194; modelName=AXM310; typeCode=AXM310-TYPE2 | id=9195; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189161; VIN=MBHCZF63S00588696; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 103

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00474308
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022183
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez BOULON ANTI BROUILLARD pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2811
- Référence DB: 37270-68L00-000
- Désignation française (designation2): BOULON ANTI BROUILLARD
- Désignation OEM (designation): SWITCH, FRONT FOG AZG416
- Search description: BOULON ANTI BROUILLARD ; SWITCH, FRONT FOG AZG416
- Public price TTC: 182.208 TND (raw DB=182.20804)
- Wholesale/pre-tax price HT: 153.116 TND (raw DB=153.116; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1438; reference=37270-68L00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.170Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3921; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3922; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=2247; referenceNo=37270-68L00; referenceType=3.0 | id=2248; referenceNo=37270-68L00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022183; VIN=TSMLYE21S00474308; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 104

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00411476
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0106757
Variant: typo (RENIFLARD -> RENFILARD)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez DURITE RENFILARD BOITE DE VITESSES pour ma ERTIGA ?

**DB facts for comparison (do not paste)**

- Part DB id: 1855
- Référence DB: 24825M74LA0
- Désignation française (designation2): DURITE RENIFLARD BOITE DE VITESSES
- Désignation OEM (designation): HOSE, BREATHER
- Search description: DURITE RENIFLARD BOITE DE VITESSES ; HOSE, BREATHER
- Public price TTC: 13.045 TND (raw DB=13.04478)
- Wholesale/pre-tax price HT: 10.962 TND (raw DB=10.962; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9180; reference=24825M74LA0; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.498Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (8): id=14828; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14829; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14830; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3070; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3071; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3072; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3073; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3074; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0106757; VIN=MA3BNC22S00411476; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 105

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG519625
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203609
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb SUPPORT CENTRAL OPTIQUE D lel FRONX. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4807
- Référence DB: 58672M74T00
- Désignation française (designation2): SUPPORT CENTRAL OPTIQUE D
- Désignation OEM (designation): BRACKET,HEAD LAMP CTR,R
- Search description: SUPPORT CENTRAL OPTIQUE D ; BRACKET,HEAD LAMP CTR,R
- Public price TTC: 41.943 TND (raw DB=41.94274)
- Wholesale/pre-tax price HT: 35.246 TND (raw DB=35.246; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11989; reference=58672M74T00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:53.644Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=19566; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=19567; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203609; VIN=MBHKWDA3SSG519625; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 106

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E30805
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180836
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez bras essuie glace pour new swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3015
- Référence DB: 38310M55R00
- Désignation française (designation2): BRAS ESSUIE GLACE
- Désignation OEM (designation): ARM ASSY, FR WIPER DRVR
- Search description: BRAS ESSUIE GLACE ; ARM ASSY, FR WIPER DRVR
- Public price TTC: 52.042 TND (raw DB=52.04227)
- Wholesale/pre-tax price HT: 43.733 TND (raw DB=43.733; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1565; reference=38310M55R00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.374Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=16730; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16731; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180836; VIN=MBHCZC63S00E30805; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 107

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D14654
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0008592
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de AGRAFE FEU AR pour une SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2337
- Référence DB: 35153M75L00
- Désignation française (designation2): AGRAFE FEU AR
- Désignation OEM (designation): GROMMET,REARCOMBLAMP
- Search description: AGRAFE FEU AR ; GROMMET,REARCOMBLAMP
- Public price TTC: 41.063 TND (raw DB=41.06333)
- Wholesale/pre-tax price HT: 34.507 TND (raw DB=34.507; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1160; reference=35153M75L00; totalQuantity=20; stockDisponible=0; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:37.794Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (9): id=15621; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=15622; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3487; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3488; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3489; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3490; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3491; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3492; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=3493; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=1869; referenceNo=35153M75L00; referenceType=3.0 | id=1870; referenceNo=35153M75L00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0008592; VIN=MA3GZC62S00D14654; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 108

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446226
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018457
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche BOULON POULIE TENDEUR pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4163
- Référence DB: 49161-60B10-000
- Désignation française (designation2): BOULON POULIE TENDEUR
- Désignation OEM (designation): BOLT,BELT TENSIO
- Search description: BOULON POULIE TENDEUR ; BOLT,BELT TENSIO
- Public price TTC: 86.603 TND (raw DB=86.60344)
- Wholesale/pre-tax price HT: 72.776 TND (raw DB=72.776; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2180; reference=49161-60B10-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.221Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=5254; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3330; referenceNo=49161-60B10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018457; VIN=TSMLYD21S00446226; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 109

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7LA643036
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042755
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de EXTENSION, TABLEAU DE BORD AR D pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4800
- Référence DB: 58640M68P00
- Désignation française (designation2): EXTENSION, TABLEAU DE BORD AR D
- Désignation OEM (designation): EXTENSION,DASH LOWER OUTER,R
- Search description: EXTENSION, TABLEAU DE BORD AR D ; EXTENSION,DASH LOWER OUTER,R
- Public price TTC: 208.739 TND (raw DB=208.73909)
- Wholesale/pre-tax price HT: 175.411 TND (raw DB=175.411; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2558; reference=58640M68P00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.948Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (6): id=19538; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19539; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=19540; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=19541; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=19542; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=19543; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (2): id=3925; referenceNo=58640M68P00; referenceType=3.0 | id=3926; referenceNo=58640M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042755; VIN=MA3WB52S7LA643036; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 110

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449104
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019542
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez engrenage differentiel pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1926
- Référence DB: 27300-54P10-000
- Désignation française (designation2): ENGRENAGE DIFFERENTIEL
- Désignation OEM (designation): GEAR ASSY,DIFFERENTIAL
- Search description: ENGRENAGE DIFFERENTIEL ; GEAR ASSY,DIFFERENTIAL
- Public price TTC: 11049.281 TND (raw DB=11049.2809)
- Wholesale/pre-tax price HT: 9285.110 TND (raw DB=9285.110000000001; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9239; reference=27300-54P10-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:44.658Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=3137; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0019542; VIN=TSMLYE21S00449104; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 111

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378433
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119780
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb TROISIEME FEU DE STOP lel SPRESSO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2511
- Référence DB: 35820M66L01
- Désignation française (designation2): TROISIEME FEU DE STOP
- Désignation OEM (designation): LAMP UNIT HIGH MOUNT STOP
- Search description: TROISIEME FEU DE STOP ; LAMP UNIT HIGH MOUNT STOP
- Public price TTC: 84.971 TND (raw DB=84.97076)
- Wholesale/pre-tax price HT: 71.404 TND (raw DB=71.404; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1264; reference=35820M66L01; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:55.199Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (1): id=3610; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=2003; referenceNo=35820M66L01; referenceType=3.0 | id=2004; referenceNo=35820M66L01-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119780; VIN=MA3RFL41S00378433; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 112

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S5LA642810
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042746
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PLATE OIL PAN BAFFLE pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 365
- Référence DB: 11541M73K10
- Désignation française (designation2): PLATE OIL PAN BAFFLE
- Désignation OEM (designation): PLATE OIL PAN BAFFLE
- Search description: PLATE OIL PAN BAFFLE
- Public price TTC: 62.765 TND (raw DB=62.76536)
- Wholesale/pre-tax price HT: 52.744 TND (raw DB=52.744; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=188; reference=11541M73K10; totalQuantity=4; stockDisponible=3; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:50.730Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (11): id=10856; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10857; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10858; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10859; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10860; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=10861; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=799; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=800; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=801; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=802; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=803; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=338; referenceNo=11541M73K10; referenceType=3.0 | id=339; referenceNo=11541M73K10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042746; VIN=MA3WB52S5LA642810; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 113

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364749
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101070
Variant: typo (CARTOUCHE -> CARTOOUCHE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez SUPPORT CARTOOUCHE pour ma ERTIGA ?

**DB facts for comparison (do not paste)**

- Part DB id: 1528
- Référence DB: 18570M73R00
- Désignation française (designation2): SUPPORT CARTOUCHE
- Désignation OEM (designation): BRACKET,CANISTER
- Search description: SUPPORT CARTOUCHE ; BRACKET,CANISTER
- Public price TTC: 45.616 TND (raw DB=45.61627)
- Wholesale/pre-tax price HT: 38.333 TND (raw DB=38.333; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=831; reference=18570M73R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:53.638Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=2573; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2574; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=1351; referenceNo=18570M73R00; referenceType=3.0 | id=1352; referenceNo=18570M73R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0101070; VIN=MA3BNC22S00364749; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 114

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E22325
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179253
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez Engrenage de 5e vitesse de l’arbre primaire pour une NEW SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1723
- Référence DB: 24114-52R80-000
- Désignation française (designation2): Engrenage de 5e vitesse de l’arbre primaire
- Désignation OEM (designation): GEAR,INPUT SHAFT 5TH
- Search description: Engrenage de 5e vitesse de l’arbre primaire ; GEAR,INPUT SHAFT 5TH
- Public price TTC: 376.210 TND (raw DB=376.20972)
- Wholesale/pre-tax price HT: 316.143 TND (raw DB=316.142625; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=922; reference=24114-52R80-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.656Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=14280; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14281; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0179253; VIN=MBHCZC63S00E22325; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 115

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA642950
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045230
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de AIR BAG SIEGE AV G pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 8848
- Référence DB: 85850M68PA0
- Désignation française (designation2): AIR BAG SIEGE AV G
- Désignation OEM (designation): MODULE ASSY, SIDE AIR BAG LH
- Search description: AIR BAG SIEGE AV G ; MODULE ASSY, SIDE AIR BAG LH
- Public price TTC: 964.021 TND (raw DB=964.02138)
- Wholesale/pre-tax price HT: 810.102 TND (raw DB=810.102; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4778; reference=85850M68PA0; totalQuantity=6; stockDisponible=6; stockConsolide=6; statut=Disponible; updatedAt=2026-09-20T19:01:38.085Z
- Availability rule: stockConsolide >= 2; actual quantity=6; expected=available
- Fitment rows (2): id=25044; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=25045; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=6690; referenceNo=85850M68PA0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045230; VIN=MA3WB52SXLA642950; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 116

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378452
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0123418
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche POULIE TENDEUR COURROIE pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1237
- Référence DB: 17530M62S00
- Désignation française (designation2): POULIE TENDEUR COURROIE
- Désignation OEM (designation): PULLY BELT TENSIONER
- Search description: POULIE TENDEUR COURROIE ; PULLY BELT TENSIONER
- Public price TTC: 209.276 TND (raw DB=209.27578)
- Wholesale/pre-tax price HT: 175.862 TND (raw DB=175.862; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8594; reference=17530M62S00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:51.461Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=2208; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0123418; VIN=MA3RFL41S00378452; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 117

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449941
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019584
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez seuil de porte ar d pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6893
- Référence DB: 76170-54P00-5PK
- Désignation française (designation2): SEUIL DE PORTE AR D
- Désignation OEM (designation): SCUFF, SIDE SILL REAR RH
- Search description: SEUIL DE PORTE AR D ; SCUFF, SIDE SILL REAR RH
- Public price TTC: 343.678 TND (raw DB=343.67795)
- Wholesale/pre-tax price HT: 288.805 TND (raw DB=288.805; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3763; reference=76170-54P00-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:53.136Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=7526; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7527; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=5395; referenceNo=76170-54P00-5PK; referenceType=3.0 | id=5396; referenceNo=76170-54P00-5PK0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019584; VIN=TSMLYE21S00449941; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 118

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442228
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018414
Variant: typo (VITESSES -> VITEESSES)
Generated category: PR

**UI prompt**

Bonjour, vous avez SOUFFLET, LEVIER DE VITEESSES pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 2009
- Référence DB: 28130-61M00-5PK
- Désignation française (designation2): SOUFFLET, LEVIER DE VITESSES
- Désignation OEM (designation): BOOT,SHIFT LEVER(BLACK)
- Search description: SOUFFLET, LEVIER DE VITESSES ; BOOT,SHIFT LEVER(BLACK)
- Public price TTC: 305.499 TND (raw DB=305.49918)
- Wholesale/pre-tax price HT: 256.722 TND (raw DB=256.722; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9313; reference=28130-61M00-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:53.367Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=3231; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018414; VIN=TSMLYD21S00442228; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 119

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454899
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015755
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb PONT REDRESSEUR ALTERNATEUR lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2142
- Référence DB: 31621M76M00
- Désignation française (designation2): PONT REDRESSEUR ALTERNATEUR
- Désignation OEM (designation): RECTIFIER BRIDGE ASSY
- Search description: PONT REDRESSEUR ALTERNATEUR ; RECTIFIER BRIDGE ASSY
- Public price TTC: 451.274 TND (raw DB=451.27418)
- Wholesale/pre-tax price HT: 379.222 TND (raw DB=379.222; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1051; reference=31621M76M00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:51.162Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=3310; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3311; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=1721; referenceNo=31621M76M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0015755; VIN=MA3KFC42S00454899; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 120

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG526965
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204637
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez GOUJON DE MOYEU DE ROUE pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3748
- Référence DB: 43423M62S00
- Désignation française (designation2): GOUJON DE MOYEU DE ROUE
- Désignation OEM (designation): BOLT,FRONT HUB
- Search description: GOUJON DE MOYEU DE ROUE ; BOLT,FRONT HUB
- Public price TTC: 9.837 TND (raw DB=9.83654)
- Wholesale/pre-tax price HT: 8.266 TND (raw DB=8.266; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10956; reference=43423M62S00; totalQuantity=20; stockDisponible=10; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:46.313Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (8): id=17947; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=17948; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=17949; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=17950; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=4893; modelName=AON312; typeCode=AON312-TYPE1 | id=4894; modelName=APQ415; typeCode=APQ415-TYPE2 | id=4895; modelName=AXM310; typeCode=AXM310-TYPE1 | id=4896; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204637; VIN=MBHKWDA3SSG526965; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 121

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00428735
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0009875
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez poignee malle pour celerio ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7757
- Référence DB: 82841M82G02
- Désignation française (designation2): POIGNEE MALLE
- Désignation OEM (designation): HANDLE,BACK DOOR INNER
- Search description: POIGNEE MALLE ; HANDLE,BACK DOOR INNER
- Public price TTC: 9.751 TND (raw DB=9.75086)
- Wholesale/pre-tax price HT: 8.194 TND (raw DB=8.194; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4228; reference=82841M82G02; totalQuantity=26; stockDisponible=26; stockConsolide=26; statut=Disponible; updatedAt=2026-09-20T19:01:50.946Z
- Availability rule: stockConsolide >= 2; actual quantity=26; expected=available
- Fitment rows (7): id=8296; modelName=AON312; typeCode=AON312-TYPE1 | id=8297; modelName=APQ415; typeCode=APQ415-TYPE2 | id=8298; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=8299; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=8300; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=8301; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=8302; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=5979; referenceNo=82841M82G02; referenceType=3.0 | id=5980; referenceNo=82841M82G02-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0009875; VIN=MA3KFC42S00428735; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 122

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588993
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189120
Variant: typo (CONDUCTEUR -> CONDUTEUR)
Generated category: PR

**UI prompt**

Bonjour, vous avez CADRE SIEGE CONDUTEUR pour ma DZIRE ?

**DB facts for comparison (do not paste)**

- Part DB id: 8837
- Référence DB: 85603M68P42
- Désignation française (designation2): CADRE SIEGE CONDUCTEUR
- Désignation OEM (designation): FRAME ASSY,FR CUSH,L
- Search description: CADRE SIEGE CONDUCTEUR ; FRAME ASSY,FR CUSH,L
- Public price TTC: 446.412 TND (raw DB=446.41184)
- Wholesale/pre-tax price HT: 375.136 TND (raw DB=375.136; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15776; reference=85603M68P42; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:41.389Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=25008; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25009; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189120; VIN=MBHCZF63S00588993; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 123

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CABLAGE CAPTEUR DE RECULE lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2683
- Référence DB: 36843M55R10
- Désignation française (designation2): CABLAGE CAPTEUR DE RECULE
- Désignation OEM (designation): WIRE, RR PARK SNSR
- Search description: CABLAGE CAPTEUR DE RECULE ; WIRE, RR PARK SNSR
- Public price TTC: 92.865 TND (raw DB=92.86522)
- Wholesale/pre-tax price HT: 78.038 TND (raw DB=78.038; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1362; reference=36843M55R10; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.503Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=16112; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16113; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=2144; referenceNo=36843M55R10; referenceType=3.0 | id=2145; referenceNo=36843M55R10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 124

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426194
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110403
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche KIT CABLES SELECCTEUR DE VITESSES BVA pour ma ERTIGA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2024
- Référence DB: 28210M68P12
- Désignation française (designation2): KIT CABLES SELECCTEUR DE VITESSES BVA
- Désignation OEM (designation): CABLE ASSY,SELECT
- Search description: KIT CABLES SELECCTEUR DE VITESSES BVA ; CABLE ASSY,SELECT
- Public price TTC: 217.601 TND (raw DB=217.60102)
- Wholesale/pre-tax price HT: 182.858 TND (raw DB=182.858; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1012; reference=28210M68P12; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:47.706Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=15161; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=3246; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3247; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=1646; referenceNo=28210M68P12; referenceType=3.0 | id=1647; referenceNo=28210M68P12-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110403; VIN=MA3BNC22S00426194; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 125

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449533
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019565
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SUPPORT CANISTER pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1526
- Référence DB: 18570-61M00-000
- Désignation française (designation2): SUPPORT CANISTER
- Désignation OEM (designation): BRACKET,CANISTER, AKK416
- Search description: SUPPORT CANISTER ; BRACKET,CANISTER, AKK416
- Public price TTC: 181.162 TND (raw DB=181.16203)
- Wholesale/pre-tax price HT: 152.237 TND (raw DB=152.237; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=830; reference=18570-61M00-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:53.629Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=2569; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=2570; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1350; referenceNo=18570-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019565; VIN=TSMLYE21S00449533; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 126

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378418
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119728
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de ÉGRATIGNER LE SEUIL AV G pour une SPRESSO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6889
- Référence DB: 76161M62S00-5PK
- Désignation française (designation2): ÉGRATIGNER LE SEUIL AV G
- Désignation OEM (designation): SCUFF SIDE SILL FR LH (BLACK)
- Search description: ÉGRATIGNER LE SEUIL AV G ; SCUFF SIDE SILL FR LH (BLACK)
- Public price TTC: 8.616 TND (raw DB=8.6156)
- Wholesale/pre-tax price HT: 7.240 TND (raw DB=7.24; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3759; reference=76161M62S00-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.572Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=7522; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119728; VIN=MA3RFL41S00378418; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 127

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00361771
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119793
Variant: typo (FAISCEAU -> FAIISCEAU)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez FAIISCEAU INTERIEUR pour ma SPRESSO ?

**DB facts for comparison (do not paste)**

- Part DB id: 2596
- Référence DB: 36602M62S20
- Désignation française (designation2): FAISCEAU INTERIEUR
- Désignation OEM (designation): HARNESS ASSY,INSTPN
- Search description: FAISCEAU INTERIEUR ; HARNESS ASSY,INSTPN
- Public price TTC: 1907.411 TND (raw DB=1907.41054)
- Wholesale/pre-tax price HT: 1602.866 TND (raw DB=1602.866; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9863; reference=36602M62S20; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:45.012Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=3734; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119793; VIN=MA3RFL41S00361771; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 128

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767398
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0094932
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CABLE FREIN DE STAIONNEMENT D pour une CELERIO BVA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4313
- Référence DB: 54401M76M00
- Désignation française (designation2): CABLE FREIN DE STAIONNEMENT D
- Désignation OEM (designation): CABLE, PARKING BRAKE RH
- Search description: CABLE FREIN DE STAIONNEMENT D ; CABLE, PARKING BRAKE RH
- Public price TTC: 133.003 TND (raw DB=133.00273)
- Wholesale/pre-tax price HT: 111.767 TND (raw DB=111.767; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2267; reference=54401M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.604Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5452; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5453; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3477; referenceNo=54401M76M00; referenceType=3.0 | id=3478; referenceNo=54401M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0094932; VIN=MA3KFC42S00767398; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 129

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340062
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025113
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de AILE TABLEAU DE BORD pour une CIAZ, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4883
- Référence DB: 59280M79M51
- Désignation française (designation2): AILE TABLEAU DE BORD
- Désignation OEM (designation): PANEL,DASH SIDE,L
- Search description: AILE TABLEAU DE BORD ; PANEL,DASH SIDE,L
- Public price TTC: 249.231 TND (raw DB=249.23122)
- Wholesale/pre-tax price HT: 209.438 TND (raw DB=209.438; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2608; reference=59280M79M51; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:38.040Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (3): id=5941; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5942; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5943; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=3997; referenceNo=59280M79M51; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025113; VIN=MA3AVC41S00340062; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 130

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S8KA599479
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037472
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez panneau dey ar ext d pour baleno ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5232
- Référence DB: 64130M68P11
- Désignation française (designation2): PANNEAU DEY AR EXT D
- Désignation OEM (designation): PANEL, RR LAMP HOUSE OTR RH
- Search description: PANNEAU DEY AR EXT D ; PANEL, RR LAMP HOUSE OTR RH
- Public price TTC: 198.604 TND (raw DB=198.60436)
- Wholesale/pre-tax price HT: 166.894 TND (raw DB=166.89442; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12370; reference=64130M68P11; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:37.324Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=20167; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=20168; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0037472; VIN=MA3WB52S8KA599479; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 131

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00406231
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0004336
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb ACTUATEUR ABS lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4444
- Référence DB: 56110M76M81
- Désignation française (designation2): ACTUATEUR ABS
- Désignation OEM (designation): ACTUATOR S/ASSY,ABS
- Search description: ACTUATEUR ABS ; ACTUATOR S/ASSY,ABS
- Public price TTC: 2927.737 TND (raw DB=2927.73677)
- Wholesale/pre-tax price HT: 2460.283 TND (raw DB=2460.283; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2346; reference=56110M76M81; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:37.553Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5576; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5577; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3615; referenceNo=56110M76M81; referenceType=3.0 | id=3616; referenceNo=56110M76M81-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0004336; VIN=MA3KFC42S00406231; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 132

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764211
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089454
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PLAQUE GUIDE SELECTEUR DE VITESSES AGS pour ma CELERIO BVA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2016
- Référence DB: 28152M76MP0
- Désignation française (designation2): PLAQUE GUIDE SELECTEUR DE VITESSES AGS
- Désignation OEM (designation): PLATE,GUIDE
- Search description: PLAQUE GUIDE SELECTEUR DE VITESSES AGS ; PLATE,GUIDE
- Public price TTC: 31.360 TND (raw DB=31.36007)
- Wholesale/pre-tax price HT: 26.353 TND (raw DB=26.353; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1007; reference=28152M76MP0; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:50.691Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3236; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3237; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=1639; referenceNo=28152M76MP0; referenceType=3.0 | id=1640; referenceNo=28152M76MP0-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089454; VIN=MA3KFC42S00764211; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 133

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339698
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025112
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche RENFORT CROCHET REMORQUAGE AR pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4973
- Référence DB: 61550M79M00
- Désignation française (designation2): RENFORT CROCHET REMORQUAGE AR
- Désignation OEM (designation): MEMBER COMP,TOWING HOOK REAR
- Search description: RENFORT CROCHET REMORQUAGE AR ; MEMBER COMP,TOWING HOOK REAR
- Public price TTC: 460.873 TND (raw DB=460.87272)
- Wholesale/pre-tax price HT: 387.288 TND (raw DB=387.288; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12132; reference=61550M79M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:52.021Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=6026; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6027; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6028; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025112; VIN=MA3AVC41S00339698; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 134

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez cache ext siege conducteur pour swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 8840
- Référence DB: 85711M62R00-5PK
- Désignation française (designation2): CACHE EXT SIEGE CONDUCTEUR
- Désignation OEM (designation): KNOB,RCLNG,L(BLACK)
- Search description: CACHE EXT SIEGE CONDUCTEUR ; KNOB,RCLNG,L(BLACK)
- Public price TTC: 113.190 TND (raw DB=113.19042)
- Wholesale/pre-tax price HT: 95.118 TND (raw DB=95.11799999999999; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15779; reference=85711M62R00-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:40.979Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (7): id=25014; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25015; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25016; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=9142; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9143; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=9144; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9145; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 135

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG503729
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203502
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CONTACTEUR DE FEU DE RECUL pour une FRONX, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2871
- Référence DB: 37610M68K01
- Désignation française (designation2): CONTACTEUR DE FEU DE RECUL
- Désignation OEM (designation): SWITCH ASSY,BACK UP LAMP
- Search description: CONTACTEUR DE FEU DE RECUL ; SWITCH ASSY,BACK UP LAMP
- Public price TTC: 207.393 TND (raw DB=207.39265)
- Wholesale/pre-tax price HT: 174.280 TND (raw DB=174.27954; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10126; reference=37610M68K01; totalQuantity=3; stockDisponible=2; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:43.342Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (3): id=16437; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=16438; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=4011; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203502; VIN=MBHKWDA3SSG503729; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 136

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588602
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189148
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez COUPELLE INF DE RESSORT A BOUDIN AV pour une DZIRE ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 3476
- Référence DB: 41212M52R00
- Désignation française (designation2): COUPELLE INF DE RESSORT A BOUDIN AV
- Désignation OEM (designation): SEAT, FRONT SPRING LOWER
- Search description: COUPELLE INF DE RESSORT A BOUDIN AV ; SEAT, FRONT SPRING LOWER
- Public price TTC: 28.817 TND (raw DB=28.81704)
- Wholesale/pre-tax price HT: 24.216 TND (raw DB=24.216; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10696; reference=41212M52R00; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:43.475Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (8): id=17491; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17492; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=17493; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=17494; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=17495; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=4616; modelName=AON312; typeCode=AON312-TYPE1 | id=4617; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4618; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189148; VIN=MBHCZF63S00588602; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 137

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG501151
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203531
Variant: typo (MOUSSTACHE -> MOUSSACHE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez JOINT MOUSSACHE AR pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 6398
- Référence DB: 72362M55T00
- Désignation française (designation2): JOINT MOUSSTACHE AR
- Désignation OEM (designation): SEAL,HOOD REAR
- Search description: JOINT MOUSSTACHE AR ; SEAL,HOOD REAR
- Public price TTC: 53.244 TND (raw DB=53.24417)
- Wholesale/pre-tax price HT: 44.743 TND (raw DB=44.743; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13422; reference=72362M55T00; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:47.389Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (3): id=21486; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=21487; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21488; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203531; VIN=MBHKWDA3SSG501151; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 138

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E23177
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179255
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BLOC DE CHAUFFAGE lel NEW SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6765
- Référence DB: 74110M55RG0
- Désignation française (designation2): BLOC DE CHAUFFAGE
- Désignation OEM (designation): CASE ASSY,HEATER
- Search description: BLOC DE CHAUFFAGE ; CASE ASSY,HEATER
- Public price TTC: 975.191 TND (raw DB=975.19072)
- Wholesale/pre-tax price HT: 819.488 TND (raw DB=819.4880000000001; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13780; reference=74110M55RG0; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.543Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (6): id=22103; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22104; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=22105; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=22106; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=7444; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7445; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0179255; VIN=MBHCZC63S00E23177; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 139

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588703
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192970
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb BOUTON DE FEUX DE DETRESSE AVEC TEMOIN D’ALARME lel DZIRE. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2849
- Référence DB: 37430M74L10-5PK
- Désignation française (designation2): BOUTON DE FEUX DE DETRESSE AVEC TEMOIN D’ALARME
- Désignation OEM (designation): SWITCH ASSY HAZARD SECURITY
- Search description: BOUTON DE FEUX DE DETRESSE AVEC TEMOIN D’ALARME ; SWITCH ASSY HAZARD SECURITY
- Public price TTC: 20.305 TND (raw DB=20.30497)
- Wholesale/pre-tax price HT: 17.063 TND (raw DB=17.063; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1463; reference=37430M74L10-5PK; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.242Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (5): id=16389; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16390; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3978; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3979; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3980; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0192970; VIN=MBHCZF63S00588703; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 140

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454981
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015751
Variant: typo (RESERVOIR -> RESEROVIR)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez JOINT TORIQUE RESEROVIR D'HUILE BOITE AGS pour ma CELERIO ?

**DB facts for comparison (do not paste)**

- Part DB id: 1653
- Référence DB: 22914M76ME0
- Désignation française (designation2): JOINT TORIQUE RESERVOIR D'HUILE BOITE AGS
- Désignation OEM (designation): ORING OIL TANK
- Search description: JOINT TORIQUE RESERVOIR D'HUILE BOITE AGS ; ORING OIL TANK
- Public price TTC: 28.409 TND (raw DB=28.40887)
- Wholesale/pre-tax price HT: 23.873 TND (raw DB=23.873; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=894; reference=22914M76ME0; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:47.537Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (5): id=14160; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14161; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2663; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2664; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2665; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015751; VIN=MA3KFC42S00454981; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 141

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447717
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019738
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de VIS DE FIXATION M6 × 16 MM pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 47
- Référence DB: 09128-06090-000
- Désignation française (designation2): VIS DE FIXATION M6 × 16 MM
- Désignation OEM (designation): SCREW(6X16)
- Search description: VIS DE FIXATION M6 × 16 MM ; SCREW(6X16)
- Public price TTC: 16.654 TND (raw DB=16.65405)
- Wholesale/pre-tax price HT: 13.995 TND (raw DB=13.995; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=29; reference=09128-06090-000; totalQuantity=49; stockDisponible=49; stockConsolide=49; statut=Disponible; updatedAt=2026-09-20T19:01:55.540Z
- Availability rule: stockConsolide >= 2; actual quantity=49; expected=available
- Fitment rows (3): id=9829; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=176; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=177; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=55; referenceNo=09128-06090-000; referenceType=3.0 | id=56; referenceNo=09128-06090-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019738; VIN=TSMLYD21S00447717; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 142

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E26180
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180821
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez filtre chauffage pour new swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6792
- Référence DB: 74176M55R00
- Désignation française (designation2): FILTRE CHAUFFAGE
- Désignation OEM (designation): DOOR ASSY
- Search description: FILTRE CHAUFFAGE ; DOOR ASSY
- Public price TTC: 251.737 TND (raw DB=251.73736)
- Wholesale/pre-tax price HT: 211.544 TND (raw DB=211.544; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13797; reference=74176M55R00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:45.494Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=22136; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22137; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180821; VIN=MBHCZC63S00E26180; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 143

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767426
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092413
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CACHE CAUSSE BATTRIE pour ma CELERIO BVA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2620
- Référence DB: 36694M68K10
- Désignation française (designation2): CACHE CAUSSE BATTRIE
- Désignation OEM (designation): COVER BTRY TERMINAL
- Search description: CACHE CAUSSE BATTRIE ; COVER BTRY TERMINAL
- Public price TTC: 22.167 TND (raw DB=22.16732)
- Wholesale/pre-tax price HT: 18.628 TND (raw DB=18.628; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1322; reference=36694M68K10; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:40.908Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (16): id=16024; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=16025; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=16026; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16027; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=16028; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=16029; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=16030; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3756; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3757; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3758; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3759; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3760; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=3761; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3762; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3763; modelName=AXM310; typeCode=AXM310-TYPE1 | id=3764; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=2095; referenceNo=36694M68K10; referenceType=3.0 | id=2096; referenceNo=36694M68K10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092413; VIN=MA3KFC42S00767426; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 144

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455002
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015738
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CORP BOITE DE VITESSE pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1834
- Référence DB: 24711M76M00
- Désignation française (designation2): CORP BOITE DE VITESSE
- Désignation OEM (designation): CASE,TRANSAXLE R
- Search description: CORP BOITE DE VITESSE ; CASE,TRANSAXLE R
- Public price TTC: 1633.187 TND (raw DB=1633.18694)
- Wholesale/pre-tax price HT: 1372.426 TND (raw DB=1372.426; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9160; reference=24711M76M00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.395Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3023; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3024; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=1547; referenceNo=24711M76M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0015738; VIN=MA3KFC42S00455002; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 145

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG510160
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203604
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez balais essui glass ar pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3234
- Référence DB: 38823M55T00
- Désignation française (designation2): BALAIS ESSUI GLASS AR
- Désignation OEM (designation): BLADE ASSY,REAR WIPER
- Search description: BALAIS ESSUI GLASS AR ; BLADE ASSY,REAR WIPER
- Public price TTC: 89.357 TND (raw DB=89.3571)
- Wholesale/pre-tax price HT: 75.090 TND (raw DB=75.09; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1715; reference=38823M55T00; totalQuantity=11; stockDisponible=3; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:39.146Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (3): id=17127; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=17128; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=17129; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203604; VIN=MBHKWDA3SSG510160; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 146

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376234
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119784
Variant: exact (no typo possible)
Generated category: PR

**UI prompt**

Je cherche PLAQUE FREIN AR D pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4260
- Référence DB: 53101M62S00
- Désignation française (designation2): PLAQUE FREIN AR D
- Désignation OEM (designation): PLATE, RR BRAKE BACKING RH
- Search description: PLAQUE FREIN AR D ; PLATE, RR BRAKE BACKING RH
- Public price TTC: 161.988 TND (raw DB=161.98756)
- Wholesale/pre-tax price HT: 136.124 TND (raw DB=136.124; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2236; reference=53101M62S00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:50.689Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=5382; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119784; VIN=MA3RFL41S00376234; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 147

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339364
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025073
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche ANTI BROUILLARD AR pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2580
- Référence DB: 36570M79M00
- Désignation française (designation2): ANTI BROUILLARD AR
- Désignation OEM (designation): LAMP ASSY RR FOG
- Search description: ANTI BROUILLARD AR ; LAMP ASSY RR FOG
- Public price TTC: 117.332 TND (raw DB=117.33162)
- Wholesale/pre-tax price HT: 98.598 TND (raw DB=98.598; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1304; reference=36570M79M00; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:38.406Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (3): id=3720; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=3721; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3722; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=2063; referenceNo=36570M79M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025073; VIN=MA3AVC41S00339364; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 148

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426621
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110402
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez KIT SOUFFLET DE CARDAN COTE BOITE pour une ERTIGA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3868
- Référence DB: 44119M72R00
- Désignation française (designation2): KIT SOUFFLET DE CARDAN COTE BOITE
- Désignation OEM (designation): .BOOT SET, WHEEL SIDE
- Search description: KIT SOUFFLET DE CARDAN COTE BOITE ; .BOOT SET, WHEEL SIDE
- Public price TTC: 204.349 TND (raw DB=204.34918)
- Wholesale/pre-tax price HT: 171.722 TND (raw DB=171.722; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2022; reference=44119M72R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:47.802Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=4984; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4985; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=3075; referenceNo=44119M72R00; referenceType=3.0 | id=3076; referenceNo=44119M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110402; VIN=MA3BNC22S00426621; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 149

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb GARNITURE COUVERCLE DE CARBURANT lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 7062
- Référence DB: 77116M68P00
- Désignation française (designation2): GARNITURE COUVERCLE DE CARBURANT
- Désignation OEM (designation): CUSHION, FUEL FILLER DOOR
- Search description: GARNITURE COUVERCLE DE CARBURANT ; CUSHION, FUEL FILLER DOOR
- Public price TTC: 3.281 TND (raw DB=3.28083)
- Wholesale/pre-tax price HT: 2.757 TND (raw DB=2.757; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3843; reference=77116M68P00; totalQuantity=200; stockDisponible=200; stockConsolide=200; statut=Disponible; updatedAt=2026-09-20T19:01:45.918Z
- Availability rule: stockConsolide >= 2; actual quantity=200; expected=available
- Fitment rows (9): id=22564; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=22565; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=22566; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22567; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=22568; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=7699; modelName=AON312; typeCode=AON312-TYPE1 | id=7700; modelName=APQ415; typeCode=APQ415-TYPE2 | id=7701; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7702; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=5484; referenceNo=77116M68P00; referenceType=3.0 | id=5485; referenceNo=77116M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 150

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426374
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110394
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BAVETTE AV G pour une ERTIGA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6250
- Référence DB: 72211M72R00-ZAM
- Désignation française (designation2): BAVETTE AV G
- Désignation OEM (designation): FLAPMUD FRONTL
- Search description: BAVETTE AV G ; FLAPMUD FRONTL
- Public price TTC: 35.543 TND (raw DB=35.54292)
- Wholesale/pre-tax price HT: 29.868 TND (raw DB=29.868; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3387; reference=72211M72R00-ZAM; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.450Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=6923; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=6924; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0110394; VIN=MA3BNC22S00426374; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 151

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00765292
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089279
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez SENSOR ASSY,CLUTCH SPEED pour une CELERIO BVA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 3258
- Référence DB: 38888M76M10
- Désignation française (designation2): SENSOR ASSY,CLUTCH SPEED
- Désignation OEM (designation): SENSOR ASSY,CLUTCH SPEED
- Search description: SENSOR ASSY,CLUTCH SPEED
- Public price TTC: 363.638 TND (raw DB=363.63782)
- Wholesale/pre-tax price HT: 305.578 TND (raw DB=305.578; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1728; reference=38888M76M10; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:52.801Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (6): id=17192; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17193; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=4440; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=4441; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=4442; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=4443; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (2): id=2648; referenceNo=38888M76M10; referenceType=3.0 | id=2649; referenceNo=38888M76M10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089279; VIN=MA3KFC42S00765292; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 152

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376245
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119745
Variant: typo (SYNCHRO -> SYNNCHRO)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez ANNEAU DE SYNNCHRO 2ÈME VITESSE pour ma SPRESSO ?

**DB facts for comparison (do not paste)**

- Part DB id: 1810
- Référence DB: 24430M74L00
- Désignation française (designation2): ANNEAU DE SYNCHRO 2ÈME VITESSE
- Désignation OEM (designation): RING ASSY,2ND GEAR SYNC
- Search description: ANNEAU DE SYNCHRO 2ÈME VITESSE ; RING ASSY,2ND GEAR SYNC
- Public price TTC: 512.158 TND (raw DB=512.15815)
- Wholesale/pre-tax price HT: 430.385 TND (raw DB=430.385; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9138; reference=24430M74L00; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:38.363Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (1): id=2963; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119745; VIN=MA3RFL41S00376245; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 153

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378435
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119729
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche CHARNIERE DE PORTE AR INF BAS pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 5710
- Référence DB: 69440M66R00
- Désignation française (designation2): CHARNIERE DE PORTE AR INF BAS
- Désignation OEM (designation): HINGE, REAR DOOR LOWER LH
- Search description: CHARNIERE DE PORTE AR INF BAS ; HINGE, REAR DOOR LOWER LH
- Public price TTC: 59.654 TND (raw DB=59.65351)
- Wholesale/pre-tax price HT: 50.129 TND (raw DB=50.129; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3075; reference=69440M66R00; totalQuantity=5; stockDisponible=1; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:42.511Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (2): id=20737; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=6591; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=4580; referenceNo=69440M66R00; referenceType=3.0 | id=4581; referenceNo=69440M66R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119729; VIN=MA3RFL41S00378435; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 154

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA642911
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042756
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de COUVERCLE REGLAGE SIEGE CONDUCTEUR pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 8822
- Référence DB: 85242M68P00-5PK
- Désignation française (designation2): COUVERCLE REGLAGE SIEGE CONDUCTEUR
- Désignation OEM (designation): COVER,FR RCLNG INS LWR,L(BLACK)
- Search description: COUVERCLE REGLAGE SIEGE CONDUCTEUR ; COVER,FR RCLNG INS LWR,L(BLACK)
- Public price TTC: 20.718 TND (raw DB=20.7179)
- Wholesale/pre-tax price HT: 17.410 TND (raw DB=17.41; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15767; reference=85242M68P00-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.745Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (13): id=24982; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=24983; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=24984; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=24985; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=24986; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=24987; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=24988; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=9126; modelName=AON312; typeCode=AON312-TYPE1 | id=9127; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9128; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9129; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=9130; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9131; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042756; VIN=MA3WB52S0LA642911; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 155

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG501983
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203534
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb FEU DE JOUR COMBINE AV G lel FRONX. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2409
- Référence DB: 35602M74TA0
- Désignation française (designation2): FEU DE JOUR COMBINE AV G
- Désignation OEM (designation): LAMP ASSY,FRONT COMB,L
- Search description: FEU DE JOUR COMBINE AV G ; LAMP ASSY,FRONT COMB,L
- Public price TTC: 2418.045 TND (raw DB=2418.04549)
- Wholesale/pre-tax price HT: 2031.971 TND (raw DB=2031.971; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1201; reference=35602M74TA0; totalQuantity=24; stockDisponible=8; stockConsolide=24; statut=Disponible; updatedAt=2026-09-20T19:01:45.217Z
- Availability rule: stockConsolide >= 2; actual quantity=24; expected=available
- Fitment rows (2): id=15697; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=15698; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203534; VIN=MBHKWDA3SSG501983; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 156

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760345
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089251
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez manchon synchro hautes vitesse 3eme et 4eme pour celerio bva ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1807
- Référence DB: 24422M76M00
- Désignation française (designation2): MANCHON SYNCHRO HAUTES VITESSE 3EME ET 4EME
- Désignation OEM (designation): SLEEVE,HIGH SPEED SYNC
- Search description: MANCHON SYNCHRO HAUTES VITESSE 3EME ET 4EME ; SLEEVE,HIGH SPEED SYNC
- Public price TTC: 295.007 TND (raw DB=295.00695)
- Wholesale/pre-tax price HT: 247.905 TND (raw DB=247.905; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=945; reference=24422M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.413Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (10): id=14610; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14611; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14612; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14613; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2946; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2947; modelName=AON312; typeCode=AON312-TYPE1 | id=2948; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2949; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2950; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2951; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089251; VIN=MA3KFC42S00760345; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 157

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445533
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018449
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez renfort pare choc ar pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5514
- Référence DB: 65560-61MA1-000
- Désignation française (designation2): RENFORT PARE CHOC  AR
- Désignation OEM (designation): MEMBER, RR BUMPER
- Search description: RENFORT PARE CHOC AR ; MEMBER, RR BUMPER
- Public price TTC: 685.626 TND (raw DB=685.62564)
- Wholesale/pre-tax price HT: 576.156 TND (raw DB=576.1559999999999; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2964; reference=65560-61MA1-000; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:52.054Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (2): id=6387; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=6388; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=4407; referenceNo=65560-61MA1-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018449; VIN=TSMLYD21S00445533; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 158

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443939
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018436
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de JEU DE CALE ROULEMENT LAT DIFFERENTIEL pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1958
- Référence DB: 27453-78MT0-000
- Désignation française (designation2): JEU DE CALE ROULEMENT LAT DIFFERENTIEL
- Désignation OEM (designation): SHIM SET,DIFF SIDE BRG
- Search description: JEU DE CALE ROULEMENT LAT DIFFERENTIEL ; SHIM SET,DIFF SIDE BRG
- Public price TTC: 933.639 TND (raw DB=933.63949)
- Wholesale/pre-tax price HT: 784.571 TND (raw DB=784.571; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9266; reference=27453-78MT0-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:46.709Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=3164; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3165; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=3166; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018436; VIN=TSMLYD21S00443939; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 159

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445702
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018450
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb SWITCHER 4WD lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2937
- Référence DB: 37790-61M00-000
- Désignation française (designation2): SWITCHER 4WD
- Désignation OEM (designation): SWITCH,4WD SELECT AKK416
- Search description: SWITCHER 4WD ; SWITCH,4WD SELECT AKK416
- Public price TTC: 691.974 TND (raw DB=691.97429)
- Wholesale/pre-tax price HT: 581.491 TND (raw DB=581.491; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1516; reference=37790-61M00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.337Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=4086; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2369; referenceNo=37790-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018450; VIN=TSMLYD21S00445702; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 160

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D95510
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018508
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PARE A HUILE DIFFERENTIEL D pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1944
- Référence DB: 27431M74L00
- Désignation française (designation2): PARE A HUILE DIFFERENTIEL D
- Désignation OEM (designation): SEAL, DIFFERENTIAL SIDE RH
- Search description: PARE A HUILE DIFFERENTIEL D ; SEAL, DIFFERENTIAL SIDE RH
- Public price TTC: 65.307 TND (raw DB=65.3072)
- Wholesale/pre-tax price HT: 54.880 TND (raw DB=54.88; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=981; reference=27431M74L00; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:49.743Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (4): id=3138; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3139; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3140; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3141; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=1595; referenceNo=27431M74L00; referenceType=3.0 | id=1596; referenceNo=27431M74L00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018508; VIN=MA3GZC62S00D95510; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 161

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG531613
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204653
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez ANGLE PARE-CHOCS AR D pour une FRONX ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6209
- Référence DB: 71841M74T00-5PK
- Désignation française (designation2): ANGLE PARE-CHOCS AR D
- Désignation OEM (designation): BUMPER,REAR CORNER,R
- Search description: ANGLE PARE-CHOCS AR D ; BUMPER,REAR CORNER,R
- Public price TTC: 69.872 TND (raw DB=69.87204)
- Wholesale/pre-tax price HT: 58.716 TND (raw DB=58.716; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3366; reference=71841M74T00-5PK; totalQuantity=29; stockDisponible=0; stockConsolide=29; statut=Disponible; updatedAt=2026-09-20T19:01:38.359Z
- Availability rule: stockConsolide >= 2; actual quantity=29; expected=available
- Fitment rows (2): id=21228; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21229; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204653; VIN=MBHKWDA3SSG531613; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 162

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588053
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183642
Variant: typo (CENTRALE -> CENTALE)
Generated category: PR

**UI prompt**

Bonjour, vous avez BOITIER CONSOLE CENTALE pour ma DZIRE ?

**DB facts for comparison (do not paste)**

- Part DB id: 6848
- Référence DB: 75811M56R00-5PK
- Désignation française (designation2): BOITIER CONSOLE CENTRALE
- Désignation OEM (designation): BOX, FLOOR CONSOLE
- Search description: BOITIER CONSOLE CENTRALE ; BOX, FLOOR CONSOLE
- Public price TTC: 250.257 TND (raw DB=250.257)
- Wholesale/pre-tax price HT: 210.300 TND (raw DB=210.3; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13841; reference=75811M56R00-5PK; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.844Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22223; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22224; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0183642; VIN=MBHCZF63S00588053; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 163

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449580
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019568
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CACHE COSSE POSITIVE BATTERIE pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 2619
- Référence DB: 36694-66M00-000
- Désignation française (designation2): CACHE COSSE POSITIVE BATTERIE
- Désignation OEM (designation): COVER,BTRY TERMINAL AKK416
- Search description: CACHE COSSE POSITIVE BATTERIE ; COVER,BTRY TERMINAL AKK416
- Public price TTC: 100.747 TND (raw DB=100.74659)
- Wholesale/pre-tax price HT: 84.661 TND (raw DB=84.661; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1321; reference=36694-66M00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.929Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3754; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3755; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=2093; referenceNo=36694-66M00; referenceType=3.0 | id=2094; referenceNo=36694-66M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019568; VIN=TSMLYE21S00449580; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 164

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445869
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018452
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de CORPS FILTRE A HUILE pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1122
- Référence DB: 16531-69G20-000
- Désignation française (designation2): CORPS FILTRE A HUILE
- Désignation OEM (designation): CASE,OIL FILTER RW416
- Search description: CORPS FILTRE A HUILE ; CASE,OIL FILTER RW416
- Public price TTC: 371.241 TND (raw DB=371.24073)
- Wholesale/pre-tax price HT: 311.967 TND (raw DB=311.967; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=567; reference=16531-69G20-000; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:43.409Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (1): id=2076; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1008; referenceNo=16531-69G20-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018452; VIN=TSMLYD21S00445869; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 165

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471438
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022155
Variant: exact (no typo possible)
Generated category: CARROSSERIE

**UI prompt**

Je cherche CACHE CAPOT pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6522
- Référence DB: 72440-54P00-000
- Désignation française (designation2): CACHE CAPOT
- Désignation OEM (designation): SILENCER,FRONT HOOD APK416
- Search description: CACHE CAPOT ; SILENCER,FRONT HOOD APK416
- Public price TTC: 519.228 TND (raw DB=519.22794)
- Wholesale/pre-tax price HT: 436.326 TND (raw DB=436.326; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3563; reference=72440-54P00-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.904Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=7199; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7200; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=5136; referenceNo=72440-54P00; referenceType=3.0 | id=5137; referenceNo=72440-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022155; VIN=TSMLYE21S00471438; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 166

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522154
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204656
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez capuchon de verrouillage pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2020
- Référence DB: 28157M55T10-5PK
- Désignation française (designation2): CAPUCHON DE VERROUILLAGE
- Désignation OEM (designation): CAP,SHIFT LOCK RELEASE(BLACK)
- Search description: CAPUCHON DE VERROUILLAGE ; CAP,SHIFT LOCK RELEASE(BLACK)
- Public price TTC: 65.884 TND (raw DB=65.88435)
- Wholesale/pre-tax price HT: 55.365 TND (raw DB=55.365; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9323; reference=28157M55T10-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:42.035Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=15151; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=15152; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=15153; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204656; VIN=MBHKWDA3SSG522154; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 167

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448767
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019751
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche MOTEUR APPAREIL MONTE GLACE pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7871
- Référence DB: 83560-61M00-000
- Désignation française (designation2): MOTEUR APPAREIL MONTE GLACE
- Désignation OEM (designation): MOTOR ASSY, WINDOW RGLTR
- Search description: MOTEUR APPAREIL MONTE GLACE ; MOTOR ASSY, WINDOW RGLTR
- Public price TTC: 489.392 TND (raw DB=489.39226)
- Wholesale/pre-tax price HT: 411.254 TND (raw DB=411.254; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4282; reference=83560-61M00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.878Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=23731; modelName=A6G415-TYPE1; typeCode=A6G415-TYPE1 | id=8393; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8394; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=6060; referenceNo=83560-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019751; VIN=TSMLYD21S00448767; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 168

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00D99810
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0173531
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BOÎTIER GUIDE JOINT TORIQUE lel NEW SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1885
- Référence DB: 25574M76MF0
- Désignation française (designation2): BOÎTIER GUIDE JOINT TORIQUE
- Désignation OEM (designation): O-RING,GUIDE CASE
- Search description: BOÎTIER GUIDE JOINT TORIQUE ; O-RING,GUIDE CASE
- Public price TTC: 11.961 TND (raw DB=11.96069)
- Wholesale/pre-tax price HT: 10.051 TND (raw DB=10.051; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=961; reference=25574M76MF0; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.876Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=14891; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14892; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3101; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (2): id=1572; referenceNo=25574M76MF0; referenceType=3.0 | id=1573; referenceNo=25574M76MF0-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0173531; VIN=MBHCZC63S00D99810; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 169

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340086
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025115
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez passage de roue int d pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5052
- Référence DB: 63410M79M50
- Désignation française (designation2): PASSAGE DE ROUE INT D
- Désignation OEM (designation): PANEL,WHEEL HOUSE INNER,R
- Search description: PASSAGE DE ROUE INT D ; PANEL,WHEEL HOUSE INNER,R
- Public price TTC: 691.937 TND (raw DB=691.9374)
- Wholesale/pre-tax price HT: 581.460 TND (raw DB=581.46; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12202; reference=63410M79M50; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:50.306Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=6093; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6094; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6095; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025115; VIN=MA3AVC41S00340086; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 170

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E26731
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179261
Variant: exact (no typo possible)
Generated category: PR

**UI prompt**

Je cherche LEVIER FREIN A MAIN pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4299
- Référence DB: 54100M55R00-C48
- Désignation française (designation2): LEVIER FREIN A MAIN
- Désignation OEM (designation): LEVER ASSY  PARKING BRAK
- Search description: LEVIER FREIN A MAIN ; LEVER ASSY PARKING BRAK
- Public price TTC: 315.843 TND (raw DB=315.84266)
- Wholesale/pre-tax price HT: 265.414 TND (raw DB=265.414; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11491; reference=54100M55R00-C48; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:48.022Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=18870; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=18871; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=5444; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0179261; VIN=MBHCZC63S00E26731; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 171

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443505
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018433
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb FEU DE JOUR LED D lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2583
- Référence DB: 36583-54P00-000
- Désignation française (designation2): FEU DE JOUR LED D
- Désignation OEM (designation): LAMP ASSY, DRL RH
- Search description: FEU DE JOUR LED D ; LAMP ASSY, DRL RH
- Public price TTC: 1561.270 TND (raw DB=1561.27048)
- Wholesale/pre-tax price HT: 1311.992 TND (raw DB=1311.992; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1306; reference=36583-54P00-000; totalQuantity=10; stockDisponible=5; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:45.218Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=3723; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3724; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2065; referenceNo=36583-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018433; VIN=TSMLYD21S00443505; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 172

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340023
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025080
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche ENSEMBLE ANNEAU SYNCHRO BASSSES VITESSES 1ERE 2EME pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1811
- Référence DB: 24430M86J00
- Désignation française (designation2): ENSEMBLE ANNEAU SYNCHRO BASSSES VITESSES 1ERE 2EME
- Désignation OEM (designation): RING ASSY, LOW GEAR SYNC
- Search description: ENSEMBLE ANNEAU SYNCHRO BASSSES VITESSES 1ERE 2EME ; RING ASSY, LOW GEAR SYNC
- Public price TTC: 612.974 TND (raw DB=612.97376)
- Wholesale/pre-tax price HT: 515.104 TND (raw DB=515.104; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9139; reference=24430M86J00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.770Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=2964; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=2965; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2966; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025080; VIN=MA3AVC41S00340023; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 173

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455105
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014479
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez PION DE CENTRAGE DE CULASSE 13 × 18 MM pour une CELERIO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 22
- Référence DB: 04211M13189
- Désignation française (designation2): PION DE CENTRAGE DE CULASSE 13 × 18 MM
- Désignation OEM (designation): PIN,CYLINDER HEAD DOWEL
- Search description: PION DE CENTRAGE DE CULASSE 13 × 18 MM ; PIN,CYLINDER HEAD DOWEL
- Public price TTC: 2.654 TND (raw DB=2.6537)
- Wholesale/pre-tax price HT: 2.230 TND (raw DB=2.23; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=16; reference=04211M13189; totalQuantity=20; stockDisponible=6; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:50.527Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (20): id=9683; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=9684; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=9685; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=9686; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=9687; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9688; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=9689; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=9690; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=88; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=89; modelName=AON312; typeCode=AON312-TYPE1 | id=90; modelName=APQ415; typeCode=APQ415-TYPE2 | id=91; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=92; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=93; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=94; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=95; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=96; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=97; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=98; modelName=AXM310; typeCode=AXM310-TYPE1 | id=99; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0014479; VIN=MA3KFC42S00455105; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 174

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00324354
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0092578
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de FLASQUE DE FREIN AR D pour une ERTIGA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4263
- Référence DB: 53101M72R00
- Désignation française (designation2): FLASQUE DE FREIN AR D
- Désignation OEM (designation): PLATE, RR BRAKE BACKING RH
- Search description: FLASQUE DE FREIN AR D ; PLATE, RR BRAKE BACKING RH
- Public price TTC: 82.546 TND (raw DB=82.54554)
- Wholesale/pre-tax price HT: 69.366 TND (raw DB=69.366; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2239; reference=53101M72R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:45.580Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5386; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5387; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0092578; VIN=MA3BNC22S00324354; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 175

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb HARNESS ASSY, SOCKET lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 3362
- Référence DB: 39460M56R00
- Désignation française (designation2): HARNESS ASSY, SOCKET
- Désignation OEM (designation): HARNESS ASSY, SOCKET
- Search description: HARNESS ASSY, SOCKET
- Public price TTC: 103.219 TND (raw DB=103.21941)
- Wholesale/pre-tax price HT: 86.739 TND (raw DB=86.739; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1783; reference=39460M56R00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:46.405Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=17397; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17398; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=2732; referenceNo=39460M56R00; referenceType=3.0 | id=2733; referenceNo=39460M56R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 176

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448012
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019741
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez bouchon reservoir d'huile pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 4215
- Référence DB: 51290-54P00-000
- Désignation française (designation2): BOUCHON RESERVOIR D'HUILE
- Désignation OEM (designation): CAP,RESERVOIR APK416
- Search description: BOUCHON RESERVOIR D'HUILE ; CAP,RESERVOIR APK416
- Public price TTC: 113.054 TND (raw DB=113.05357)
- Wholesale/pre-tax price HT: 95.003 TND (raw DB=95.003; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2206; reference=51290-54P00-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:40.029Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=5321; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5322; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3365; referenceNo=51290-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019741; VIN=TSMLYD21S00448012; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 177

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG528422
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204665
Variant: typo (PROTECTEUR -> PROTECCTEUR)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez PROTECCTEUR AILE AV D pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 6368
- Référence DB: 72351M74T00
- Désignation française (designation2): PROTECTEUR AILE AV D
- Désignation OEM (designation): PAD,FRONT FENDER,R
- Search description: PROTECTEUR AILE AV D ; PAD,FRONT FENDER,R
- Public price TTC: 201.010 TND (raw DB=201.01004)
- Wholesale/pre-tax price HT: 168.916 TND (raw DB=168.916; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13391; reference=72351M74T00; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:51.773Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=21438; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21439; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204665; VIN=MBHKWDA3SSG528422; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 178

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654834
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045583
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR REFRIGERANT pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9044
- Référence DB: 95546M74L00
- Désignation française (designation2): CAPTEUR REFRIGERANT
- Désignation OEM (designation): SENSOR,REFRIGERANT PRESSU
- Search description: CAPTEUR REFRIGERANT ; SENSOR,REFRIGERANT PRESSU
- Public price TTC: 186.299 TND (raw DB=186.29926)
- Wholesale/pre-tax price HT: 156.554 TND (raw DB=156.554; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4871; reference=95546M74L00; totalQuantity=9; stockDisponible=9; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:41.951Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (12): id=25399; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=25400; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25401; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25402; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=9372; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9373; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9374; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=9375; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=9376; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=9377; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9378; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=9379; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=6822; referenceNo=95546M74L00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045583; VIN=MA3WB52S2LA654834; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 179

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454740
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014459
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PIPE HUILE FRIEN AV D pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4232
- Référence DB: 51430M76M00
- Désignation française (designation2): PIPE HUILE FRIEN AV D
- Désignation OEM (designation): PIPEHUTOFRBKHOSER
- Search description: PIPE HUILE FRIEN AV D ; PIPEHUTOFRBKHOSER
- Public price TTC: 49.935 TND (raw DB=49.93478)
- Wholesale/pre-tax price HT: 41.962 TND (raw DB=41.962; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2215; reference=51430M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:50.540Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5335; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5336; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3386; referenceNo=51430M76M00; referenceType=3.0 | id=3387; referenceNo=51430M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014459; VIN=MA3KFC42S00454740; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 180

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471723
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022159
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de COUVERCLE POIGNEE DE PORTE AV D pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 7686
- Référence DB: 82813-57L10-ZNL
- Désignation française (designation2): COUVERCLE POIGNEE DE PORTE AV D
- Désignation OEM (designation): CAP, FRONT DOOR OUT LH (WHITE)
- Search description: COUVERCLE POIGNEE DE PORTE AV D ; CAP, FRONT DOOR OUT LH (WHITE)
- Public price TTC: 126.020 TND (raw DB=126.01981)
- Wholesale/pre-tax price HT: 105.899 TND (raw DB=105.899; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4178; reference=82813-57L10-ZNL; totalQuantity=22; stockDisponible=22; stockConsolide=22; statut=Disponible; updatedAt=2026-09-20T19:01:43.736Z
- Availability rule: stockConsolide >= 2; actual quantity=22; expected=available
- Fitment rows (2): id=8211; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8212; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5921; referenceNo=82813-57L10-ZNL0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022159; VIN=TSMLYE21S00471723; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 181

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364690
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101065
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche FEU AR FIXE pour ma ERTIGA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2470
- Référence DB: 35701M72R00
- Désignation française (designation2): FEU AR FIXE
- Désignation OEM (designation): LAMP ASSY,TAIL,RH
- Search description: FEU AR FIXE ; LAMP ASSY,TAIL,RH
- Public price TTC: 127.159 TND (raw DB=127.15864)
- Wholesale/pre-tax price HT: 106.856 TND (raw DB=106.856; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9742; reference=35701M72R00; totalQuantity=7; stockDisponible=0; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:45.149Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (2): id=3574; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3575; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=1969; referenceNo=35701M72R00; referenceType=3.0 | id=1970; referenceNo=35701M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0101065; VIN=MA3BNC22S00364690; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 182

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445350
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018445
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de RESERVOIR DE LIQUIDE DE FREIN pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4204
- Référence DB: 51200-54P20-000
- Désignation française (designation2): RESERVOIR DE LIQUIDE DE FREIN
- Désignation OEM (designation): RESERVOIR,BRAKE MASTER APK416
- Search description: RESERVOIR DE LIQUIDE DE FREIN ; RESERVOIR,BRAKE MASTER APK416
- Public price TTC: 310.316 TND (raw DB=310.3163)
- Wholesale/pre-tax price HT: 260.770 TND (raw DB=260.77; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2198; reference=51200-54P20-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.095Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5299; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5300; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3354; referenceNo=51200-54P20-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018445; VIN=TSMLYD21S00445350; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 183

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587915
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192976
Variant: exact (no typo possible)
Generated category: CARROSSERIE

**UI prompt**

Je cherche CACHE BOX FRIEN MAN G pour ma DZIRE. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6853
- Référence DB: 75841M56R50-5PK
- Désignation française (designation2): CACHE BOX FRIEN MAN G
- Désignation OEM (designation): COVER,FLOOR CONSOLE SIDE ASST
- Search description: CACHE BOX FRIEN MAN G ; COVER,FLOOR CONSOLE SIDE ASST
- Public price TTC: 60.682 TND (raw DB=60.68167)
- Wholesale/pre-tax price HT: 50.993 TND (raw DB=50.993; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3739; reference=75841M56R50-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.895Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22232; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22233; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5365; referenceNo=75841M56R50-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0192976; VIN=MBHCZF63S00587915; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 184

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA642556
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042637
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez buzzer assy,kls pour baleno ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3191
- Référence DB: 38590-72M00-000
- Désignation française (designation2): BUZZER ASSY,KLS
- Désignation OEM (designation): BUZZER ASSY,KLS
- Search description: BUZZER ASSY,KLS
- Public price TTC: 254.033 TND (raw DB=254.03287)
- Wholesale/pre-tax price HT: 213.473 TND (raw DB=213.473; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1685; reference=38590-72M00-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.496Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (11): id=17049; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=17050; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=17051; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17052; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=4357; modelName=APQ415; typeCode=APQ415-TYPE2 | id=4358; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4359; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=4360; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=4361; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=4362; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=4363; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=2594; referenceNo=38590-72M00; referenceType=3.0 | id=2595; referenceNo=38590-72M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042637; VIN=MA3WB52S6LA642556; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 185

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587918
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183499
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb CUIRE LEVIER lel DZIRE. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2010
- Référence DB: 28130M55R00-5PK
- Désignation française (designation2): CUIRE LEVIER
- Désignation OEM (designation): BOOT, SHIFT LEVER
- Search description: CUIRE LEVIER ; BOOT, SHIFT LEVER
- Public price TTC: 88.992 TND (raw DB=88.99177)
- Wholesale/pre-tax price HT: 74.783 TND (raw DB=74.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9314; reference=28130M55R00-5PK; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.828Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=15136; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=15137; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=1636; referenceNo=28130M55R00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0183499; VIN=MBHCZF63S00587918; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 186

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SERRURE DE MALLE pour une SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 7620
- Référence DB: 82510M55R22
- Désignation française (designation2): SERRURE DE MALLE
- Désignation OEM (designation): LATCH ASSY,BACK DOOR
- Search description: SERRURE DE MALLE ; LATCH ASSY,BACK DOOR
- Public price TTC: 229.417 TND (raw DB=229.41653)
- Wholesale/pre-tax price HT: 192.787 TND (raw DB=192.787; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4139; reference=82510M55R22; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.895Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=23287; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=23288; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 187

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767296
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092419
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez faisceau instrument int pour celerio bva ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2688
- Référence DB: 36901M76M90
- Désignation française (designation2): FAISCEAU INSTRUMENT INT
- Désignation OEM (designation): HARNESS ASSY MAIN
- Search description: FAISCEAU INSTRUMENT INT ; HARNESS ASSY MAIN
- Public price TTC: 2140.010 TND (raw DB=2140.01032)
- Wholesale/pre-tax price HT: 1798.328 TND (raw DB=1798.328; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9949; reference=36901M76M90; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:45.010Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=3816; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0092419; VIN=MA3KFC42S00767296; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 188

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG506849
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203605
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez BOUCHON DE RESERVOIR DE LIQUIDE DE FREIN pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4212
- Référence DB: 51220M55T00
- Désignation française (designation2): BOUCHON DE RESERVOIR DE LIQUIDE DE FREIN
- Désignation OEM (designation): CAP,RESERVOIR
- Search description: BOUCHON DE RESERVOIR DE LIQUIDE DE FREIN ; CAP,RESERVOIR
- Public price TTC: 52.538 TND (raw DB=52.5385)
- Wholesale/pre-tax price HT: 44.150 TND (raw DB=44.15; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11404; reference=51220M55T00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:39.973Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (6): id=18663; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18664; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18665; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=18666; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=5313; modelName=AON312; typeCode=AON312-TYPE1 | id=5314; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203605; VIN=MBHKWDA3SSG506849; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 189

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760312
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089284
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de GARNITURE DE SOL AR D pour une CELERIO BVA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4993
- Référence DB: 62120M76M00
- Désignation française (designation2): GARNITURE DE SOL AR D
- Désignation OEM (designation): MEMBER,RR FLR SIDE RR,R
- Search description: GARNITURE DE SOL AR D ; MEMBER,RR FLR SIDE RR,R
- Public price TTC: 276.969 TND (raw DB=276.96893)
- Wholesale/pre-tax price HT: 232.747 TND (raw DB=232.747; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2662; reference=62120M76M00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:45.941Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=6041; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=6042; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089284; VIN=MA3KFC42S00760312; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 190

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513015
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189279
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche SWITCHER ANTI BROUILLARD pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2812
- Référence DB: 37270M68P00
- Désignation française (designation2): SWITCHER ANTI BROUILLARD
- Désignation OEM (designation): SWITCH ASSY, FRONT FOG LAMP
- Search description: SWITCHER ANTI BROUILLARD ; SWITCH ASSY, FRONT FOG LAMP
- Public price TTC: 66.978 TND (raw DB=66.97796)
- Wholesale/pre-tax price HT: 56.284 TND (raw DB=56.284; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1439; reference=37270M68P00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.339Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3923; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3924; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=2249; referenceNo=37270M68P00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189279; VIN=MA3AVC71S00513015; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 191

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S4LA642961
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042754
Variant: typo (STATIONNEMENT -> STATIONNMENT)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez ISOLANT CABLE FREIN DE STATIONNMENT pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 918
- Référence DB: 14232M68P00
- Désignation française (designation2): ISOLANT CABLE FREIN DE STATIONNEMENT
- Désignation OEM (designation): INSULATOR,PARKING CABLE HEAT
- Search description: ISOLANT CABLE FREIN DE STATIONNEMENT ; INSULATOR,PARKING CABLE HEAT
- Public price TTC: 77.344 TND (raw DB=77.34405)
- Wholesale/pre-tax price HT: 64.995 TND (raw DB=64.995; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8323; reference=14232M68P00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:46.540Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=12753; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12754; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=12755; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12756; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=12757; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042754; VIN=MA3WB52S4LA642961; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 192

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447997
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019740
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb BRAS LONGERON AR lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5012
- Référence DB: 62830-61M00-000
- Désignation française (designation2): BRAS LONGERON AR
- Désignation OEM (designation): BRAS LONGERON AR
- Search description: BRAS LONGERON AR
- Public price TTC: 322.394 TND (raw DB=322.39361)
- Wholesale/pre-tax price HT: 270.919 TND (raw DB=270.919; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2672; reference=62830-61M00-000; totalQuantity=9; stockDisponible=3; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:40.385Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (2): id=6058; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=6059; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=4100; referenceNo=62830-61M00-000; referenceType=3.0 | id=4101; referenceNo=62830-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019740; VIN=TSMLYD21S00447997; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 193

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339887
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025065
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEURE DE LUMIERE pour ma CIAZ. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 3199
- Référence DB: 38680M56R00
- Désignation française (designation2): CAPTEURE DE LUMIERE
- Désignation OEM (designation): SENSOR ASSY,AUTO LIGHT
- Search description: CAPTEURE DE LUMIERE ; SENSOR ASSY,AUTO LIGHT
- Public price TTC: 174.293 TND (raw DB=174.29335)
- Wholesale/pre-tax price HT: 146.465 TND (raw DB=146.465; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1691; reference=38680M56R00; totalQuantity=2; stockDisponible=1; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:42.013Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (7): id=17069; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=4373; modelName=AON312; typeCode=AON312-TYPE1 | id=4374; modelName=APQ415; typeCode=APQ415-TYPE2 | id=4375; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=4376; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=4377; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=4378; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=2606; referenceNo=38680M56R00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025065; VIN=MA3AVC41S00339887; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 194

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E28620
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180830
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de BOULON AMORTISSEUR AR pour une NEW SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3599
- Référence DB: 41821M55R00
- Désignation française (designation2): BOULON AMORTISSEUR AR
- Désignation OEM (designation): BOLT RR SHOCK ABSORBER
- Search description: BOULON AMORTISSEUR AR ; BOLT RR SHOCK ABSORBER
- Public price TTC: 6.040 TND (raw DB=6.03955)
- Wholesale/pre-tax price HT: 5.075 TND (raw DB=5.07525; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10816; reference=41821M55R00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:40.168Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (11): id=17697; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=17698; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=17699; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17700; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=17701; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=4746; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=4747; modelName=AON312; typeCode=AON312-TYPE1 | id=4748; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4749; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=4750; modelName=AXM310; typeCode=AXM310-TYPE1 | id=4751; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180830; VIN=MBHCZC63S00E28620; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 195

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454814
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014466
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez DETENDEUR CLIMATISATION pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9040
- Référence DB: 95431M76M00
- Désignation française (designation2): DETENDEUR CLIMATISATION
- Désignation OEM (designation): VALVE ASSY EXPANSION
- Search description: DETENDEUR CLIMATISATION ; VALVE ASSY EXPANSION
- Public price TTC: 356.213 TND (raw DB=356.21341)
- Wholesale/pre-tax price HT: 299.339 TND (raw DB=299.339; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15947; reference=95431M76M00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.988Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=9362; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9363; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0014466; VIN=MA3KFC42S00454814; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 196

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00517215
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0193791
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez calculateur ensemble pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2226
- Référence DB: 33920M82R20
- Désignation française (designation2): CALCULATEUR ENSEMBLE
- Désignation OEM (designation): CONTROLLER INJECTION/AIR CON
- Search description: CALCULATEUR ENSEMBLE ; CONTROLLER INJECTION/AIR CON
- Public price TTC: 965.271 TND (raw DB=965.27088)
- Wholesale/pre-tax price HT: 811.152 TND (raw DB=811.152; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1099; reference=33920M82R20; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.570Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=3405; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3406; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (2): id=1784; referenceNo=33920M82R20; referenceType=3.0 | id=1785; referenceNo=33920M82R20-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0193791; VIN=MA3AVC71S00517215; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 197

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E29934
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180837
Variant: typo (RACCORD -> RACORD)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez RACORD DE DURITE DE RENIFLARD pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 127
- Référence DB: 09367M14004
- Désignation française (designation2): RACCORD DE DURITE DE RENIFLARD
- Désignation OEM (designation): PIPE
- Search description: RACCORD DE DURITE DE RENIFLARD ; PIPE
- Public price TTC: 3.482 TND (raw DB=3.48194)
- Wholesale/pre-tax price HT: 2.926 TND (raw DB=2.926; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=78; reference=09367M14004; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:51.840Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (14): id=10145; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10146; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10147; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10148; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=10149; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10150; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10151; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=359; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=360; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=361; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=362; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=363; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=364; modelName=AXM310; typeCode=AXM310-TYPE1 | id=365; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=149; referenceNo=09367M14004; referenceType=3.0 | id=150; referenceNo=09367M14004-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180837; VIN=MBHCZC63S00E29934; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 198

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb CACHE POIGNEE MALLE AR lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 8185
- Référence DB: 83940M52R20
- Désignation française (designation2): CACHE POIGNEE MALLE AR
- Désignation OEM (designation): GARNISH, BACK DOOR LOWER
- Search description: CACHE POIGNEE MALLE AR ; GARNISH, BACK DOOR LOWER
- Public price TTC: 35.963 TND (raw DB=35.96299)
- Wholesale/pre-tax price HT: 30.221 TND (raw DB=30.221; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4459; reference=83940M52R20; totalQuantity=5; stockDisponible=1; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:41.056Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (3): id=24206; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=24207; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=8668; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (1): id=6268; referenceNo=83940M52R20; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 199

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S8LA642641
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042642
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez contacteur feu de stop pour baleno ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2927
- Référence DB: 37740M68P00
- Désignation française (designation2): CONTACTEUR FEU DE STOP
- Désignation OEM (designation): SWITCH ASSY,STOP LAMP
- Search description: CONTACTEUR FEU DE STOP ; SWITCH ASSY,STOP LAMP
- Public price TTC: 250.295 TND (raw DB=250.29508)
- Wholesale/pre-tax price HT: 210.332 TND (raw DB=210.332; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1507; reference=37740M68P00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.352Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=16551; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (1): id=2358; referenceNo=37740M68P00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042642; VIN=MA3WB52S8LA642641; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 200

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448085
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019744
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de REFROIDISSEUR D'HUILE pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1847
- Référence DB: 24777-78MT0-000
- Désignation française (designation2): REFROIDISSEUR D'HUILE
- Désignation OEM (designation): COOLER, OIL APK416
- Search description: REFROIDISSEUR D'HUILE ; COOLER, OIL APK416
- Public price TTC: 1436.169 TND (raw DB=1436.16906)
- Wholesale/pre-tax price HT: 1206.865 TND (raw DB=1206.86475301875; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9173; reference=24777-78MT0-000; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:51.959Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (2): id=3048; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3049; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1562; referenceNo=24777-78MT0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019744; VIN=TSMLYD21S00448085; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1
