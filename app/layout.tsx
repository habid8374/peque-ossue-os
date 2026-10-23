import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MARCA, SITE_URL } from "@/lib/marca";
import "./globals.css";

const display = localFont({
  src: "./fuentes/fraunces-latin-soft-normal.woff2",
  variable: "--fuente-display",
  weight: "100 900",
  display: "swap",
});

const italica = localFont({
  src: "./fuentes/fraunces-latin-wght-italic.woff2",
  variable: "--fuente-italica",
  weight: "100 900",
  style: "italic",
  display: "swap",
  preload: false,
});

const sans = localFont({
  src: "./fuentes/nunito-latin-wght-normal.woff2",
  variable: "--fuente-sans",
  weight: "200 1000",
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
