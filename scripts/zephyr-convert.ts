import fs from "fs";
import path from "path";

// 🔹 Archivos
const inputFile = path.join(__dirname, "../test-results/results.json");
const outputFile = path.join(__dirname, "../test-results/zephyr.json");

// 🔹 Mapear estados Playwright -> Zephyr
const statusMap: Record<string, number> = {
  passed: 1,
  failed: 2,
  skipped: 3,
};

// 🔹 Mapear tests -> Jira issueId
const testIdMap: Record<string, number> = {
  "PRUEB-T3 @dev @qa @app login works": 12345,
  // agrega más tests si tienes
};

// 🔹 Leer results.json
if (!fs.existsSync(inputFile)) {
  console.error(`❌ No se encontró el archivo: ${inputFile}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputFile, "utf-8");
const resultsJson = JSON.parse(raw);

// 🔹 Construir payload Zephyr
const zephyrPayload: { issueId: number; status: number }[] = [];

function extractTests(suites: any[]) {
  for (const suite of suites) {
    if (suite.suites && suite.suites.length > 0) {
      extractTests(suite.suites);
    }
    if (suite.specs && suite.specs.length > 0) {
      for (const spec of suite.specs) {
        const issueId = testIdMap[spec.title];
        if (!issueId) continue; // ignorar tests no mapeados
        const status = statusMap[spec.tests[0].status] || 2; // fallback a fail
        zephyrPayload.push({ issueId, status });
      }
    }
  }
}

extractTests(resultsJson.suites);

// 🔹 Guardar zephyr.json
fs.writeFileSync(outputFile, JSON.stringify(zephyrPayload, null, 2));
console.log(`✅ Zephyr JSON generado en: ${outputFile}`);
