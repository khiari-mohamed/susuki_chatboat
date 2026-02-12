import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function extractAllParts() {
  const parts = await prisma.piecesRechange.findMany({
    select: { designation: true },
  });

  const partTypesMap = new Map<string, number>();

  parts.forEach(part => {
    const designation = part.designation.toLowerCase().trim();
    const words = designation.split(/\s+/);
    
    words.forEach(word => {
      word = word.replace(/[^a-zàâäéèêëïîôùûüÿæœç]/g, '');
      if (word.length >= 3 && !['de', 'du', 'des', 'le', 'la', 'les', 'pour', 'avec', 'sans', 'sur', 'sous', 'par', 'dans', 'une', 'un'].includes(word)) {
        partTypesMap.set(word, (partTypesMap.get(word) || 0) + 1);
      }
    });
  });

  const sortedParts = Array.from(partTypesMap.entries()).sort((a, b) => b[1] - a[1]);

  console.log('  private readonly typeWeights: Record<string, number> = {');
  
  sortedParts.forEach(([word, count]) => {
    let weight = 1.1;
    if (['frein', 'plaquette', 'disque', 'amortisseur', 'retroviseur', 'rétroviseur'].includes(word)) weight = 1.5;
    else if (['batterie', 'filtre', 'courroie', 'phare', 'radiateur', 'roulement', 'etrier', 'étrier', 'rotule', 'biellette', 'triangle', 'bras', 'embrayage', 'tambour', 'suspension', 'cremaillere', 'crémaillère', 'cardan'].includes(word)) weight = 1.3;
    else if (['capteur', 'pompe', 'moteur', 'vitre', 'porte', 'aile', 'capot', 'lampe', 'alternateur', 'demarreur', 'démarreur', 'volant', 'injecteur', 'bougie', 'catalyseur', 'silencieux', 'echappement', 'échappement'].includes(word)) weight = 1.2;
    else if (count > 20) weight = 1.2;
    else if (count > 10) weight = 1.15;
    
    console.log(`    '${word}': ${weight},`);
  });
  
  console.log('  };');
  console.log(`\n// Total: ${sortedParts.length} unique part types from ${parts.length} parts`);

  await prisma.$disconnect();
}

extractAllParts().catch(console.error);
