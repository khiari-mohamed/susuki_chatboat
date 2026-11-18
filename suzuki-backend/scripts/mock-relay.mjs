// Local-only stand-in for the Car Pro relay. Use only with a throwaway database.
// Usage: node scripts/mock-relay.mjs (listens on 127.0.0.1:4066; key "test-key")
import http from 'node:http';

const HOST = '127.0.0.1';
const PORT = 4066;
const KEY = 'test-key';
const data = {
  '/api/chatbot/vehicle-types': [
    { id: 1, typeCode: 'ZZT100 TYPE1', modelName: 'MOCK MODEL A' },
    { id: 2, typeCode: 'ZZT200-TYPE1', modelName: 'MOCK MODEL B' },
  ],
  '/api/chatbot/vehicle-models': [
    { id: 1, modele: 'MOCKA', typeCode: 'ZZT100 TYPE1' },
    { id: 2, modele: 'MOCKB', typeCode: 'ZZT200-TYPE1' },
  ],
  '/api/chatbot/vehicles': [
    { id: 'V1', vehicleNo: 'MOCKV1', vin: 'MOCKVIN0000000001', marque: 'SUZUKI', modele: 'MOCKA', modeleDescription: 'MOCK A GL', typeCode: 'ZZT100 TYPE1', immatriculation: '1-TUN-1', isActive: true, deleted: false },
    { id: 'V2', vehicleNo: 'MOCKV2', vin: 'MOCKVIN0000000002', marque: 'SUZUKI', modele: 'MOCKB', typeCode: 'ZZT200-TYPE1', isActive: true, deleted: true },
  ],
  '/api/chatbot/parts': [
    { id: 1, reference: 'MOCK-P1', designation: 'MOCK PART ONE', designation2: 'PIECE UN', prixHt: 100, prixTtc: 119, prixPublic: 150, source: '01_PROD' },
    { id: 2, reference: 'MOCK-P2', designation: 'MOCK PART TWO', designation2: null, prixPublic: 0, source: '01_PROD' },
    { id: 3, reference: 'MOCK-P3', designation: '', source: '01_PROD' },
  ],
  '/api/chatbot/stock': [
    { id: 'S1', reference: 'MOCK-P1', totalQuantity: 5, stockDisponible: 4, stockConsolide: 9, deleted: false },
    { id: 'S2', reference: 'MOCK-P2', totalQuantity: 1, deleted: false },
  ],
  '/api/chatbot/fitments': [
    { id: 1, partReference: 'MOCK-P1', typeCode: 'ZZT100 TYPE1', modelName: 'MOCK MODEL A' },
    { id: 2, partReference: 'MOCK-P1', typeCode: 'ZZT200-TYPE1', modelName: 'MOCK MODEL B' },
    { id: 3, partReference: 'NOPE', typeCode: 'ZZT200-TYPE1', modelName: 'X' },
  ],
  '/api/chatbot/item-references': [
    { id: 'R1', partReference: 'MOCK-P1', referenceType: 3, referenceNo: 'MOCK-ALT-1' },
  ],
};

if (process.env.MOCK_EXISTING_REF) {
  const ref = process.env.MOCK_EXISTING_REF.trim();
  if (ref) {
    data['/api/chatbot/parts'].push({
      id: 4,
      reference: ref,
      designation: 'RELAY NAME',
      designation2: null,
      prixHt: 1,
      prixTtc: 1,
      prixPublic: 999,
      source: '01_PROD',
    });
    data['/api/chatbot/stock'].push({
      id: 'S3',
      reference: ref,
      totalQuantity: 7,
      stockDisponible: 7,
      stockConsolide: 7,
      deleted: false,
    });
  }
}

function json(res, body, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  if (url.pathname === '/api/chatbot/health') {
    return json(res, {
      status: 'Healthy',
      service: 'mock',
      timestampUtc: new Date().toISOString(),
      erpReachable: 'true',
    });
  }
  if (req.headers['x-api-key'] !== KEY) {
    return json(res, { title: 'Unauthorized', status: 401 }, 401);
  }
  const rows = data[url.pathname];
  if (!rows) return json(res, { title: 'Not Found', status: 404 }, 404);
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 1000);
  return json(res, {
    page,
    pageSize,
    totalRecords: rows.length,
    data: rows.slice((page - 1) * pageSize, page * pageSize),
  });
}).listen(PORT, HOST, () => {
  console.log(`mock relay listening on http://${HOST}:${PORT}`);
});
