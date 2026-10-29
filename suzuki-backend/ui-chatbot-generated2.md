# Generated chatbot UI test prompts

Generated: 2026-10-06T07:47:58.646Z  |  seed: 777  |  cases: 200

Run with: $env:CASES_FILE="ui-chatbot-generated2.md"; node test-ui-chatbot-20.js --count=100000

## Case 001

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339993
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025111
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de PIGNON  BOITE VITESSE pour une CIAZ, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0025111; VIN=MA3AVC41S00339993; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 002

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E29455
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180829
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez bouchon bouton d'option pour new swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0180829; VIN=MBHCZC63S00E29455; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 003

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00452126
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113759
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CACHE CONSOLE SELECTEUR VITESSE G pour une ERTIGA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6851
- Référence DB: 75830M72R50-5PK
- Désignation française (designation2): CACHE CONSOLE SELECTEUR VITESSE G
- Désignation OEM (designation): COVER,FL CONSOLE FRDRVR(BLACK)
- Search description: CACHE CONSOLE SELECTEUR VITESSE G ; COVER,FL CONSOLE FRDRVR(BLACK)
- Public price TTC: 211.391 TND (raw DB=211.39137)
- Wholesale/pre-tax price HT: 177.640 TND (raw DB=177.63981; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13844; reference=75830M72R50-5PK; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:40.927Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=7504; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7505; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113759; VIN=MA3BNC22S00452126; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 004

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376091
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119731
Variant: exact
Generated category: PR

**UI prompt**

Je cherche CAPUCHON VERROU RACCORD CABLE EMBRAYAGE pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119731; VIN=MA3RFL41S00376091; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 005

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376234
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119784
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb POULIE TENDEUR COURROIE lel SPRESSO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0119784; VIN=MA3RFL41S00376234; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 006

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376218
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119775
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
- Matched vehicle row: vehicleNo=VN0119775; VIN=MA3RFL41S00376218; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 007

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D95202
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018293
Variant: typo (CIRCLIP -> CIRCCLIP)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez CIRCCLIP D’AXE DE PISTON pour ma SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0018293; VIN=MA3GZC62S00D95202; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 008

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588072
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192972
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
- Matched vehicle row: vehicleNo=VN0192972; VIN=MBHCZF63S00588072; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 009

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339456
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025117
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de SUPPORT DURITE HUILE EMBRAYAGE pour une CIAZ, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0025117; VIN=MA3AVC41S00339456; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 010

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E32126
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179257
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez BOUTON CAPTEUR PARKING pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0179257; VIN=MBHCZC63S00E32126; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 011

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S5LA642810
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042746
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche BLOC ACCOUDOIR pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6859
- Référence DB: 75851M68P00-5PK
- Désignation française (designation2): BLOC ACCOUDOIR
- Désignation OEM (designation): BOX FLOOR CONSOLE RR (BLACK)
- Search description: BLOC ACCOUDOIR ; BOX FLOOR CONSOLE RR (BLACK)
- Public price TTC: 143.068 TND (raw DB=143.06775)
- Wholesale/pre-tax price HT: 120.225 TND (raw DB=120.225; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3742; reference=75851M68P00-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.540Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=22241; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042746; VIN=MA3WB52S5LA642810; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 012

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587388
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183508
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BUTEE LATERALE TABLETTE AR lel DZIRE. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0183508; VIN=MBHCZF63S00587388; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 013

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00428735
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0009875
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de CIRCLIP D'ARBRE INTERMÉDIAIRE pour une CELERIO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1777
- Référence DB: 24391M76M00
- Désignation française (designation2): CIRCLIP D'ARBRE INTERMÉDIAIRE
- Désignation OEM (designation): CIRCLIP,COUNTERSHAFT BRG,R
- Search description: CIRCLIP D'ARBRE INTERMÉDIAIRE ; CIRCLIP,COUNTERSHAFT BRG,R
- Public price TTC: 3.387 TND (raw DB=3.38674)
- Wholesale/pre-tax price HT: 2.846 TND (raw DB=2.846; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9107; reference=24391M76M00; totalQuantity=20; stockDisponible=0; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:42.644Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (10): id=14502; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14503; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14504; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14505; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2876; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2877; modelName=AON312; typeCode=AON312-TYPE1 | id=2878; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2879; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2880; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2881; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0009875; VIN=MA3KFC42S00428735; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 014

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767406
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092411
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb DEMARREUR POP lel CELERIO BVA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0092411; VIN=MA3KFC42S00767406; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 015

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CONDUIT AERATION AR N 2 D pour une SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 016

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG498246
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203618
Variant: typo (GARNITURE -> GARNTURE)
Generated category: PR

**UI prompt**

Bonjour, vous avez PROTECTEUR GARNTURE MALLE AR pour ma FRONX ?

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
- Matched vehicle row: vehicleNo=VN0203618; VIN=MBHKWDA3SSG498246; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 017

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D95422
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018505
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche ANNEAU DE SYNCHRONISATION 5ÈME VITESSE pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1820
- Référence DB: 24434M67K02
- Désignation française (designation2): ANNEAU DE SYNCHRONISATION 5ÈME VITESSE
- Désignation OEM (designation): RING, 5TH GEAR SYNC
- Search description: ANNEAU DE SYNCHRONISATION 5ÈME VITESSE ; RING, 5TH GEAR SYNC
- Public price TTC: 53.701 TND (raw DB=53.70113)
- Wholesale/pre-tax price HT: 45.127 TND (raw DB=45.127; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9148; reference=24434M67K02; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:38.366Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (1): id=2988; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0018505; VIN=MA3GZC62S00D95422; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 018

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446503
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018459
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez moteur rideau de toit pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7333
- Référence DB: 78821-54P00-000
- Désignation française (designation2): MOTEUR RIDEAU DE TOIT
- Désignation OEM (designation): MOTOR,SHADEAPK416
- Search description: MOTEUR RIDEAU DE TOIT ; MOTOR,SHADEAPK416
- Public price TTC: 843.691 TND (raw DB=843.69096)
- Wholesale/pre-tax price HT: 708.984 TND (raw DB=708.984; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3999; reference=78821-54P00-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.934Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=7944; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7945; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5667; referenceNo=78821-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018459; VIN=TSMLYD21S00446503; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 019

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449941
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019584
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb CACHE AILE AR D lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6605
- Référence DB: 72814-54P00-000
- Désignation française (designation2): CACHE AILE AR D
- Désignation OEM (designation): COVER,BACK PANEL APK416
- Search description: CACHE AILE AR D ; COVER,BACK PANEL APK416
- Public price TTC: 167.667 TND (raw DB=167.66743)
- Wholesale/pre-tax price HT: 140.897 TND (raw DB=140.897; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3607; reference=72814-54P00-000; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:40.732Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (1): id=7282; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5203; referenceNo=72814-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019584; VIN=TSMLYE21S00449941; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 020

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00445869
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018452
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez collier de serrage a ressort ø 17,8 mm pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0018452; VIN=TSMLYD21S00445869; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 021

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG500119
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203627
Variant: typo (BOUCHON -> BOUHCON)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez BOUHCON DE RESERVOIR DE LIQUIDE DE FREIN pour ma FRONX ?

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
- Matched vehicle row: vehicleNo=VN0203627; VIN=MBHKWDA3SSG500119; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 022

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7LA642694
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042635
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez LAMPE LED pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0042635; VIN=MA3WB52S7LA642694; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 023

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378412
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119736
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de SECTION LATERALE D pour une SPRESSO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5157
- Référence DB: 64111M62S00
- Désignation française (designation2): SECTION LATERALE D
- Désignation OEM (designation): PANEL,SIDE BODY OUTER,R
- Search description: SECTION LATERALE D ; PANEL,SIDE BODY OUTER,R
- Public price TTC: 1638.700 TND (raw DB=1638.70021)
- Wholesale/pre-tax price HT: 1377.059 TND (raw DB=1377.059; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2754; reference=64111M62S00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.785Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=6172; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=4192; referenceNo=64111M62S00; referenceType=3.0 | id=4193; referenceNo=64111M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119736; VIN=MA3RFL41S00378412; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 024

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376236
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119756
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ÉGRATIGNER LE SEUIL AV G pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119756; VIN=MA3RFL41S00376236; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 025

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426309
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110396
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez synchro 2 eme vitesse pour ertiga ? prix ?

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
- Matched vehicle row: vehicleNo=VN0110396; VIN=MA3BNC22S00426309; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 026

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767418
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092412
Variant: typo (CAPTEUR -> CAPETUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CAPETUR SORTIE EVAPORATEUR pour ma CELERIO BVA ?

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
- Matched vehicle row: vehicleNo=VN0092412; VIN=MA3KFC42S00767418; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 027

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E29934
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180837
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche GARNITURE COUVERCLE DE CARBURANT pour ma NEW SWIFT. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0180837; VIN=MBHCZC63S00E29934; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 028

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG499871
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203529
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb PULSEUR D'AIR HABITACLE lel FRONX. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0203529; VIN=MBHKWDA3SSG499871; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 029

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454814
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014466
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez JOINT, CARTER D'HUILE pour une CELERIO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0014466; VIN=MA3KFC42S00454814; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 030

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340119
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025070
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de BOUTON DE FEUX DE DETRESSE AVEC TEMOIN D’ALARME pour une CIAZ, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0025070; VIN=MA3AVC41S00340119; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 031

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454843
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015753
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez calle capot pour celerio ? prix ?

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
- Matched vehicle row: vehicleNo=VN0015753; VIN=MA3KFC42S00454843; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 032

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00448803
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113767
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez CACHE EXT SIEGE CONDUCTEUR pour une ERTIGA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0113767; VIN=MA3BNC22S00448803; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 033

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7LA643036
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042755
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de MANCHON DE SYNCHRO 5EME VITESSE pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1808
- Référence DB: 24423M76M01
- Désignation française (designation2): MANCHON DE SYNCHRO 5EME VITESSE
- Désignation OEM (designation): SLEEVE, 5TH SPEED SYNC
- Search description: MANCHON DE SYNCHRO 5EME VITESSE ; SLEEVE, 5TH SPEED SYNC
- Public price TTC: 201.185 TND (raw DB=201.18497)
- Wholesale/pre-tax price HT: 169.063 TND (raw DB=169.063; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=946; reference=24423M76M01; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.410Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (9): id=14620; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14621; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14622; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2952; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2953; modelName=AON312; typeCode=AON312-TYPE1 | id=2954; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2955; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2956; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2957; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042755; VIN=MA3WB52S7LA643036; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 034

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00507255
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0180763
Variant: typo (HARNESS -> HANESS)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez HANESS ASSY,MAIN pour ma CIAZ ?

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
- Matched vehicle row: vehicleNo=VN0180763; VIN=MA3AVC71S00507255; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 035

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA654936
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045584
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche AERATEUR CENTRAL CHROME pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6685
- Référence DB: 73610M68P00-C48
- Désignation française (designation2): AERATEUR CENTRAL CHROME
- Désignation OEM (designation): LOUVERCTR VENT R(CHROME)
- Search description: AERATEUR CENTRAL CHROME ; LOUVERCTR VENT R(CHROME)
- Public price TTC: 91.861 TND (raw DB=91.86086)
- Wholesale/pre-tax price HT: 77.194 TND (raw DB=77.194; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3648; reference=73610M68P00-C48; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:37.743Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=21967; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=21968; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=5260; referenceNo=73610M68P00-C48; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045584; VIN=MA3WB52SXLA654936; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 036

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589179
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189123
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BOITIER CONSOLE CENTRALE lel DZIRE. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0189123; VIN=MBHCZF63S00589179; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 037

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442862
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018424
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez tube galerie d’huile n 3 pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1085
- Référence DB: 16180-69GE0-000
- Désignation française (designation2): TUBE GALERIE D’HUILE N 3
- Désignation OEM (designation): PIPE,OIL GALLERY NO.3 RM413
- Search description: TUBE GALERIE D’HUILE N 3 ; PIPE,OIL GALLERY NO.3 RM413
- Public price TTC: 222.244 TND (raw DB=222.2444)
- Wholesale/pre-tax price HT: 186.760 TND (raw DB=186.76; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=551; reference=16180-69GE0-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.253Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=2048; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=985; referenceNo=16180-69GE0; referenceType=3.0 | id=986; referenceNo=16180-69GE0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018424; VIN=TSMLYD21S00442862; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 038

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00357869
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0115887
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
- Matched vehicle row: vehicleNo=VN0115887; VIN=MA3RFL41S00357869; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 039

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447043
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019728
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche BAGUETTE DE LA PORTE AR D pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 8210
- Référence DB: 83970-54P02-000
- Désignation française (designation2): BAGUETTE DE LA PORTE AR D
- Désignation OEM (designation): GARNISH, RR
- Search description: BAGUETTE DE LA PORTE AR D ; GARNISH, RR
- Public price TTC: 343.931 TND (raw DB=343.93058)
- Wholesale/pre-tax price HT: 289.017 TND (raw DB=289.01729; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15166; reference=83970-54P02-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:38.850Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=8679; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8680; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=6282; referenceNo=83970-54P02-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019728; VIN=TSMLYD21S00447043; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 040

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E22961
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180818
Variant: typo (CONDUCTEUR -> CONDUCTTEUR)
Generated category: PR

**UI prompt**

Bonjour, vous avez CADRE SIEGE CONDUCTTEUR pour ma NEW SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0180818; VIN=MBHCZC63S00E22961; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 041

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00362618
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119757
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez METTRE CYLINDRE pour une SPRESSO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0119757; VIN=MA3RFL41S00362618; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 042

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

## Case 043

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche JOINT POIGNE DE PORTE G pour ma SWIFT. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7725
- Référence DB: 82822M66R00
- Désignation française (designation2): JOINT POIGNE DE PORTE G
- Désignation OEM (designation): .BRACKET, FR DR OUT HANDLE LH
- Search description: JOINT POIGNE DE PORTE G ; .BRACKET, FR DR OUT HANDLE LH
- Public price TTC: 16.201 TND (raw DB=16.20066)
- Wholesale/pre-tax price HT: 13.614 TND (raw DB=13.614; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4205; reference=82822M66R00; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:47.437Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (3): id=23503; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=23504; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=8261; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (1): id=5953; referenceNo=82822M66R00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 044

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588339
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0194488
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BRAS ESSUIE GLACE pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0194488; VIN=MBHCZF63S00588339; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 045

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446691
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019722
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez JOINT SUPPORT FILTRE A HUILE pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1123
- Référence DB: 16539-69G00-000
- Désignation française (designation2): JOINT SUPPORT FILTRE A HUILE
- Désignation OEM (designation): GASKET,OIL ADAPTER RW416
- Search description: JOINT SUPPORT FILTRE A HUILE ; GASKET,OIL ADAPTER RW416
- Public price TTC: 66.886 TND (raw DB=66.88633)
- Wholesale/pre-tax price HT: 56.207 TND (raw DB=56.207; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=568; reference=16539-69G00-000; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:47.479Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (1): id=2077; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1009; referenceNo=16539-69G00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019722; VIN=TSMLYD21S00446691; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 046

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00763772
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092407
Variant: typo (REFRIGERANT -> REFRIGERNT)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CAPTEUR REFRIGERNT pour ma CELERIO BVA ?

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
- Matched vehicle row: vehicleNo=VN0092407; VIN=MA3KFC42S00763772; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 047

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00443606
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019718
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez baguette montant de porte ar d pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 7163
- Référence DB: 77440-54P02-000
- Désignation française (designation2): BAGUETTE MONTANT DE PORTE AR D
- Désignation OEM (designation): GARNISH, RR
- Search description: BAGUETTE MONTANT DE PORTE AR D ; GARNISH, RR
- Public price TTC: 470.159 TND (raw DB=470.15948)
- Wholesale/pre-tax price HT: 395.092 TND (raw DB=395.092; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3903; reference=77440-54P02-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:39.018Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=7799; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7800; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5549; referenceNo=77440-54P02-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019718; VIN=TSMLYD21S00443606; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 048

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340210
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025109
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
- Matched vehicle row: vehicleNo=VN0025109; VIN=MA3AVC41S00340210; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 049

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339425
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025077
Variant: typo (DEPRESSION -> DEPRESION)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez RACCORD DE DEPRESION DE SERVOFREIN pour ma CIAZ ?

**DB facts for comparison (do not paste)**

- Part DB id: 4227
- Référence DB: 51320M79M10
- Désignation française (designation2): RACCORD DE DEPRESSION DE SERVOFREIN
- Désignation OEM (designation): VACUUM UNION ASSY
- Search description: RACCORD DE DEPRESSION DE SERVOFREIN ; VACUUM UNION ASSY
- Public price TTC: 29.876 TND (raw DB=29.87614)
- Wholesale/pre-tax price HT: 25.106 TND (raw DB=25.106; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11419; reference=51320M79M10; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:51.839Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=5330; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5331; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5332; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0025077; VIN=MA3AVC41S00339425; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 050

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00763988
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089424
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche COMMUTATEUR MAINS LIBRES pour ma CELERIO BVA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0089424; VIN=MA3KFC42S00763988; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 051

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378425
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119722
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CHARNIERE DE PORTE AR D pour une SPRESSO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 5694
- Référence DB: 69410M66R00
- Désignation française (designation2): CHARNIERE DE PORTE AR D
- Désignation OEM (designation): HINGE, REAR DOOR UPPER RH
- Search description: CHARNIERE DE PORTE AR D ; HINGE, REAR DOOR UPPER RH
- Public price TTC: 72.149 TND (raw DB=72.14851)
- Wholesale/pre-tax price HT: 60.629 TND (raw DB=60.629; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3062; reference=69410M66R00; totalQuantity=16; stockDisponible=0; stockConsolide=16; statut=Disponible; updatedAt=2026-09-20T19:01:42.505Z
- Availability rule: stockConsolide >= 2; actual quantity=16; expected=available
- Fitment rows (4): id=20662; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=6543; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=6544; modelName=AXM310; typeCode=AXM310-TYPE1 | id=6545; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=4560; referenceNo=69410M66R00; referenceType=3.0 | id=4561; referenceNo=69410M66R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0119722; VIN=MA3RFL41S00378425; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 052

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3STG643803
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE2
Vehicle number (DB cross-check only): VN0215822
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0215822; VIN=MBHKWDA3STG643803; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE2

## Case 053

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E24844
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179258
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb CUIRE LEVIER lel NEW SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0179258; VIN=MBHCZC63S00E24844; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 054

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00513590
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0189292
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
- Matched vehicle row: vehicleNo=VN0189292; VIN=MA3AVC71S00513590; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 055

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez GARNITURE MONTANT CENTRAL G pour une SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6919
- Référence DB: 76221M56R00-V6N
- Désignation française (designation2): GARNITURE MONTANT CENTRAL G
- Désignation OEM (designation): TRIM, CTR PILLAR UPPER LH
- Search description: GARNITURE MONTANT CENTRAL G ; TRIM, CTR PILLAR UPPER LH
- Public price TTC: 139.348 TND (raw DB=139.34781)
- Wholesale/pre-tax price HT: 117.099 TND (raw DB=117.099; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3783; reference=76221M56R00-V6N; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:46.091Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=22322; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22323; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5418; referenceNo=76221M56R00-V6N; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 056

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364810
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101066
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ECROU HEXAGONAL M8 pour ma ERTIGA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0101066; VIN=MA3BNC22S00364810; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 057

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455028
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014471
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb TUYAU DE CABIN FILTRE A'AIR lel CELERIO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 850
- Référence DB: 13871M73K00
- Désignation française (designation2): TUYAU DE CABIN FILTRE A'AIR
- Désignation OEM (designation): GROMMET, AIR INTK
- Search description: TUYAU DE CABIN FILTRE A'AIR ; GROMMET, AIR INTK
- Public price TTC: 14.969 TND (raw DB=14.96901)
- Wholesale/pre-tax price HT: 12.579 TND (raw DB=12.579; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=428; reference=13871M73K00; totalQuantity=12; stockDisponible=5; stockConsolide=12; statut=Disponible; updatedAt=2026-09-20T19:01:55.296Z
- Availability rule: stockConsolide >= 2; actual quantity=12; expected=available
- Fitment rows (4): id=1731; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1732; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1733; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1734; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=770; referenceNo=13871M73K00; referenceType=3.0 | id=771; referenceNo=13871M73K00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014471; VIN=MA3KFC42S00455028; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 058

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448391
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019747
Variant: typo (SWITCHE -> SWTCHE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez SWTCHE MALLE AR pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 2796
- Référence DB: 37179-61M00-000
- Désignation française (designation2): SWITCHE MALLE AR
- Désignation OEM (designation): SWITCH, BACK DOOR AKK416
- Search description: SWITCHE MALLE AR ; SWITCH, BACK DOOR AKK416
- Public price TTC: 286.469 TND (raw DB=286.4687)
- Wholesale/pre-tax price HT: 240.730 TND (raw DB=240.73; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1425; reference=37179-61M00-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:54.327Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=3900; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=3901; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2232; referenceNo=37179-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019747; VIN=TSMLYD21S00448391; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 059

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG514481
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203487
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de SUPPORT INF PARE-CHOCS AV G pour une FRONX, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5935
- Référence DB: 71736M74T00
- Désignation française (designation2): SUPPORT INF PARE-CHOCS AV G
- Désignation OEM (designation): HOLDER,FR BUMPER LWR,L
- Search description: SUPPORT INF PARE-CHOCS AV G ; HOLDER,FR BUMPER LWR,L
- Public price TTC: 20.842 TND (raw DB=20.84166)
- Wholesale/pre-tax price HT: 17.514 TND (raw DB=17.514; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3201; reference=71736M74T00; totalQuantity=17; stockDisponible=1; stockConsolide=17; statut=Disponible; updatedAt=2026-09-20T19:01:53.763Z
- Availability rule: stockConsolide >= 2; actual quantity=17; expected=available
- Fitment rows (2): id=20954; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=20955; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0203487; VIN=MBHKWDA3SSG514481; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 060

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426631
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110400
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez flasque de frein ar d pour ertiga ? prix ?

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
- Matched vehicle row: vehicleNo=VN0110400; VIN=MA3BNC22S00426631; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 061

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522216
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203530
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de DURITE RENIFLARD BOITE DE VITESSES pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0203530; VIN=MBHKWDA3SSG522216; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 062

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442228
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018414
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez feu de jour led d pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0018414; VIN=TSMLYD21S00442228; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 063

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339517
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025121
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez COUSSIN GARDE BOUE AV G pour une CIAZ ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6405
- Référence DB: 72365M79M00
- Désignation française (designation2): COUSSIN GARDE BOUE AV G
- Désignation OEM (designation): CUSHION,FR FENDER,L
- Search description: COUSSIN GARDE BOUE AV G ; CUSHION,FR FENDER,L
- Public price TTC: 9.251 TND (raw DB=9.25106)
- Wholesale/pre-tax price HT: 7.774 TND (raw DB=7.774; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3485; reference=72365M79M00; totalQuantity=20; stockDisponible=20; stockConsolide=20; statut=Disponible; updatedAt=2026-09-20T19:01:43.543Z
- Availability rule: stockConsolide >= 2; actual quantity=20; expected=available
- Fitment rows (3): id=7091; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=7092; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=7093; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=5037; referenceNo=72365M79M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025121; VIN=MA3AVC41S00339517; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 064

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG505764
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203535
Variant: typo (ROULEMENT -> ROULEMNT)
Generated category: PR

**UI prompt**

Bonjour, vous avez ROULEMNT BV pour ma FRONX ?

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
- Matched vehicle row: vehicleNo=VN0203535; VIN=MBHKWDA3SSG505764; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 065

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767432
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092424
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb TUYAUX FLEXIBLES DE FREIN AR D lel CELERIO BVA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0092424; VIN=MA3KFC42S00767432; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 066

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG530380
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204667
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche FEU DE JOUR COMBINE AV G pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0204667; VIN=MBHKWDA3SSG530380; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 067

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426641
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109882
Variant: typo (VENTILATION -> VENTILAATION)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez CACHE SORTIE VENTILAATION pour ma ERTIGA ?

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
- Matched vehicle row: vehicleNo=VN0109882; VIN=MA3BNC22S00426641; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 068

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448767
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019751
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez soufflet, levier de vitesses pour vitara ? prix ?

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
- Matched vehicle row: vehicleNo=VN0019751; VIN=TSMLYD21S00448767; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 069

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364618
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101068
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche PARE-HUILE ARBRE PRIMAIRE pour ma ERTIGA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1729
- Référence DB: 24151M86J00
- Désignation française (designation2): PARE-HUILE ARBRE PRIMAIRE
- Désignation OEM (designation): SEAL,INPUT SHAFT OIL
- Search description: PARE-HUILE ARBRE PRIMAIRE ; SEAL,INPUT SHAFT OIL
- Public price TTC: 20.683 TND (raw DB=20.68339)
- Wholesale/pre-tax price HT: 17.381 TND (raw DB=17.381; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=924; reference=24151M86J00; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:50.204Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (8): id=14299; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14300; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14301; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=2743; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2744; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=2745; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=2746; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2747; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0101068; VIN=MA3BNC22S00364618; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 070

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00765047
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0091057
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb FAISCEAU INSTRUMENT INT lel CELERIO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0091057; VIN=MA3KFC42S00765047; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE2

## Case 071

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00441638
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018407
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez VIS DE FIXATION M5 × 16 MM pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 48
- Référence DB: 09132-05053-000
- Désignation française (designation2): VIS DE FIXATION M5 × 16 MM
- Désignation OEM (designation): SCREW AN650
- Search description: VIS DE FIXATION M5 × 16 MM ; SCREW AN650
- Public price TTC: 14.762 TND (raw DB=14.76195)
- Wholesale/pre-tax price HT: 12.405 TND (raw DB=12.405; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=30; reference=09132-05053-000; totalQuantity=48; stockDisponible=48; stockConsolide=48; statut=Disponible; updatedAt=2026-09-20T19:01:55.539Z
- Availability rule: stockConsolide >= 2; actual quantity=48; expected=available
- Fitment rows (2): id=178; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=179; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=57; referenceNo=09132-05053-000; referenceType=3.0 | id=58; referenceNo=09132-05053-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018407; VIN=TSMLYD21S00441638; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 072

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589030
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189218
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de FILTRE CHAUFFAGE pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189218; VIN=MBHCZF63S00589030; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 073

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448048
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019742
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche COUPLEUR DE TRANSMISSION AR pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1971
- Référence DB: 27610-79J01-000
- Désignation française (designation2): COUPLEUR DE TRANSMISSION AR
- Désignation OEM (designation): COUPLING, RR DRIVE RW416
- Search description: COUPLEUR DE TRANSMISSION AR ; COUPLING, RR DRIVE RW416
- Public price TTC: 5371.559 TND (raw DB=5371.55912)
- Wholesale/pre-tax price HT: 4513.915 TND (raw DB=4513.91523; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=995; reference=27610-79J01-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:43.484Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=3187; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1616; referenceNo=27610-79J01-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019742; VIN=TSMLYD21S00448048; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 074

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG513027
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203500
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez contacteur de feu de recul pour fronx ? prix ?

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
- Matched vehicle row: vehicleNo=VN0203500; VIN=MBHKWDA3SSG513027; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 075

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442961
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018426
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de PANNEAU AILE AR D pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6946
- Référence DB: 76270-54P01-5PK
- Désignation française (designation2): PANNEAU AILE AR D
- Désignation OEM (designation): TRIM, QUARTER LOWER RH (BLACK)
- Search description: PANNEAU AILE AR D ; TRIM, QUARTER LOWER RH (BLACK)
- Public price TTC: 861.794 TND (raw DB=861.79443)
- Wholesale/pre-tax price HT: 724.197 TND (raw DB=724.197; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3806; reference=76270-54P01-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:49.422Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=7582; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7583; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5438; referenceNo=76270-54P01-5PK0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018426; VIN=TSMLYD21S00442961; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 076

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E30721
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180812
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BLOC DE CHAUFFAGE pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0180812; VIN=MBHCZC63S00E30721; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 077

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448204
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019746
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BAGUE DIFFÉRENTIEL lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1957
- Référence DB: 27453-63J00-245
- Désignation française (designation2): BAGUE DIFFÉRENTIEL
- Désignation OEM (designation): SHIM, DIFF SIDE (T:245)
- Search description: BAGUE DIFFÉRENTIEL ; SHIM, DIFF SIDE (T:245)
- Public price TTC: 23.750 TND (raw DB=23.75002)
- Wholesale/pre-tax price HT: 19.958 TND (raw DB=19.958; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=987; reference=27453-63J00-245; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:38.760Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=3162; modelName=APK416-TYPE1; typeCode=APK416-TYPE1 | id=3163; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (1): id=1605; referenceNo=27453-63J00-2450; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019746; VIN=TSMLYD21S00448204; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 078

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376231
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119727
Variant: typo (TROISIEME -> TROISIME)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez TROISIME FEU DE STOP pour ma SPRESSO ?

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
- Matched vehicle row: vehicleNo=VN0119727; VIN=MA3RFL41S00376231; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 079

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588237
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183497
Variant: typo (BATTERIE -> BATTRIE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez CACHE DE BATTRIE pour ma DZIRE ?

**DB facts for comparison (do not paste)**

- Part DB id: 2191
- Référence DB: 33690M77M10
- Désignation française (designation2): CACHE DE BATTERIE
- Désignation OEM (designation): COVER, BATTERY1
- Search description: CACHE DE BATTERIE ; COVER, BATTERY1
- Public price TTC: 32.056 TND (raw DB=32.05622)
- Wholesale/pre-tax price HT: 26.938 TND (raw DB=26.938; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1081; reference=33690M77M10; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.940Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=15441; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=15442; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=1763; referenceNo=33690M77M10; referenceType=3.0 | id=1764; referenceNo=33690M77M10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0183497; VIN=MBHCZF63S00588237; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 080

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446651
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019721
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez retrov int pour vitara ? prix ?

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

## Case 081

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454740
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014459
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb PISTON D'EMBRAYAGE lel CELERIO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0014459; VIN=MA3KFC42S00454740; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 082

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00359544
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101076
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
- Matched vehicle row: vehicleNo=VN0101076; VIN=MA3BNC22S00359544; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 083

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez TRAVERSE SUPPORT COLONNE DE DIRECTION pour une SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6667
- Référence DB: 73200M56R50
- Désignation française (designation2): TRAVERSE SUPPORT COLONNE DE DIRECTION
- Désignation OEM (designation): MEMBER, STEERING SUPPORT
- Search description: TRAVERSE SUPPORT COLONNE DE DIRECTION ; MEMBER, STEERING SUPPORT
- Public price TTC: 571.783 TND (raw DB=571.7831)
- Wholesale/pre-tax price HT: 480.490 TND (raw DB=480.49; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3638; reference=73200M56R50; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.109Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=21933; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1
- Alternate/item reference rows (2): id=5249; referenceNo=73200M56R50; referenceType=3.0 | id=5250; referenceNo=73200M56R50-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 084

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447523
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019734
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ENGRENAGE DIFFERENTIEL pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0019734; VIN=TSMLYD21S00447523; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 085

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D94642
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018281
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb SYNCHRONISATION DE LA VITESSE DU MOYEU lel SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0018281; VIN=MA3GZC62S00D94642; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 086

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E28196
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180827
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez HARNESS ASSY, SOCKET pour une NEW SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0180827; VIN=MBHCZC63S00E28196; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 087

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378438
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119751
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche REVETTMENT DE TOIT pour ma SPRESSO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0119751; VIN=MA3RFL41S00378438; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 088

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA654890
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045581
Variant: typo (PANNEAU -> PANEAU)
Generated category: PR

**UI prompt**

Bonjour, vous avez PANEAU DEY AR EXT D pour ma BALENO ?

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
- Matched vehicle row: vehicleNo=VN0045581; VIN=MA3WB52S1LA654890; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 089

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00763953
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089426
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de ENSEMBLE MOTEUR POMPE A HUILE pour une CELERIO BVA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0089426; VIN=MA3KFC42S00763953; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 090

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA642850
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042743
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez capteur de lumiere pour baleno ? prix ?

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
- Matched vehicle row: vehicleNo=VN0042743; VIN=MA3WB52S6LA642850; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 091

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340038
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025067
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
- Matched vehicle row: vehicleNo=VN0025067; VIN=MA3AVC41S00340038; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 092

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376205
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119748
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez plaque frein ar d pour spresso ? prix ?

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
- Matched vehicle row: vehicleNo=VN0119748; VIN=MA3RFL41S00376205; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 093

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767410
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092422
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de TUYAUX FLEXIBLES DE FREIN AR G pour une CELERIO BVA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0092422; VIN=MA3KFC42S00767410; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 094

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654803
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045574
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez LAMPE PLAFONNIER pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0045574; VIN=MA3WB52S2LA654803; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 095

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00471663
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022157
Variant: typo (EXTENSION -> EXTENION)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez EXTENION PLANCHER AR D pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 4953
- Référence DB: 61514-61M10-000
- Désignation française (designation2): EXTENSION PLANCHER AR D
- Désignation OEM (designation): EXTENSION,RR FLOOR SIDE,R
- Search description: EXTENSION PLANCHER AR D ; EXTENSION,RR FLOOR SIDE,R
- Public price TTC: 259.929 TND (raw DB=259.92888)
- Wholesale/pre-tax price HT: 218.428 TND (raw DB=218.42763; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12112; reference=61514-61M10-000; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:44.937Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=5995; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5996; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=4044; referenceNo=61514-61M10; referenceType=3.0 | id=4045; referenceNo=61514-61M10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022157; VIN=TSMLYE21S00471663; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 096

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG503861
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203537
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
- Matched vehicle row: vehicleNo=VN0203537; VIN=MBHKWDA3SSG503861; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 097

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455020
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015743
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez engrenage 5eme vitesse pour celerio ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 1769
- Référence DB: 24351M76M00
- Désignation française (designation2): ENGRENAGE 5EME VITESSE
- Désignation OEM (designation): GEAR,COUNTERSHAFT 5TH
- Search description: ENGRENAGE 5EME VITESSE ; GEAR,COUNTERSHAFT 5TH
- Public price TTC: 397.479 TND (raw DB=397.47904)
- Wholesale/pre-tax price HT: 334.016 TND (raw DB=334.016; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9099; reference=24351M76M00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:44.655Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=2849; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2850; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0015743; VIN=MA3KFC42S00455020; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 098

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588993
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189120
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CACHE CAUSSE BATTRIE pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189120; VIN=MBHCZF63S00588993; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 099

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA654766
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045575
Variant: exact (no typo possible)
Generated category: CARROSSERIE

**UI prompt**

Je cherche ECROU DE CARDAN M18 pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 60
- Référence DB: 09159M18024
- Désignation française (designation2): ECROU DE CARDAN M18
- Désignation OEM (designation): NUT,DRIVE SHAFT
- Search description: ECROU DE CARDAN M18 ; NUT,DRIVE SHAFT
- Public price TTC: 15.688 TND (raw DB=15.6884)
- Wholesale/pre-tax price HT: 13.184 TND (raw DB=13.18353; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=38; reference=09159M18024; totalQuantity=40; stockDisponible=1; stockConsolide=40; statut=Disponible; updatedAt=2026-09-20T19:01:44.556Z
- Availability rule: stockConsolide >= 2; actual quantity=40; expected=available
- Fitment rows (12): id=9917; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=9918; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=9919; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=9920; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=9921; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=227; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=228; modelName=AON312; typeCode=AON312-TYPE1 | id=229; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=230; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=231; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=232; modelName=AXM310; typeCode=AXM310-TYPE2 | id=233; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=76; referenceNo=09159M18024; referenceType=3.0 | id=77; referenceNo=09159M18024-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045575; VIN=MA3WB52S0LA654766; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 100

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587818
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0183506
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez PATIN DE PEDALE pour une DZIRE ?

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
- Matched vehicle row: vehicleNo=VN0183506; VIN=MBHCZF63S00587818; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 101

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb CARTER DE BOITE DE VITESSES G lel SWIFT. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1837
- Référence DB: 24721M68P02
- Désignation française (designation2): CARTER DE BOITE DE VITESSES G
- Désignation OEM (designation): CASE, TRANSAXLE LEFT
- Search description: CARTER DE BOITE DE VITESSES G ; CASE, TRANSAXLE LEFT
- Public price TTC: 1462.708 TND (raw DB=1462.70754)
- Wholesale/pre-tax price HT: 1229.166 TND (raw DB=1229.166; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9163; reference=24721M68P02; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:42.164Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (4): id=14741; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14742; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14743; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14744; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=1551; referenceNo=24721M68P02; referenceType=3.0 | id=1552; referenceNo=24721M68P02-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 102

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00352624
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0117893
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR PRESSION GAZ CLIM pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 9042
- Référence DB: 95526M50G40
- Désignation française (designation2): CAPTEUR PRESSION GAZ CLIM
- Désignation OEM (designation): SWITCH DUAL PRESSURE
- Search description: CAPTEUR PRESSION GAZ CLIM ; SWITCH DUAL PRESSURE
- Public price TTC: 155.925 TND (raw DB=155.92451)
- Wholesale/pre-tax price HT: 131.029 TND (raw DB=131.029; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4869; reference=95526M50G40; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.949Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=9366; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=6818; referenceNo=95526M50G40; referenceType=3.0 | id=6819; referenceNo=95526M50G40-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0117893; VIN=MA3RFL41S00352624; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 103

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00411564
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109246
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb FEUTRE TABLEAU DE BORD lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6666
- Référence DB: 73123M82M00
- Désignation française (designation2): FEUTRE TABLEAU DE BORD
- Désignation OEM (designation): FELT,I/P TOP
- Search description: FEUTRE TABLEAU DE BORD ; FELT,I/P TOP
- Public price TTC: 3.045 TND (raw DB=3.04521)
- Wholesale/pre-tax price HT: 2.559 TND (raw DB=2.559; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3637; reference=73123M82M00; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:45.244Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (13): id=7346; modelName=AXM310; typeCode=AXM310-TYPE2 | id=21920; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=21921; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21922; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=21923; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=7338; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=7339; modelName=AON312; typeCode=AON312-TYPE1 | id=7340; modelName=APQ415; typeCode=APQ415-TYPE2 | id=7341; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7342; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=7343; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=7344; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=7345; modelName=AXM310; typeCode=AXM310-TYPE1
- Alternate/item reference rows (1): id=5248; referenceNo=73123M82M00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0109246; VIN=MA3BNC22S00411564; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 104

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00441728
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018409
Variant: exact
Generated category: PR

**UI prompt**

Je cherche BAGUE EXT DU ROULEMENT pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0018409; VIN=TSMLYD21S00441728; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 105

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E24308
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180813
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez BOULON DE TRAIN AR pour une NEW SWIFT ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0180813; VIN=MBHCZC63S00E24308; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 106

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454835
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014468
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez sensor assy,clutch speed pour celerio ? prix ?

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
- Matched vehicle row: vehicleNo=VN0014468; VIN=MA3KFC42S00454835; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 107

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E24797
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180820
Variant: typo (TABLEAU -> TABBLEAU)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez EXTENSION, TABBLEAU DE BORD G pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 4850
- Référence DB: 58740M68P00
- Désignation française (designation2): EXTENSION, TABLEAU DE BORD G
- Désignation OEM (designation): EXTENSION,DASH LOWER OUTER,L
- Search description: EXTENSION, TABLEAU DE BORD G ; EXTENSION,DASH LOWER OUTER,L
- Public price TTC: 216.744 TND (raw DB=216.74422)
- Wholesale/pre-tax price HT: 182.138 TND (raw DB=182.138; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2587; reference=58740M68P00; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:44.951Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (6): id=19633; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19634; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=19635; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=19636; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=19637; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=19638; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (2): id=3970; referenceNo=58740M68P00; referenceType=3.0 | id=3971; referenceNo=58740M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180820; VIN=MBHCZC63S00E24797; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 108

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de CAPUCHON AMORTISSEUR AR pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 109

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764101
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089465
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche TENDEUR COURROIE CLIMATISEUR pour ma CELERIO BVA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 8961
- Référence DB: 95125M68K00
- Désignation française (designation2): TENDEUR COURROIE CLIMATISEUR
- Désignation OEM (designation): TENSIONER,CPRSR
- Search description: TENDEUR COURROIE CLIMATISEUR ; TENSIONER,CPRSR
- Public price TTC: 64.201 TND (raw DB=64.2005)
- Wholesale/pre-tax price HT: 53.950 TND (raw DB=53.95; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4816; reference=95125M68K00; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:54.683Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=9297; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=9298; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (1): id=6744; referenceNo=95125M68K00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0089465; VIN=MA3KFC42S00764101; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 110

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG526243
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204649
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CAPTEUR VITESSE ROUE AR pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0204649; VIN=MBHKWDA3SSG526243; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 111

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589110
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189179
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache sous capot av pour dzire ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6552
- Référence DB: 72471M55R00
- Désignation française (designation2): CACHE SOUS CAPOT AV
- Désignation OEM (designation): COVER,FRONT HOOD FRONT
- Search description: CACHE SOUS CAPOT AV ; COVER,FRONT HOOD FRONT
- Public price TTC: 39.003 TND (raw DB=39.00344)
- Wholesale/pre-tax price HT: 32.776 TND (raw DB=32.776; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3579; reference=72471M55R00; totalQuantity=86; stockDisponible=86; stockConsolide=86; statut=Disponible; updatedAt=2026-09-20T19:01:41.305Z
- Availability rule: stockConsolide >= 2; actual quantity=86; expected=available
- Fitment rows (2): id=21736; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=21737; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5157; referenceNo=72471M55R00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189179; VIN=MBHCZF63S00589110; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 112

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376039
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119766
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb BUSE D'EAU ESSUIE GLASSE lel SPRESSO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0119766; VIN=MA3RFL41S00376039; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 113

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447717
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019738
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CACHE THERMIQUE pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0019738; VIN=TSMLYD21S00447717; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 114

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00354956
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0013869
Variant: typo (POSITIVE -> POSIIVE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CACHE COSSE POSIIVE BATTERIE pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0013869; VIN=TSMLYD21S00354956; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 115

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31539
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180825
Variant: typo (TABLETTE -> TABETTE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez SUPPORT TABETTE AR D pour ma NEW SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 8890
- Référence DB: 88913M54P00
- Désignation française (designation2): SUPPORT TABLETTE AR D
- Désignation OEM (designation): HOLDER, REAR PARCEL RH
- Search description: SUPPORT TABLETTE AR D ; HOLDER, REAR PARCEL RH
- Public price TTC: 4.420 TND (raw DB=4.41966)
- Wholesale/pre-tax price HT: 3.714 TND (raw DB=3.714; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15811; reference=88913M54P00; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:54.291Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (10): id=25098; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25099; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25100; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25101; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=25102; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=25103; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=9187; modelName=AON312; typeCode=AON312-TYPE1 | id=9188; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9189; modelName=AXM310; typeCode=AXM310-TYPE1 | id=9190; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0180825; VIN=MBHCZC63S00E31539; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 116

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454917
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015748
Variant: exact
Generated category: PR

**UI prompt**

Je cherche RESSORT EMBRAYAGE pour ma CELERIO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0015748; VIN=MA3KFC42S00454917; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 117

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449319
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019553
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BOULON POULIE TENDEUR lel VITARA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0019553; VIN=TSMLYE21S00449319; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 118

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339872
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025108
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez calculateur ensemble epi / ecm pour ciaz ? prix ?

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
- Matched vehicle row: vehicleNo=VN0025108; VIN=MA3AVC41S00339872; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 119

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00767440
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0092425
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez GARNITURE MALLE AR D pour une CELERIO BVA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 6939
- Référence DB: 76251M76M00-6GS
- Désignation française (designation2): GARNITURE MALLE AR D
- Désignation OEM (designation): TRIMQUARTER UPPERR
- Search description: GARNITURE MALLE AR D ; TRIMQUARTER UPPERR
- Public price TTC: 43.393 TND (raw DB=43.39335)
- Wholesale/pre-tax price HT: 36.465 TND (raw DB=36.465; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3799; reference=76251M76M00-6GS; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:46.039Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=7578; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=7579; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0092425; VIN=MA3KFC42S00767440; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 120

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00C63208
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0003795
Variant: price
Generated category: PR

**UI prompt**

Quel est le prix de CLAVETTE SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0003795; VIN=MA3GZC62S00C63208; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 121

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448116
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019745
Variant: typo (RADIATEUR -> RADITAEUR)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez DURITE DE RADITAEUR INF pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 1337
- Référence DB: 17852-61M00-000
- Désignation française (designation2): DURITE DE RADIATEUR INF
- Désignation OEM (designation): HOSE,RADIATOR INLET AKK416
- Search description: DURITE DE RADIATEUR INF ; HOSE,RADIATOR INLET AKK416
- Public price TTC: 193.360 TND (raw DB=193.35976)
- Wholesale/pre-tax price HT: 162.487 TND (raw DB=162.48719; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8696; reference=17852-61M00-000; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:44.408Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=2327; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=1182; referenceNo=17852-61M00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019745; VIN=TSMLYD21S00448116; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 122

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764065
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089444
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CEINTURE CENTRALE pour une CELERIO BVA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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

## Case 123

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0KA599895
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037466
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de BRAS LENGERON pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 4793
- Référence DB: 58620M68P20
- Désignation française (designation2): BRAS LENGERON
- Désignation OEM (designation): .MEMBER, DASH LOWER RH
- Search description: BRAS LENGERON ; .MEMBER, DASH LOWER RH
- Public price TTC: 511.903 TND (raw DB=511.90349)
- Wholesale/pre-tax price HT: 430.171 TND (raw DB=430.171; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2552; reference=58620M68P20; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:40.383Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=19522; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=19523; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=3918; referenceNo=58620M68P20; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0037466; VIN=MA3WB52S0KA599895; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 124

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589163
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189158
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb COUVERCLE REGLAGE SIEGE CONDUCTEUR lel DZIRE. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0189158; VIN=MBHCZF63S00589163; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 125

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00475048
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022188
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez assiette sup amortisseur av pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3562
- Référence DB: 41720-79J10-000
- Désignation française (designation2): ASSIETTE SUP AMORTISSEUR AV
- Désignation OEM (designation): STOPPER,FRONT STRUT RS413
- Search description: ASSIETTE SUP AMORTISSEUR AV ; STOPPER,FRONT STRUT RS413
- Public price TTC: 107.418 TND (raw DB=107.41773)
- Wholesale/pre-tax price HT: 90.267 TND (raw DB=90.267; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1860; reference=41720-79J10-000; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:38.682Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (2): id=4697; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=4698; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=2833; referenceNo=41720-79J10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022188; VIN=TSMLYE21S00475048; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 126

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00362466
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119760
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
- Matched vehicle row: vehicleNo=VN0119760; VIN=MA3RFL41S00362466; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 127

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448596
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019749
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche TETE PLAGE G pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 4622
- Référence DB: 58120-54P00-000
- Désignation française (designation2): TETE PLAGE G
- Désignation OEM (designation): BRACE,LAMP SUPPORT,L APK416
- Search description: TETE PLAGE G ; BRACE,LAMP SUPPORT,L APK416
- Public price TTC: 309.834 TND (raw DB=309.83435)
- Wholesale/pre-tax price HT: 260.365 TND (raw DB=260.365; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2449; reference=58120-54P00-000; totalQuantity=3; stockDisponible=1; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:54.767Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=5731; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=5732; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=3772; referenceNo=58120-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019749; VIN=TSMLYD21S00448596; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 128

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588037
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192979
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
- Matched vehicle row: vehicleNo=VN0192979; VIN=MBHCZF63S00588037; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 129

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00360039
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101074
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BOUCHON CARTER BOITE VITESSE lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1854
- Référence DB: 24824-77M10-000
- Désignation française (designation2): BOUCHON CARTER BOITE VITESSE
- Désignation OEM (designation): PLUG, T/M OIL CHECK
- Search description: BOUCHON CARTER BOITE VITESSE ; PLUG, T/M OIL CHECK
- Public price TTC: 31.894 TND (raw DB=31.89438)
- Wholesale/pre-tax price HT: 26.802 TND (raw DB=26.802; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=957; reference=24824-77M10-000; totalQuantity=10; stockDisponible=10; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:39.951Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (9): id=14819; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14820; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14821; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14822; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14823; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3066; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=3067; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=3068; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3069; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (1): id=1567; referenceNo=24824-77M10-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0101074; VIN=MA3BNC22S00360039; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 130

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG503729
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203502
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez CATADIOPTRE AR pour une FRONX ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0203502; VIN=MBHKWDA3SSG503729; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 131

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E01288
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0173536
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache poignee malle ar pour new swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0173536; VIN=MBHCZC63S00E01288; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 132

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426866
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109883
Variant: typo (RACCORD -> RACCRD)
Generated category: PR

**UI prompt**

Bonjour, vous avez RACCRD COUDE DE DURITE DE LAVE-GLACE pour ma ERTIGA ?

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
- Matched vehicle row: vehicleNo=VN0109883; VIN=MA3BNC22S00426866; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 133

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00447007
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019726
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez actuateur de ralentie pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 763
- Référence DB: 13471-54LA0-000
- Désignation française (designation2): ACTUATEUR DE RALENTIE
- Désignation OEM (designation): ACTUATOR ASSY RW416 T3
- Search description: ACTUATEUR DE RALENTIE ; ACTUATOR ASSY RW416 T3
- Public price TTC: 592.624 TND (raw DB=592.62357)
- Wholesale/pre-tax price HT: 498.003 TND (raw DB=498.003; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=364; reference=13471-54LA0-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:37.554Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (1): id=1633; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=661; referenceNo=13471-54LA0-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019726; VIN=TSMLYD21S00447007; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 134

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455187
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014489
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
- Matched vehicle row: vehicleNo=VN0014489; VIN=MA3KFC42S00455187; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 135

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00440774
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018399
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SIGLE AV pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6241
- Référence DB: 72131-54P10-DB7
- Désignation française (designation2): SIGLE AV
- Désignation OEM (designation): COVER, SENSOR (BLACK/CHROME)
- Search description: SIGLE AV ; COVER, SENSOR (BLACK/CHROME)
- Public price TTC: 499.670 TND (raw DB=499.67029)
- Wholesale/pre-tax price HT: 419.891 TND (raw DB=419.891; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3384; reference=72131-54P10-DB7; totalQuantity=24; stockDisponible=24; stockConsolide=24; statut=Disponible; updatedAt=2026-09-20T19:01:53.178Z
- Availability rule: stockConsolide >= 2; actual quantity=24; expected=available
- Fitment rows (1): id=6922; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=4920; referenceNo=72131-54P10-DB70; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018399; VIN=TSMLYD21S00440774; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 136

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA642911
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042756
Variant: exact
Generated category: PR

**UI prompt**

Je cherche SUPPORT PLANCHIER AR pour ma BALENO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0042756; VIN=MA3WB52S0LA642911; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 137

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442470
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018417
Variant: typo (RESERVOIR -> REESRVOIR)
Generated category: MÉCANIQUE

**UI prompt**

Bonjour, vous avez REESRVOIR DE LIQUIDE DE FREIN pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0018417; VIN=TSMLYD21S00442470; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 138

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZC72S00677487
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0044660
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de VERRE COMBINÉ D'INSTRUMENT pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0044660; VIN=TSMNZC72S00677487; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 139

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG525796
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204663
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez angle pare-chocs ar g pour fronx ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6215
- Référence DB: 71842M74T00-5PK
- Désignation française (designation2): ANGLE PARE-CHOCS AR G
- Désignation OEM (designation): BUMPER,REAR CORNER,L
- Search description: ANGLE PARE-CHOCS AR G ; BUMPER,REAR CORNER,L
- Public price TTC: 70.007 TND (raw DB=70.00651)
- Wholesale/pre-tax price HT: 58.829 TND (raw DB=58.829; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13241; reference=71842M74T00-5PK; totalQuantity=25; stockDisponible=0; stockConsolide=25; statut=Disponible; updatedAt=2026-09-20T19:01:38.360Z
- Availability rule: stockConsolide >= 2; actual quantity=25; expected=available
- Fitment rows (2): id=21235; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21236; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204663; VIN=MBHKWDA3SSG525796; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 140

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426194
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110403
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez BAVETTE AV G pour une ERTIGA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0110403; VIN=MA3BNC22S00426194; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 141

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588672
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189122
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de TUBE ECHAPPMENT pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0189122; VIN=MBHCZF63S00588672; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 142

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339570
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025090
Variant: exact (no typo possible)
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
- Matched vehicle row: vehicleNo=VN0025090; VIN=MA3AVC41S00339570; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 143

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA642836
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042745
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche MACANISME PORTE AV G pour ma BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7566
- Référence DB: 82281M68831
- Désignation française (designation2): MACANISME PORTE AV G
- Désignation OEM (designation): CYLINDER SET, FR DR LATCH LH
- Search description: MACANISME PORTE AV G ; CYLINDER SET, FR DR LATCH LH
- Public price TTC: 696.105 TND (raw DB=696.10478)
- Wholesale/pre-tax price HT: 584.962 TND (raw DB=584.962; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4118; reference=82281M68831; totalQuantity=2; stockDisponible=2; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:48.268Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=23251; modelName=BALENO GLX; typeCode=A1K414-TYPE1
- Alternate/item reference rows (1): id=5844; referenceNo=82281M68831; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042745; VIN=MA3WB52S1LA642836; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 144

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442798
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018423
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb JEU DE CALE ROULEMENT LAT DIFFERENTIEL lel VITARA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0018423; VIN=TSMLYD21S00442798; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 145

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00472587
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022172
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche JOINT, CONDUITE D'HUILE pour ma VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 1080
- Référence DB: 16147-78G70-000
- Désignation française (designation2): JOINT, CONDUITE D'HUILE
- Désignation OEM (designation): O-RING, OIL PIPE RM413
- Search description: JOINT, CONDUITE D'HUILE ; O-RING, OIL PIPE RM413
- Public price TTC: 16.540 TND (raw DB=16.53981)
- Wholesale/pre-tax price HT: 13.899 TND (raw DB=13.899; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=548; reference=16147-78G70-000; totalQuantity=6; stockDisponible=6; stockConsolide=6; statut=Disponible; updatedAt=2026-09-20T19:01:47.573Z
- Availability rule: stockConsolide >= 2; actual quantity=6; expected=available
- Fitment rows (1): id=2046; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=980; referenceNo=16147-78G70-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022172; VIN=TSMLYE21S00472587; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 146

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E22749
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180819
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez COMMANDE CLEF FERMETURE CENTRALE pour une NEW SWIFT ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0180819; VIN=MBHCZC63S00E22749; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 147

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S8LA642641
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042642
Variant: typo (ARMATURE -> ARMATRE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez ARMATRE PLAGE AVG pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 6358
- Référence DB: 72350M68P00
- Désignation française (designation2): ARMATURE PLAGE AVG
- Désignation OEM (designation): COVER COMP,FRONT FENDER,R
- Search description: ARMATURE PLAGE AVG ; COVER COMP,FRONT FENDER,R
- Public price TTC: 50.592 TND (raw DB=50.59166)
- Wholesale/pre-tax price HT: 42.514 TND (raw DB=42.514; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3458; reference=72350M68P00; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:38.674Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=21425; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=21426; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (1): id=5012; referenceNo=72350M68P00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0042642; VIN=MA3WB52S8LA642641; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 148

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZC62S00D92598
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0018252
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez agrafe plancher coffre pour swift ? prix ?

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
- Matched vehicle row: vehicleNo=VN0018252; VIN=MA3GZC62S00D92598; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 149

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426159
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0110404
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BARS DE DIRECTION lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 4153
- Référence DB: 48830M72R01
- Désignation française (designation2): BARS DE DIRECTION
- Désignation OEM (designation): TIE ROD, STRG
- Search description: BARS DE DIRECTION ; TIE ROD, STRG
- Public price TTC: 91.366 TND (raw DB=91.36582)
- Wholesale/pre-tax price HT: 76.778 TND (raw DB=76.77800000000001; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2173; reference=48830M72R01; totalQuantity=8; stockDisponible=1; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:39.190Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (4): id=18541; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=18542; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=5237; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5238; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=3320; referenceNo=48830M72R01; referenceType=3.0 | id=3321; referenceNo=48830M72R01-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0110404; VIN=MA3BNC22S00426159; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 150

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454938
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015742
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CAPTEUR DE CHOCK pour une CELERIO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0015742; VIN=MA3KFC42S00454938; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 151

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339796
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025087
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez SUPPORT SIGLE CALANDRE pour une CIAZ ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5980
- Référence DB: 71746M79M00-5PK
- Désignation française (designation2): SUPPORT SIGLE CALANDRE
- Désignation OEM (designation): COVERMARK(S)
- Search description: SUPPORT SIGLE CALANDRE ; COVERMARK(S)
- Public price TTC: 31.816 TND (raw DB=31.81584)
- Wholesale/pre-tax price HT: 26.736 TND (raw DB=26.736; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3237; reference=71746M79M00-5PK; totalQuantity=9; stockDisponible=5; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:54.259Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (1): id=6763; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (1): id=4758; referenceNo=71746M79M00-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025087; VIN=MA3AVC41S00339796; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 152

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG506849
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203605
Variant: exact
Generated category: PR

**UI prompt**

Je cherche JOINT COLONE DE DIRECTION pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0203605; VIN=MBHKWDA3SSG506849; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 153

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA653268
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045570
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de JOINT DURIT FILRE A AIR pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 843
- Référence DB: 13799M68P00
- Désignation française (designation2): JOINT DURIT FILRE A AIR
- Désignation OEM (designation): SEAL, AIR SUCT PIPE
- Search description: JOINT DURIT FILRE A AIR ; SEAL, AIR SUCT PIPE
- Public price TTC: 13.985 TND (raw DB=13.98488)
- Wholesale/pre-tax price HT: 11.752 TND (raw DB=11.752; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=423; reference=13799M68P00; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:47.250Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=12584; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12585; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1
- Alternate/item reference rows (2): id=760; referenceNo=13799M68P00; referenceType=3.0 | id=761; referenceNo=13799M68P00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045570; VIN=MA3WB52S1LA653268; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 154

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00517235
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0193788
Variant: typo (CALCULATEUR -> CALCULTAEUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CALCULTAEUR ECM pour ma CIAZ ?

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
- Matched vehicle row: vehicleNo=VN0193788; VIN=MA3AVC71S00517235; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 155

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: JS2ZC6C23L6100096
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0049000
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache box frien man d pour swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 6852
- Référence DB: 75831M56R50-5PK
- Désignation française (designation2): CACHE BOX FRIEN MAN D
- Désignation OEM (designation): COVER,FLOOR CONSOLE SIDE DRVR
- Search description: CACHE BOX FRIEN MAN D ; COVER,FLOOR CONSOLE SIDE DRVR
- Public price TTC: 35.692 TND (raw DB=35.69167)
- Wholesale/pre-tax price HT: 29.993 TND (raw DB=29.993; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3738; reference=75831M56R50-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.894Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=22230; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22231; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5364; referenceNo=75831M56R50-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0049000; VIN=JS2ZC6C23L6100096; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 156

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00764109
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089548
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb GOUPILLE ELASTIQUE 3 × 10 MM lel CELERIO BVA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0089548; VIN=MA3KFC42S00764109; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 157

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00426763
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0109880
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb ROULEMENT G ARBRE PRIMAIRE lel ERTIGA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1736
- Référence DB: 24165M86J00
- Désignation française (designation2): ROULEMENT G ARBRE PRIMAIRE
- Désignation OEM (designation): BEARING, INPUT SHAFT, L
- Search description: ROULEMENT G ARBRE PRIMAIRE ; BEARING, INPUT SHAFT, L
- Public price TTC: 122.778 TND (raw DB=122.77825)
- Wholesale/pre-tax price HT: 103.175 TND (raw DB=103.175; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9067; reference=24165M86J00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:52.590Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (8): id=14338; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=14339; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=14340; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=2768; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=2769; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=2770; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=2771; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=2772; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0109880; VIN=MA3BNC22S00426763; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 158

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339387
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025069
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez lecteur climatronic pour ciaz ? prix ?

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
- Matched vehicle row: vehicleNo=VN0025069; VIN=MA3AVC41S00339387; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 159

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449358
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019556
Variant: typo (OUVRANTE -> OUVRRANTE)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez VITRE TOIT OUVRRANTE pour ma VITARA ?

**DB facts for comparison (do not paste)**

- Part DB id: 7318
- Référence DB: 78710-61M01-000
- Désignation française (designation2): VITRE TOIT OUVRANTE
- Désignation OEM (designation): GLASS, SLIDING ROOF,AKK416
- Search description: VITRE TOIT OUVRANTE ; GLASS, SLIDING ROOF,AKK416
- Public price TTC: 2127.390 TND (raw DB=2127.39037)
- Wholesale/pre-tax price HT: 1787.723 TND (raw DB=1787.723; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3990; reference=78710-61M01-000; totalQuantity=3; stockDisponible=3; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:55.711Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=7914; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7915; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5655; referenceNo=78710-61M01-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0019556; VIN=TSMLYE21S00449358; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 160

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454870
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015758
Variant: exact
Generated category: PR

**UI prompt**

Je cherche ASSIETTE  RESSORT SOUPAPE pour ma CELERIO. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0015758; VIN=MA3KFC42S00454870; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 161

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760318
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089282
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de GUIDE SOUPAPE pour une CELERIO BVA, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0089282; VIN=MA3KFC42S00760318; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 162

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00444116
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018437
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez BOULON ANTI BROUILLARD pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0018437; VIN=TSMLYD21S00444116; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 163

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG528422
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204665
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
- Matched vehicle row: vehicleNo=VN0204665; VIN=MBHKWDA3SSG528422; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 164

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E22513
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0179266
Variant: dialect
Generated category: PR

**UI prompt**

Salem, n7eb MECANISME LEVE-VITRE AR lel NEW SWIFT. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0179266; VIN=MBHCZC63S00E22513; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 165

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG532569
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204647
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche LIGNE D'ECHAPPEMENT pour ma FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0204647; VIN=MBHKWDA3SSG532569; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 166

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG505075
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0203590
Variant: price
Generated category: ELECTRIQUE

**UI prompt**

Quel est le prix de CABLE DE MASSE DE BATTERIE pour une FRONX, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0203590; VIN=MBHKWDA3SSG505075; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 167

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00473023
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022179
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez BAGUETTE PORTE AR G pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 8216
- Référence DB: 83980-54P02-000
- Désignation française (designation2): BAGUETTE PORTE AR G
- Désignation OEM (designation): GARNISH, RR
- Search description: BAGUETTE PORTE AR G ; GARNISH, RR
- Public price TTC: 361.127 TND (raw DB=361.12692)
- Wholesale/pre-tax price HT: 303.468 TND (raw DB=303.468; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4473; reference=83980-54P02-000; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.037Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=8686; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=8687; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=6289; referenceNo=83980-54P02-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022179; VIN=TSMLYE21S00473023; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 168

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00472346
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022168
Variant: typo (CHAUFFAGE -> CHAUUFFAGE)
Generated category: PR

**UI prompt**

Bonjour, vous avez RACCORD DE CHAUUFFAGE pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0022168; VIN=TSMLYE21S00472346; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 169

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588989
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0192982
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb BOUCHON BOITE VITESSE lel DZIRE. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 1840
- Référence DB: 24726M76M00
- Désignation française (designation2): BOUCHON BOITE VITESSE
- Désignation OEM (designation): PLUG,TRANSAXLE CASE
- Search description: BOUCHON BOITE VITESSE ; PLUG,TRANSAXLE CASE
- Public price TTC: 15.744 TND (raw DB=15.7437)
- Wholesale/pre-tax price HT: 13.230 TND (raw DB=13.23; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=953; reference=24726M76M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.945Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (10): id=14749; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14750; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14751; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14752; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3033; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3034; modelName=AON312; typeCode=AON312-TYPE1 | id=3035; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=3036; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=3037; modelName=AXM310; typeCode=AXM310-TYPE1 | id=3038; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=1556; referenceNo=24726M76M00; referenceType=3.0 | id=1557; referenceNo=24726M76M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0192982; VIN=MBHCZF63S00588989; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 170

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA642570
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042636
Variant: twoturn
Generated category: ELECTRIQUE

**UI prompt**

**Turn 1:** Vous avez TWEETER AUDIO pour une BALENO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 3303
- Référence DB: 39102M65M00
- Désignation française (designation2): TWEETER AUDIO
- Désignation OEM (designation): SPEAKER ASSY,TWEETER
- Search description: TWEETER AUDIO ; SPEAKER ASSY,TWEETER
- Public price TTC: 57.300 TND (raw DB=57.29969)
- Wholesale/pre-tax price HT: 48.151 TND (raw DB=48.151; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1755; reference=39102M65M00; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:55.349Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (9): id=17246; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=17247; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=17248; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=17249; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=17250; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=4475; modelName=APQ415; typeCode=APQ415-TYPE2 | id=4476; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=4477; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=4478; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042636; VIN=MA3WB52S0LA642570; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 171

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00448875
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019753
Variant: exact (no typo possible)
Generated category: CARROSSERIE

**UI prompt**

Je cherche SEUIL DE PORTE AR D pour ma VITARA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0019753; VIN=TSMLYD21S00448875; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 172

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00589157
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189149
Variant: lowercase
Generated category: PR

**UI prompt**

vous avez engrenage de 5e vitesse de l’arbre primaire pour dzire ? prix ?

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
- Matched vehicle row: vehicleNo=VN0189149; VIN=MBHCZF63S00589157; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 173

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00763855
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089240
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de RING SYNCHRONISEUR DE VITESSE pour une CELERIO BVA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 1819
- Référence DB: 24433M76M00
- Désignation française (designation2): RING SYNCHRONISEUR DE VITESSE
- Désignation OEM (designation): RING,HIGH SPEED GEAR SYNC
- Search description: RING SYNCHRONISEUR DE VITESSE ; RING,HIGH SPEED GEAR SYNC
- Public price TTC: 72.748 TND (raw DB=72.74827)
- Wholesale/pre-tax price HT: 61.133 TND (raw DB=61.133; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9147; reference=24433M76M00; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:52.387Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (10): id=14665; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14666; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14667; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14668; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=2982; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=2983; modelName=AON312; typeCode=AON312-TYPE1 | id=2984; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=2985; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=2986; modelName=AXM310; typeCode=AXM310-TYPE1 | id=2987; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0089240; VIN=MA3KFC42S00763855; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 174

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E30209
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180815
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR DE ROUE ARR pour ma NEW SWIFT. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0180815; VIN=MBHCZC63S00E30209; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 175

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMNZD72S00543883
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0045905
Variant: typo (SUPPORT -> SUPPPORT)
Generated category: CARROSSERIE

**UI prompt**

Bonjour, vous avez SUPPPORT PLANCHIER AR D pour ma SWIFT ?

**DB facts for comparison (do not paste)**

- Part DB id: 4954
- Référence DB: 61514M56R00
- Désignation française (designation2): SUPPORT PLANCHIER AR D
- Désignation OEM (designation): EXTENSION, RR FLOOR RR SIDE,RH
- Search description: SUPPORT PLANCHIER AR D ; EXTENSION, RR FLOOR RR SIDE,RH
- Public price TTC: 48.796 TND (raw DB=48.79595)
- Wholesale/pre-tax price HT: 41.005 TND (raw DB=41.005; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2641; reference=61514M56R00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:54.168Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (2): id=19799; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=19800; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (2): id=4046; referenceNo=61514M56R00; referenceType=3.0 | id=4047; referenceNo=61514M56R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045905; VIN=TSMNZD72S00543883; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 176

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00281064
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0080446
Variant: twoturn
Generated category: PR

**UI prompt**

**Turn 1:** Vous avez COUVERCLE COLONNE DE DIRECTION pour une ERTIGA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0080446; VIN=MA3BNC22S00281064; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 177

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de CAPUCHON TIGE DE RENFORT pour une SWIFT, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 178

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC71S00517243
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB415-TYPE2
Vehicle number (DB cross-check only): VN0193787
Variant: exact
Generated category: ELECTRIQUE

**UI prompt**

Je cherche CAPTEUR DE CHOC pour ma CIAZ. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0193787; VIN=MA3AVC71S00517243; marque=SUZUKI; modele=CIAZ; typeCode=AVB415-TYPE2

## Case 179

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00470830
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022147
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez cache capteur pour vitara ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 2922
- Référence DB: 37737-54P00-000
- Désignation française (designation2): CACHE CAPTEUR
- Désignation OEM (designation): BEZEL,PARK SNSR
- Search description: CACHE CAPTEUR ; BEZEL,PARK SNSR
- Public price TTC: 62.076 TND (raw DB=62.07635)
- Wholesale/pre-tax price HT: 52.165 TND (raw DB=52.165; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1504; reference=37737-54P00-000; totalQuantity=12; stockDisponible=0; stockConsolide=12; statut=Disponible; updatedAt=2026-09-20T19:01:40.906Z
- Availability rule: stockConsolide >= 2; actual quantity=12; expected=available
- Fitment rows (2): id=4066; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=4067; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=2354; referenceNo=37737-54P00; referenceType=3.0 | id=2355; referenceNo=37737-54P00-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022147; VIN=TSMLYE21S00470830; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 180

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454748
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014460
Variant: dialect
Generated category: MÉCANIQUE

**UI prompt**

Salem, n7eb MANCHON SYNCHRO HAUTES VITESSE 3EME ET 4EME lel CELERIO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0014460; VIN=MA3KFC42S00454748; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 181

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E28878
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180824
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
- Matched vehicle row: vehicleNo=VN0180824; VIN=MBHCZC63S00E28878; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 182

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588535
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0189146
Variant: exact
Generated category: CARROSSERIE

**UI prompt**

Je cherche TABLEAU INF pour ma DZIRE. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 6664
- Référence DB: 73121M56R60-5PK
- Désignation française (designation2): TABLEAU INF
- Désignation OEM (designation): PANEL,INSTRUMENT MAIN LOWER
- Search description: TABLEAU INF ; PANEL,INSTRUMENT MAIN LOWER
- Public price TTC: 819.380 TND (raw DB=819.38045)
- Wholesale/pre-tax price HT: 688.555 TND (raw DB=688.5549999999999; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13684; reference=73121M56R60-5PK; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:54.533Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=21918; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=21919; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5247; referenceNo=73121M56R60-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0189146; VIN=MBHCZF63S00588535; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 183

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00364749
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0101070
Variant: lowercase
Generated category: MÉCANIQUE

**UI prompt**

vous avez kit soufflet de cardan cote roue pour ertiga ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 3877
- Référence DB: 44138M72R50
- Désignation française (designation2): KIT SOUFFLET DE CARDAN COTE ROUE
- Désignation OEM (designation): .BOOT SET, WHEEL SIDE
- Search description: KIT SOUFFLET DE CARDAN COTE ROUE ; .BOOT SET, WHEEL SIDE
- Public price TTC: 284.096 TND (raw DB=284.09584)
- Wholesale/pre-tax price HT: 238.736 TND (raw DB=238.736; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2030; reference=44138M72R50; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:47.806Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=5001; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=5002; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=3089; referenceNo=44138M72R50; referenceType=3.0 | id=3090; referenceNo=44138M72R50-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0101070; VIN=MA3BNC22S00364749; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 184

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340046
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025089
Variant: typo (DOUILLE -> DOUILE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez DOUILE DE FEU DE RECUL pour ma CIAZ ?

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
- Matched vehicle row: vehicleNo=VN0025089; VIN=MA3AVC41S00340046; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 185

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3SSG522390
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0204655
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb SUPPORT ANTIBROUILLARD AV G lel FRONX. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 6048
- Référence DB: 71763M74T00
- Désignation française (designation2): SUPPORT ANTIBROUILLARD AV G
- Désignation OEM (designation): BRACKET,FOG LAMP,L
- Search description: SUPPORT ANTIBROUILLARD AV G ; BRACKET,FOG LAMP,L
- Public price TTC: 94.225 TND (raw DB=94.22539)
- Wholesale/pre-tax price HT: 79.181 TND (raw DB=79.181; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3276; reference=71763M74T00; totalQuantity=10; stockDisponible=1; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:53.567Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (2): id=21068; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=21069; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0204655; VIN=MBHKWDA3SSG522390; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 186

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00376212
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119744
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez CIRCLIP DE ROULEMENT DE ROUE AV pour une SPRESSO ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 4015
- Référence DB: 46861M60G00
- Désignation française (designation2): CIRCLIP DE ROULEMENT DE ROUE AV
- Désignation OEM (designation): CIRCLIP,FRONT WHEEL
- Search description: CIRCLIP DE ROULEMENT DE ROUE AV ; CIRCLIP,FRONT WHEEL
- Public price TTC: 3.046 TND (raw DB=3.0464)
- Wholesale/pre-tax price HT: 2.560 TND (raw DB=2.56; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=11216; reference=46861M60G00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:42.647Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (7): id=18320; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=5111; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=5112; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5113; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5114; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=5115; modelName=AXM310; typeCode=AXM310-TYPE2 | id=5116; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119744; VIN=MA3RFL41S00376212; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 187

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654865
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045579
Variant: dialect
Generated category: ELECTRIQUE

**UI prompt**

Salem, n7eb CONTACTEUR FEU DE STOP lel BALENO. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0045579; VIN=MA3WB52S2LA654865; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 188

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339902
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025101
Variant: twoturn
Generated category: CARROSSERIE

**UI prompt**

**Turn 1:** Vous avez CARENAGE COTE CONDENSEUR G pour une CIAZ ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 9033
- Référence DB: 95344M79M00
- Désignation française (designation2): CARENAGE COTE CONDENSEUR G
- Désignation OEM (designation): SHROUD, COND SIDE,LH NO.2
- Search description: CARENAGE COTE CONDENSEUR G ; SHROUD, COND SIDE,LH NO.2
- Public price TTC: 31.799 TND (raw DB=31.79918)
- Wholesale/pre-tax price HT: 26.722 TND (raw DB=26.722; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4865; reference=95344M79M00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:42.156Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=9355; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1
- Alternate/item reference rows (2): id=6811; referenceNo=95344M79M00; referenceType=3.0 | id=6812; referenceNo=95344M79M00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025101; VIN=MA3AVC41S00339902; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 189

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455116
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0014480
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche CLAVETTE DEMI-LUNE DE QUEUE DE SOUPAPE pour ma CELERIO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 720
- Référence DB: 12932M74L00
- Désignation française (designation2): CLAVETTE DEMI-LUNE DE QUEUE DE SOUPAPE
- Désignation OEM (designation): COTTER, VALVE
- Search description: CLAVETTE DEMI-LUNE DE QUEUE DE SOUPAPE ; COTTER, VALVE
- Public price TTC: 2.749 TND (raw DB=2.7489)
- Wholesale/pre-tax price HT: 2.310 TND (raw DB=2.31; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=339; reference=12932M74L00; totalQuantity=27; stockDisponible=27; stockConsolide=27; statut=Disponible; updatedAt=2026-09-20T19:01:42.671Z
- Availability rule: stockConsolide >= 2; actual quantity=27; expected=available
- Fitment rows (20): id=1554; modelName=APQ415; typeCode=APQ415-TYPE2 | id=12292; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=12293; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=12294; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=12295; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=12296; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=12297; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=12298; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=12299; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1553; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1555; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=1556; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=1557; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1558; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=1559; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=1560; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1561; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1562; modelName=AXM310; typeCode=AXM310-TYPE1 | id=1563; modelName=AXM310; typeCode=AXM310-TYPE2 | id=1564; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (2): id=608; referenceNo=12932M74L00; referenceType=3.0 | id=609; referenceNo=12932M74L00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0014480; VIN=MA3KFC42S00455116; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 190

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00760312
Expected validated vehicle: SUZUKI CELERIO BVA
DB type code used for this part’s fitment: AVH310-TYPE2
Vehicle number (DB cross-check only): VN0089284
Variant: typo (ACTUATEUR -> ACTUATUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez ACTUATUR ABS pour ma CELERIO BVA ?

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
- Matched vehicle row: vehicleNo=VN0089284; VIN=MA3KFC42S00760312; marque=SUZUKI; modele=CELERIO BVA; typeCode=AVH310-TYPE2

## Case 191

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZC63S00E31441
Expected validated vehicle: SUZUKI NEW SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0180811
Variant: lowercase
Generated category: CARROSSERIE

**UI prompt**

vous avez charniere porte av d inf pour new swift ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 5686
- Référence DB: 69330M74L00
- Désignation française (designation2): CHARNIERE  PORTE AV D INF
- Désignation OEM (designation): HINGEFRONT DOOR LOWER
- Search description: CHARNIERE PORTE AV D INF ; HINGEFRONT DOOR LOWER
- Public price TTC: 48.532 TND (raw DB=48.53177)
- Wholesale/pre-tax price HT: 40.783 TND (raw DB=40.783; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3055; reference=69330M74L00; totalQuantity=17; stockDisponible=0; stockConsolide=17; statut=Disponible; updatedAt=2026-09-20T19:01:42.443Z
- Availability rule: stockConsolide >= 2; actual quantity=17; expected=available
- Fitment rows (3): id=20631; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=20632; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=6523; modelName=AON312; typeCode=AON312-TYPE1
- Alternate/item reference rows (1): id=4553; referenceNo=69330M74L00; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0180811; VIN=MBHCZC63S00E31441; marque=SUZUKI; modele=NEW SWIFT; typeCode=A2N412-TYPE1

## Case 192

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00425738
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0008616
Variant: price
Generated category: MÉCANIQUE

**UI prompt**

Quel est le prix de SOUFFLET ACTIONNEUR EMBRAYAGE AGS pour une CELERIO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0008616; VIN=MA3KFC42S00425738; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 193

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1KA623492
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0037245
Variant: lowercase
Generated category: ELECTRIQUE

**UI prompt**

vous avez module transistor de pulseur pour baleno ? prix ?

**DB facts for comparison (do not paste)**

- Part DB id: 9046
- Référence DB: 95626M79M00
- Désignation française (designation2): MODULE TRANSISTOR DE PULSEUR
- Désignation OEM (designation): .POWER TRANSISTOR ASSY,BLO
- Search description: MODULE TRANSISTOR DE PULSEUR ; .POWER TRANSISTOR ASSY,BLO
- Public price TTC: 600.761 TND (raw DB=600.7613)
- Wholesale/pre-tax price HT: 504.841 TND (raw DB=504.84143; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=15953; reference=95626M79M00; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:48.728Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (14): id=25412; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=25413; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=25414; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=25415; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=25416; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=25417; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=9381; modelName=AON312; typeCode=AON312-TYPE1 | id=9382; modelName=APQ415; typeCode=APQ415-TYPE2 | id=9383; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=9384; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=9385; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=9386; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=9387; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=9388; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0037245; VIN=MA3WB52S1KA623492; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 194

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378454
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119764
Variant: price
Generated category: CARROSSERIE

**UI prompt**

Quel est le prix de MEMBRE COTE AR G pour une SPRESSO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5008
- Référence DB: 62312M62S00
- Désignation française (designation2): MEMBRE COTE AR G
- Désignation OEM (designation): .MEMBER,RR FLR SIDE RR,L
- Search description: MEMBRE COTE AR G ; .MEMBER,RR FLR SIDE RR,L
- Public price TTC: 109.906 TND (raw DB=109.90602)
- Wholesale/pre-tax price HT: 92.358 TND (raw DB=92.358; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=2668; reference=62312M62S00; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:48.571Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (1): id=6053; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119764; VIN=MA3RFL41S00378454; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 195

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378435
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0119729
Variant: exact
Generated category: MÉCANIQUE

**UI prompt**

Je cherche SIEGE RESSORT D'AMMORTISSEUR AV pour ma SPRESSO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 3479
- Référence DB: 41230M74P00
- Désignation française (designation2): SIEGE RESSORT D'AMMORTISSEUR AV
- Désignation OEM (designation): SEAT, FR SPRING UPR
- Search description: SIEGE RESSORT D'AMMORTISSEUR AV ; SEAT, FR SPRING UPR
- Public price TTC: 39.062 TND (raw DB=39.06175)
- Wholesale/pre-tax price HT: 32.825 TND (raw DB=32.825; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=10699; reference=41230M74P00; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:53.163Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (3): id=4623; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=4624; modelName=AXM310; typeCode=AXM310-TYPE1 | id=4625; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0119729; VIN=MA3RFL41S00378435; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 196

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00449104
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0019542
Variant: typo (POUSSIERE -> POUSSEIRE)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez CACHE-POUSSEIRE D'OPTIQUE pour ma VITARA ?

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
- Matched vehicle row: vehicleNo=VN0019542; VIN=TSMLYE21S00449104; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 197

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00442209
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018413
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb CACHE CAPOT lel VITARA. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0018413; VIN=TSMLYD21S00442209; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 198

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446226
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018457
Variant: twoturn
Generated category: MÉCANIQUE

**UI prompt**

**Turn 1:** Vous avez TUBE A HUILE pour une VITARA ?

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0018457; VIN=TSMLYD21S00446226; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 199

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3ZF6C122A625881
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0071837
Variant: typo (FERMETUR -> FERMTEUR)
Generated category: ELECTRIQUE

**UI prompt**

Bonjour, vous avez ANTENNE FERMTEUR CENTRALE pour ma SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0071837; VIN=MA3ZF6C122A625881; marque=SUZUKI; modele=SWIFT; typeCode=A2N412-TYPE1

## Case 200

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYD21S00446206
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0018456
Variant: dialect
Generated category: CARROSSERIE

**UI prompt**

Salem, n7eb BOUTON SIEGE lel VITARA. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 8839
- Référence DB: 85711-65JA0-5PK
- Désignation française (designation2): BOUTON SIEGE
- Désignation OEM (designation): KNOB, RCLNG LH (BLACK)
- Search description: BOUTON SIEGE ; KNOB, RCLNG LH (BLACK)
- Public price TTC: 22.283 TND (raw DB=22.28275)
- Wholesale/pre-tax price HT: 18.725 TND (raw DB=18.725; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=4775; reference=85711-65JA0-5PK; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:40.269Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=9140; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=9141; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=6687; referenceNo=85711-65JA0; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0018456; VIN=TSMLYD21S00446206; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1
