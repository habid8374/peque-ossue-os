"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesionRequerida } from "@/components/cuenta/useSesion";
import { IconoFlecha } from "@/components/Iconos";
import { InsigniaEstado } from "@/components/tienda/SeguimientoPedido";
import { fecha, pesos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { unidades } from "@/lib/pedidos";
import { repo } from "@/lib/repositorio";

export function VistaCuenta() {
  const cliente = useSesionRequerida();
  const router = useRouter();
  const pedidos = useDatos((r) => (cliente ? r.pedidosDeCliente(cliente.id) : Promise.resolve([])), [cliente?.id]);
  if (!cliente) return <p>Cargando…</p>;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="sobretitulo">Mi cuenta</p>
          <h1 className="mt-2 text-5xl">
            Hola, <em className="acento">{cliente.nombre.split(" ")[0]}</em>
          </h1>
        </div>
        <button
          type="button"
          className="boton-sec"
          onClick={async () => {
            await repo().cerrarSesion();
            router.push("/");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <section aria-labelledby="titulo-pedidos">
        <h2 id="titulo-pedidos" className="text-3xl">
          Mis pedidos
        </h2>
        {!pedidos ? (
          <p className="mt-4">Cargando…</p>
        ) : pedidos.length === 0 ? (
          <p className="mt-4">
            Aún no tienes pedidos.{" "}
            <Link href="/tienda" className="enlace">
              Ir a la tienda
            </Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {pedidos.map((p) => (
              <li key={p.id}>
                <Link href={`/cuenta/pedido?n=${encodeURIComponent(p.numero)}`} className="tarjeta flex flex-wrap items-center gap-x-6 gap-y-2 p-5 hover:border-cacao/40">
                  <span className="min-w-32">
                    <span className="block font-extrabold">{p.numero}</span>
                    <span className="text-sm text-cacao-suave">{fecha(p.creado)}</span>
                  </span>
                  <InsigniaEstado estado={p.estado} />
                  <span className="text-sm text-cacao-suave">
                    {unidades(p)} {unidades(p) === 1 ? "prenda" : "prendas"}
                  </span>
                  <span className="ml-auto flex items-center gap-3 font-extrabold">
                    {pesos(p.total)} <IconoFlecha tam={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulo-datos" className="tarjeta p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 id="titulo-datos" className="text-3xl">
            Datos de entrega
          </h2>
          <Link href="/cuenta/datos" className="boton-sec">
            Editar datos
          </Link>
        </div>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-cacao-suave">Nombre</dt>
            <dd>
              {cliente.nombre} {cliente.apellidos}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-cacao-suave">Contacto</dt>
            <dd>
              {cliente.correo} · {cliente.celular}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-cacao-suave">Dirección</dt>
            <dd>
              {cliente.direccion}
              {cliente.complemento ? `, ${cliente.complemento}` : ""} — {cliente.ciudad}, {cliente.departamento}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-cacao-suave">Correos de campañas</dt>
            <dd>{cliente.autorizaCorreos ? "Autorizados" : "No autorizados"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
