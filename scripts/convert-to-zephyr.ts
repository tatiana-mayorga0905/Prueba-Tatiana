import fs from "fs";
import path from "path";

// Paths
const inputFile = path.resolve(__dirname, "../test-results/results.json");
const outputFile = path.resolve(__dirname, "../test-results/zephyr.json");

// Verificar que exista el JSON de Playwright
if (!fs.existsSync(inputFile)) {
  console.error("❌ No se encontró results.json. Ejecuta primero los tests.");
  process.exit(1);
}

// Leer y parsear JSON
const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

// Interfaces TS para autocompletado
interface TestResult {
  title: string;
  status: "passed" | "failed" | "skipped";
}

interface Spec {
  tests: TestResult[];
}

interface Suite {
  specs: Spec[];
}

// Convertir Playwright JSON -> Zephyr Legacy
const zephyr = (data.suites as Suite[]).flatMap((suite) =>
  suite.specs.flatMap((spec) =>
    spec.tests.map((test) => ({
      issueId: getIssueIdFromTitle(test.title), // mapa título -> issueId de Jira
      status: test.status === "passed" ? 1 : 2, // 1=Pass, 2=Fail
    }))
  )
);

// Guardar JSON final listo para Zephyr
fs.writeFileSync(outputFile, JSON.stringify(zephyr, null, 2));
console.log(`✅ JSON listo para Zephyr: ${outputFile}`);

// Función de ejemplo para extraer issueId del título del test
function getIssueIdFromTitle(title: string): number {
  const match = title.match(/PRUEB-(\d+)/); // ejemplo: "PRUEB-123 Some test"
  if (match) return parseInt(match[1], 10);
  return 0; // fallback si no se encuentra
}
