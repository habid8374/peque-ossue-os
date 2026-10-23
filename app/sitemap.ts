import type { MetadataRoute } from "next";
import { CATALOGO } from "@/lib/catalogo-semilla";
import { CATEGORIAS, SITE_URL } from "@/lib/marca";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const fijas = ["", "/tienda", "/seguimiento", "/plan-de-pago", "/sonadores", "/quienes-somos", "/envios-y-cambios", "/politica-de-datos", "/cuenta/registro"];
  return [
    ...fijas.map((r) => ({ url: `${SITE_URL}${r}`, lastModified: ahora, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.6 })),
    ...CATEGORIAS.map((c) => ({ url: `${SITE_URL}/coleccion/${c.id}`, lastModified: ahora, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...CATALOGO.map((p) => ({ url: `${SITE_URL}/producto/${p.slug}`, lastModified: ahora, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
