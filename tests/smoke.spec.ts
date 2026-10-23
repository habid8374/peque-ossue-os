import { expect, test } from "@playwright/test";
import { CATALOGO } from "../lib/catalogo-semilla";
import { CATEGORIAS } from "../lib/marca";
import { ingresarAdmin, revisarTitulos } from "./utilidades";

const PUBLICAS = [
  "/",
  "/tienda",
  "/tienda?orden=nuevos",
  "/carrito",
  "/checkout",
  "/favoritos",
  "/seguimiento",
  "/pedido/confirmado",
  "/plan-de-pago",
  "/sonadores",
  "/quienes-somos",
  "/envios-y-cambios",
  "/politica-de-datos",
  "/cuenta/ingresar",
  "/cuenta/registro",
  ...CATEGORIAS.map((c) => `/coleccion/${c.id}`),
  ...CATALOGO.map((p) => `/producto/${p.slug}`),
];

const ADMIN = ["/admin", "/admin/pedidos", "/admin/productos", "/admin/clientes", "/admin/campanas", "/admin/configuracion"];

test("todas las rutas públicas responden, con un solo H1 y sin saltos de títulos", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(`${page.url()}: ${e.message}`));
  for (const ruta of PUBLICAS) {
    const r = await page.goto(ruta);
    expect(r?.status(), ruta).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    const t = await revisarTitulos(page);
    expect(t.h1, `${ruta} debe tener un H1`).toBe(1);
    expect(t.saltos, `${ruta} salta niveles`).toEqual([]);
  }
  expect(errores).toEqual([]);
});

test("cero enlaces internos rotos en la portada", async ({ page, request }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const enlaces = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
  expect(enlaces.length).toBeGreaterThan(20);
  const rotos: string[] = [];
  for (const href of enlaces) {
    const r = await request.get(href);
    if (r.status() >= 400) rotos.push(`${href} → ${r.status()}`);
  }
  expect(rotos).toEqual([]);
});

test("recursos SEO y cabeceras de seguridad", async ({ request }) => {
  for (const r of ["/sitemap.xml", "/robots.txt", "/llms.txt", "/icon.png", "/marca/logo-pequenos-suenos.webp"]) {
    expect((await request.get(r)).status(), r).toBe(200);
  }
  const home = await request.get("/");
  const h = home.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  const html = await home.text();
  expect(html).toContain('"@type":"ClothingStore"');
  const prod = await (await request.get(`/producto/${CATALOGO[0].slug}`)).text();
  expect(prod).toContain('"@type":"Product"');
});

test("el panel exige sesión y sus rutas responden", async ({ page, request }) => {
  const sinSesion = await request.get("/admin/pedidos", { maxRedirects: 0 });
  expect(sinSesion.status()).toBe(307);
  expect(sinSesion.headers()["location"]).toContain("/admin/ingresar");
  const campana = await request.post("/api/admin/campanas", { data: { asunto: "Hola", contenido: "Mensaje de prueba", segmento: "todos", destinatarios: [] } });
  expect(campana.status()).toBe(401);

  await ingresarAdmin(page);
  for (const ruta of ADMIN) {
    const r = await page.goto(ruta);
    expect(r?.status(), ruta).toBe(200);
    await page.waitForLoadState("networkidle");
    const t = await revisarTitulos(page);
    expect(t.h1, ruta).toBe(1);
    expect(t.saltos, ruta).toEqual([]);
  }
});

test("redirecciones solo a rutas internas", async ({ page }) => {
  await page.goto("/cuenta/ingresar?siguiente=https://ejemplo.com/robo");
  await page.locator("main").getByLabel("Correo").fill("demo@correo-demo.co");
  await page.locator("main").getByLabel("Contraseña").fill("demo1234");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("**/cuenta");
  expect(new URL(page.url()).host).toBe("localhost:3200");
});

test("CSV protegido contra inyección de fórmulas y rutas seguras", async () => {
  const { generarCsv, rutaInternaSegura } = await import("../lib/seguridad");
  const csv = generarCsv([["=HYPERLINK(\"http://x\")", "+57 300", "-1", "@SUM(A1)", 'normal "comillas"']]);
  expect(csv).toContain(`"'=HYPERLINK(""http://x"")"`);
  expect(csv).toContain(`"'+57 300"`);
  expect(csv).toContain(`"'-1"`);
  expect(csv).toContain(`"'@SUM(A1)"`);
  expect(csv).toContain(`"normal ""comillas"""`);
  expect(rutaInternaSegura("//evil.com")).toBe("/");
  expect(rutaInternaSegura("https://evil.com")).toBe("/");
  expect(rutaInternaSegura("/\\evil.com")).toBe("/");
  expect(rutaInternaSegura("/checkout?x=1")).toBe("/checkout?x=1");
});
