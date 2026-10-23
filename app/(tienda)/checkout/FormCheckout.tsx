"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Campo, CamposEntrega, CasillaAutorizacionDatos, ErrorGeneral } from "@/components/Formularios";
import { IconoCandado } from "@/components/Iconos";
import { ImagenProducto } from "@/components/tienda/ImagenProducto";
import { ResumenCompra } from "@/components/tienda/ResumenCompra";
import { useLineasCarrito } from "@/components/tienda/useLineasCarrito";
import { pesos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { NOMBRE_PAGO } from "@/lib/marca";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import type { MetodoPago, NuevoPedido } from "@/lib/tipos";
import { validarEnServidor, type Errores } from "@/lib/validar";

import { CLAVE_ULTIMO_PEDIDO } from "@/lib/claves";

const PAGOS: { id: MetodoPago; detalle: string }[] = [
  { id: "tarjeta", detalle: "Crédito o débito. En producción el pago se hace en la pasarela segura; aquí no pedimos datos de tarjeta." },
  { id: "pse", detalle: "Débito desde tu cuenta bancaria. En la demo se aprueba automáticamente." },
  { id: "contraentrega", detalle: "Pagas en efectivo cuando recibes el pedido." },
];

export function FormCheckout() {
  const router = useRouter();
  const { listo, carrito, lineas, subtotal, envio, config } = useLineasCarrito();
  const cliente = useDatos((r) => r.clienteActual());
  const [errores, setErrores] = useState<Errores>({});
  const [pago, setPago] = useState<MetodoPago>("tarjeta");
  const [estado, setEstado] = useState<"idle" | "validando" | "pagando">("idle");

  if (!listo || cliente === undefined) return <p className="py-10">Cargando…</p>;
  if (!lineas.length) {
    return (
      <div className="tarjeta p-10 text-center">
        <p className="titulo text-3xl">No hay nada para pagar todavía</p>
        <Link href="/tienda" className="boton mt-6">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    const cuerpo = {
      contacto: { nombre: g("contacto.nombre"), apellidos: g("contacto.apellidos"), correo: g("contacto.correo"), celular: g("contacto.celular"), cedula: g("contacto.cedula") || undefined },
      envio: { departamento: g("envio.departamento"), ciudad: g("envio.ciudad"), direccion: g("envio.direccion"), complemento: g("envio.complemento") || undefined },
      metodoPago: g("metodoPago"),
      autorizaDatos: f.get("autorizaDatos") === "on",
      items: lineas.map((l) => ({ productoId: l.productoId, talla: l.talla, cantidad: l.cantidad })),
    };
    setEstado("validando");
    const v = await validarEnServidor<NuevoPedido>("/api/pedidos/validar", cuerpo);
    if (!v.ok) {
      setErrores(v.errores);
      setEstado("idle");
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setErrores({});
    setEstado("pagando");
    await new Promise((r) => setTimeout(r, 900)); // pago simulado
    try {
      const pedido = await repo().crearPedido({ ...v.datos, clienteId: cliente?.id });
      sessionStorage.setItem(CLAVE_ULTIMO_PEDIDO, JSON.stringify({ numero: pedido.numero, correo: pedido.contacto.correo }));
      carrito.vaciar();
      router.push("/pedido/confirmado");
    } catch (err) {
      setErrores({ _: err instanceof ErrorRepositorio ? err.message : "No pudimos crear el pedido. Intenta de nuevo." });
      setEstado("idle");
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-10">
        <div role="note" className="flex gap-3 rounded-2xl bg-durazno px-4 py-3">
          <IconoCandado className="mt-0.5 shrink-0" />
          <p>
            <strong>Tienda de demostración.</strong> No se hará ningún cobro ni se enviará ningún producto.
          </p>
        </div>
        <ErrorGeneral errores={errores} />

        <fieldset className="space-y-4">
          <legend className="titulo mb-2 text-2xl">1. Tus datos</legend>
          {!cliente && (
            <p className="text-cacao-suave">
              ¿Ya tienes cuenta?{" "}
              <Link href="/cuenta/ingresar?siguiente=/checkout" className="enlace">
                Inicia sesión
              </Link>{" "}
              y llenamos todo por ti.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo nombre="contacto.nombre" etiqueta="Nombre" autoComplete="given-name" defaultValue={cliente?.nombre} errores={errores} />
            <Campo nombre="contacto.apellidos" etiqueta="Apellidos" autoComplete="family-name" defaultValue={cliente?.apellidos} errores={errores} />
            <Campo nombre="contacto.correo" etiqueta="Correo" type="email" autoComplete="email" defaultValue={cliente?.correo} errores={errores} ayuda="Con este correo puedes seguir tu pedido." />
            <Campo nombre="contacto.celular" etiqueta="Celular" type="tel" inputMode="tel" autoComplete="tel-national" defaultValue={cliente?.celular} errores={errores} placeholder="300 123 4567" />
            <Campo nombre="contacto.cedula" etiqueta="Cédula" opcional inputMode="numeric" defaultValue={cliente?.cedula} errores={errores} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="titulo mb-2 text-2xl">2. Dirección de entrega</legend>
          <CamposEntrega prefijo="envio." errores={errores} inicial={cliente ?? undefined} />
        </fieldset>

        <fieldset>
          <legend className="titulo mb-4 text-2xl">3. Pago (simulado)</legend>
          <div className="space-y-3">
            {PAGOS.map((p) => (
              <label key={p.id} className="tarjeta flex cursor-pointer gap-4 p-4 has-[:checked]:border-cacao has-[:checked]:ring-1 has-[:checked]:ring-cacao">
                <input type="radio" name="metodoPago" value={p.id} checked={pago === p.id} onChange={() => setPago(p.id)} className="mt-1 size-5 accent-rosa" />
                <span>
                  <span className="block font-extrabold">{NOMBRE_PAGO[p.id]}</span>
                  <span className="text-sm text-cacao-suave">{p.detalle}</span>
                </span>
              </label>
            ))}
          </div>
          {errores.metodoPago && (
            <p role="alert" className="error-campo">
              {errores.metodoPago}
            </p>
          )}
        </fieldset>

        <CasillaAutorizacionDatos errores={errores} />
      </div>

      <aside aria-label="Tu pedido" className="tarjeta h-fit p-6 lg:sticky lg:top-32">
        <h2 className="text-2xl">Tu pedido</h2>
        <ul className="mt-4 space-y-3">
          {lineas.map((l) => (
            <li key={`${l.productoId}-${l.talla}`} className="flex items-center gap-3">
              <div className="w-14 shrink-0">
                <ImagenProducto producto={l.producto} sizes="56px" />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold">{l.producto.nombre}</p>
                <p className="text-cacao-suave">
                  Talla {l.talla} × {l.cantidad}
                </p>
              </div>
              <p className="text-sm font-bold">{pesos(l.producto.precio * l.cantidad)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <ResumenCompra subtotal={subtotal} envio={envio} envioGratisDesde={config.envioGratisDesde} />
        </div>
        <button type="submit" className="boton mt-6 w-full" disabled={estado !== "idle"}>
          {estado === "validando" ? "Revisando datos…" : estado === "pagando" ? "Procesando pago simulado…" : pago === "contraentrega" ? "Confirmar pedido" : "Pagar (simulado)"}
        </button>
      </aside>
    </form>
  );
}
