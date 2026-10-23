import { expect, test } from "@playwright/test";
import { ingresarAdmin } from "./utilidades";

test("registro → compra → seguimiento → el admin cambia el estado → el cliente lo ve", async ({ page, context }) => {
  const correo = `e2e.${Date.now()}@correo-demo.co`;

  // 1. Registro
  await page.goto("/cuenta/registro");
  // Las casillas deben empezar sin marcar
  await expect(page.locator("main").getByRole("checkbox", { name: /tratamiento de mis datos/ })).not.toBeChecked();
  await expect(page.locator("main").getByRole("checkbox", { name: /recibir correos/ })).not.toBeChecked();
  await page.locator("main").getByLabel("Nombre", { exact: true }).fill("Lucía");
  await page.locator("main").getByLabel("Apellidos").fill("Prueba Automática");
  await page.locator("main").getByLabel("Celular").fill("3001234567");
  await page.locator("main").getByLabel("Correo", { exact: true }).fill(correo);
  await page.locator("main").getByLabel("Departamento").selectOption("Atlántico");
  await page.locator("main").getByLabel("Ciudad o municipio").selectOption("Baranoa");
  await page.locator("main").getByLabel("Dirección", { exact: true }).fill("Carrera 19 # 20-30");
  await page.locator("main").getByLabel("Contraseña", { exact: true }).fill("segura123");
  await page.locator("main").getByLabel("Repite la contraseña").fill("segura123");

  // Sin autorización de datos no deja crear la cuenta
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Debes autorizar" }).first()).toBeVisible();

  await page.locator("main").getByRole("checkbox", { name: /tratamiento de mis datos/ }).check();
  await page.locator("main").getByRole("checkbox", { name: /recibir correos/ }).check();
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await page.waitForURL("**/cuenta");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lucía");

  // 2. Compra
  await page.goto("/producto/jardinera-arcoiris");
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Elige una talla" })).toBeVisible();
  await page.getByRole("button", { name: "Talla 9 M", exact: true }).click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Agregado al carrito" })).toBeVisible();

  await page.goto("/carrito");
  await expect(page.getByText("Jardinera Arcoíris")).toBeVisible();
  await page.getByRole("link", { name: "Continuar con la compra" }).click();
  await page.waitForURL("**/checkout");
  // Datos precargados desde la cuenta
  await expect(page.locator("main").getByLabel("Correo", { exact: true })).toHaveValue(correo);
  await expect(page.locator("main").getByLabel("Ciudad o municipio")).toHaveValue("Baranoa");
  await page.locator("main").getByLabel("PSE").check();
  await page.locator("main").getByRole("checkbox", { name: /tratamiento de mis datos/ }).check();
  await page.getByRole("button", { name: "Pagar (simulado)" }).click();
  await page.waitForURL("**/pedido/confirmado");
  const numero = (await page.locator("strong.text-rosa").first().textContent())!.trim();
  expect(numero).toMatch(/^PS-\d+$/);
  await expect(page.getByText("Pagado").first()).toBeVisible();

  // 3. Seguimiento desde la cuenta
  await page.goto("/cuenta");
  await page.getByRole("link", { name: new RegExp(numero) }).click();
  await page.waitForURL(`**/cuenta/pedido?n=${numero}`);
  await expect(page.getByRole("heading", { name: /Llega/ })).toBeVisible();

  // 4. El admin cambia el estado en otra pestaña
  const admin = await context.newPage();
  await ingresarAdmin(admin);
  await admin.goto(`/admin/pedidos?n=${numero}`);
  const editor = admin.getByRole("dialog");
  await expect(editor.getByRole("heading", { name: `Pedido ${numero}` })).toBeVisible();
  await editor.getByLabel("Estado").selectOption("enviado");
  await editor.getByLabel("Transportadora").selectOption("Interrapidísimo");
  await editor.getByLabel("Número de guía").fill("240099887766");
  await editor.getByLabel("Nota visible para el cliente").fill("Tu pedido va en camino a Baranoa.");
  await editor.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(editor.getByRole("status")).toContainText("Cambios guardados");

  // 5. El cliente lo ve actualizado (la pestaña abierta se refresca sola)
  await page.bringToFront();
  await expect(page.locator("main").getByText("Enviado").first()).toBeVisible();
  await expect(page.getByText("240099887766")).toBeVisible();
  await expect(page.getByText("Tu pedido va en camino a Baranoa.")).toBeVisible();
  await expect(page.getByText("Interrapidísimo")).toBeVisible();
  // Ya salió: no se puede cancelar
  await expect(page.getByRole("button", { name: "Cancelar pedido" })).toHaveCount(0);
});

test("consulta sin cuenta y cancelación de un pedido que no ha salido", async ({ page }) => {
  // La cuenta de prueba tiene un pedido en preparación
  await page.goto("/cuenta/ingresar");
  await page.locator("main").getByLabel("Correo").fill("demo@correo-demo.co");
  await page.locator("main").getByLabel("Contraseña").fill("demo1234");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("**/cuenta");
  const filas = page.locator("#titulo-pedidos ~ ul li");
  await expect(filas).toHaveCount(3);
  await expect(page.getByText("En reparto")).toBeVisible();
  await expect(page.getByText("Preparando")).toBeVisible();
  await expect(page.getByText("Entregado")).toBeVisible();
  const numero = (await filas.filter({ hasText: "Preparando" }).locator(".font-extrabold").first().textContent())!.trim();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();

  await page.goto("/seguimiento");
  await page.locator("main").getByLabel("Número de pedido").fill(numero);
  await page.locator("main").getByLabel("Correo de la compra").fill("demo@correo-demo.co");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.getByText(`Pedido ${numero}`, { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Cancelar pedido" }).click();
  await page.getByRole("button", { name: "Sí, cancelar" }).click();
  await expect(page.getByRole("heading", { name: "Pedido cancelado" })).toBeVisible();

  // Correo equivocado: no muestra nada
  await page.locator("main").getByLabel("Correo de la compra").fill("otra@correo-demo.co");
  await page.getByRole("button", { name: "Ver mi pedido" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No encontramos" })).toBeVisible();
});
