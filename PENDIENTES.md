# Pendientes

Todo lo marcado `TODO(CLIENTE)` en el código. Nada de esto se inventó: se completa con la tienda.

## Datos del negocio (TODO(CLIENTE))
- [ ] Correo de atención al cliente (`lib/marca.ts`).
- [ ] Horario de atención (`lib/marca.ts`, `/quienes-somos`).
- [ ] Razón social o titular, NIT o cédula y correo para peticiones de datos personales (`/politica-de-datos`).
- [ ] Historia de la tienda: fundadora, año de apertura, fotos del local (`/quienes-somos`).
- [ ] Condiciones del **Plan de pago**: abono inicial, cuotas, tiempo de separado, prendas a las que aplica (`/plan-de-pago`).
- [ ] Galería de **Soñadores** con autorización escrita de padres o acudientes (`/sonadores`).

## Envíos y cambios (TODO(CLIENTE))
- [ ] Monto para envío gratis y costo de envío reales (hoy $200.000 y $12.000 de ejemplo; se cambian en `/admin/configuracion`).
- [ ] Transportadoras con las que trabaja la tienda.
- [ ] Tiempos de entrega reales por zona (`lib/pedidos.ts`).
- [ ] Política de cambios y devoluciones (`/envios-y-cambios`).

## Catálogo
- [ ] **Fotos del héroe de la portada** (`public/hero/`): son fotos de demostración. Confirmar la licencia de uso o reemplazarlas por fotos propias con autorización escrita de los padres o acudientes.
- [ ] **Subir fotos reales** de cada prenda (hoy son ilustraciones). Ponerlas en `referencias/productos/` o subirlas desde el panel.
- [ ] Inventario, precios, tallas y nombres reales (los actuales son de ejemplo, `lib/catalogo-semilla.ts`).

## Legal
- [ ] Revisión por abogado de la **política de tratamiento de datos** (hoy es plantilla).
- [ ] Términos y condiciones de compra.

## Producción (ver README)
- [ ] Base de datos (Supabase/Postgres) y autenticación real de clientes y administradores.
- [ ] Pasarela de pagos (Wompi, ePayco o Mercado Pago).
- [ ] Correo real con Resend (confirmaciones, estados, campañas con enlace de baja).
- [ ] Dominio propio y `NEXT_PUBLIC_SITE_URL`.
- [ ] Perfil de Google Business y analítica (GA4) con aviso de cookies si aplica.
