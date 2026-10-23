import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/marca";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/cuenta", "/carrito", "/checkout", "/pedido/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
