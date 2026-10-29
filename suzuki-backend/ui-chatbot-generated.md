# Generated chatbot UI test prompts

Generated: 2026-10-05T12:43:17.441Z  |  seed: 42  |  cases: 200

Run with: $env:CASES_FILE="ui-chatbot-generated.md"; node test-ui-chatbot-20.js --count=100000

## Case 001

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455145
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014484
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de GOUPILLE ELASTIQUE 3 × 10 MM pour une CELERIO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0014484; VIN=MA3KFC42S00455145; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 002

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez BOÎTIER GUIDE JOINT TORIQUE pour une SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 003

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587523
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0195220
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb BOUTON DE CONTRÔLE CLIM lel DZIRE. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6806
- Référence DB: 74462M66RC0
- Désignation française (designation2): BOUTON DE CONTRÔLE CLIM
- Désignation OEM (designation): .KNOB, F/R CONTROL1
- Search description: BOUTON DE CONTRÔLE CLIM ; .KNOB, F/R CONTROL1
- Public price TTC: 16.997 TND (raw DB=16.99677)
- Wholesale/pre-tax price HT: 14.283 TND (raw DB=14.283; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3714; reference=74462M66RC0; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.240Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (5): id=22151; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22152; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=7465; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=7466; modelName=AXM310; typeCode=AXM310-TYPE1 | id=7467; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (1): id=5333; referenceNo=74462M66RC0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0195220; VIN=MBHCZF63S00587523; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 004

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339887
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025065
Variant: typo (CAPTEURE -> CAPTEEURE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CAPTEEURE DE LUMIERE pour ma CIAZ ?

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

## Case 005

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00361842
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119792
Variant: exact
Generated category: PR

**UI prompt**

Je cherche AGRAFE PLANCHER COFFRE pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119792; VIN=MA3RFL41S00361842; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 006

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767296
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092419
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez plaque guide selecteur de vitesses ags pour celerio bva ? prix ?

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
- Matched vehicle row: vehicleNo=VN0092419; VIN=MA3KFC42S00767296; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 007

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340144
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025074
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez barre de torsion charniere malle g pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5539
- Référence DB: 65832M79M00
- Désignation française (designation2): BARRE DE TORSION CHARNIERE MALLE G
- Désignation OEM (designation): BAR, HINGE TORSION LH
- Search description: BARRE DE TORSION CHARNIERE MALLE G ; BAR, HINGE TORSION LH
- Public price TTC: 93.430 TND (raw DB=93.43047)
- Wholesale/pre-tax price HT: 78.513 TND (raw DB=78.51300000000001; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12638; reference=65832M79M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:39.169Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=6409; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025074; VIN=MA3AVC41S00340144; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 008

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513125
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189278
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb HARNESS ASSY,MAIN lel CIAZ. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0189278; VIN=MA3AVC71S00513125; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 009

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E22961
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180818
Variant: exact
Generated category: PR

**UI prompt**

Je cherche BRAS ESSUIE GLACE pour ma NEW SWIFT. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0180818; VIN=MBHCZC63S00E22961; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 010

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31915
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180845
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez TUBE ECHAPPMENT pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 905
- Référence DB: 14190M68P00
- Désignation française (designation2): TUBE ECHAPPMENT
- Désignation OEM (designation): PIPE, EXH
- Search description: TUBE ECHAPPMENT ; PIPE, EXH
- Public price TTC: 738.970 TND (raw DB=738.96977)
- Wholesale/pre-tax price HT: 620.983 TND (raw DB=620.9829999999999; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=465; reference=14190M68P00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.248Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=12729; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=12730; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=831; referenceNo=14190M68P00; referenceType=3.0 | id=832; referenceNo=14190M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180845; VIN=MBHCZC63S00E31915; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 011

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426217
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110395
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de CALLE CAPOT pour une ERTIGA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6429
- Référence DB: 72372M70F10
- Désignation française (designation2): CALLE CAPOT
- Désignation OEM (designation): CUSHION,FRONT HOOD FRONT SIDE
- Search description: CALLE CAPOT ; CUSHION,FRONT HOOD FRONT SIDE
- Public price TTC: 5.679 TND (raw DB=5.67868)
- Wholesale/pre-tax price HT: 4.772 TND (raw DB=4.772; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3503; reference=72372M70F10; totalQuantity=14; stockDisponible=4; stockConsolide=14; statut=Disponible; updatedAt=2026-09-20T19:01:41.641Z
- Availability rule: stockConsolide >= 2; actual quantity=14; expected=available
- Fitment rows (18): id=21540; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=21541; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=21542; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=21543; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=21544; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=7106; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=7107; modelName=AON312; typeCode=AON312-TYPE1 | id=7108; modelName=APQ415; typeCode=APQ415-TYPE2 | id=7109; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7110; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=7111; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=7112; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=7113; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=7114; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=7115; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=7116; modelName=AXM310; typeCode=AXM310-TYPE1 | id=7117; modelName=AXM310; typeCode=AXM310-TYPE2 | id=7118; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=5052; referenceNo=72372M70F10; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110395; VIN=MA3BNC22S00426217; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 012

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: typo (DETRESSE -> DETRSSE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez BOUTON DE FEUX DE DETRSSE AVEC TEMOIN D’ALARME pour ma SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 013

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG500119
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203627
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb ASSIETTE  RESSORT SOUPAPE lel FRONX. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0203627; VIN=MBHKWDA3SSG500119; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 014

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D83823
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018007
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche CACHE MOYEU DE JANTE AVEC LOGO SUZUKI pour ma SWIFT. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0018007; VIN=MA3GZC62S00D83823; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 015

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339917
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025100
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SUPPORT PLANCHIER D pour une CIAZ ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4968
- Référence DB: 61520M79M00
- Désignation française (designation2): SUPPORT PLANCHIER D
- Désignation OEM (designation): EXTENSION COMPRR FLOOR SIDE,R
- Search description: SUPPORT PLANCHIER D ; EXTENSION COMPRR FLOOR SIDE,R
- Public price TTC: 56.751 TND (raw DB=56.7511)
- Wholesale/pre-tax price HT: 47.690 TND (raw DB=47.69; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12127; reference=61520M79M00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.170Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (3): id=6013; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6014; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6015; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (2): id=4068; referenceNo=61520M79M00; referenceType=3.0 | id=4069; referenceNo=61520M79M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025100; VIN=MA3AVC41S00339917; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 016

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588989
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192982
Variant: exact (no typo possible)
Generated category: ELECTRIQUE

**UI prompt**

Je cherche AGRAFE FEU AR pour ma DZIRE. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0192982; VIN=MBHCZF63S00588989; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 017

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00359667
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101073
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez joint colone de direction pour ertiga ? prix ?

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
- Matched vehicle row: vehicleNo=VN0101073; VIN=MA3BNC22S00359667; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 018

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654751
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045582
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de GOUJON CHAINE DE DISTRIBUTION pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 614
- Référence DB: 12781M69G00
- Désignation française (designation2): GOUJON CHAINE DE DISTRIBUTION
- Désignation OEM (designation): JETTIMING CHAIN
- Search description: GOUJON CHAINE DE DISTRIBUTION ; JETTIMING CHAIN
- Public price TTC: 10.266 TND (raw DB=10.26613)
- Wholesale/pre-tax price HT: 8.627 TND (raw DB=8.627; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=318; reference=12781M69G00; totalQuantity=15; stockDisponible=1; stockConsolide=15; statut=Disponible; updatedAt=2026-09-20T19:01:46.312Z
- Availability rule: stockConsolide >= 2; actual quantity=15; expected=available
- Fitment rows (21): id=11633; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11634; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11635; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11636; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11637; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11638; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11639; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11640; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1196; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1197; modelName=AON312; typeCode=AON312-TYPE1 | id=1198; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1199; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=1200; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=1201; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1202; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1203; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=1204; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1205; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1206; modelName=AXM310; typeCode=AXM310-TYPE1 | id=1207; modelName=AXM310; typeCode=AXM310-TYPE2 | id=1208; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=572; referenceNo=12781M69G00; referenceType=3.0 | id=573; referenceNo=12781M69G00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045582; VIN=MA3WB52S9LA654751; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 019

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339940
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025099
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb PANNEAU INT AR AILE AR G lel CIAZ. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5098
- Référence DB: 63713M79M50
- Désignation française (designation2): PANNEAU INT AR AILE AR G
- Désignation OEM (designation): PANEL,QTR INNER RR,L
- Search description: PANNEAU INT AR AILE AR G ; PANEL,QTR INNER RR,L
- Public price TTC: 99.432 TND (raw DB=99.43164)
- Wholesale/pre-tax price HT: 83.556 TND (raw DB=83.556; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12245; reference=63713M79M50; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:49.517Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=6137; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6138; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6139; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025099; VIN=MA3AVC41S00339940; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 020

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654951
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045585
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
- Matched vehicle row: vehicleNo=VN0045585; VIN=MA3WB52S6LA654951; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 021

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522154
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204656
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez PROTECTEUR GARNITURE MALLE AR pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0204656; VIN=MBHKWDA3SSG522154; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 022

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG519625
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203609
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez joint cartere boite de vitesse pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1849
- Référence DB: 24781-57B00-000
- Désignation française (designation2): JOINT CARTERE BOITE DE VITESSE
- Désignation OEM (designation): GASKET, DRAIN PLUG
- Search description: JOINT CARTERE BOITE DE VITESSE ; GASKET, DRAIN PLUG
- Public price TTC: 36.538 TND (raw DB=36.53776)
- Wholesale/pre-tax price HT: 30.704 TND (raw DB=30.704; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=956; reference=24781-57B00-000; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:46.902Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (13): id=14785; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14786; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14787; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14788; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14789; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=14790; modelName=A6G415-TYPE1; typeCode=A6G415-TYPE1 | id=14791; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=3050; modelName=AON312; typeCode=AON312-TYPE1 | id=3051; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3052; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3053; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3054; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=3055; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=1565; referenceNo=24781-57B00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0203609; VIN=MBHKWDA3SSG519625; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 023

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31441
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180811
Variant: typo (CANALISATION -> CANALISTION)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez CANALISTION  D'AIR pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 6814
- Référence DB: 74662M56R10
- Désignation française (designation2): CANALISATION  D'AIR
- Désignation OEM (designation): DUCT,REAR VENT NO.2 LH
- Search description: CANALISATION D'AIR ; DUCT,REAR VENT NO.2 LH
- Public price TTC: 70.531 TND (raw DB=70.5313)
- Wholesale/pre-tax price HT: 59.270 TND (raw DB=59.27; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3719; reference=74662M56R10; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.663Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22166; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22167; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=5341; referenceNo=74662M56R10; referenceType=3.0 | id=5342; referenceNo=74662M56R10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180811; VIN=MBHCZC63S00E31441; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 024

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587944
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0193786
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CABLAGE CAPTEUR DE RECULE pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0193786; VIN=MBHCZF63S00587944; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 025

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00440774
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018399
Variant: typo (ENGRENAGE -> ENGREAGE)
Generated category: PR

**UI prompt**

Bonjour, vous avez ENGREAGE DIFFERENTIEL pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0018399; VIN=TSMLYD21S00440774; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 026

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455042
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014472
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche MOYEU DE ROUE pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 3745
- Référence DB: 43421M68K00
- Désignation française (designation2): MOYEU DE ROUE
- Désignation OEM (designation): HUB FRONT WHEEL
- Search description: MOYEU DE ROUE ; HUB FRONT WHEEL
- Public price TTC: 155.084 TND (raw DB=155.08437)
- Wholesale/pre-tax price HT: 130.323 TND (raw DB=130.323; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1961; reference=43421M68K00; totalQuantity=22; stockDisponible=19; stockConsolide=22; statut=Disponible; updatedAt=2026-09-20T19:01:49.076Z
- Availability rule: stockConsolide >= 2; actual quantity=22; expected=available
- Fitment rows (3): id=4888; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=4889; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=4890; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (2): id=2966; referenceNo=43421M68K00; referenceType=3.0 | id=2967; referenceNo=43421M68K00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014472; VIN=MA3KFC42S00455042; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 027

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767418
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092412
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de POIGNEE MALLE pour une CELERIO BVA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0092412; VIN=MA3KFC42S00767418; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 028

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D93844
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018271
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez capteur temp int pour swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0018271; VIN=MA3GZC62S00D93844; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 029

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426631
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110400
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez RESERVOIR HUILE FREIN pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 4209
- Référence DB: 51200M72R70
- Désignation française (designation2): RESERVOIR HUILE FREIN
- Désignation OEM (designation): RESERVOIR S/ASSY, OIL
- Search description: RESERVOIR HUILE FREIN ; RESERVOIR S/ASSY, OIL
- Public price TTC: 147.238 TND (raw DB=147.23756)
- Wholesale/pre-tax price HT: 123.729 TND (raw DB=123.72904; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11401; reference=51200M72R70; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:52.116Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (6): id=18648; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18649; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18650; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5305; modelName=AON312; typeCode=AON312-TYPE1 | id=5306; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5307; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0110400; VIN=MA3BNC22S00426631; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 030

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00236766
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101261
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb KIT CABLES SELECCTEUR DE VITESSES BVA lel ERTIGA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0101261; VIN=MA3BNC22S00236766; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 031

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764297
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089521
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de MEMBRE DE SOL AR G pour une CELERIO BVA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5009
- Référence DB: 62321M76M00
- Désignation française (designation2): MEMBRE DE SOL AR G
- Désignation OEM (designation): MEMBER,RR FLOOR SIDE RR,L
- Search description: MEMBRE DE SOL AR G ; MEMBER,RR FLOOR SIDE RR,L
- Public price TTC: 228.974 TND (raw DB=228.97385)
- Wholesale/pre-tax price HT: 192.415 TND (raw DB=192.415; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2669; reference=62321M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.575Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=6054; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=6055; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089521; VIN=MA3KFC42S00764297; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 032

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378435
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119729
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR DE CHOC pour une SPRESSO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 1539
- Référence DB: 18640M72R00
- Désignation française (designation2): CAPTEUR DE CHOC
- Désignation OEM (designation): SENSOR ASSY,KNOCK
- Search description: CAPTEUR DE CHOC ; SENSOR ASSY,KNOCK
- Public price TTC: 89.334 TND (raw DB=89.33449)
- Wholesale/pre-tax price HT: 75.071 TND (raw DB=75.071; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=842; reference=18640M72R00; totalQuantity=3; stockDisponible=2; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:41.817Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (11): id=14033; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14034; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14035; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=2588; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2589; modelName=APQ415; typeCode=APQ415-TYPE2 | id=2590; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2591; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=2592; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2593; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=2594; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2595; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=1366; referenceNo=18640M72R00; referenceType=3.0 | id=1367; referenceNo=18640M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119729; VIN=MA3RFL41S00378435; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 033

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00357679
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0117944
Variant: typo (ÉGRATIGNER -> ÉGRATGINER)
Generated category: PR

**UI prompt**

Bonjour, vous avez ÉGRATGINER LE SEUIL AV G pour ma SPRESSO ?

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
- Matched vehicle row: vehicleNo=VN0117944; VIN=MA3RFL41S00357679; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 034

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E30209
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180815
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez cuire levier pour new swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0180815; VIN=MBHCZC63S00E30209; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 035

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426322
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110397
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb CACHE, PIVOT D'ESSUIE-GLACE AR lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 3012
- Référence DB: 38274M72R00
- Désignation française (designation2): CACHE, PIVOT D'ESSUIE-GLACE AR
- Désignation OEM (designation): CAP, REAR WIPER PIVOT
- Search description: CACHE, PIVOT D'ESSUIE-GLACE AR ; CAP, REAR WIPER PIVOT
- Public price TTC: 18.727 TND (raw DB=18.72703)
- Wholesale/pre-tax price HT: 15.737 TND (raw DB=15.737; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10262; reference=38274M72R00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.377Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=4179; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=4180; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=2434; referenceNo=38274M72R00; referenceType=3.0 | id=2435; referenceNo=38274M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110397; VIN=MA3BNC22S00426322; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 036

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654720
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045586
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche SWITCHER RADAR DE RECULE pour ma BALENO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0045586; VIN=MA3WB52S9LA654720; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 037

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454886
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015754
Variant: typo (EMBRAYAGE -> EMBRAYGE)
Generated category: PR

**UI prompt**

Bonjour, vous avez RESSORT EMBRAYGE pour ma CELERIO ?

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
- Matched vehicle row: vehicleNo=VN0015754; VIN=MA3KFC42S00454886; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 038

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG533016
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204651
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de COUVERCLE LATERAL BOITE DE VITESSES pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0204651; VIN=MBHKWDA3SSG533016; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 039

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448839
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019752
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez panneau ext logement feu ar g pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5394
- Référence DB: 64530-54P00-000
- Désignation française (designation2): PANNEAU EXT LOGEMENT FEU AR G
- Désignation OEM (designation): PANEL, RR LAMP HOUSE OTR LH
- Search description: PANNEAU EXT LOGEMENT FEU AR G ; PANEL, RR LAMP HOUSE OTR LH
- Public price TTC: 269.803 TND (raw DB=269.80275)
- Wholesale/pre-tax price HT: 226.725 TND (raw DB=226.725; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2894; reference=64530-54P00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:49.478Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=6309; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=6310; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=4323; referenceNo=64530-54P00; referenceType=3.0 | id=4324; referenceNo=64530-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019752; VIN=TSMLYD21S00448839; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 040

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG506849
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203605
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche BOUTON START/STOP MOTEUR pour ma FRONX. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2816
- Référence DB: 37290M55T01
- Désignation française (designation2): BOUTON START/STOP MOTEUR
- Désignation OEM (designation): SWITCH ASSYENGINE START
- Search description: BOUTON START/STOP MOTEUR ; SWITCH ASSYENGINE START
- Public price TTC: 557.392 TND (raw DB=557.39243)
- Wholesale/pre-tax price HT: 468.397 TND (raw DB=468.397; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10071; reference=37290M55T01; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.271Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (4): id=16325; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=16326; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3941; modelName=AON312; typeCode=AON312-TYPE1 | id=3942; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203605; VIN=MBHKWDA3SSG506849; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 041

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588529
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183619
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BUTEE LATERALE TABLETTE AR pour une DZIRE ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0183619; VIN=MBHCZF63S00588529; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 042

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00325731
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0089447
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb CONDUITE D’ENTREE D’EAU lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1321
- Référence DB: 17830M73R00
- Désignation française (designation2): CONDUITE D’ENTREE D’EAU
- Désignation OEM (designation): PIPE, WTR INLET
- Search description: CONDUITE D’ENTREE D’EAU ; PIPE, WTR INLET
- Public price TTC: 124.485 TND (raw DB=124.48471)
- Wholesale/pre-tax price HT: 104.609 TND (raw DB=104.609; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=686; reference=17830M73R00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.301Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (6): id=13599; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=13600; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=13601; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=13602; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=2312; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2313; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=1167; referenceNo=17830M73R00; referenceType=3.0 | id=1168; referenceNo=17830M73R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089447; VIN=MA3BNC22S00325731; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 043

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376218
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119775
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez pare a bour ar d pour spresso ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6591
- Référence DB: 72811M62S00
- Désignation française (designation2): PARE A BOUR AR D
- Désignation OEM (designation): LINING REAR WHEEL HSG RH
- Search description: PARE A BOUR AR D ; LINING REAR WHEEL HSG RH
- Public price TTC: 26.770 TND (raw DB=26.77024)
- Wholesale/pre-tax price HT: 22.496 TND (raw DB=22.496; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3597; reference=72811M62S00; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:49.723Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (1): id=7267; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=5192; referenceNo=72811M62S00; referenceType=3.0 | id=5193; referenceNo=72811M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119775; VIN=MA3RFL41S00376218; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 044

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339517
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025121
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de LECTEUR CLIMATRONIC pour une CIAZ, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3375
- Référence DB: 39530M79M00
- Désignation française (designation2): LECTEUR CLIMATRONIC
- Désignation OEM (designation): CONTROLLER UNIT,AUTO A/C
- Search description: LECTEUR CLIMATRONIC ; CONTROLLER UNIT,AUTO A/C
- Public price TTC: 361.160 TND (raw DB=361.16024)
- Wholesale/pre-tax price HT: 303.496 TND (raw DB=303.496; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1788; reference=39530M79M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:47.986Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=4573; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (1): id=2741; referenceNo=39530M79M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025121; VIN=MA3AVC41S00339517; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 045

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D92662
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018250
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb CLAVETTE SYNCHRO BASSES VITESSES 1ERE ET 2EME lel SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0018250; VIN=MA3GZC62S00D92662; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 046

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA642986
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045229
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CONDUITE DE CARBURANT G pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1020
- Référence DB: 15811M68P10
- Désignation française (designation2): CONDUITE DE CARBURANT G
- Désignation OEM (designation): PIPE,FUEL FEED (LH)
- Search description: CONDUITE DE CARBURANT G ; PIPE,FUEL FEED (LH)
- Public price TTC: 174.610 TND (raw DB=174.60989)
- Wholesale/pre-tax price HT: 146.731 TND (raw DB=146.731; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8416; reference=15811M68P10; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.305Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (5): id=12996; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12997; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=12998; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12999; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=13000; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045229; VIN=MA3WB52S9LA642986; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 047

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378433
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119780
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche POIGNEE INTERIEUR G pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7783
- Référence DB: 83130M62S00
- Désignation française (designation2): POIGNEE INTERIEUR G
- Désignation OEM (designation): HANDLE SIDE DOOR INSIDE LH
- Search description: POIGNEE INTERIEUR G ; HANDLE SIDE DOOR INSIDE LH
- Public price TTC: 52.379 TND (raw DB=52.37904)
- Wholesale/pre-tax price HT: 44.016 TND (raw DB=44.016; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4242; reference=83130M62S00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:50.941Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=8326; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=5998; referenceNo=83130M62S00; referenceType=3.0 | id=5999; referenceNo=83130M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119780; VIN=MA3RFL41S00378433; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 048

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E24715
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180839
Variant: exact (no typo possible)
Generated category: ELECTRIQUE

**UI prompt**

Je cherche LAMP ASSY,ROOM pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 2539
- Référence DB: 36210M66R00-V6N
- Désignation française (designation2): LAMP ASSY,ROOM
- Désignation OEM (designation): LAMP ASSY,ROOM
- Search description: LAMP ASSY,ROOM
- Public price TTC: 118.637 TND (raw DB=118.63705)
- Wholesale/pre-tax price HT: 99.695 TND (raw DB=99.69499999999999; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1281; reference=36210M66R00-V6N; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:47.852Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (4): id=15904; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=15905; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3671; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3672; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (1): id=2024; referenceNo=36210M66R00-V6N; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180839; VIN=MBHCZC63S00E24715; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 049

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2KA599123
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037465
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez couvercle reglage siege conducteur pour baleno ? prix ?

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
- Matched vehicle row: vehicleNo=VN0037465; VIN=MA3WB52S2KA599123; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 050

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00763772
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092407
Variant: typo (FLEXIBLE -> FLEIBLE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez FLEIBLE DE FREIN AV D pour ma CELERIO BVA ?

**DB facts for comparison (do not paste)**

- Part DB id: 4245
- Référence DB: 51540M76M00
- Désignation française (designation2): FLEXIBLE DE FREIN AV D
- Désignation OEM (designation): HOSE,FR BRAKE FLEXIBLE,R
- Search description: FLEXIBLE DE FREIN AV D ; HOSE,FR BRAKE FLEXIBLE,R
- Public price TTC: 100.217 TND (raw DB=100.21704)
- Wholesale/pre-tax price HT: 84.216 TND (raw DB=84.21599999999999; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2225; reference=51540M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:45.647Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5353; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5354; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3409; referenceNo=51540M76M00; referenceType=3.0 | id=3410; referenceNo=51540M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092407; VIN=MA3KFC42S00763772; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 051

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378428
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119740
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
- Matched vehicle row: vehicleNo=VN0119740; VIN=MA3RFL41S00378428; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 052

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00441419
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018406
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de BUZZER ASSY,KLS AZG412 pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3192
- Référence DB: 38590-82K01-000
- Désignation française (designation2): BUZZER ASSY,KLS AZG412
- Désignation OEM (designation): BUZZER ASSY,KLS AZG412
- Search description: BUZZER ASSY,KLS AZG412
- Public price TTC: 226.928 TND (raw DB=226.92773)
- Wholesale/pre-tax price HT: 190.696 TND (raw DB=190.69557; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10436; reference=38590-82K01-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:40.499Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=4364; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=4365; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2596; referenceNo=38590-82K01-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018406; VIN=TSMLYD21S00441419; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 053

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454909
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015747
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez PATIN DE PEDALE pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0015747; VIN=MA3KFC42S00454909; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 054

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471663
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022157
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche JOINT D’ELECTROVANNE DE COMMANDE D’HUILE pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1130
- Référence DB: 16559-69GE0-000
- Désignation française (designation2): JOINT D’ELECTROVANNE DE COMMANDE D’HUILE
- Désignation OEM (designation): GASKET, OCV
- Search description: JOINT D’ELECTROVANNE DE COMMANDE D’HUILE ; GASKET, OCV
- Public price TTC: 46.702 TND (raw DB=46.70155)
- Wholesale/pre-tax price HT: 39.245 TND (raw DB=39.245; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=572; reference=16559-69GE0-000; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:46.955Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (1): id=2089; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1013; referenceNo=16559-69GE0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022157; VIN=TSMLYE21S00471663; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 055

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00451981
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113761
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb ENJOLIVEUR INT PORTE AR lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 7978
- Référence DB: 83790M72R00-5PK
- Désignation française (designation2): ENJOLIVEUR INT PORTE AR
- Désignation OEM (designation): GARNISH, REAR DOOR INNER LH(BLACK)
- Search description: ENJOLIVEUR INT PORTE AR ; GARNISH, REAR DOOR INNER LH(BLACK)
- Public price TTC: 48.517 TND (raw DB=48.51749)
- Wholesale/pre-tax price HT: 40.771 TND (raw DB=40.771; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4333; reference=83790M72R00-5PK; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:44.728Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=8506; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=8507; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (1): id=6133; referenceNo=83790M72R00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0113761; VIN=MA3BNC22S00451981; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 056

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471189
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022153
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR DE LUMIÉRE pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0022153; VIN=TSMLYE21S00471189; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 057

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376205
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119748
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BUSE D'EAU ESSUIE GLASSE pour une SPRESSO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0119748; VIN=MA3RFL41S00376205; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 058

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767402
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092421
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de ROULEMENT3ÈME ET 4ÈME VITESSE pour une CELERIO BVA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1750
- Référence DB: 24283M76M00
- Désignation française (designation2): ROULEMENT3ÈME ET 4ÈME VITESSE
- Désignation OEM (designation): BEARING,3RD & 4TH GEAR NDL
- Search description: ROULEMENT3ÈME ET 4ÈME VITESSE ; BEARING,3RD & 4TH GEAR NDL
- Public price TTC: 65.924 TND (raw DB=65.92362)
- Wholesale/pre-tax price HT: 55.398 TND (raw DB=55.398; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9081; reference=24283M76M00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:52.602Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (9): id=14403; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14404; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14405; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2807; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2808; modelName=AON312; typeCode=AON312-TYPE1 | id=2809; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2810; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2811; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2812; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0092421; VIN=MA3KFC42S00767402; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 059

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443091
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018427
Variant: typo (LATERAL -> LATREAL)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez CACHE LATREAL FACE AV pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 6066
- Référence DB: 71781-54P00-000
- Désignation française (designation2): CACHE LATERAL FACE AV
- Désignation OEM (designation): COVER, FRONT END SIDE APK416
- Search description: CACHE LATERAL FACE AV ; COVER, FRONT END SIDE APK416
- Public price TTC: 32.276 TND (raw DB=32.27637)
- Wholesale/pre-tax price HT: 27.123 TND (raw DB=27.123; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13106; reference=71781-54P00-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:41.008Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=6808; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=4801; referenceNo=71781-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018427; VIN=TSMLYD21S00443091; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 060

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471723
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022159
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez cache cosse positive batterie pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0022159; VIN=TSMLYE21S00471723; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 061

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426599
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110398
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez raccord coude de durite de lave-glace pour ertiga ? prix ?

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
- Matched vehicle row: vehicleNo=VN0110398; VIN=MA3BNC22S00426599; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 062

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446180
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018455
Variant: exact (no typo possible)
Generated category: MÉCANIQUE

**UI prompt**

Je cherche CARDAN ARG pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 3855
- Référence DB: 44106-61M00-000
- Désignation française (designation2): CARDAN ARG
- Désignation OEM (designation): SHAFT ASSY,R
- Search description: CARDAN ARG ; SHAFT ASSY,R
- Public price TTC: 2419.317 TND (raw DB=2419.3173)
- Wholesale/pre-tax price HT: 2033.040 TND (raw DB=2033.03975; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11062; reference=44106-61M00-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:42.071Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=4972; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3059; referenceNo=44106-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018455; VIN=TSMLYD21S00446180; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 063

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7KA599540
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037471
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb ADHESIF MONTANT  G lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 7073
- Référence DB: 77146M68P00-0CB
- Désignation française (designation2): ADHESIF MONTANT  G
- Désignation OEM (designation): TAPE FR PILLAR UPPERR LH
- Search description: ADHESIF MONTANT G ; TAPE FR PILLAR UPPERR LH
- Public price TTC: 213.768 TND (raw DB=213.76803)
- Wholesale/pre-tax price HT: 179.637 TND (raw DB=179.637; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3851; reference=77146M68P00-0CB; totalQuantity=11; stockDisponible=11; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:37.694Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (1): id=22589; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (1): id=5494; referenceNo=77146M68P00-0CB; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0037471; VIN=MA3WB52S7KA599540; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 064

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG526243
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204649
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CONTACTEUR DE FEU DE RECUL pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0204649; VIN=MBHKWDA3SSG526243; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 065

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587130
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192980
Variant: exact
Generated category: PR

**UI prompt**

Je cherche CAPUCHON AMORTISSEUR AR pour ma DZIRE. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0192980; VIN=MBHCZF63S00587130; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 066

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D94869
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018500
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de SUPPORT PIGNON DE DIRECTION D pour une SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4117
- Référence DB: 48525M74L00
- Désignation française (designation2): SUPPORT PIGNON DE DIRECTION D
- Désignation OEM (designation): MOUNT RH
- Search description: SUPPORT PIGNON DE DIRECTION D ; MOUNT RH
- Public price TTC: 55.727 TND (raw DB=55.72651)
- Wholesale/pre-tax price HT: 46.829 TND (raw DB=46.829; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2143; reference=48525M74L00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.160Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=5193; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=3281; referenceNo=48525M74L00; referenceType=3.0 | id=3282; referenceNo=48525M74L00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018500; VIN=MA3GZC62S00D94869; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 067

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340218
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025102
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez coussin garde-boue av d pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6404
- Référence DB: 72364M79M00
- Désignation française (designation2): COUSSIN GARDE-BOUE AV D
- Désignation OEM (designation): CUSHION,FR FENDER,R
- Search description: COUSSIN GARDE-BOUE AV D ; CUSHION,FR FENDER,R
- Public price TTC: 12.137 TND (raw DB=12.13681)
- Wholesale/pre-tax price HT: 10.199 TND (raw DB=10.199; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3484; reference=72364M79M00; totalQuantity=20; stockDisponible=20; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:43.548Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (3): id=7088; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=7089; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=7090; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=5036; referenceNo=72364M79M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025102; VIN=MA3AVC41S00340218; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 068

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446691
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019722
Variant: typo (BROUILLARD -> BROUUILLARD)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez BOULON ANTI BROUUILLARD pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0019722; VIN=TSMLYD21S00446691; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 069

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00474308
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022183
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez RETROV INT pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0022183; VIN=TSMLYE21S00474308; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 070

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D92962
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018257
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de SYNCHRONISATION DE LA VITESSE DU MOYEU pour une SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1789
- Référence DB: 24400M68K00
- Désignation française (designation2): SYNCHRONISATION DE LA VITESSE DU MOYEU
- Désignation OEM (designation): HUB ASSY,LOW SPEED SYNC
- Search description: SYNCHRONISATION DE LA VITESSE DU MOYEU ; HUB ASSY,LOW SPEED SYNC
- Public price TTC: 321.969 TND (raw DB=321.96878)
- Wholesale/pre-tax price HT: 270.562 TND (raw DB=270.562; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9118; reference=24400M68K00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.390Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=2912; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018257; VIN=MA3GZC62S00D92962; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 071

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E23177
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179255
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb RENFORT SUP BOITE A GANTS lel NEW SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6683
- Référence DB: 73470M52R50
- Désignation française (designation2): RENFORT SUP BOITE A GANTS
- Désignation OEM (designation): REINF , GLOVE BOX UPPER
- Search description: RENFORT SUP BOITE A GANTS ; REINF , GLOVE BOX UPPER
- Public price TTC: 30.639 TND (raw DB=30.63893)
- Wholesale/pre-tax price HT: 25.747 TND (raw DB=25.747; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13703; reference=73470M52R50; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.069Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=21963; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=21964; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0179255; VIN=MBHCZC63S00E23177; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 072

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448875
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019753
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche SWITCHER 4WD pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0019753; VIN=TSMLYD21S00448875; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 073

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588523
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192969
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BUTEE AR TABLETTE AR pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 8888
- Référence DB: 88912M55R00
- Désignation française (designation2): BUTEE AR TABLETTE AR
- Désignation OEM (designation): CUSHION, REAR PARCEL REAR
- Search description: BUTEE AR TABLETTE AR ; CUSHION, REAR PARCEL REAR
- Public price TTC: 3.972 TND (raw DB=3.97222)
- Wholesale/pre-tax price HT: 3.338 TND (raw DB=3.338; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15809; reference=88912M55R00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:40.477Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (7): id=25089; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25090; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25091; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9181; modelName=AON312; typeCode=AON312-TYPE1 | id=9182; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9183; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9184; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0192969; VIN=MBHCZF63S00588523; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 074

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D93774
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018272
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb TUBE ESSENCE lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1021
- Référence DB: 15811M74L10
- Désignation française (designation2): TUBE ESSENCE
- Désignation OEM (designation): PIPE, FUEL FEED LH
- Search description: TUBE ESSENCE ; PIPE, FUEL FEED LH
- Public price TTC: 131.493 TND (raw DB=131.49262)
- Wholesale/pre-tax price HT: 110.498 TND (raw DB=110.498; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=520; reference=15811M74L10; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:55.251Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=1964; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=934; referenceNo=15811M74L10; referenceType=3.0 | id=935; referenceNo=15811M74L10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018272; VIN=MA3GZC62S00D93774; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 075

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00765520
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0091038
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez COUVERCLE INF G pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0091038; VIN=MA3KFC42S00765520; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE2

## Case 076

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764027
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089478
Variant: typo (COMMUTATEUR -> COMMUUTATEUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez COMMUUTATEUR MAINS LIBRES pour ma CELERIO BVA ?

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
- Matched vehicle row: vehicleNo=VN0089478; VIN=MA3KFC42S00764027; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 077

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E23645
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180814
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez mecanisme leve-vitre ar pour new swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0180814; VIN=MBHCZC63S00E23645; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 078

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378430
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119724
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche METTRE CYLINDRE pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4175
- Référence DB: 51000M62S10
- Désignation française (designation2): METTRE CYLINDRE
- Désignation OEM (designation): BOOSTER MASTER CYLINDER ASSY
- Search description: METTRE CYLINDRE ; BOOSTER MASTER CYLINDER ASSY
- Public price TTC: 728.454 TND (raw DB=728.45374)
- Wholesale/pre-tax price HT: 612.146 TND (raw DB=612.146; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2184; reference=51000M62S10; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.584Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=5275; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=3334; referenceNo=51000M62S10; referenceType=3.0 | id=3335; referenceNo=51000M62S10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119724; VIN=MA3RFL41S00378430; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 079

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG529363
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204668
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche VIS CRUCIFORME A TETE BOMBEE M4 × 12 MM pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0204668; VIN=MBHKWDA3SSG529363; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 080

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589179
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189123
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR DE ROUE ARR pour une DZIRE ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189123; VIN=MBHCZF63S00589179; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 081

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589124
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189213
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BRAS ESSUIE GLACE AV pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189213; VIN=MBHCZF63S00589124; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 082

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00424985
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0009843
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez ensemble moteur pompe a huile pour celerio ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1645
- Référence DB: 2280TM76ME0
- Désignation française (designation2): ENSEMBLE MOTEUR POMPE A HUILE
- Désignation OEM (designation): MOTOR SET, OIL PUMP
- Search description: ENSEMBLE MOTEUR POMPE A HUILE ; MOTOR SET, OIL PUMP
- Public price TTC: 463.849 TND (raw DB=463.84891)
- Wholesale/pre-tax price HT: 389.789 TND (raw DB=389.789; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=892; reference=2280TM76ME0; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:44.787Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (5): id=14144; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14145; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2655; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2656; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2657; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0009843; VIN=MA3KFC42S00424985; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 083

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445803
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018451
Variant: typo (PLANCHE -> PLANHE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez TOLLE DE PLANHE AR G pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 4955
- Référence DB: 61515-61M10-000
- Désignation française (designation2): TOLLE DE PLANCHE AR G
- Désignation OEM (designation): EXTENSION,RR FLOOR SIDE,L
- Search description: TOLLE DE PLANCHE AR G ; EXTENSION,RR FLOOR SIDE,L
- Public price TTC: 272.925 TND (raw DB=272.92531)
- Wholesale/pre-tax price HT: 229.349 TND (raw DB=229.349; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2642; reference=61515-61M10-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.901Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5997; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5998; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=4048; referenceNo=61515-61M10; referenceType=3.0 | id=4049; referenceNo=61515-61M10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018451; VIN=TSMLYD21S00445803; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 084

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378411
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119777
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CAPTEUR ARBRE A CAMME lel SPRESSO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0119777; VIN=MA3RFL41S00378411; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 085

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654782
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045576
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez PANNEAU DEY AR EXT D pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0045576; VIN=MA3WB52S9LA654782; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 086

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339811
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025091
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche ROULEMENT D DE DIFFERENTIEL AV pour ma CIAZ. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0025091; VIN=MA3AVC41S00339811; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 087

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471959
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022164
Variant: typo (POIGNEE -> POGNEE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez POGNEE DE PORTE pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 7673
- Référence DB: 82812-57LA0-ZNL
- Désignation française (designation2): POIGNEE DE PORTE
- Désignation OEM (designation): HANDLE, SIDE DOOR OUT (WHITE)
- Search description: POIGNEE DE PORTE ; HANDLE, SIDE DOOR OUT (WHITE)
- Public price TTC: 233.741 TND (raw DB=233.74099)
- Wholesale/pre-tax price HT: 196.421 TND (raw DB=196.421; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4167; reference=82812-57LA0-ZNL; totalQuantity=49; stockDisponible=49; stockConsolide=49; statut=Disponible; updatedAt=2026-09-20T19:01:50.836Z
- Availability rule: stockConsolide >= 2; actual quantity=49; expected=available
- Fitment rows (2): id=8187; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8188; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5908; referenceNo=82812-57LA0-ZNL0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022164; VIN=TSMLYE21S00471959; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 088

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454989
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015752
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CACHE CAUSSE BATTRIE pour une CELERIO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0015752; VIN=MA3KFC42S00454989; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 089

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00411693
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109245
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb FLASQUE DE FREIN AR D lel ERTIGA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0109245; VIN=MA3BNC22S00411693; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 090

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767426
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092413
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez siege ammortisseur pour celerio bva ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3475
- Référence DB: 41211M76M00
- Désignation française (designation2): SIEGE AMMORTISSEUR
- Désignation OEM (designation): SEAT, COIL SPRING
- Search description: SIEGE AMMORTISSEUR ; SEAT, COIL SPRING
- Public price TTC: 159.096 TND (raw DB=159.09586)
- Wholesale/pre-tax price HT: 133.694 TND (raw DB=133.694; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1807; reference=41211M76M00; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:53.150Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=4614; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=4615; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=2761; referenceNo=41211M76M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092413; VIN=MA3KFC42S00767426; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 091

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340023
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025080
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez deflecteur d pour ciaz ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6190
- Référence DB: 71831M79M00-5PK
- Désignation française (designation2): DEFLECTEUR D
- Désignation OEM (designation): BEZELRR REFLECTORR
- Search description: DEFLECTEUR D ; BEZELRR REFLECTORR
- Public price TTC: 76.291 TND (raw DB=76.2909)
- Wholesale/pre-tax price HT: 64.110 TND (raw DB=64.11; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3355; reference=71831M79M00-5PK; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.900Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (3): id=6879; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6880; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6881; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=4891; referenceNo=71831M79M00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025080; VIN=MA3AVC41S00340023; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 092

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG518957
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204623
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR VITESSE ROUE AR pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0204623; VIN=MBHKWDA3SSG518957; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 093

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448767
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019751
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb RACCORD DE CHAUFFAGE lel VITARA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0019751; VIN=TSMLYD21S00448767; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 094

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E27747
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180840
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CAPUCHON TIGE DE RENFORT pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3568
- Référence DB: 41724M55R00
- Désignation française (designation2): CAPUCHON TIGE DE RENFORT
- Désignation OEM (designation): CAP,STRUT ROD2
- Search description: CAPUCHON TIGE DE RENFORT ; CAP,STRUT ROD2
- Public price TTC: 16.030 TND (raw DB=16.03049)
- Wholesale/pre-tax price HT: 13.471 TND (raw DB=13.471; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1866; reference=41724M55R00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:42.040Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=17644; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17645; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=2841; referenceNo=41724M55R00; referenceType=3.0 | id=2842; referenceNo=41724M55R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180840; VIN=MBHCZC63S00E27747; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 095

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454891
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015759
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de CIRCLIP D’AXE DE PISTON pour une CELERIO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 129
- Référence DB: 09381M18002
- Désignation française (designation2): CIRCLIP D’AXE DE PISTON
- Désignation OEM (designation): CIRCLIP(OD:20.5)
- Search description: CIRCLIP D’AXE DE PISTON ; CIRCLIP(OD:20.5)
- Public price TTC: 3.475 TND (raw DB=3.4748)
- Wholesale/pre-tax price HT: 2.920 TND (raw DB=2.92; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7593; reference=09381M18002; totalQuantity=38; stockDisponible=0; stockConsolide=38; statut=Disponible; updatedAt=2026-09-20T19:01:42.642Z
- Availability rule: stockConsolide >= 2; actual quantity=38; expected=available
- Fitment rows (19): id=10160; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10161; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10162; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10163; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=10164; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10165; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10166; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=10167; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=366; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=367; modelName=AON312; typeCode=AON312-TYPE1 | id=368; modelName=APQ415; typeCode=APQ415-TYPE2 | id=369; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=370; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=371; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=372; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=373; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=374; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=375; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=376; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015759; VIN=MA3KFC42S00454891; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 096

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA642950
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045230
Variant: typo (PLAFONNIER -> PLFONNIER)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez LAMPE PLFONNIER pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 174
- Référence DB: 09471M12181
- Désignation française (designation2): LAMPE PLAFONNIER
- Désignation OEM (designation): BULB
- Search description: LAMPE PLAFONNIER ; BULB
- Public price TTC: 6.280 TND (raw DB=6.27963)
- Wholesale/pre-tax price HT: 5.277 TND (raw DB=5.277; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7631; reference=09471M12181; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:47.897Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (19): id=10426; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10427; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10428; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10429; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=10430; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10431; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10432; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=10433; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=535; modelName=AON312; typeCode=AON312-TYPE1 | id=536; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=537; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=538; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=539; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=540; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=541; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=542; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=543; modelName=AXM310; typeCode=AXM310-TYPE1 | id=544; modelName=AXM310; typeCode=AXM310-TYPE2 | id=545; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045230; VIN=MA3WB52SXLA642950; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 097

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG510420
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203601
Variant: exact
Generated category: PR

**UI prompt**

Je cherche COUVERCLE COLONNE DE DIRECTION pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0203601; VIN=MBHKWDA3SSG510420; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 098

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339585
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025075
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb SUPPORT DURITE HUILE EMBRAYAGE lel CIAZ. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0025075; VIN=MA3AVC41S00339585; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 099

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447453
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019733
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez baguette montant de porte ar g pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7164
- Référence DB: 77450-54P02-000
- Désignation française (designation2): BAGUETTE MONTANT DE PORTE AR G
- Désignation OEM (designation): GARNISH,RR D
- Search description: BAGUETTE MONTANT DE PORTE AR G ; GARNISH,RR D
- Public price TTC: 361.661 TND (raw DB=361.66123)
- Wholesale/pre-tax price HT: 303.917 TND (raw DB=303.917; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3904; reference=77450-54P02-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:39.020Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=7801; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7802; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5550; referenceNo=77450-54P02-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019733; VIN=TSMLYD21S00447453; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 100

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00472241
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022167
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR VITESSE ROUE AR D AKK416 pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4499
- Référence DB: 56310-61M00-000
- Désignation française (designation2): CAPTEUR VITESSE ROUE AR D AKK416
- Désignation OEM (designation): SENSOR,RR WHEEEL,R, AKK416
- Search description: CAPTEUR VITESSE ROUE AR D AKK416 ; SENSOR,RR WHEEEL,R, AKK416
- Public price TTC: 170.448 TND (raw DB=170.44846)
- Wholesale/pre-tax price HT: 143.234 TND (raw DB=143.234; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2372; reference=56310-61M00-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:42.005Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=5616; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5617; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3663; referenceNo=56310-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022167; VIN=TSMLYE21S00472241; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 101

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449580
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019568
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de COLLIER DE SERRAGE A RESSORT Ø 17,8 MM pour une VITARA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0019568; VIN=TSMLYE21S00449580; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 102

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: typo (VENTILATEUR -> VENITLATEUR)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez ECROU MOTEUR VENITLATEUR pour ma SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 1187
- Référence DB: 17129-56F00-000
- Désignation française (designation2): ECROU MOTEUR VENTILATEUR
- Désignation OEM (designation): SCREW, RW420D
- Search description: ECROU MOTEUR VENTILATEUR ; SCREW, RW420D
- Public price TTC: 21.704 TND (raw DB=21.70441)
- Wholesale/pre-tax price HT: 18.239 TND (raw DB=18.239; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=606; reference=17129-56F00-000; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:44.566Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (6): id=13322; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=13323; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=13324; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=13325; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2151; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=2152; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1056; referenceNo=17129-56F00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 103

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA654735
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045580
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SIGLE BALENO (CHROME) pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 7218
- Référence DB: 77831M68P00-0PG
- Désignation française (designation2): SIGLE BALENO (CHROME)
- Désignation OEM (designation): EMBLEM (CHROME)
- Search description: SIGLE BALENO (CHROME) ; EMBLEM (CHROME)
- Public price TTC: 38.586 TND (raw DB=38.58575)
- Wholesale/pre-tax price HT: 32.425 TND (raw DB=32.425; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3928; reference=77831M68P00-0PG; totalQuantity=21; stockDisponible=2; stockConsolide=21; statut=Disponible; updatedAt=2026-09-20T19:01:53.182Z
- Availability rule: stockConsolide >= 2; actual quantity=21; expected=available
- Fitment rows (2): id=22850; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=22851; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=5580; referenceNo=77831M68P00-0PG; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045580; VIN=MA3WB52S0LA654735; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 104

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448204
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019746
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CACHE-POUSSIERE D'OPTIQUE pour une VITARA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0019746; VIN=TSMLYD21S00448204; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 105

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00359893
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101077
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BAVETTE AV G lel ERTIGA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0101077; VIN=MA3BNC22S00359893; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 106

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588564
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189136
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez roue de secours pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3717
- Référence DB: 43290M68P00
- Désignation française (designation2): ROUE DE SECOURS
- Désignation OEM (designation): WHEEL,SPARE(15X4J)
- Search description: ROUE DE SECOURS ; WHEEL,SPARE(15X4J)
- Public price TTC: 239.854 TND (raw DB=239.85357)
- Wholesale/pre-tax price HT: 201.558 TND (raw DB=201.55762; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10927; reference=43290M68P00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:52.459Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (5): id=17895; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=17896; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=17897; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17898; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=4859; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189136; VIN=MBHCZF63S00588564; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 107

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S3LA642885
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042757
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche SUPPORT, GARDE-BOUE AV D pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4873
- Référence DB: 59233M68P00
- Désignation française (designation2): SUPPORT, GARDE-BOUE AV D
- Désignation OEM (designation): BRACKET, FRONT FENDER RH
- Search description: SUPPORT, GARDE-BOUE AV D ; BRACKET, FRONT FENDER RH
- Public price TTC: 4.510 TND (raw DB=4.5101)
- Wholesale/pre-tax price HT: 3.790 TND (raw DB=3.79; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2603; reference=59233M68P00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.312Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=19686; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19687; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (2): id=3992; referenceNo=59233M68P00; referenceType=3.0 | id=3993; referenceNo=59233M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042757; VIN=MA3WB52S3LA642885; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 108

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA654890
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045581
Variant: exact (no typo possible)
Generated category: ELECTRIQUE

**UI prompt**

Je cherche AIR BAG SIEGE AV G pour ma BALENO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0045581; VIN=MA3WB52S1LA654890; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 109

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG504193
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203539
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de ROULEMENT BV pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0203539; VIN=MBHKWDA3SSG504193; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 110

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00453551
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113753
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb DEMI-CARTER BOITE DE VITESSES D lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1835
- Référence DB: 24711M82R02
- Désignation française (designation2): DEMI-CARTER BOITE DE VITESSES D
- Désignation OEM (designation): CASE TRANSMISSION RIGHT
- Search description: DEMI-CARTER BOITE DE VITESSES D ; CASE TRANSMISSION RIGHT
- Public price TTC: 1649.687 TND (raw DB=1649.68748)
- Wholesale/pre-tax price HT: 1386.292 TND (raw DB=1386.292; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9161; reference=24711M82R02; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:43.975Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=14736; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=3025; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3026; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113753; VIN=MA3BNC22S00453551; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 111

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764280
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089260
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CHARNIERE DE PORTE AR H pour une CELERIO BVA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 5695
- Référence DB: 69410M68L00
- Désignation française (designation2): CHARNIERE DE PORTE AR H
- Désignation OEM (designation): HINGE, REAR DOOR UPPER RH
- Search description: CHARNIERE DE PORTE AR H ; HINGE, REAR DOOR UPPER RH
- Public price TTC: 59.451 TND (raw DB=59.45121)
- Wholesale/pre-tax price HT: 49.959 TND (raw DB=49.959; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3063; reference=69410M68L00; totalQuantity=14; stockDisponible=9; stockConsolide=14; statut=Disponible; updatedAt=2026-09-20T19:01:42.509Z
- Availability rule: stockConsolide >= 2; actual quantity=14; expected=available
- Fitment rows (14): id=20666; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=20667; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=20668; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=20669; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=20670; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=6546; modelName=APQ415; typeCode=APQ415-TYPE2 | id=6547; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=6548; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=6549; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6550; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6551; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=6552; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=6553; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=6554; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=4562; referenceNo=69410M68L00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089260; VIN=MA3KFC42S00764280; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 112

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E26964
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180844
Variant: typo (HARNESS -> HANRESS)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez HANRESS ASSY, SOCKET pour ma NEW SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0180844; VIN=MBHCZC63S00E26964; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 113

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588535
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189146
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez bloc de chauffage pour dzire ? prix ?

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
- Matched vehicle row: vehicleNo=VN0189146; VIN=MBHCZF63S00588535; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 114

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG499871
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203529
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche ISOLANT CABLE FREIN DE STATIONNEMENT pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0203529; VIN=MBHKWDA3SSG499871; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 115

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376245
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119745
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche SUPPORT AILE AV G pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4747
- Référence DB: 58416M62S00
- Désignation française (designation2): SUPPORT AILE AV G
- Désignation OEM (designation): BRACKET, FRONT FENDER LOWER LH
- Search description: SUPPORT AILE AV G ; BRACKET, FRONT FENDER LOWER LH
- Public price TTC: 33.853 TND (raw DB=33.85312)
- Wholesale/pre-tax price HT: 28.448 TND (raw DB=28.448; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2530; reference=58416M62S00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:53.531Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=5831; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=3874; referenceNo=58416M62S00; referenceType=3.0 | id=3875; referenceNo=58416M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119745; VIN=MA3RFL41S00376245; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 116

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455116
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014480
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CAPTEUR SORTIE EVAPORATEUR pour une CELERIO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0014480; VIN=MA3KFC42S00455116; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 117

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00361861
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119794
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
- Matched vehicle row: vehicleNo=VN0119794; VIN=MA3RFL41S00361861; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 118

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449895
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019580
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de CARDAN AVD pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3804
- Référence DB: 44101-54PB2-000
- Désignation française (designation2): CARDAN AVD
- Désignation OEM (designation): SHAFT,FRONT DRIVE APK416
- Search description: CARDAN AVD ; SHAFT,FRONT DRIVE APK416
- Public price TTC: 1982.720 TND (raw DB=1982.71969)
- Wholesale/pre-tax price HT: 1666.151 TND (raw DB=1666.151; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11009; reference=44101-54PB2-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:42.154Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=4931; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=3017; referenceNo=44101-54PB2; referenceType=3.0 | id=3018; referenceNo=44101-54PB2-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019580; VIN=TSMLYE21S00449895; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 119

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447523
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019734
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache capot pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0019734; VIN=TSMLYD21S00447523; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 120

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb COMMANDE CLEF FERMETURE CENTRALE lel SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 121

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E25237
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179263
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb FILTRE CHAUFFAGE lel NEW SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0179263; VIN=MBHCZC63S00E25237; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 122

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764083
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089283
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche JOINT TORIQUE RESERVOIR D'HUILE BOITE AGS pour ma CELERIO BVA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0089283; VIN=MA3KFC42S00764083; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 123

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455160
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014486
Variant: typo (CARBURANT -> CARRBURANT)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez GARNITURE RESERVOIR CARRBURANT pour ma CELERIO ?

**DB facts for comparison (do not paste)**

- Part DB id: 8919
- Référence DB: 89232M74L00
- Désignation française (designation2): GARNITURE RESERVOIR CARBURANT
- Désignation OEM (designation): COVER, FUEL FILLER NECK
- Search description: GARNITURE RESERVOIR CARBURANT ; COVER, FUEL FILLER NECK
- Public price TTC: 7.091 TND (raw DB=7.09121)
- Wholesale/pre-tax price HT: 5.959 TND (raw DB=5.959; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15839; reference=89232M74L00; totalQuantity=4; stockDisponible=0; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:46.216Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (17): id=25170; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=25171; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25172; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25173; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25174; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9223; modelName=AON312; typeCode=AON312-TYPE1 | id=9224; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9225; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9226; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=9227; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=9228; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=9229; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=9230; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9231; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=9232; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9233; modelName=AXM310; typeCode=AXM310-TYPE2 | id=9234; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0014486; VIN=MA3KFC42S00455160; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 124

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767440
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092425
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez capteur refrigerant pour celerio bva ? prix ?

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
- Matched vehicle row: vehicleNo=VN0092425; VIN=MA3KFC42S00767440; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 125

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BOITIER CONSOLE CENTRALE pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 126

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339479
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025097
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez VOLANT CIAZ pour une CIAZ ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4031
- Référence DB: 48110M79MC0-C48
- Désignation française (designation2): VOLANT CIAZ
- Désignation OEM (designation): WHEEL S/ASSYSTEERING
- Search description: VOLANT CIAZ ; WHEEL S/ASSYSTEERING
- Public price TTC: 679.519 TND (raw DB=679.51856)
- Wholesale/pre-tax price HT: 571.024 TND (raw DB=571.024; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11231; reference=48110M79MC0-C48; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:55.738Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=5126; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (1): id=3222; referenceNo=48110M79MC0-C48; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025097; VIN=MA3AVC41S00339479; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 127

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454767
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014461
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb RENFORT PASSAGE DE ROUE AR D lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 5055
- Référence DB: 63413M76M00
- Désignation française (designation2): RENFORT PASSAGE DE ROUE AR D
- Désignation OEM (designation): REINF RR WHEEL HOUSE FR R
- Search description: RENFORT PASSAGE DE ROUE AR D ; REINF RR WHEEL HOUSE FR R
- Public price TTC: 55.440 TND (raw DB=55.43972)
- Wholesale/pre-tax price HT: 46.588 TND (raw DB=46.588; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2697; reference=63413M76M00; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:52.062Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=6097; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=6098; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=4128; referenceNo=63413M76M00; referenceType=3.0 | id=4129; referenceNo=63413M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014461; VIN=MA3KFC42S00454767; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 128

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31949
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180817
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de BOUTON DEMARRAGE MOTEUR START/STOP pour une NEW SWIFT, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2817
- Référence DB: 37290M56R00
- Désignation française (designation2): BOUTON DEMARRAGE MOTEUR START/STOP
- Désignation OEM (designation): SWITCH ASSY, ENGINE START
- Search description: BOUTON DEMARRAGE MOTEUR START/STOP ; SWITCH ASSY, ENGINE START
- Public price TTC: 371.999 TND (raw DB=371.99887)
- Wholesale/pre-tax price HT: 312.604 TND (raw DB=312.60409; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1443; reference=37290M56R00; totalQuantity=2; stockDisponible=1; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.244Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (4): id=16329; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16330; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3943; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3944; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180817; VIN=MBHCZC63S00E31949; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 129

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588993
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189120
Variant: typo (CONDUCTEUR -> CONDUTCEUR)
Generated category: PR

**UI prompt**

Bonjour, vous avez CADRE SIEGE CONDUTCEUR pour ma DZIRE ?

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

## Case 130

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1797
- Référence DB: 24411M67P00
- Désignation française (designation2): MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME
- Désignation OEM (designation): HUB,LOW SPEED SYNC
- Search description: MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME ; HUB,LOW SPEED SYNC
- Public price TTC: 82.975 TND (raw DB=82.97513)
- Wholesale/pre-tax price HT: 69.727 TND (raw DB=69.727; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9125; reference=24411M67P00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:49.089Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (8): id=14568; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14569; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14570; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14571; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2920; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2921; modelName=AON312; typeCode=AON312-TYPE1 | id=2922; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2923; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=1538; referenceNo=24411M67P00; referenceType=3.0 | id=1539; referenceNo=24411M67P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 131

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449431
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019558
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez joint vase d'eau pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3128
- Référence DB: 38453-61L00-000
- Désignation française (designation2): JOINT VASE D'EAU
- Désignation OEM (designation): GROMMET,WASHER PUMP AZH412
- Search description: JOINT VASE D'EAU ; GROMMET,WASHER PUMP AZH412
- Public price TTC: 32.044 TND (raw DB=32.04432)
- Wholesale/pre-tax price HT: 26.928 TND (raw DB=26.928; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1649; reference=38453-61L00-000; totalQuantity=14; stockDisponible=14; stockConsolide=14; statut=Disponible; updatedAt=2026-09-20T19:01:47.540Z
- Availability rule: stockConsolide >= 2; actual quantity=14; expected=available
- Fitment rows (2): id=4298; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=4299; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2545; referenceNo=38453-61L00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019558; VIN=TSMLYE21S00449431; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 132

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513041
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189298
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
- Matched vehicle row: vehicleNo=VN0189298; VIN=MA3AVC71S00513041; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 133

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00324040
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0092579
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez SUPPORT PLANCHIER AR pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0092579; VIN=MA3BNC22S00324040; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 134

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E28196
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180827
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche RESSORT A BOUDIN AV pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 3470
- Référence DB: 41111M55R01
- Désignation française (designation2): RESSORT A BOUDIN AV
- Désignation OEM (designation): SPRING FRONT COIL
- Search description: RESSORT A BOUDIN AV ; SPRING FRONT COIL
- Public price TTC: 132.902 TND (raw DB=132.90158)
- Wholesale/pre-tax price HT: 111.682 TND (raw DB=111.682; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10690; reference=41111M55R01; totalQuantity=8; stockDisponible=0; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:52.126Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (2): id=17481; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=17482; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180827; VIN=MBHCZC63S00E28196; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 135

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447130
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019730
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de GARNITURE D'AILE AVANT GAUCHE pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6586
- Référence DB: 72620-54P10-C48
- Désignation française (designation2): GARNITURE D'AILE AVANT GAUCHE
- Désignation OEM (designation): GARNISH, FR FENDER LH
- Search description: GARNITURE D'AILE AVANT GAUCHE ; GARNISH, FR FENDER LH
- Public price TTC: 134.448 TND (raw DB=134.44776)
- Wholesale/pre-tax price HT: 112.981 TND (raw DB=112.98131; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13604; reference=72620-54P10-C48; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:45.928Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=7263; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7264; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5187; referenceNo=72620-54P10-C480; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019730; VIN=TSMLYD21S00447130; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 136

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00512927
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189290
Variant: typo (CALCULATEUR -> CALCULATEEUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CALCULATEEUR ECM pour ma CIAZ ?

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
- Matched vehicle row: vehicleNo=VN0189290; VIN=MA3AVC71S00512927; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 137

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767424
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092423
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez ecrou hexagonal m8 pour celerio bva ? prix ?

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
- Matched vehicle row: vehicleNo=VN0092423; VIN=MA3KFC42S00767424; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 138

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00361771
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119793
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb SOUFFLET ACTIONNEUR EMBRAYAGE AGS lel SPRESSO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1905
- Référence DB: 26424M76ME0
- Désignation française (designation2): SOUFFLET ACTIONNEUR EMBRAYAGE AGS
- Désignation OEM (designation): BOOT, CLUTCH ACTUATOR
- Search description: SOUFFLET ACTIONNEUR EMBRAYAGE AGS ; BOOT, CLUTCH ACTUATOR
- Public price TTC: 108.954 TND (raw DB=108.95402)
- Wholesale/pre-tax price HT: 91.558 TND (raw DB=91.55800000000001; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=970; reference=26424M76ME0; totalQuantity=4; stockDisponible=2; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:53.341Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (6): id=14933; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14934; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3121; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3122; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3123; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3124; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119793; VIN=MA3RFL41S00361771; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 139

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7KA599652
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037475
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche ADHESIF PORTE AV G 2 pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 8120
- Référence DB: 83924M68P10-0CB
- Désignation française (designation2): ADHESIF PORTE AV G 2
- Désignation OEM (designation): TAPE,FRONT DOOR OUTER RR,
- Search description: ADHESIF PORTE AV G 2 ; TAPE,FRONT DOOR OUTER RR,
- Public price TTC: 67.866 TND (raw DB=67.8657)
- Wholesale/pre-tax price HT: 57.030 TND (raw DB=57.03; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4420; reference=83924M68P10-0CB; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:37.736Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=24133; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (1): id=6230; referenceNo=83924M68P10-0CB; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0037475; VIN=MA3WB52S7KA599652; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 140

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764161
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089557
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb PONT REDRESSEUR ALTERNATEUR lel CELERIO BVA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0089557; VIN=MA3KFC42S00764161; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 141

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455139
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014483
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez capuchon verrou raccord cable embrayage pour celerio ? prix ?

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
- Matched vehicle row: vehicleNo=VN0014483; VIN=MA3KFC42S00455139; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 142

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522216
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203530
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez SOUFFLET DE CREMAILLERE pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4122
- Référence DB: 48571M72R00
- Désignation française (designation2): SOUFFLET DE CREMAILLERE
- Désignation OEM (designation): .BOOT, STRG
- Search description: SOUFFLET DE CREMAILLERE ; .BOOT, STRG
- Public price TTC: 39.382 TND (raw DB=39.38186)
- Wholesale/pre-tax price HT: 33.094 TND (raw DB=33.094; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2148; reference=48571M72R00; totalQuantity=4; stockDisponible=2; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:53.360Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (4): id=18475; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18476; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5198; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5199; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203530; VIN=MBHKWDA3SSG522216; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 143

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339970
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025068
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de PASSAGE DE ROUE AR D pour une CIAZ, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5064
- Référence DB: 63480M79M50
- Désignation française (designation2): PASSAGE DE ROUE AR D
- Désignation OEM (designation): PANEL,WHEEL HOUSE OUTER,R
- Search description: PASSAGE DE ROUE AR D ; PANEL,WHEEL HOUSE OUTER,R
- Public price TTC: 234.638 TND (raw DB=234.63825)
- Wholesale/pre-tax price HT: 197.175 TND (raw DB=197.175; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12214; reference=63480M79M50; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:50.239Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=6104; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=6105; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=6106; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025068; VIN=MA3AVC41S00339970; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 144

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG509520
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203613
Variant: typo (CATADIOPTRE -> CATADIOOPTRE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CATADIOOPTRE AR pour ma FRONX ?

**DB facts for comparison (do not paste)**

- Part DB id: 2524
- Référence DB: 35950M72S00
- Désignation française (designation2): CATADIOPTRE AR
- Désignation OEM (designation): REFLECTOR ASSY,REAR
- Search description: CATADIOPTRE AR ; REFLECTOR ASSY,REAR
- Public price TTC: 58.994 TND (raw DB=58.99425)
- Wholesale/pre-tax price HT: 49.575 TND (raw DB=49.575; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9797; reference=35950M72S00; totalQuantity=48; stockDisponible=0; stockConsolide=48; statut=Disponible; updatedAt=2026-09-20T19:01:42.222Z
- Availability rule: stockConsolide >= 2; actual quantity=48; expected=available
- Fitment rows (2): id=15858; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=15859; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203613; VIN=MBHKWDA3SSG509520; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 145

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00472556
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022171
Variant: exact
Generated category: PR

**UI prompt**

Je cherche JEU DE CALE ROULEMENT LAT DIFFERENTIEL pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0022171; VIN=TSMLYE21S00472556; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 146

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588994
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189119
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de RENFORT COLLECTEUR D'ECHAPPEMENT pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 927
- Référence DB: 14271M73K00
- Désignation française (designation2): RENFORT COLLECTEUR D'ECHAPPEMENT
- Désignation OEM (designation): STIFFENER, EXH MANF
- Search description: RENFORT COLLECTEUR D'ECHAPPEMENT ; STIFFENER, EXH MANF
- Public price TTC: 53.692 TND (raw DB=53.69161)
- Wholesale/pre-tax price HT: 45.119 TND (raw DB=45.119; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8331; reference=14271M73K00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.016Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (12): id=12776; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12777; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=12778; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=12779; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=12780; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12781; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=12782; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=1836; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=1837; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=1838; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1839; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1840; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0189119; VIN=MBHCZF63S00588994; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 147

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG512319
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203610
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez BALAIS ESSUI GLASS AR pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0203610; VIN=MBHKWDA3SSG512319; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 148

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00D99810
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0173531
Variant: typo (CAPTEUR -> CAPETUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez BOUTON CAPETUR PARKING pour ma NEW SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0173531; VIN=MBHCZC63S00D99810; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 149

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588703
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192970
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez levier frein a main pour dzire ? prix ?

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
- Matched vehicle row: vehicleNo=VN0192970; VIN=MBHCZF63S00588703; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 150

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455012
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015739
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb ENSEMBLE RESERVOIR D'HUILE BOITE AGS lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1651
- Référence DB: 2290TM76ME0
- Désignation française (designation2): ENSEMBLE RESERVOIR D'HUILE BOITE AGS
- Désignation OEM (designation): TANK SET, OIL
- Search description: ENSEMBLE RESERVOIR D'HUILE BOITE AGS ; TANK SET, OIL
- Public price TTC: 105.672 TND (raw DB=105.672)
- Wholesale/pre-tax price HT: 88.800 TND (raw DB=88.8; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8986; reference=2290TM76ME0; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:44.796Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (2): id=2660; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2661; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015739; VIN=MA3KFC42S00455012; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 151

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449533
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019565
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez GARNITURE D'AILE AV D pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6585
- Référence DB: 72610-54P10-C48
- Désignation française (designation2): GARNITURE D'AILE AV D
- Désignation OEM (designation): GARNISH, FR FENDER RH
- Search description: GARNITURE D'AILE AV D ; GARNISH, FR FENDER RH
- Public price TTC: 141.170 TND (raw DB=141.1697)
- Wholesale/pre-tax price HT: 118.630 TND (raw DB=118.63; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3594; reference=72610-54P10-C48; totalQuantity=11; stockDisponible=11; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:45.926Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (2): id=7261; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7262; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5186; referenceNo=72610-54P10-C480; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019565; VIN=TSMLYE21S00449533; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 152

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG510160
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203604
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
- Matched vehicle row: vehicleNo=VN0203604; VIN=MBHKWDA3SSG510160; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 153

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00410332
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0013919
Variant: exact
Generated category: PR

**UI prompt**

Je cherche JOINT PORTE AV D pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6968
- Référence DB: 76291-54P00-000
- Désignation française (designation2): JOINT PORTE AV D
- Désignation OEM (designation): TRIM,FR DR OPNG,R
- Search description: JOINT PORTE AV D ; TRIM,FR DR OPNG,R
- Public price TTC: 283.184 TND (raw DB=283.1843)
- Wholesale/pre-tax price HT: 237.970 TND (raw DB=237.97; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13966; reference=76291-54P00-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:47.471Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=7600; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7601; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0013919; VIN=TSMLYE21S00410332; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 154

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb PISTON D'EMBRAYAGE lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1904
- Référence DB: 2641TM76ME0
- Désignation française (designation2): PISTON D'EMBRAYAGE
- Désignation OEM (designation): ANCHOR SET,CLUTCH ACTUATOR
- Search description: PISTON D'EMBRAYAGE ; ANCHOR SET,CLUTCH ACTUATOR
- Public price TTC: 19.673 TND (raw DB=19.67308)
- Wholesale/pre-tax price HT: 16.532 TND (raw DB=16.532; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=969; reference=2641TM76ME0; totalQuantity=7; stockDisponible=7; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:50.574Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (5): id=14928; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14929; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3118; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3119; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3120; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 155

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587818
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183506
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de BAGUETTE LEVIER pour une DZIRE, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6858
- Référence DB: 75851M56R00-5PK
- Désignation française (designation2): BAGUETTE LEVIER
- Désignation OEM (designation): GARNISH,FLOOR CONSOLE BOX FR
- Search description: BAGUETTE LEVIER ; GARNISH,FLOOR CONSOLE BOX FR
- Public price TTC: 33.528 TND (raw DB=33.52825)
- Wholesale/pre-tax price HT: 28.175 TND (raw DB=28.175; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3741; reference=75851M56R00-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:38.978Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22239; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22240; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5367; referenceNo=75851M56R00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0183506; VIN=MBHCZF63S00587818; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 156

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00765165
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092403
Variant: typo (CAPTEUR -> CAPEUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CAPEUR DE CHOCK pour ma CELERIO BVA ?

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
- Matched vehicle row: vehicleNo=VN0092403; VIN=MA3KFC42S00765165; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 157

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00470830
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022147
Variant: typo (TABLEAU -> TABBLEAU)
Generated category: PR

**UI prompt**

Bonjour, vous avez FAISCEAU ELECTRIQUE TABBLEAU DE BORD pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 2689
- Référence DB: 36902-54PU0-000
- Désignation française (designation2): FAISCEAU ELECTRIQUE TABLEAU DE BORD
- Désignation OEM (designation): HARNESS ASSY,I/P
- Search description: FAISCEAU ELECTRIQUE TABLEAU DE BORD ; HARNESS ASSY,I/P
- Public price TTC: 5165.547 TND (raw DB=5165.54745)
- Wholesale/pre-tax price HT: 4340.796 TND (raw DB=4340.79618; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9950; reference=36902-54PU0-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:45.008Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (1): id=3817; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0022147; VIN=TSMLYE21S00470830; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 158

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00403773
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0106758
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CIRCLIP MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0106758; VIN=MA3BNC22S00403773; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 159

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E30207
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180841
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche JOINT INF VITRE AR pour ma NEW SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7941
- Référence DB: 83691M63J00
- Désignation française (designation2): JOINT INF VITRE AR
- Désignation OEM (designation): RUBBER, RR GLASS BOTTOM
- Search description: JOINT INF VITRE AR ; RUBBER, RR GLASS BOTTOM
- Public price TTC: 17.767 TND (raw DB=17.7667)
- Wholesale/pre-tax price HT: 14.930 TND (raw DB=14.93; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4322; reference=83691M63J00; totalQuantity=13; stockDisponible=0; stockConsolide=13; statut=Disponible; updatedAt=2026-09-20T19:01:47.281Z
- Availability rule: stockConsolide >= 2; actual quantity=13; expected=available
- Fitment rows (7): id=23853; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=23854; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=8472; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=8473; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=8474; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=8475; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=8476; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=6119; referenceNo=83691M63J00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180841; VIN=MBHCZC63S00E30207; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 160

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378413
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119743
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez troisieme feu de stop pour spresso ? prix ?

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
- Matched vehicle row: vehicleNo=VN0119743; VIN=MA3RFL41S00378413; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 161

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446503
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018459
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb SOUFFLET, LEVIER DE VITESSES lel VITARA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0018459; VIN=TSMLYD21S00446503; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 162

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654920
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045578
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de JOINT, CARTER D'HUILE pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 359
- Référence DB: 11518M68K00
- Désignation française (designation2): JOINT, CARTER D'HUILE
- Désignation OEM (designation): O-RING,OIL PAN
- Search description: JOINT, CARTER D'HUILE ; O-RING,OIL PAN
- Public price TTC: 1.937 TND (raw DB=1.93732)
- Wholesale/pre-tax price HT: 1.628 TND (raw DB=1.628; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=184; reference=11518M68K00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:47.572Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (21): id=10809; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=10810; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=10811; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=10812; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=10813; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=10814; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=10815; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=10816; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=769; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=770; modelName=AON312; typeCode=AON312-TYPE1 | id=771; modelName=APQ415; typeCode=APQ415-TYPE2 | id=772; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=773; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=774; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=775; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=776; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=777; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=778; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=779; modelName=AXM310; typeCode=AXM310-TYPE1 | id=780; modelName=AXM310; typeCode=AXM310-TYPE2 | id=781; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=332; referenceNo=11518M68K00; referenceType=3.0 | id=333; referenceNo=11518M68K00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045578; VIN=MA3WB52S6LA654920; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 163

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471438
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022155
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche DEFLECTEURE TOIT PANORAMIQUE pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7324
- Référence DB: 78771-54P00-000
- Désignation française (designation2): DEFLECTEURE TOIT PANORAMIQUE
- Désignation OEM (designation): DEFLECTOR,SLIDING ROOF APK416
- Search description: DEFLECTEURE TOIT PANORAMIQUE ; DEFLECTOR,SLIDING ROOF APK416
- Public price TTC: 433.146 TND (raw DB=433.14572)
- Wholesale/pre-tax price HT: 363.988 TND (raw DB=363.988; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14309; reference=78771-54P00-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.917Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (3): id=7924; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7925; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=7926; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (1): id=5660; referenceNo=78771-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022155; VIN=TSMLYE21S00471438; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 164

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00766542
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0093373
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez DEMARREUR POP pour une CELERIO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0093373; VIN=MA3KFC42S00766542; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE2

## Case 165

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de CACHE EXT SIEGE CONDUCTEUR pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 166

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767428
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092429
Variant: typo (RONDELLE -> RONDELLLE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez RONDELLLE ELASTIQUE DE PIGNON DE DIFFERENTIEL pour ma CELERIO BVA ?

**DB facts for comparison (do not paste)**

- Part DB id: 66
- Référence DB: 09164-35003-000
- Désignation française (designation2): RONDELLE ELASTIQUE DE PIGNON DE DIFFERENTIEL
- Désignation OEM (designation): WASHER
- Search description: RONDELLE ELASTIQUE DE PIGNON DE DIFFERENTIEL ; WASHER
- Public price TTC: 32.100 TND (raw DB=32.10025)
- Wholesale/pre-tax price HT: 26.975 TND (raw DB=26.975; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=43; reference=09164-35003-000; totalQuantity=18; stockDisponible=0; stockConsolide=18; statut=Disponible; updatedAt=2026-09-20T19:01:52.409Z
- Availability rule: stockConsolide >= 2; actual quantity=18; expected=available
- Fitment rows (8): id=9935; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=9936; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=9937; modelName=A6G415-TYPE1; typeCode=A6G415-TYPE1 | id=236; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=237; modelName=APQ415; typeCode=APQ415-TYPE2 | id=238; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=239; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=240; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0092429; VIN=MA3KFC42S00767428; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 167

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588109
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189215
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez adhesif av porte av g pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 8093
- Référence DB: 83922M55R00-0CB
- Désignation française (designation2): ADHESIF AV PORTE AV G
- Désignation OEM (designation): TAPE, FRONT DOOR OUTER FR LH
- Search description: ADHESIF AV PORTE AV G ; TAPE, FRONT DOOR OUTER FR LH
- Public price TTC: 64.331 TND (raw DB=64.3314)
- Wholesale/pre-tax price HT: 54.060 TND (raw DB=54.06; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4406; reference=83922M55R00-0CB; totalQuantity=42; stockDisponible=0; stockConsolide=42; statut=Disponible; updatedAt=2026-09-20T19:01:37.597Z
- Availability rule: stockConsolide >= 2; actual quantity=42; expected=available
- Fitment rows (2): id=24103; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=24104; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=6215; referenceNo=83922M55R00-0CB; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189215; VIN=MBHCZF63S00588109; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 168

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S4LA654849
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045588
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CALCULATEUR BOITE DE VITESSE lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 3255
- Référence DB: 38880-68PB0-000
- Désignation française (designation2): CALCULATEUR BOITE DE VITESSE
- Désignation OEM (designation): CONTROLLER ASSY. AT
- Search description: CALCULATEUR BOITE DE VITESSE ; CONTROLLER ASSY. AT
- Public price TTC: 2843.262 TND (raw DB=2843.26224)
- Wholesale/pre-tax price HT: 2389.296 TND (raw DB=2389.296; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1725; reference=38880-68PB0-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:41.541Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=17188; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=17189; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=2645; referenceNo=38880-68PB0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045588; VIN=MA3WB52S4LA654849; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 169

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG498499
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203515
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez pulseur d'air habitacle pour fronx ? prix ?

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
- Matched vehicle row: vehicleNo=VN0203515; VIN=MBHKWDA3SSG498499; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 170

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00375909
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119788
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PARE A HUILE DIFFERENTIEL G pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119788; VIN=MA3RFL41S00375909; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 171

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0KA599184
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037467
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb CACHE SOUS CAPOT D lel BALENO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0037467; VIN=MA3WB52S0KA599184; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 172

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513707
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189294
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CALCULATEUR ENSEMBLE pour une CIAZ, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189294; VIN=MA3AVC71S00513707; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 173

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3STG641650
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE2
Vehicle number (DB cross-check only): VN0217467
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0217467; VIN=MBHKWDA3STG641650; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE2

## Case 174

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31539
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180825
Variant: typo (VITESSE -> VITTESSE)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez CIRCLIP ARBRE DE CONTRE 5ÈME VITTESSE T2.30 pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 1778
- Référence DB: 24392M76M00-230
- Désignation française (designation2): CIRCLIP ARBRE DE CONTRE 5ÈME VITESSE T2.30
- Désignation OEM (designation): CIRCLIP,CTSHFT 5TH GR T2.30
- Search description: CIRCLIP ARBRE DE CONTRE 5ÈME VITESSE T2.30 ; CIRCLIP,CTSHFT 5TH GR T2.30
- Public price TTC: 6.063 TND (raw DB=6.06305)
- Wholesale/pre-tax price HT: 5.095 TND (raw DB=5.095; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9108; reference=24392M76M00-230; totalQuantity=20; stockDisponible=0; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:42.637Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (8): id=14512; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14513; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2882; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2883; modelName=AON312; typeCode=AON312-TYPE1 | id=2884; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2885; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2886; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2887; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180825; VIN=MBHCZC63S00E31539; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 175

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00444116
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018437
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CACHE SOUS PLANCHER PRINCIPAL pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6625
- Référence DB: 72823-61M00-000
- Désignation française (designation2): CACHE SOUS PLANCHER PRINCIPAL
- Désignation OEM (designation): COVER,MAIN FLOOR UNDER AKK416
- Search description: CACHE SOUS PLANCHER PRINCIPAL ; COVER,MAIN FLOOR UNDER AKK416
- Public price TTC: 497.128 TND (raw DB=497.12845)
- Wholesale/pre-tax price HT: 417.755 TND (raw DB=417.755; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13643; reference=72823-61M00-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.333Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=7298; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018437; VIN=TSMLYD21S00444116; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 176

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339872
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025108
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb ANTI BROUILLARD AR lel CIAZ. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0025108; VIN=MA3AVC41S00339872; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 177

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445702
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018450
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez bague ext du roulement pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0018450; VIN=TSMLYD21S00445702; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 178

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364690
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101065
Variant: typo (SYNCHRO -> SYCHRO)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez SYCHRO 2 EME VITESSE pour ma ERTIGA ?

**DB facts for comparison (do not paste)**

- Part DB id: 1762
- Référence DB: 24321M60M01
- Désignation française (designation2): SYNCHRO 2 EME VITESSE
- Désignation OEM (designation): GEAR COUNTERSHAFT 2ND
- Search description: SYNCHRO 2 EME VITESSE ; GEAR COUNTERSHAFT 2ND
- Public price TTC: 334.636 TND (raw DB=334.63633)
- Wholesale/pre-tax price HT: 281.207 TND (raw DB=281.207; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9092; reference=24321M60M01; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.361Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (4): id=2830; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2831; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=2832; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2833; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0101065; VIN=MA3BNC22S00364690; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 179

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7LA642615
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042633
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de GARNITURE LENGERON pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4790
- Référence DB: 58615M68P00
- Désignation française (designation2): GARNITURE LENGERON
- Désignation OEM (designation): ..PLATE, APRON SIDE MEMBE
- Search description: GARNITURE LENGERON ; ..PLATE, APRON SIDE MEMBE
- Public price TTC: 121.537 TND (raw DB=121.53708)
- Wholesale/pre-tax price HT: 102.132 TND (raw DB=102.132; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2550; reference=58615M68P00; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:46.011Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (2): id=19515; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19516; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=3916; referenceNo=58615M68P00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042633; VIN=MA3WB52S7LA642615; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 180

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376261
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119747
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche FAISCEAU INTERIEUR pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119747; VIN=MA3RFL41S00376261; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 181

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: typo (Engrenage -> Engrengae)
Generated category: PR

**UI prompt**

Bonjour, vous avez Engrengae de 5e vitesse de l’arbre primaire pour ma SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 182

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767448
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092417
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez DURITE CONDENSEUR BAS pour une CELERIO BVA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9086
- Référence DB: 95720M76M00
- Désignation française (designation2): DURITE CONDENSEUR BAS
- Désignation OEM (designation): HOSE,DISCHARGE
- Search description: DURITE CONDENSEUR BAS ; HOSE,DISCHARGE
- Public price TTC: 193.875 TND (raw DB=193.8748)
- Wholesale/pre-tax price HT: 162.920 TND (raw DB=162.92; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15994; reference=95720M76M00; totalQuantity=2; stockDisponible=1; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:44.358Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=9442; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9443; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=6867; referenceNo=95720M76M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0092417; VIN=MA3KFC42S00767448; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 183

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376282
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119785
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb BAGUETTE JOINT DE VITRE DROIT lel SPRESSO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 7987
- Référence DB: 83811M62S00
- Désignation française (designation2): BAGUETTE JOINT DE VITRE DROIT
- Désignation OEM (designation): WEATHERSTRIP,FRONT DOOR OUT,RH
- Search description: BAGUETTE JOINT DE VITRE DROIT ; WEATHERSTRIP,FRONT DOOR OUT,RH
- Public price TTC: 54.197 TND (raw DB=54.19736)
- Wholesale/pre-tax price HT: 45.544 TND (raw DB=45.544; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14942; reference=83811M62S00; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:38.966Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (1): id=8514; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=6140; referenceNo=83811M62S00; referenceType=3.0 | id=6141; referenceNo=83811M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119785; VIN=MA3RFL41S00376282; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 184

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00324286
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0092577
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de FEU AR FIXE pour une ERTIGA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0092577; VIN=MA3BNC22S00324286; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 185

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454933
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015741
Variant: exact
Generated category: PR

**UI prompt**

Je cherche JOINT TABLEAU DU BORD pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6656
- Référence DB: 73114M76M00
- Désignation française (designation2): JOINT TABLEAU DU BORD
- Désignation OEM (designation): SILENCER I/P TOP
- Search description: JOINT TABLEAU DU BORD ; SILENCER I/P TOP
- Public price TTC: 163.524 TND (raw DB=163.52385)
- Wholesale/pre-tax price HT: 137.415 TND (raw DB=137.415; do not present as customer price)
- Unit: PCS
- Category: PR
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13675; reference=73114M76M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:47.496Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=7324; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=7325; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015741; VIN=MA3KFC42S00454933; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 186

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00447716
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113764
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez boulon de triangle de suspension av pour ertiga ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3979
- Référence DB: 45861M68P10
- Désignation française (designation2): BOULON DE TRIANGLE DE SUSPENSION AV
- Désignation OEM (designation): BOLT, SPNSN ARM FR BUSHING
- Search description: BOULON DE TRIANGLE DE SUSPENSION AV ; BOLT, SPNSN ARM FR BUSHING
- Public price TTC: 46.875 TND (raw DB=46.87529)
- Wholesale/pre-tax price HT: 39.391 TND (raw DB=39.391; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11182; reference=45861M68P10; totalQuantity=40; stockDisponible=0; stockConsolide=40; statut=Disponible; updatedAt=2026-09-20T19:01:40.196Z
- Availability rule: stockConsolide >= 2; actual quantity=40; expected=available
- Fitment rows (10): id=18270; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=18271; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=18272; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=18273; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=18274; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=18275; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18276; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5083; modelName=AON312; typeCode=AON312-TYPE1 | id=5084; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5085; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113764; VIN=MA3BNC22S00447716; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 187

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448545
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019748
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche OUTIL DE GUIDAGE DE ROUE M12 pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 44
- Référence DB: 09119-12022-000
- Désignation française (designation2): OUTIL DE GUIDAGE DE ROUE M12
- Désignation OEM (designation): TOOL,WHEEL HANGER
- Search description: OUTIL DE GUIDAGE DE ROUE M12 ; TOOL,WHEEL HANGER
- Public price TTC: 96.294 TND (raw DB=96.29361)
- Wholesale/pre-tax price HT: 80.919 TND (raw DB=80.919; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=26; reference=09119-12022-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:49.348Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=168; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=169; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=49; referenceNo=09119-12022-000; referenceType=3.0 | id=50; referenceNo=09119-12022-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019748; VIN=TSMLYD21S00448545; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 188

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339728
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025094
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CALCULATEUR ENSEMBLE EPI / ECM pour une CIAZ, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 2221
- Référence DB: 33920M79M40
- Désignation française (designation2): CALCULATEUR ENSEMBLE EPI / ECM
- Désignation OEM (designation): CONTROLLER ASSY,EPI-A/C
- Search description: CALCULATEUR ENSEMBLE EPI / ECM ; CONTROLLER ASSY,EPI-A/C
- Public price TTC: 1297.057 TND (raw DB=1297.05716)
- Wholesale/pre-tax price HT: 1089.964 TND (raw DB=1089.964; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1096; reference=33920M79M40; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.580Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=3402; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (2): id=1782; referenceNo=33920M79M40; referenceType=3.0 | id=1783; referenceNo=33920M79M40-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025094; VIN=MA3AVC41S00339728; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 189

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340169
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025105
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb CACHE CABLE FREIN MAIN lel CIAZ. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0025105; VIN=MA3AVC41S00340169; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 190

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449556
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019566
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez boulon poulie tendeur pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0019566; VIN=TSMLYE21S00449556; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 191

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445533
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018449
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SUPPORT PLAQUE pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6049
- Référence DB: 71771-54P00-PSD
- Désignation française (designation2): SUPPORT PLAQUE
- Désignation OEM (designation): GARNISH, FR BUMPER LICENSE
- Search description: SUPPORT PLAQUE ; GARNISH, FR BUMPER LICENSE
- Public price TTC: 438.608 TND (raw DB=438.60782)
- Wholesale/pre-tax price HT: 368.578 TND (raw DB=368.578; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3277; reference=71771-54P00-PSD; totalQuantity=31; stockDisponible=0; stockConsolide=31; statut=Disponible; updatedAt=2026-09-20T19:01:54.171Z
- Availability rule: stockConsolide >= 2; actual quantity=31; expected=available
- Fitment rows (1): id=6799; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=4795; referenceNo=71771-54P00-PSD0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018449; VIN=TSMLYD21S00445533; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 192

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589175
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189222
Variant: typo (BOUCHON -> BOUHON)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez BOUHON BOUTON D'OPTION pour ma DZIRE ?

**DB facts for comparison (do not paste)**

- Part DB id: 2814
- Référence DB: 37285M66R00
- Désignation française (designation2): BOUCHON BOUTON D'OPTION
- Désignation OEM (designation): CAP, OPTION SW HOLE
- Search description: BOUCHON BOUTON D'OPTION ; CAP, OPTION SW HOLE
- Public price TTC: 2.885 TND (raw DB=2.88456)
- Wholesale/pre-tax price HT: 2.424 TND (raw DB=2.424; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1441; reference=37285M66R00; totalQuantity=4; stockDisponible=3; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:39.948Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (7): id=16316; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16317; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=16318; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=3935; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3936; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3937; modelName=AXM310; typeCode=AXM310-TYPE1 | id=3938; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=2252; referenceNo=37285M66R00; referenceType=3.0 | id=2253; referenceNo=37285M66R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189222; VIN=MBHCZF63S00589175; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 193

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG526856
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204669
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb CAPUCHON DE VERROUILLAGE lel FRONX. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0204669; VIN=MBHKWDA3SSG526856; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 194

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760238
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089243
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez tuyaux flexibles de frein ar d pour celerio bva ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 4241
- Référence DB: 51510M76M00
- Désignation française (designation2): TUYAUX FLEXIBLES DE FREIN AR D
- Désignation OEM (designation): PIPE,RR BK HOSE TO RR W/C,R
- Search description: TUYAUX FLEXIBLES DE FREIN AR D ; PIPE,RR BK HOSE TO RR W/C,R
- Public price TTC: 44.204 TND (raw DB=44.20374)
- Wholesale/pre-tax price HT: 37.146 TND (raw DB=37.146; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2222; reference=51510M76M00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:55.338Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=5349; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=5350; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (2): id=3400; referenceNo=51510M76M00; referenceType=3.0 | id=3401; referenceNo=51510M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089243; VIN=MA3KFC42S00760238; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 195

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445869
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018452
Variant: typo (POIGNEE -> POIGENE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez COUVERCLE POIGENE  DE PORTE AV G pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0018452; VIN=TSMLYD21S00445869; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 196

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378418
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119728
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CACHE TROISIEME FEU DE STOP pour une SPRESSO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0119728; VIN=MA3RFL41S00378418; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 197

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D92598
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018252
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez SILENT BLOC TRAIN AR pour une SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 3986
- Référence DB: 46221M74L00
- Désignation française (designation2): SILENT BLOC TRAIN AR
- Désignation OEM (designation): BUSHING, TRAILING ARM
- Search description: SILENT BLOC TRAIN AR ; BUSHING, TRAILING ARM
- Public price TTC: 83.296 TND (raw DB=83.29643)
- Wholesale/pre-tax price HT: 69.997 TND (raw DB=69.997; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2087; reference=46221M74L00; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:53.242Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (4): id=5090; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5091; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5092; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=5093; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (1): id=3184; referenceNo=46221M74L00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018252; VIN=MA3GZC62S00D92598; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 198

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447997
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019740
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche CACHE INF TABLEAU DE BORD COTE PASSAGER pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6735
- Référence DB: 73881-61M10-000
- Désignation française (designation2): CACHE INF TABLEAU DE BORD COTE PASSAGER
- Désignation OEM (designation): COVER, I/P UNDER ASST AKK416
- Search description: CACHE INF TABLEAU DE BORD COTE PASSAGER ; COVER, I/P UNDER ASST AKK416
- Public price TTC: 120.479 TND (raw DB=120.47917)
- Wholesale/pre-tax price HT: 101.243 TND (raw DB=101.243; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3685; reference=73881-61M10-000; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:40.995Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (1): id=7428; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5295; referenceNo=73881-61M10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019740; VIN=TSMLYD21S00447997; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 199

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454843
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015753
Variant: exact (no typo possible)
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CABLE ABS AR G pour ma CELERIO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0015753; VIN=MA3KFC42S00454843; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 200

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG523320
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204610
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de PIGNON  BOITE VITESSE pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0204610; VIN=MBHKWDA3SSG523320; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1
