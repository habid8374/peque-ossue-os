import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MARCA, SITE_URL } from "@/lib/marca";
import "./globals.css";

// Fuentes: Fraunces (SIL OFL) y Nunito (SIL OFL), recortadas a caracteres latinos y
// español, con los ejes fijados que usa el sitio (ver docs/PLAN-DISENO.md).

const display = localFont({
  src: "./fuentes/fraunces-suave.woff2",
  variable: "--fuente-display",
  weight: "400 600",
  display: "swap",
});

const italica = localFont({
  src: "./fuentes/fraunces-italica.woff2",
  variable: "--fuente-italica",
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
});

const sans = localFont({
  src: "./fuentes/nunito.woff2",
  variable: "--fuente-sans",
  weight: "400 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${MARCA.nombre} | Ropa infantil y para bebés en Sabanalarga`,
    template: `%s | ${MARCA.nombre}`,
  },
  description: `${MARCA.descripcion} ${MARCA.lema}`,
  applicationName: MARCA.nombre,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: MARCA.nombre,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${italica.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
