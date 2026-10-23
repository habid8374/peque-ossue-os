// Lighthouse en móvil para portada y catálogo. Requiere el sitio corriendo.
// Uso: BASE=http://localhost:3000 npm run lighthouse
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
for (const [nombre, ruta] of [["portada", "/"], ["tienda", "/tienda"]]) {
  execFileSync("npx", ["lighthouse", BASE + ruta, "--quiet", "--form-factor=mobile", "--chrome-flags=--headless=new --no-sandbox", "--output=json", "--output=html", `--output-path=docs/lighthouse/movil-${nombre}`], { stdio: "inherit" });
  const r = JSON.parse(readFileSync(`docs/lighthouse/movil-${nombre}.report.json`, "utf8"));
  const p = Object.values(r.categories).map((c) => `${c.title}: ${Math.round(c.score * 100)}`).join(" · ");
  console.log(`${nombre}: ${p} · peso ${Math.round(r.audits["total-byte-weight"].numericValue / 1024)} KB`);
}
