import type { Page } from "@playwright/test";

export const CLAVE_ADMIN = "clave-e2e";

export async function ingresarAdmin(page: Page) {
  await page.goto("/admin/ingresar");
  await page.locator("main").getByLabel("Contraseña").fill(CLAVE_ADMIN);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.waitForURL("**/admin");
}

/** Devuelve los saltos de jerarquía de títulos (p. ej. h1 → h3) y cuántos h1 hay. */
export async function revisarTitulos(page: Page) {
  return page.evaluate(() => {
    const hs = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).filter((h) => !h.closest("dialog:not([open])"));
    const niveles = hs.map((h) => Number(h.tagName[1]));
    const saltos: string[] = [];
    for (let i = 1; i < niveles.length; i++) {
      if (niveles[i] > niveles[i - 1] + 1) saltos.push(`${hs[i - 1].tagName}→${hs[i].tagName} (“${hs[i].textContent?.trim().slice(0, 40)}”)`);
    }
    return { h1: niveles.filter((n) => n === 1).length, saltos, primero: niveles[0] };
  });
}
