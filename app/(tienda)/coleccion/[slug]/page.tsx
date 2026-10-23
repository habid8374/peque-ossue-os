import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalogo, CatalogoRespaldo } from "@/components/tienda/Catalogo";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { CATALOGO } from "@/lib/catalogo-semilla";
import { CATEGORIAS, categoriaPorId } from "@/lib/marca";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/coleccion/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = categoriaPorId(slug);
  if (!c) return {};
  return {
    title: `${c.nombre} (${c.edad})`,
    description: `${c.descripcion} Ropa ${c.nombre.toLowerCase()} en Pequeños Sueños, Sabanalarga. Envíos a toda Colombia.`,
    alternates: { canonical: `/coleccion/${c.id}` },
  };
}

export default async function PaginaColeccion({ params }: PageProps<"/coleccion/[slug]">) {
  const { slug } = await params;
  const c = categoriaPorId(slug);
  if (!c) notFound();
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { href: "/tienda", nombre: "Tienda" }, { nombre: c.nombre }]} sobretitulo={c.edad} titulo={c.nombre} texto={c.descripcion} />
      <div className="contenedor">
        <Suspense fallback={<CatalogoRespaldo iniciales={CATALOGO} categoriaFija={c.id} />}>
          <Catalogo iniciales={CATALOGO} categoriaFija={c.id} />
        </Suspense>
      </div>
    </>
  );
}
