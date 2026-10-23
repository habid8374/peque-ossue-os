"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { repo } from "@/lib/repositorio";

const NAV = [
  { href: "/admin", nombre: "Resumen" },
  { href: "/admin/pedidos", nombre: "Pedidos" },
  { href: "/admin/productos", nombre: "Productos" },
  { href: "/admin/clientes", nombre: "Clientes" },
  { href: "/admin/campanas", nombre: "Campañas" },
  { href: "/admin/configuracion", nombre: "Configuración" },
];

export function MarcoAdmin({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const [aviso, setAviso] = useState("");

  async function restablecer() {
    await repo().restablecer();
    dialogo.current?.close();
    setAviso("Datos demo restablecidos.");
    setTimeout(() => setAviso(""), 4000);
  }

  async function salir() {
    await fetch("/api/admin/sesion", { method: "DELETE" });
    router.push("/admin/ingresar");
  }

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[240px_1fr] lg:bg-[linear-gradient(to_right,var(--color-papel)_240px,transparent_240px)]">
      <a href="#contenido-admin" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-cacao focus:px-5 focus:py-3 focus:text-white">
        Saltar al contenido
      </a>
      <aside className="border-b border-linea bg-papel lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-5 lg:py-6">
          <Image src="/marca/logo-pequenos-suenos.webp" alt="" width={44} height={44} className="rounded-full" />
          <div className="leading-tight">
            <p className="titulo text-lg">Pequeños Sueños</p>
            <p className="text-xs font-bold text-cacao-suave">Panel de administración</p>
          </div>
        </div>
        <nav aria-label="Panel" className="overflow-x-auto px-2 pb-2 lg:px-3">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map((n) => {
              const activo = n.href === "/admin" ? ruta === "/admin" : ruta.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={activo ? "page" : undefined} className="flex min-h-11 items-center rounded-xl px-3 font-bold whitespace-nowrap hover:bg-crema aria-[current=page]:bg-cacao aria-[current=page]:text-white">
                    {n.nombre}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden space-y-1 border-t border-linea px-3 pt-4 lg:block">
          <Link href="/" className="flex min-h-11 items-center rounded-xl px-3 text-sm font-bold hover:bg-crema">
            Ver la tienda ↗
          </Link>
          <button type="button" onClick={() => dialogo.current?.showModal()} className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-bold hover:bg-crema">
            Restablecer datos demo
          </button>
          <button type="button" onClick={salir} className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-bold hover:bg-crema">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-linea bg-durazno px-4 py-2 text-sm lg:px-8">
          <strong>Modo demostración:</strong> los datos viven en este navegador. Los pagos y correos son simulados.
          <span className="ml-auto flex gap-2 lg:hidden">
            <button type="button" className="min-h-11 rounded-full px-3 font-bold underline" onClick={() => dialogo.current?.showModal()}>
              Restablecer
            </button>
            <button type="button" className="min-h-11 rounded-full px-3 font-bold underline" onClick={salir}>
              Salir
            </button>
          </span>
        </div>
        {aviso && (
          <p role="status" className="bg-salvia px-4 py-2 font-bold lg:px-8">
            {aviso}
          </p>
        )}
        <main id="contenido-admin" className="px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
      <dialog ref={dialogo} aria-labelledby="titulo-restablecer" className="m-auto w-[min(92vw,460px)] rounded-3xl bg-papel p-0 text-cacao backdrop:bg-cacao/40">
        <div className="p-6">
          <h2 id="titulo-restablecer" className="text-2xl">
            ¿Restablecer los datos demo?
          </h2>
          <p className="mt-3 text-cacao-suave">Se borran los pedidos, clientes, productos y campañas creados en este navegador y se cargan de nuevo los datos de ejemplo.</p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="boton-sec" onClick={() => dialogo.current?.close()}>
              Cancelar
            </button>
            <button type="button" className="boton" onClick={restablecer}>
              Sí, restablecer
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
