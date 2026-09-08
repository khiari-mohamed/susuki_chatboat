const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const API_URL = process.env.CHAT_API_URL || 'http://localhost:8000/chat/message';
const VERIFICATION_URL = process.env.VERIFICATION_API_URL || 'http://localhost:8000/verification/upload';
const CRT_DIR = path.resolve(__dirname, 'crt');
const REPORT_PATH = path.resolve(__dirname, 'final-exam-report.txt');

const cardGrisFiles = {
  'New Celerio': path.join(CRT_DIR, 'New Celerio.jpg.jpeg'),
  'All New Swift': path.join(CRT_DIR, 'All New Swift.JPG.jpeg'),
  'New Swift': path.join(CRT_DIR, 'New Swift.JPG.jpeg')
};

const tests = [
  {
    suite: 'New Celerio (12)',
    prompt: 'Bonjour, je cherche un radiateur pour ma New Celerio',
    expected: {
      reference: '17700M81R00',
      price: '747.957',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'il me faut un optique droit pour New Celerio',
    expected: {
      reference: '35121M81R30',
      price: '762.652',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'optique gauche New Celerio SVP',
    expected: {
      reference: '35321M81R30',
      price: '762.645',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'prix du capot New Celerio',
    expected: {
      reference: '57300M81R00',
      price: '1036.88',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'aile avant droite New Celerio',
    expected: {
      reference: '57611M81R00',
      price: '419.709',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: "j'ai besoin d'une aile av gauche pour New Celerio",
    expected: {
      reference: '57711M81R00',
      price: '419.709',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'porte avant droite New Celerio disponible?',
    expected: {
      reference: '68001M81R20',
      price: '1619.63',
      availability: 'Indisponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'porte av gauche New Celerio',
    expected: {
      reference: '68002M81R20',
      price: '1619.63',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'porte arrière droite New Celerio',
    expected: {
      reference: '68003M81R00',
      price: '1694.091',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'porte ar gauche New Celerio',
    expected: {
      reference: '68004M81R00',
      price: '1694.091',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'pare choc avant New Celerio',
    expected: {
      reference: '71711M81R00-799',
      price: '1087.321',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Celerio (12)',
    prompt: 'pare choc arrière New Celerio',
    expected: {
      reference: '71811M81R10-799',
      price: '1014.063',
      availability: 'Disponible'
    }
  },
  {
    suite: 'All New Swift (5)',
    prompt: 'radiateur All New Swift',
    expected: {
      reference: '17700M68P00',
      price: '798.146',
      availability: 'Disponible'
    }
  },
  {
    suite: 'All New Swift (5)',
    prompt: 'capot All New Swift',
    expected: {
      reference: '57300M75T00',
      price: '940.309',
      availability: 'Disponible'
    }
  },
  {
    suite: 'All New Swift (5)',
    prompt: 'pare choc avant All New Swift',
    expected: {
      reference: '71711M75T00-799',
      price: '1034.987',
      availability: 'Disponible'
    }
  },
  {
    suite: 'All New Swift (5)',
    prompt: 'calandre All New Swift',
    expected: {
      reference: '71741M75T10-W9K',
      price: '831.464',
      availability: 'Disponible'
    }
  },
  {
    suite: 'All New Swift (5)',
    prompt: 'pare choc arrière All New Swift',
    expected: {
      reference: '71811M75T00-799',
      price: '849.157',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'aile avant droite New Swift',
    expected: {
      reference: '57611M55R10',
      price: '501.61',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'aile av gauche New Swift',
    expected: {
      reference: '57711M55R10',
      price: '501.612',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'porte avant droite New Swift, elle est disponible?',
    expected: {
      reference: '68001M55R00',
      price: '1639.726',
      availability: 'Indisponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'porte av droite New Swift',
    expected: {
      reference: '68001M55R01',
      price: '1639.725',
      availability: 'Indisponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'porte avant droite New Swift dispo',
    expected: {
      reference: '68001M55R02',
      price: '2049.423',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'pare choc avant New Swift',
    expected: {
      reference: '71711M55R00-799',
      price: '1079.117',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'calandre New Swift',
    expected: {
      reference: '71740M55R00-C48',
      price: '410.308',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'vitre avant droite New Swift',
    expected: {
      reference: '84501M55R00',
      price: '359.437',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'lunette arrière New Swift',
    expected: {
      reference: '84570M55R10',
      price: '890.323',
      availability: 'Disponible'
    }
  },
  {
    suite: 'New Swift (10)',
    prompt: 'rétroviseur droit New Swift',
    expected: {
      reference: '84701M55R50-ZHJ',
      price: '629.171',
      availability: 'Disponible'
    }
  }
];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function extractReference(text) {
  const match = text.match(/([A-Z0-9-]+(?:-[A-Z0-9]+)?)/i);
  return match ? match[1].toUpperCase() : null;
}

function extractPrice(text) {
  const match = text.match(/(\d+(?:[.,]\d{1,3})?)/);
  return match ? match[1].replace(',', '.') : null;
}

function extractAvailability(text) {
  const lowered = normalizeText(text);
  if (lowered.includes('indisponible')) return 'Indisponible';
  if (lowered.includes('disponible')) return 'Disponible';
  return 'Unknown';
}

function getPrimaryProduct(body) {
  const productsDetail = body.productsDetail || [];
  if (productsDetail.length > 0) return productsDetail[0];

  const products = body.products || [];
  if (products.length > 0) return products[0];

  return null;
}

function escapeReportText(value) {
  return String(value ?? '').replace(/\r\n/g, '\n');
}

function appendToReport(lines) {
  fs.appendFileSync(REPORT_PATH, `${lines.join('\n')}\n`, 'utf8');
}

async function loadVehicleFromCardGrise(label) {
  const filePath = cardGrisFiles[label];
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Carte grise introuvable pour ${label}: ${filePath || 'N/A'}`);
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: 'image/jpeg'
  });

  const response = await axios.post(VERIFICATION_URL, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Échec de l’upload de la carte grise');
  }

  return response.data.vehicleInfo || null;
}

async function runOneTest(test, vehicle) {
  try {
    const response = await axios.post(API_URL, {
      message: test.prompt,
      vehicle,
      sessionId: undefined
    });

    const body = response.data || {};
    const responseText = body.response || '';
    const product = getPrimaryProduct(body);

    const stockStatus = product?.stock?.statut || product?.stockStatus || product?.availability || null;
    const priceTtc = product?.prixTtc ?? product?.prix_ttc ?? product?.priceTtc ?? null;
    const reference = product?.reference || product?.articleNumber || product?.article_number || null;

    const actual = {
      reference: reference || extractReference(responseText) || null,
      price: priceTtc !== null ? String(priceTtc) : extractPrice(responseText) || null,
      availability: stockStatus ? String(stockStatus) : extractAvailability(responseText) || 'Unknown'
    };

    const passed =
      normalizeText(actual.reference) === normalizeText(test.expected.reference) &&
      normalizeText(String(actual.price)) === normalizeText(String(test.expected.price)) &&
      normalizeText(actual.availability) === normalizeText(test.expected.availability);

    return {
      ...test,
      passed,
      actual,
      responseText,
      body
    };
  } catch (error) {
    return {
      ...test,
      passed: false,
      actual: { reference: null, price: null, availability: 'Unknown' },
      error: error.message,
      responseText: '',
      body: null
    };
  }
}

function getVehicleLabelForSuite(suite) {
  if (suite.includes('New Celerio')) return 'New Celerio';
  if (suite.includes('All New Swift')) return 'All New Swift';
  return 'New Swift';
}

async function main() {
  if (fs.existsSync(REPORT_PATH)) fs.unlinkSync(REPORT_PATH);

  console.log('🎓 FINAL EXAM — NEW CELERIO / SWIFT');
  console.log('='.repeat(100));

  let passed = 0;
  let failed = 0;

  const groupedSuites = [...new Set(tests.map((test) => test.suite))];

  for (const suiteName of groupedSuites) {
    const vehicleLabel = getVehicleLabelForSuite(suiteName);
    const vehicle = await loadVehicleFromCardGrise(vehicleLabel);
    console.log(`\n[SUITE] ${suiteName}`);
    console.log(`[LOAD] ${vehicleLabel} -> ${path.basename(cardGrisFiles[vehicleLabel])}`);
    console.log(`[LOAD] vehicle=${JSON.stringify(vehicle)}`);

    const suiteTests = tests.filter((test) => test.suite === suiteName);
    for (const test of suiteTests) {
      const result = await runOneTest(test, vehicle);
      const resultLines = [
        `===== ${result.suite} =====`,
        `Prompt: ${result.prompt}`,
        `Expected: ref=${result.expected.reference} | price=${result.expected.price} | avail=${result.expected.availability}`,
        `Actual : ref=${result.actual.reference || 'null'} | price=${result.actual.price || 'null'} | avail=${result.actual.availability || 'null'}`,
        `Passed: ${result.passed}`
      ];

      if (result.error) resultLines.push(`Error: ${result.error}`);
      if (result.responseText) resultLines.push(`Response text: ${escapeReportText(result.responseText)}`);
      if (result.body) {
        resultLines.push('Structured payload:');
        resultLines.push(JSON.stringify(result.body, null, 2));
      }

      console.log(`\n[${result.passed ? 'PASS' : 'FAIL'}] ${result.suite}`);
      console.log(`Prompt: ${result.prompt}`);
      console.log(`Expected: ref=${result.expected.reference} | price=${result.expected.price} | avail=${result.expected.availability}`);
      console.log(`Actual  : ref=${result.actual.reference || 'null'} | price=${result.actual.price || 'null'} | avail=${result.actual.availability || 'null'}`);
      if (result.error) console.log(`Error: ${result.error}`);
      if (result.responseText) console.log(`Response: ${result.responseText.slice(0, 400)}`);
      console.log('Structured payload:');
      console.log(JSON.stringify(result.body || {}, null, 2));

      appendToReport(resultLines);

      if (result.passed) passed += 1;
      else failed += 1;
    }
  }

  appendToReport([
    '',
    '='.repeat(100),
    `FINAL SCORE: ${passed}/${tests.length} passed`,
    `FAILED: ${failed}`,
    `Report saved to: ${REPORT_PATH}`
  ]);

  console.log('\n' + '='.repeat(100));
  console.log(`FINAL SCORE: ${passed}/${tests.length} passed`);
  console.log(`FAILED: ${failed}`);
  console.log(`Report saved to: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
