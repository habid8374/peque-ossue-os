import type { Metadata } from "next";
import { FichaProducto } from "@/components/tienda/FichaProducto";
import { CATALOGO } from "@/lib/catalogo-semilla";
import { MARCA, SITE_URL, categoriaPorId } from "@/lib/marca";

// Los productos creados desde el panel (demo en el navegador) se resuelven en el cliente.
export const dynamicParams = true;

export function generateStaticParams() {
  return CATALOGO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = CATALOGO.find((x) => x.slug === slug);
  if (!p) return { title: "Producto", robots: { index: false } };
  return {
    title: p.nombre,
    description: `${p.descripcion} ${categoriaPorId(p.categoria)?.nombre}. Compra en línea o por WhatsApp en Pequeños Sueños.`,
    alternates: { canonical: `/producto/${p.slug}` },
  };
}

export default async function PaginaProducto({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const p = CATALOGO.find((x) => x.slug === slug);
  const relacionados = CATALOGO.filter((x) => p && x.id !== p.id && (x.categoria === p.categoria || x.categoria === "accesorios")).slice(0, 4);
  const jsonLd = p
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.nombre,
        description: p.descripcion,
        sku: p.id,
        category: categoriaPorId(p.categoria)?.nombre,
        color: p.color.nombre,
        image: `${SITE_URL}/opengraph-image.jpg`,
        brand: { "@type": "Brand", name: MARCA.nombre },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/producto/${p.slug}`,
          priceCurrency: "COP",
          price: p.precio,
          availability: p.tallas.some((t) => t.existencias > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: MARCA.nombre },
        },
      }
    : null;
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <FichaProducto slug={slug} inicial={p} relacionadosIniciales={relacionados} />
    </>
  );
}
