// Genera capturas de escritorio (1366 px) y celular (390 px) en capturas/.
// Uso: con el sitio corriendo (npm run build && ADMIN_DEMO_PASSWORD=... npm start)
//   BASE=http://localhost:3000 CLAVE_ADMIN=... npm run capturas
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const CLAVE = process.env.CLAVE_ADMIN ?? process.env.ADMIN_DEMO_PASSWORD ?? "suenos-demo-2026";

const TIENDA = [
  ["01-portada", "/"],
  ["02-catalogo", "/tienda"],
  ["03-ficha-producto", "/producto/vestido-campanita"],
  ["04-registro", "/cuenta/registro"],
];

async function recorrer(p) {
  await p.waitForLoadState("networkidle");
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(700);
}

const b = await chromium.launch();
for (const [ancho, alto, etiqueta] of [[1366, 900, "escritorio"], [390, 844, "celular"]]) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: alto }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const [nombre, ruta] of TIENDA) {
    await p.goto(BASE + ruta);
    await recorrer(p);
    await p.screenshot({ path: `capturas/${etiqueta}-${nombre}.png`, fullPage: true });
  }
  // Mi cuenta y seguimiento con la cuenta de prueba
  await p.goto(BASE + "/cuenta/ingresar");
  await p.locator("main").getByLabel("Correo").fill("demo@correo-demo.co");
  await p.locator("main").getByLabel("Contraseña").fill("demo1234");
  await p.getByRole("button", { name: "Iniciar sesión" }).click();
  await p.waitForURL("**/cuenta");
  await recorrer(p);
  await p.screenshot({ path: `capturas/${etiqueta}-05-mi-cuenta.png`, fullPage: true });
  const enReparto = p.locator("#titulo-pedidos ~ ul li").filter({ hasText: "En reparto" }).getByRole("link");
  await enReparto.click();
  await p.waitForURL("**/cuenta/pedido**");
  await recorrer(p);
  await p.screenshot({ path: `capturas/${etiqueta}-06-seguimiento-pedido.png`, fullPage: true });

  // Panel
  await p.goto(BASE + "/admin/ingresar");
  await p.locator("main").getByLabel("Contraseña").fill(CLAVE);
  await p.getByRole("button", { name: "Ingresar" }).click();
  await p.waitForURL("**/admin");
  for (const [nombre, ruta] of [["07-dashboard", "/admin"], ["08-panel-pedidos", "/admin/pedidos"], ["09-panel-productos", "/admin/productos"], ["10-panel-campanas", "/admin/campanas"]]) {
    await p.goto(BASE + ruta);
    await recorrer(p);
    await p.screenshot({ path: `capturas/${etiqueta}-${nombre}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
console.log("Capturas listas en capturas/");
