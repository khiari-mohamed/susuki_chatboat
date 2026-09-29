# 50 chatbot UI test prompts

Generated: 2026-09-28T12:00:03.888Z

Start a fresh chat for each case. For cases with Turn 1 and Turn 2, send both messages in the same chat. Paste only the text under “UI prompt”; use the DB facts below it as the manual checking guide.

For each case, enter the listed VIN in the UI vehicle section using “Saisissez directement votre VIN”, validate it, confirm the displayed model matches the expected vehicle, then send only the UI prompt. The VIN and expected model are test setup, not chat text.

## Case 01

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S4LA654849
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045588

**UI prompt**

Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 535
- Référence DB: 12341M74L00-0BA
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET
- Désignation OEM (designation): BEARING,CRANK UPR(US:0.25,T:2.125)
- Search description: COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VIOLET ; BEARING,CRANK UPR(US:0.25,T:2.125)
- Public price TTC: 33.062 TND (raw DB=33.06177)
- Wholesale/pre-tax price HT: 27.783 TND (raw DB=27.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7953; reference=12341M74L00-0BA; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.661Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (14): id=11267; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11268; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11269; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11270; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11271; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11272; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11273; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11274; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1033; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1034; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1035; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1036; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1037; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1038; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045588; VIN=MA3WB52S4LA654849; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 02

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHKWDA3STG625451
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE2
Vehicle number (DB cross-check only): VN0217480

**UI prompt**

Je cherche BOUTON DE COMMANDE DE L’AFFICHAGE TETE HAUTE (HUD) pour une FRONX. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0217480; VIN=MBHKWDA3STG625451; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE2

## Case 03

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654819
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045587

**UI prompt**

Salem, n7eb COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 537
- Référence DB: 12341M74L00-0CA
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON
- Désignation OEM (designation): BEARING,CRANK UPR(US:0.25,T:2.125)
- Search description: COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/MARRON ; BEARING,CRANK UPR(US:0.25,T:2.125)
- Public price TTC: 33.062 TND (raw DB=33.06177)
- Wholesale/pre-tax price HT: 27.783 TND (raw DB=27.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7955; reference=12341M74L00-0CA; totalQuantity=8; stockDisponible=0; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:43.645Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (14): id=11293; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11294; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11295; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11296; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11297; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11298; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11299; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11300; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1043; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1044; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1045; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1046; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1047; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1048; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045587; VIN=MA3WB52S6LA654819; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 04

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654720
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045586

**UI prompt**

**Turn 1:** Je cherche COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VIOLET pour ma BALENO.

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 572
- Référence DB: 12345M74L00-0BA
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VIOLET
- Désignation OEM (designation): BEARING,CRANK LWR(US:0.25,T:2.125)
- Search description: COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VIOLET ; BEARING,CRANK LWR(US:0.25,T:2.125)
- Public price TTC: 41.518 TND (raw DB=41.51791)
- Wholesale/pre-tax price HT: 34.889 TND (raw DB=34.889; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7994; reference=12345M74L00-0BA; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.601Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (14): id=11429; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11430; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11431; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11432; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11433; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11434; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11435; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11436; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1099; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1100; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1101; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1102; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1103; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1104; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045586; VIN=MA3WB52S9LA654720; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 05

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654951
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045585

**UI prompt**

Quel est le prix de COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/MARRON pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 574
- Référence DB: 12345M74L00-0CA
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/MARRON
- Désignation OEM (designation): BEARING,CRANK LWR(US:0.25,T:2.125)
- Search description: COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/MARRON ; BEARING,CRANK LWR(US:0.25,T:2.125)
- Public price TTC: 31.575 TND (raw DB=31.57546)
- Wholesale/pre-tax price HT: 26.534 TND (raw DB=26.534; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7996; reference=12345M74L00-0CA; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.579Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (14): id=11455; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11456; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11457; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11458; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11459; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11460; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11461; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11462; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1109; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1110; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1111; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1112; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1113; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1114; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045585; VIN=MA3WB52S6LA654951; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 06

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00343668
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0030815

**UI prompt**

Il me faut RONDELLE PLATE M10 D'AXE DE FOURCHETTE  SELECTION pour ma CIAZ. Vous avez ça ?

**DB facts for comparison (do not paste)**

- Part DB id: 31
- Référence DB: 08322M0110A
- Désignation française (designation2): RONDELLE PLATE M10 D'AXE DE FOURCHETTE  SELECTION
- Désignation OEM (designation): WASHER
- Search description: RONDELLE PLATE M10 D'AXE DE FOURCHETTE SELECTION ; WASHER
- Public price TTC: 2.901 TND (raw DB=2.90122)
- Wholesale/pre-tax price HT: 2.438 TND (raw DB=2.438; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7497; reference=08322M0110A; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:52.412Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (9): id=9747; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=9748; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=9749; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=125; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=126; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=127; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=128; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=129; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=130; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0030815; VIN=MA3AVC41S00343668; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 07

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654834
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045583

**UI prompt**

Prix et disponibilité pour COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/NOIR, compatible avec une BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 541
- Référence DB: 12341M74L00-0EA
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/NOIR
- Désignation OEM (designation): BEARING,CRANK UPR(US:0.25,T:2.125,WHITE)
- Search description: COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/NOIR ; BEARING,CRANK UPR(US:0.25,T:2.125,WHITE)
- Public price TTC: 33.062 TND (raw DB=33.06177)
- Wholesale/pre-tax price HT: 27.783 TND (raw DB=27.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7959; reference=12341M74L00-0EA; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.650Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (14): id=11345; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11346; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11347; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11348; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11349; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11350; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11351; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11352; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1063; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1064; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1065; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1066; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1067; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1068; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045583; VIN=MA3WB52S2LA654834; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 08

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654751
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045582

**UI prompt**

**Turn 1:** Vous avez COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/ROSE pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 533
- Référence DB: 12341M74L00-0AA
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/ROSE
- Désignation OEM (designation): BEARING,CRANK UPR(US:0.25,T:2.125)
- Search description: COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/ROSE ; BEARING,CRANK UPR(US:0.25,T:2.125)
- Public price TTC: 33.062 TND (raw DB=33.06177)
- Wholesale/pre-tax price HT: 27.783 TND (raw DB=27.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7951; reference=12341M74L00-0AA; totalQuantity=8; stockDisponible=0; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:43.655Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (14): id=11241; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11242; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11243; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11244; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11245; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11246; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11247; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11248; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1023; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1024; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1025; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1026; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1027; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1028; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045582; VIN=MA3WB52S9LA654751; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 09

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA654890
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045581

**UI prompt**

Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VERT pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 539
- Référence DB: 12341M74L00-0DA
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VERT
- Désignation OEM (designation): BEARING,CRANK UPR(US:0.25,T:2.125)
- Search description: COUSSINET PALIER VILEBREQUIN SUP 0,25 ROUGE/VERT ; BEARING,CRANK UPR(US:0.25,T:2.125)
- Public price TTC: 33.062 TND (raw DB=33.06177)
- Wholesale/pre-tax price HT: 27.783 TND (raw DB=27.783; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7957; reference=12341M74L00-0DA; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.658Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (14): id=11319; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11320; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11321; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11322; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11323; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11324; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11325; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11326; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1053; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1054; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1055; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1056; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1057; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1058; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045581; VIN=MA3WB52S1LA654890; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 10

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA654735
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045580

**UI prompt**

Je cherche COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/ROSE pour une BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 570
- Référence DB: 12345M74L00-0AA
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/ROSE
- Désignation OEM (designation): BEARING,CRANK LWR(US:0.25,T:2.125)
- Search description: COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/ROSE ; BEARING,CRANK LWR(US:0.25,T:2.125)
- Public price TTC: 31.575 TND (raw DB=31.57546)
- Wholesale/pre-tax price HT: 26.534 TND (raw DB=26.534; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7992; reference=12345M74L00-0AA; totalQuantity=10; stockDisponible=0; stockConsolide=10; statut=Disponible; updatedAt=2026-09-20T19:01:43.590Z
- Availability rule: stockConsolide >= 2; actual quantity=10; expected=available
- Fitment rows (14): id=11403; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11404; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11405; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11406; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11407; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11408; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11409; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11410; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1089; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1090; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1091; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1092; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1093; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1094; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045580; VIN=MA3WB52S0LA654735; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 11

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654865
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045579

**UI prompt**

Salem, n7eb COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VERT lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 576
- Référence DB: 12345M74L00-0DA
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VERT
- Désignation OEM (designation): BEARING,CRANK LWR(US:0.25,T:2.125)
- Search description: COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/VERT ; BEARING,CRANK LWR(US:0.25,T:2.125)
- Public price TTC: 31.575 TND (raw DB=31.57546)
- Wholesale/pre-tax price HT: 26.534 TND (raw DB=26.534; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7998; reference=12345M74L00-0DA; totalQuantity=8; stockDisponible=0; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:43.594Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (14): id=11481; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11482; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11483; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11484; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11485; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11486; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11487; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11488; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1119; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1120; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1121; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1122; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1123; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1124; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045579; VIN=MA3WB52S2LA654865; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 12

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHWDBC20SG346917
Expected validated vehicle: SUZUKI FRONX
DB type code used for this part’s fitment: A3L415-TYPE1
Vehicle number (DB cross-check only): VN0207812

**UI prompt**

**Turn 1:** Je cherche SPIRALE DE VOLANT  ALLUMAGE AUTOMATIQUE DES FEUX pour ma FRONX.

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 2836
- Référence DB: 37410M55TH0
- Désignation française (designation2): SPIRALE DE VOLANT  ALLUMAGE AUTOMATIQUE DES FEUX
- Désignation OEM (designation): SET,CONTACT COIL & AUTO LIGHT
- Search description: SPIRALE DE VOLANT ALLUMAGE AUTOMATIQUE DES FEUX ; SET,CONTACT COIL & AUTO LIGHT
- Public price TTC: 1683.384 TND (raw DB=1683.38352)
- Wholesale/pre-tax price HT: 1414.608 TND (raw DB=1414.608; do not present as customer price)
- Unit: PCS
- Category: ELECTRIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1455; reference=37410M55TH0; totalQuantity=1; stockDisponible=1; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:53.420Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=16371; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=16372; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=3967; modelName=APQ415; typeCode=APQ415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0207812; VIN=MBHWDBC20SG346917; marque=SUZUKI; modele=FRONX; typeCode=A3L415-TYPE1

## Case 13

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S6LA654920
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045578

**UI prompt**

Quel est le prix de COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/NOIR pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 578
- Référence DB: 12345M74L00-0EA
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/NOIR
- Désignation OEM (designation): BEARING,CRANK LWR(US:0.25,T:2.125,WHITE)
- Search description: COUSSINET INF PALIER VILEBREQUIN 0,25 ROUGE/NOIR ; BEARING,CRANK LWR(US:0.25,T:2.125,WHITE)
- Public price TTC: 31.575 TND (raw DB=31.57546)
- Wholesale/pre-tax price HT: 26.534 TND (raw DB=26.534; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=8000; reference=12345M74L00-0EA; totalQuantity=9; stockDisponible=0; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:43.587Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (14): id=11507; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11508; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11509; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11510; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11511; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11512; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11513; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11514; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1129; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1130; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1131; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1132; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=1133; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=1134; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045578; VIN=MA3WB52S6LA654920; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 14

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00340152
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0028458

**UI prompt**

Il me faut BOUTON DE FEUX DE DETRESSE AVEC TEMOIN D’ALARME pour ma CIAZ. Vous avez ça ?

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
- Matched vehicle row: vehicleNo=VN0028458; VIN=MA3AVC41S00340152; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 15

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00587523
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0195220

**UI prompt**

Prix et disponibilité pour CACHE EXT MECANISME INCLINAISON SIEGE AV G NOIR, compatible avec une DZIRE ?

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
- Matched vehicle row: vehicleNo=VN0195220; VIN=MBHCZF63S00587523; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 16

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588339
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0194488

**UI prompt**

**Turn 1:** Vous avez ENJOLIVEUR EXT COTE CONDUCTEUR TABLEAU DE BORD pour une DZIRE ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 6722
- Référence DB: 73831M56R50-5PK
- Désignation française (designation2): ENJOLIVEUR EXT COTE CONDUCTEUR TABLEAU DE BORD
- Désignation OEM (designation): KGARNISH, I/P DRVR OUTSIDE
- Search description: ENJOLIVEUR EXT COTE CONDUCTEUR TABLEAU DE BORD ; KGARNISH, I/P DRVR OUTSIDE
- Public price TTC: 40.453 TND (raw DB=40.45286)
- Wholesale/pre-tax price HT: 33.994 TND (raw DB=33.994; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3677; reference=73831M56R50-5PK; totalQuantity=5; stockDisponible=5; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:44.716Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (2): id=22036; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22037; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2
- Alternate/item reference rows (1): id=5290; referenceNo=73831M56R50-5PK; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0194488; VIN=MBHCZF63S00588339; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 17

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA654905
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045577

**UI prompt**

Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP STD VIOLET pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 534
- Référence DB: 12341M74L00-0B0
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP STD VIOLET
- Désignation OEM (designation): BEARING,CRANK UPR(STD,T:2.0)
- Search description: COUSSINET PALIER VILEBREQUIN SUP STD VIOLET ; BEARING,CRANK UPR(STD,T:2.0)
- Public price TTC: 15.857 TND (raw DB=15.85675)
- Wholesale/pre-tax price HT: 13.325 TND (raw DB=13.325; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7952; reference=12341M74L00-0B0; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.679Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (12): id=11255; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11256; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11257; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11258; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11259; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11260; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11261; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11262; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1029; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1030; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1031; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1032; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045577; VIN=MA3WB52SXLA654905; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 18

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA654782
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045576

**UI prompt**

Je cherche COUSSINET PALIER VILEBREQUIN SUP STD MARRON pour une BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 536
- Référence DB: 12341M74L00-0C0
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP STD MARRON
- Désignation OEM (designation): BEARING,CRANK UPR(STD,T:2.0)
- Search description: COUSSINET PALIER VILEBREQUIN SUP STD MARRON ; BEARING,CRANK UPR(STD,T:2.0)
- Public price TTC: 15.857 TND (raw DB=15.85675)
- Wholesale/pre-tax price HT: 13.325 TND (raw DB=13.325; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7954; reference=12341M74L00-0C0; totalQuantity=8; stockDisponible=0; stockConsolide=8; statut=Disponible; updatedAt=2026-09-20T19:01:43.665Z
- Availability rule: stockConsolide >= 2; actual quantity=8; expected=available
- Fitment rows (12): id=11281; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11282; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11283; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11284; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11285; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11286; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11287; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11288; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1039; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1040; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1041; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1042; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045576; VIN=MA3WB52S9LA654782; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 19

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA654766
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045575

**UI prompt**

Salem, n7eb COUSSINET INF PALIER VILEBREQUIN STD VIOLET lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 571
- Référence DB: 12345M74L00-0B0
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN STD VIOLET
- Désignation OEM (designation): BEARING,CRANK LWR(STD,T:2.0)
- Search description: COUSSINET INF PALIER VILEBREQUIN STD VIOLET ; BEARING,CRANK LWR(STD,T:2.0)
- Public price TTC: 13.775 TND (raw DB=13.77544)
- Wholesale/pre-tax price HT: 11.576 TND (raw DB=11.576; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7993; reference=12345M74L00-0B0; totalQuantity=0; stockDisponible=0; stockConsolide=0; statut=Indisponible; updatedAt=2026-09-20T19:01:43.626Z
- Availability rule: stockConsolide >= 2; actual quantity=0; expected=unavailable
- Fitment rows (12): id=11417; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11418; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11419; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11420; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11421; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11422; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11423; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11424; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1095; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1096; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1097; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1098; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045575; VIN=MA3WB52S0LA654766; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 20

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S2LA654803
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045574

**UI prompt**

**Turn 1:** Je cherche COUSSINET INF PALIER VILEBREQUIN STD MARRON pour ma BALENO.

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 573
- Référence DB: 12345M74L00-0C0
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN STD MARRON
- Désignation OEM (designation): BEARING,CRANK LWR(STD,T:2.0)
- Search description: COUSSINET INF PALIER VILEBREQUIN STD MARRON ; BEARING,CRANK LWR(STD,T:2.0)
- Public price TTC: 13.781 TND (raw DB=13.78139)
- Wholesale/pre-tax price HT: 11.581 TND (raw DB=11.581; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7995; reference=12345M74L00-0C0; totalQuantity=7; stockDisponible=0; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:43.607Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (12): id=11443; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11444; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11445; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11446; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11447; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11448; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11449; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11450; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1105; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1106; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1107; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1108; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045574; VIN=MA3WB52S2LA654803; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 21

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00294262
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0239113

**UI prompt**

Quel est le prix de VIS CRUCIFORME A TETE BOMBEE AVEC RONDELLE pour une VITARA, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 16
- Référence DB: 03241-0516D-000
- Désignation française (designation2): VIS CRUCIFORME A TETE BOMBEE AVEC RONDELLE
- Désignation OEM (designation): SCREW AKK416
- Search description: VIS CRUCIFORME A TETE BOMBEE AVEC RONDELLE ; SCREW AKK416
- Public price TTC: 11.733 TND (raw DB=11.7334)
- Wholesale/pre-tax price HT: 9.860 TND (raw DB=9.86; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12; reference=03241-0516D-000; totalQuantity=46; stockDisponible=46; stockConsolide=46; statut=Disponible; updatedAt=2026-09-20T19:01:55.528Z
- Availability rule: stockConsolide >= 2; actual quantity=46; expected=available
- Fitment rows (2): id=57; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=58; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (2): id=23; referenceNo=03241-0516D-000; referenceType=3.0 | id=24; referenceNo=03241-0516D-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0239113; VIN=TSMLYE21S00294262; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 22

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339517
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025121

**UI prompt**

Il me faut RENFORT LAT EXT BAIE PARE-BRISE G pour ma CIAZ. Vous avez ça ?

**DB facts for comparison (do not paste)**

- Part DB id: 4903
- Référence DB: 59460M79M50
- Désignation française (designation2): RENFORT LAT EXT BAIE PARE-BRISE G
- Désignation OEM (designation): MEMBERCOWL SIDE OUTERL
- Search description: RENFORT LAT EXT BAIE PARE-BRISE G ; MEMBERCOWL SIDE OUTERL
- Public price TTC: 111.586 TND (raw DB=111.5863)
- Wholesale/pre-tax price HT: 93.770 TND (raw DB=93.77; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12078; reference=59460M79M50; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:52.028Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (3): id=5958; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=5959; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=5960; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3
- Alternate/item reference rows (2): id=4017; referenceNo=59460M79M50; referenceType=3.0 | id=4018; referenceNo=59460M79M50-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0025121; VIN=MA3AVC41S00339517; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 23

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA653351
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045573

**UI prompt**

Prix et disponibilité pour COUSSINET PALIER VILEBREQUIN SUP STD ROSE, compatible avec une BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 532
- Référence DB: 12341M74L00-0A0
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP STD ROSE
- Désignation OEM (designation): BEARING,CRANK UPR(STD,T:2.0)
- Search description: COUSSINET PALIER VILEBREQUIN SUP STD ROSE ; BEARING,CRANK UPR(STD,T:2.0)
- Public price TTC: 16.020 TND (raw DB=16.01978)
- Wholesale/pre-tax price HT: 13.462 TND (raw DB=13.462; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7950; reference=12341M74L00-0A0; totalQuantity=12; stockDisponible=0; stockConsolide=12; statut=Disponible; updatedAt=2026-09-20T19:01:43.672Z
- Availability rule: stockConsolide >= 2; actual quantity=12; expected=available
- Fitment rows (12): id=11229; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11230; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11231; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11232; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11233; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11234; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11235; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11236; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1019; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1020; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1021; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1022; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045573; VIN=MA3WB52SXLA653351; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 24

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA653292
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045572

**UI prompt**

**Turn 1:** Vous avez COUSSINET PALIER VILEBREQUIN SUP STD VERT pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 538
- Référence DB: 12341M74L00-0D0
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP STD VERT
- Désignation OEM (designation): BEARING,CRANK UPR(STD,T:2.0)
- Search description: COUSSINET PALIER VILEBREQUIN SUP STD VERT ; BEARING,CRANK UPR(STD,T:2.0)
- Public price TTC: 15.857 TND (raw DB=15.85675)
- Wholesale/pre-tax price HT: 13.325 TND (raw DB=13.325; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7956; reference=12341M74L00-0D0; totalQuantity=7; stockDisponible=0; stockConsolide=7; statut=Disponible; updatedAt=2026-09-20T19:01:43.676Z
- Availability rule: stockConsolide >= 2; actual quantity=7; expected=available
- Fitment rows (12): id=11307; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11308; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11309; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11310; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11311; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11312; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11313; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11314; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1049; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1050; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1051; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1052; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045572; VIN=MA3WB52S9LA653292; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 25

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S7LA653372
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045571

**UI prompt**

Bonjour, vous avez COUSSINET PALIER VILEBREQUIN SUP STD NOIR pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 540
- Référence DB: 12341M74L00-0E0
- Désignation française (designation2): COUSSINET PALIER VILEBREQUIN SUP STD NOIR
- Désignation OEM (designation): BEARING,CRANK UPR(STD,T:2.0)
- Search description: COUSSINET PALIER VILEBREQUIN SUP STD NOIR ; BEARING,CRANK UPR(STD,T:2.0)
- Public price TTC: 15.857 TND (raw DB=15.85675)
- Wholesale/pre-tax price HT: 13.325 TND (raw DB=13.325; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7958; reference=12341M74L00-0E0; totalQuantity=11; stockDisponible=0; stockConsolide=11; statut=Disponible; updatedAt=2026-09-20T19:01:43.670Z
- Availability rule: stockConsolide >= 2; actual quantity=11; expected=available
- Fitment rows (12): id=11333; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11334; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11335; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11336; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11337; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11338; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11339; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11340; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1059; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1060; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1061; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1062; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045571; VIN=MA3WB52S7LA653372; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 26

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S1LA653268
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045570

**UI prompt**

Je cherche COUSSINET INF PALIER VILEBREQUIN STD ROSE pour une BALENO. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 569
- Référence DB: 12345M74L00-0A0
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN STD ROSE
- Désignation OEM (designation): BEARING,CRANK LWR(STD,T:2.0)
- Search description: COUSSINET INF PALIER VILEBREQUIN STD ROSE ; BEARING,CRANK LWR(STD,T:2.0)
- Public price TTC: 13.775 TND (raw DB=13.77544)
- Wholesale/pre-tax price HT: 11.576 TND (raw DB=11.576; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7991; reference=12345M74L00-0A0; totalQuantity=6; stockDisponible=0; stockConsolide=6; statut=Disponible; updatedAt=2026-09-20T19:01:43.615Z
- Availability rule: stockConsolide >= 2; actual quantity=6; expected=available
- Fitment rows (12): id=11391; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11392; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11393; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11394; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11395; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11396; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11397; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11398; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1085; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1086; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1087; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1088; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045570; VIN=MA3WB52S1LA653268; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 27

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339834
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025119

**UI prompt**

Salem, n7eb ENSEMBLE ANNEAU SYNCHRO BASSSES VITESSES 1ERE 2EME lel CIAZ. Mawjoud ? W ch7al ?

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
- Matched vehicle row: vehicleNo=VN0025119; VIN=MA3AVC41S00339834; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 28

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA653222
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045569

**UI prompt**

**Turn 1:** Je cherche COUSSINET INF PALIER VILEBREQUIN STD VERT pour ma BALENO.

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

**DB facts for comparison (do not paste)**

- Part DB id: 575
- Référence DB: 12345M74L00-0D0
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN STD VERT
- Désignation OEM (designation): BEARING,CRANK LWR(STD,T:2.0)
- Search description: COUSSINET INF PALIER VILEBREQUIN STD VERT ; BEARING,CRANK LWR(STD,T:2.0)
- Public price TTC: 13.775 TND (raw DB=13.77544)
- Wholesale/pre-tax price HT: 11.576 TND (raw DB=11.576; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7997; reference=12345M74L00-0D0; totalQuantity=5; stockDisponible=0; stockConsolide=5; statut=Disponible; updatedAt=2026-09-20T19:01:43.621Z
- Availability rule: stockConsolide >= 2; actual quantity=5; expected=available
- Fitment rows (12): id=11469; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11470; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11471; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11472; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11473; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11474; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11475; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11476; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1115; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1116; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1117; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1118; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045569; VIN=MA3WB52SXLA653222; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 29

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52SXLA642950
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045230

**UI prompt**

Quel est le prix de COUSSINET INF PALIER VILEBREQUIN STD NOIR pour une BALENO, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 577
- Référence DB: 12345M74L00-0E0
- Désignation française (designation2): COUSSINET INF PALIER VILEBREQUIN STD NOIR
- Désignation OEM (designation): BEARING,CRANK LWR(STD,T:2.0)
- Search description: COUSSINET INF PALIER VILEBREQUIN STD NOIR ; BEARING,CRANK LWR(STD,T:2.0)
- Public price TTC: 13.775 TND (raw DB=13.77544)
- Wholesale/pre-tax price HT: 11.576 TND (raw DB=11.576; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=7999; reference=12345M74L00-0E0; totalQuantity=9; stockDisponible=0; stockConsolide=9; statut=Disponible; updatedAt=2026-09-20T19:01:43.611Z
- Availability rule: stockConsolide >= 2; actual quantity=9; expected=available
- Fitment rows (12): id=11495; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=11496; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=11497; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=11498; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=11499; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=11500; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=11501; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=11502; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=1125; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=1126; modelName=APQ415; typeCode=APQ415-TYPE2 | id=1127; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=1128; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0045230; VIN=MA3WB52SXLA642950; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 30

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454891
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015759

**UI prompt**

Il me faut JOINT TORIQUE RESERVOIR D'HUILE BOITE AGS pour ma CELERIO. Vous avez ça ?

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
- Matched vehicle row: vehicleNo=VN0015759; VIN=MA3KFC42S00454891; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 31

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMYDA1S8LM667586
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0049441

**UI prompt**

Prix et disponibilité pour CACHE INF TABLEAU DE BORD COTE PASSAGER, compatible avec une VITARA ?

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
- Matched vehicle row: vehicleNo=VN0049441; VIN=TSMYDA1S8LM667586; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 32

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00475048
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022188

**UI prompt**

**Turn 1:** Vous avez JEU DE CALE ROULEMENT LAT DIFFERENTIEL pour une VITARA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0022188; VIN=TSMLYE21S00475048; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 33

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3GZF62S00523452
Expected validated vehicle: SUZUKI SWIFT
DB type code used for this part’s fitment: AZI412-TYPE3
Vehicle number (DB cross-check only): VN0026489

**UI prompt**

Bonjour, vous avez CACHE MOYEU DE JANTE AVEC LOGO SUZUKI pour ma SWIFT ?

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
- Matched vehicle row: vehicleNo=VN0026489; VIN=MA3GZF62S00523452; marque=SUZUKI; modele=SWIFT; typeCode=AZI412-TYPE3

## Case 34

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3AVC41S00339623
Expected validated vehicle: SUZUKI CIAZ
DB type code used for this part’s fitment: AVB414-TYPE1
Vehicle number (DB cross-check only): VN0025118

**UI prompt**

Je cherche CIRCLIP MOYEU SYNCHRO BASSES VITESSES 1ERE ET 2EME pour une CIAZ. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0025118; VIN=MA3AVC41S00339623; marque=SUZUKI; modele=CIAZ; typeCode=AVB414-TYPE1

## Case 35

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S9LA642986
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0045229

**UI prompt**

Salem, n7eb ADHESIF DE FIXATION DU CABLE DE TRAPPE A CARBURANT lel BALENO. Mawjoud ? W ch7al ?

**DB facts for comparison (do not paste)**

- Part DB id: 2693
- Référence DB: 36930M70F10
- Désignation française (designation2): ADHESIF DE FIXATION DU CABLE DE TRAPPE A CARBURANT
- Désignation OEM (designation): COVER, PARK SNSR HARNESS RR
- Search description: ADHESIF DE FIXATION DU CABLE DE TRAPPE A CARBURANT ; COVER, PARK SNSR HARNESS RR
- Public price TTC: 1.655 TND (raw DB=1.65529)
- Wholesale/pre-tax price HT: 1.391 TND (raw DB=1.391; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=1364; reference=36930M70F10; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:37.602Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (14): id=16122; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=16123; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=16124; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=16125; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=16126; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=16127; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=16128; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=16129; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=3819; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3820; modelName=AON312; typeCode=AON312-TYPE1 | id=3821; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=3822; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=3823; modelName=AXM310; typeCode=AXM310-TYPE1 | id=3824; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (2): id=2149; referenceNo=36930M70F10; referenceType=3.0 | id=2150; referenceNo=36930M70F10-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0045229; VIN=MA3WB52S9LA642986; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 36

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA642875
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042760

**UI prompt**

**Turn 1:** Je cherche JEU CALE LATERALE DE VILEBREQUIN COTE 0,125 pour ma BALENO.

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
- Matched vehicle row: vehicleNo=VN0042760; VIN=MA3WB52S0LA642875; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 37

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454870
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015758

**UI prompt**

Quel est le prix de PLAQUE GUIDE SELECTEUR DE VITESSES AGS pour une CELERIO, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0015758; VIN=MA3KFC42S00454870; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 38

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00455068
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015757

**UI prompt**

Il me faut CAPUCHON VERROU RACCORD CABLE EMBRAYAGE pour ma CELERIO. Vous avez ça ?

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
- Matched vehicle row: vehicleNo=VN0015757; VIN=MA3KFC42S00455068; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 39

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00448895
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113768

**UI prompt**

Prix et disponibilité pour ENJOLIVEUR LATERAL BAIE DE PARE BRISE D, compatible avec une ERTIGA ?

**DB facts for comparison (do not paste)**

- Part DB id: 6408
- Référence DB: 72370M72R00-5PK
- Désignation française (designation2): ENJOLIVEUR LATERAL BAIE DE PARE BRISE D
- Désignation OEM (designation): GARNISH COMP,COWL TOP SIDE,R
- Search description: ENJOLIVEUR LATERAL BAIE DE PARE BRISE D ; GARNISH COMP,COWL TOP SIDE,R
- Public price TTC: 30.265 TND (raw DB=30.26527)
- Wholesale/pre-tax price HT: 25.433 TND (raw DB=25.433; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13432; reference=72370M72R00-5PK; totalQuantity=3; stockDisponible=0; stockConsolide=3; statut=Disponible; updatedAt=2026-09-20T19:01:44.734Z
- Availability rule: stockConsolide >= 2; actual quantity=3; expected=available
- Fitment rows (2): id=7095; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7096; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0113768; VIN=MA3BNC22S00448895; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 40

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S0LA642925
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042759

**UI prompt**

**Turn 1:** Vous avez CLAVETTE DEMI-LUNE DE QUEUE DE SOUPAPE pour une BALENO ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0042759; VIN=MA3WB52S0LA642925; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 41

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00448803
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113767

**UI prompt**

Bonjour, vous avez RACCORD COUDE DE DURITE DE LAVE-GLACE pour ma ERTIGA ?

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
- Matched vehicle row: vehicleNo=VN0113767; VIN=MA3BNC22S00448803; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 42

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: TSMLYE21S00474983
Expected validated vehicle: SUZUKI VITARA
DB type code used for this part’s fitment: APK416-TYPE1
Vehicle number (DB cross-check only): VN0022187

**UI prompt**

Je cherche BAGUETTE MONTANT DE PORTE AVANT GAUCHE pour une VITARA. C'est disponible ?

**DB facts for comparison (do not paste)**

- Part DB id: 7162
- Référence DB: 77430-54P01-000
- Désignation française (designation2): BAGUETTE MONTANT DE PORTE AVANT GAUCHE
- Désignation OEM (designation): GARNISH, FR
- Search description: BAGUETTE MONTANT DE PORTE AVANT GAUCHE ; GARNISH, FR
- Public price TTC: 369.236 TND (raw DB=369.23558)
- Wholesale/pre-tax price HT: 310.282 TND (raw DB=310.282; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=14163; reference=77430-54P01-000; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:39.025Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (2): id=7797; modelName=APK414-3-TYPE3; typeCode=APK414-TYPE3 | id=7798; modelName=APK416-TYPE1; typeCode=APK416-TYPE1
- Alternate/item reference rows (1): id=5548; referenceNo=77430-54P01-0000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0022187; VIN=TSMLYE21S00474983; marque=SUZUKI; modele=VITARA; typeCode=APK416-TYPE1

## Case 43

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00449209
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113766

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
- Matched vehicle row: vehicleNo=VN0113766; VIN=MA3BNC22S00449209; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 44

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3KFC42S00454925
Expected validated vehicle: SUZUKI CELERIO
DB type code used for this part’s fitment: AVH310-TYPE1
Vehicle number (DB cross-check only): VN0015756

**UI prompt**

**Turn 1:** Je cherche ENSEMBLE RESERVOIR D'HUILE BOITE AGS pour ma CELERIO.

**Turn 2:** Vous l'avez en stock ? Et c'est combien ?

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
- Matched vehicle row: vehicleNo=VN0015756; VIN=MA3KFC42S00454925; marque=SUZUKI; modele=CELERIO; typeCode=AVH310-TYPE1

## Case 45

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MBHCZF63S00588625
Expected validated vehicle: SUZUKI DZIRE
DB type code used for this part’s fitment: A2N412-TYPE1
Vehicle number (DB cross-check only): VN0194487

**UI prompt**

Quel est le prix de BOUTON DEMARRAGE MOTEUR START/STOP pour une DZIRE, s'il vous plaît ?

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
- Matched vehicle row: vehicleNo=VN0194487; VIN=MBHCZF63S00588625; marque=SUZUKI; modele=DZIRE; typeCode=A2N412-TYPE1

## Case 46

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3RFL41S00378420
Expected validated vehicle: SUZUKI SPRESSO
DB type code used for this part’s fitment: ABU310-TYPE1
Vehicle number (DB cross-check only): VN0123420

**UI prompt**

Il me faut EXTENSION, CÔTÉ TABLIER MBR LWR LH pour ma SPRESSO. Vous avez ça ?

**DB facts for comparison (do not paste)**

- Part DB id: 4849
- Référence DB: 58735M62S00
- Désignation française (designation2): EXTENSION, CÔTÉ TABLIER MBR LWR LH
- Désignation OEM (designation): EXTENSION,APRON SIDE MBR UPR LH
- Search description: EXTENSION, CÔTÉ TABLIER MBR LWR LH ; EXTENSION,APRON SIDE MBR UPR LH
- Public price TTC: 140.269 TND (raw DB=140.26887)
- Wholesale/pre-tax price HT: 117.873 TND (raw DB=117.873; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=12030; reference=58735M62S00; totalQuantity=2; stockDisponible=0; stockConsolide=2; statut=Indisponible; updatedAt=2026-09-20T19:01:44.946Z
- Availability rule: stockConsolide >= 2; actual quantity=2; expected=available
- Fitment rows (1): id=5912; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1
- Alternate/item reference rows (2): id=3968; referenceNo=58735M62S00; referenceType=3.0 | id=3969; referenceNo=58735M62S00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0123420; VIN=MA3RFL41S00378420; marque=SUZUKI; modele=SPRESSO; typeCode=ABU310-TYPE1

## Case 47

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S5LA642824
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042758

**UI prompt**

Prix et disponibilité pour CACHE LATERAL TABLEAU DE BORD NOIR, compatible avec une BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 6734
- Référence DB: 73871M73H00-5PK
- Désignation française (designation2): CACHE LATERAL TABLEAU DE BORD NOIR
- Désignation OEM (designation): CAP, I/P SIDE (BLACK)
- Search description: CACHE LATERAL TABLEAU DE BORD NOIR ; CAP, I/P SIDE (BLACK)
- Public price TTC: 1.674 TND (raw DB=1.67433)
- Wholesale/pre-tax price HT: 1.407 TND (raw DB=1.407; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=13756; reference=73871M73H00-5PK; totalQuantity=1; stockDisponible=0; stockConsolide=1; statut=Indisponible; updatedAt=2026-09-20T19:01:41.015Z
- Availability rule: stockConsolide >= 2; actual quantity=1; expected=unavailable
- Fitment rows (21): id=22059; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=22060; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=22061; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=22062; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=22063; modelName=A3K415-TYPE1; typeCode=A3K415-TYPE1 | id=22064; modelName=A3L415-TYPE1; typeCode=A3L415-TYPE1 | id=22065; modelName=A3L415-TYPE2; typeCode=A3L415-TYPE2 | id=22066; modelName=A6N415-TYPE1; typeCode=A6N415-TYPE1 | id=7415; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=7416; modelName=AON312; typeCode=AON312-TYPE1 | id=7417; modelName=APQ415; typeCode=APQ415-TYPE2 | id=7418; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=7419; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2 | id=7420; modelName=AVB414-TYPE1; typeCode=AVB414-TYPE1 | id=7421; modelName=AVB415-TYPE2; typeCode=AVB415-TYPE2 | id=7422; modelName=AVB415-TYPE3; typeCode=AVB415-TYPE3 | id=7423; modelName=AVH310-TYPE 1; typeCode=AVH310-TYPE1 | id=7424; modelName=AVH310-TYPE 2; typeCode=AVH310-TYPE2 | id=7425; modelName=AXM310; typeCode=AXM310-TYPE1 | id=7426; modelName=AXM310; typeCode=AXM310-TYPE2 | id=7427; modelName=AZI412-TYPE3; typeCode=AZI412-TYPE3
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042758; VIN=MA3WB52S5LA642824; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 48

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00448836
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113765

**UI prompt**

**Turn 1:** Vous avez SUPPORT TRAVERSE INF JOUE D'AILE D pour une ERTIGA ?

**Turn 2:** D'accord. Et le prix, s'il vous plaît ?

**DB facts for comparison (do not paste)**

- Part DB id: 5761
- Référence DB: 71141M72R00
- Désignation française (designation2): SUPPORT TRAVERSE INF JOUE D'AILE D
- Désignation OEM (designation): BRACKET, APRON LOWER MEMBER RH
- Search description: SUPPORT TRAVERSE INF JOUE D'AILE D ; BRACKET, APRON LOWER MEMBER RH
- Public price TTC: 31.177 TND (raw DB=31.17681)
- Wholesale/pre-tax price HT: 26.199 TND (raw DB=26.199; do not present as customer price)
- Unit: PCS
- Category: CARROSSERIE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=3090; reference=71141M72R00; totalQuantity=4; stockDisponible=4; stockConsolide=4; statut=Disponible; updatedAt=2026-09-20T19:01:54.308Z
- Availability rule: stockConsolide >= 2; actual quantity=4; expected=available
- Fitment rows (2): id=6623; modelName=ARL415-TYPE1; typeCode=ARL415-TYPE1 | id=6624; modelName=ARL415-2-TYPE2; typeCode=ARL415-TYPE2
- Alternate/item reference rows (2): id=4601; referenceNo=71141M72R00; referenceType=3.0 | id=4602; referenceNo=71141M72R00-000; referenceType=3.0
- Matched vehicle row: vehicleNo=VN0113765; VIN=MA3BNC22S00448836; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

## Case 49

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3WB52S3LA642885
Expected validated vehicle: SUZUKI BALENO
DB type code used for this part’s fitment: A1K414-TYPE1
Vehicle number (DB cross-check only): VN0042757

**UI prompt**

Bonjour, vous avez CIRCLIP MOYEU SYNCHRO BAS VITESSE pour ma BALENO ?

**DB facts for comparison (do not paste)**

- Part DB id: 1827
- Référence DB: 24451M76M00
- Désignation française (designation2): CIRCLIP MOYEU SYNCHRO BAS VITESSE
- Désignation OEM (designation): CIRCLIP,LOW SPEED SYNC HUB
- Search description: CIRCLIP MOYEU SYNCHRO BAS VITESSE ; CIRCLIP,LOW SPEED SYNC HUB
- Public price TTC: 6.497 TND (raw DB=6.4974)
- Wholesale/pre-tax price HT: 5.460 TND (raw DB=5.46; do not present as customer price)
- Unit: PCS
- Category: MÉCANIQUE
- Manufacturer: SUZUKI
- Supplier code: CAR PRO PARTS
- Source: 01_PROD (Suzuki OEM)
- Stock row: id=9154; reference=24451M76M00; totalQuantity=19; stockDisponible=0; stockConsolide=19; statut=Disponible; updatedAt=2026-09-20T19:01:42.650Z
- Availability rule: stockConsolide >= 2; actual quantity=19; expected=available
- Fitment rows (8): id=14698; modelName=BALENO GLX; typeCode=A1K414-TYPE1 | id=14699; modelName=A1M414-TYPE1; typeCode=A1M414-TYPE1 | id=14700; modelName=A2N412-TYPE1; typeCode=A2N412-TYPE1 | id=14701; modelName=A2N412-TYPE2; typeCode=A2N412-TYPE2 | id=3002; modelName=ABU310-TYPE1; typeCode=ABU310-TYPE1 | id=3003; modelName=AON312; typeCode=AON312-TYPE1 | id=3004; modelName=AXM310; typeCode=AXM310-TYPE1 | id=3005; modelName=AXM310; typeCode=AXM310-TYPE2
- Alternate/item reference rows (0): none
- Matched vehicle row: vehicleNo=VN0042757; VIN=MA3WB52S3LA642885; marque=SUZUKI; modele=BALENO; typeCode=A1K414-TYPE1

## Case 50

**Vehicle setup (UI only; do not paste into chat)**

Enter this VIN in the direct VIN field: MA3BNC22S00447716
Expected validated vehicle: SUZUKI ERTIGA
DB type code used for this part’s fitment: ARL415-TYPE1
Vehicle number (DB cross-check only): VN0113764

**UI prompt**

Je cherche KIT SOUFFLET DE CARDAN COTE BOITE pour une ERTIGA. C'est disponible ?

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
- Matched vehicle row: vehicleNo=VN0113764; VIN=MA3BNC22S00447716; marque=SUZUKI; modele=ERTIGA; typeCode=ARL415-TYPE1

