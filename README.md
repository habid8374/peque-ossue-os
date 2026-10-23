# Pequeños Sueños · tienda online (demo)

Tienda online de demostración para **Pequeños Sueños**, tienda de ropa infantil y para bebés en el
Cc San Miguel, segundo piso, Sabanalarga (Atlántico). *"Donde vestir también es soñar."*

Hecha por Axentia Technologies con Next.js (App Router), React, TypeScript y Tailwind CSS.

## Cómo ejecutarla

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local      # y cambia ADMIN_DEMO_PASSWORD y ADMIN_SESSION_SECRET
npm run dev                     # http://localhost:3000
```

Producción local: `npm run build && npm start`.

### Cuentas de prueba

| Para | Usuario | Contraseña |
|---|---|---|
| Cliente | `demo@correo-demo.co` | `demo1234` (3 pedidos: en reparto, preparando y entregado) |
| Panel `/admin` | — | el valor de `ADMIN_DEMO_PASSWORD`. Si no se define, `suenos-demo-2026` |

El botón **"Restablecer datos demo"** del panel vuelve a cargar los datos de ejemplo.

### Variables de entorno

| Variable | Uso |
|---|---|
| `ADMIN_DEMO_PASSWORD` | Contraseña del panel de la demo. **Defínela en Vercel**: el valor por defecto está en este repositorio. |
| `ADMIN_SESSION_SECRET` | Secreto para firmar la cookie del panel (32+ caracteres aleatorios). |
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, robots, JSON-LD). Ej.: `https://pequenos-suenos.vercel.app` |

## Verificación

```bash
npm run lint
npm run typecheck
npm run build
npm test                     # Playwright: humo + punta a punta (levanta el servidor solo)
npm start & BASE=http://localhost:3000 npm run lighthouse
npm start & BASE=http://localhost:3000 CLAVE_ADMIN=... npm run capturas
```

- `tests/smoke.spec.ts`: todas las rutas responden, un solo H1 y sin saltos de títulos, cero enlaces
  internos rotos en la portada, cabeceras de seguridad, sitemap/robots/llms.txt, JSON-LD, panel
  protegido, redirecciones solo internas y CSV protegido contra fórmulas.
- `tests/e2e.spec.ts`: registro → compra → seguimiento → el admin cambia el estado en otra pestaña →
  el cliente lo ve actualizado; consulta sin cuenta y cancelación.
- Informes Lighthouse en `docs/lighthouse/`, capturas en `capturas/`.

## Qué incluye

- **Tienda:** portada con arcoíris animado (respeta `prefers-reduced-motion`), compra por edad,
  recién llegados, banners editables, look, confianza, historias destacadas (Plan de pago,
  Soñadores, Quiénes somos), seguimiento y suscripción. Catálogo con filtros (categoría, talla,
  precio, orden), búsqueda y favoritos. Ficha con tallas, existencias, WhatsApp, relacionados y barra
  fija en celular. Carrito, checkout y confirmación con envío gratis configurable.
- **Cuenta:** registro completo con dos autorizaciones separadas y sin marcar (datos obligatoria,
  correos opcional), ingreso, mis pedidos, edición de datos y checkout precargado.
- **Seguimiento tipo Amazon:** etapas, fecha estimada, transportadora, guía, historial, detalle y
  dirección; consulta sin cuenta (número + correo, sin poner el correo en la URL); cancelación
  mientras el pedido no haya salido; se actualiza solo cuando el panel cambia el estado.
- **Panel `/admin`:** resumen con estadísticas y gráficas (paleta validada con el skill `dataviz`,
  `docs/validacion-paleta-graficas.txt`), pedidos, productos, clientes (CSV solo de autorizados),
  campañas de correo simuladas y configuración.
- **Técnico:** CSP, HSTS, X-Frame-Options, nosniff y Referrer-Policy (`next.config.ts`); rutas con
  Zod en `app/api/`; SEO por página, `sitemap.xml`, `robots.txt`, `/llms.txt`, JSON-LD
  ClothingStore, Product y FAQPage; fuentes autohospedadas y recortadas.

Diseño: ver `docs/PLAN-DISENO.md`.

## Qué es demo (y qué falta para producción)

La demo guarda todo **en el navegador** (`localStorage`). Por eso el panel y la tienda comparten datos
solo si se abren en el mismo navegador, y cada visitante ve sus propios datos de ejemplo.

Las pantallas solo hablan con la interfaz `Repositorio` (`lib/repositorio/interfaz.ts`). Para
producción se escribe otra implementación y se cambia en `lib/repositorio/index.ts`:

1. **Base de datos:** Supabase o Postgres (productos, clientes, pedidos, historial, campañas,
   configuración), con las mismas operaciones de la interfaz detrás de rutas de servidor.
2. **Autenticación real:** clientes (Supabase Auth o Auth.js) y usuarios administradores con roles.
   Hoy el panel usa una sola contraseña de demo y las contraseñas de clientes se guardan con hash en
   el navegador, lo cual **no es seguro para producción**.
3. **Pasarela de pagos:** Wompi, ePayco o Mercado Pago (tarjeta y PSE) con webhooks que pasen el
   pedido a "pagado". Hoy el pago es simulado.
4. **Correo real:** Resend para confirmaciones, cambios de estado y campañas. El punto de
   integración está en `app/api/admin/campanas/route.ts`; hoy siempre simula y exige sesión de admin.
5. **Fotos reales** de los productos (hoy son ilustraciones SVG) y almacenamiento de imágenes
   (Supabase Storage o Vercel Blob).
6. Revisión legal de la política de datos y de los textos marcados como pendientes (`PENDIENTES.md`).

## Desplegar en Vercel

1. En Vercel: **Add New → Project → Import** este repositorio. Framework: Next.js (se detecta solo).
2. En **Environment Variables** agrega `ADMIN_DEMO_PASSWORD`, `ADMIN_SESSION_SECRET` y
   `NEXT_PUBLIC_SITE_URL`.
3. **Deploy.** No hace falta configuración adicional.
