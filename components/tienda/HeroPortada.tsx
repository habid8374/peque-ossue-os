"use client";

import Image from "next/image";
import Link from "next/link";
import { IconoFlecha, IconoWhatsApp } from "@/components/Iconos";
import { CONFIG_INICIAL } from "@/lib/config-inicial";
import { useDatos } from "@/lib/hooks";
import { MARCA, enlaceWhatsApp } from "@/lib/marca";
import { rutaInternaSegura } from "@/lib/seguridad";

// TODO(CLIENTE): fotos de banco de demostración. Reemplazar por fotos propias de la
// tienda (con autorización de los padres) antes de publicar. Ver PENDIENTES.md.
const FOTO_PRINCIPAL = "/hero/nina-falda-colores.jpg";
const FOTO_TARJETA = "/hero/nina-vestido-rojo.jpg";

/** Resalta en itálica la última palabra del título, como el "soñar" del lema. */
function TituloConAcento({ texto, claseAcento = "acento" }: { texto: string; claseAcento?: string }) {
  const partes = texto.trim().split(" ");
  const ultima = partes.pop();
  return (
    <>
      {partes.join(" ")} <em className={claseAcento}>{ultima}</em>
    </>
  );
}

/** El arcoíris del logo, en trazo, que se dibuja una sola vez (único momento animado). */
function ArcosAnimados({ className = "" }: { className?: string }) {
  const arcos = [
    { r: 230, color: "#FBF6EF" },
    { r: 196, color: "#D9CBEA" },
    { r: 162, color: "#F6D9A8" },
    { r: 128, color: "#C9D6BF" },
  ];
  return (
    <svg viewBox="0 0 500 260" className={`arco-anim ${className}`} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth={22}>
        {arcos.map((a) => (
          <path key={a.r} d={`M ${250 - a.r} 255 A ${a.r} ${a.r} 0 0 1 ${250 + a.r} 255`} stroke={a.color} style={{ "--largo": (Math.PI * a.r).toFixed(1) } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

function Estrella({ className = "", color = "#FBF6EF" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-16 -16 32 32" className={className} aria-hidden="true">
      <path d="M0 -14 L4 -4 L15 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-15 -4 L-4 -4 Z" fill={color} />
    </svg>
  );
}

/** Sello circular con el lema alrededor del logo. */
function SelloLema({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center rounded-full bg-papel shadow-[0_10px_30px_-12px_rgba(74,52,56,0.45)] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="circulo-lema" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text fill="#7A6064" fontSize="9.4" fontWeight="800" letterSpacing="2.2" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#circulo-lema">DONDE VESTIR TAMBIÉN ES SOÑAR ✦ </textPath>
        </text>
      </svg>
      <Image src="/marca/logo-pequenos-suenos.webp" alt="" width={64} height={64} className="relative size-[54%] rounded-full" sizes="72px" />
    </div>
  );
}

/** Borde de nube que une el héroe con el fondo crema. */
function BordeNube() {
  return (
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px z-20 h-8 w-full sm:h-12" aria-hidden="true">
      <path
        fill="#FBF6EF"
        d="M0 56 V34 C60 34 70 14 130 14 C190 14 200 34 260 34 C320 34 330 8 400 8 C470 8 480 34 540 34 C600 34 610 18 670 18 C730 18 740 36 800 36 C860 36 870 6 940 6 C1010 6 1020 34 1080 34 C1140 34 1150 16 1210 16 C1270 16 1280 34 1340 34 C1390 34 1410 22 1440 22 V56 Z"
      />
    </svg>
  );
}

export function HeroPortada() {
  const config = useDatos((r) => r.configuracion());
  const b = (config ?? CONFIG_INICIAL).banners[0] ?? CONFIG_INICIAL.banners[0];
  const enlace = rutaInternaSegura(b.enlace, "/tienda");

  return (
    <section aria-labelledby="titulo-heroe" className="relative isolate overflow-hidden bg-[#E99897]">
      {/* Foto: en celular arriba y recortada sobre la niña; en escritorio, a todo el ancho */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={FOTO_PRINCIPAL}
          alt="Niña de cabello rizado riendo, con blusa rosada de flores y falda de vuelo de colores"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_18%] lg:object-[38%_top] xl:object-[72%_top]"
        />
        {/* Fundido hacia el bloque de texto en celular */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#E99897] to-transparent lg:hidden" />
        <SelloLema className="absolute top-4 left-4 size-20 sm:size-24 lg:hidden" />
      </div>

      {/* Decoración de marca */}
      <ArcosAnimados className="pointer-events-none absolute -bottom-2 -left-28 z-0 w-[460px] opacity-90 sm:w-[560px] lg:-left-44 lg:w-[600px]" />
      <Estrella className="pointer-events-none absolute top-[14%] left-[46%] z-10 hidden size-6 lg:block" />
      <Estrella className="pointer-events-none absolute top-[30%] left-[40%] z-10 hidden size-4 lg:block" color="#F6D9A8" />
      <Estrella className="pointer-events-none absolute top-[62%] right-[30%] z-10 hidden size-5 lg:block" color="#D9CBEA" />

      <div className="contenedor relative z-10 lg:flex lg:min-h-[min(82vh,700px)] lg:items-center">
        <div className="-mt-6 pb-20 lg:mt-0 lg:max-w-[470px] lg:py-24 xl:max-w-[580px]">
          <p className="inline-flex items-center gap-2 rounded-full bg-papel/80 px-4 py-1.5 text-[0.7rem] font-extrabold tracking-[0.08em] whitespace-nowrap text-cacao uppercase sm:text-[0.78rem] sm:tracking-[0.12em]">
            <span className="size-2 rounded-full bg-rosa" aria-hidden="true" />
            {MARCA.ciudad} · Envíos a toda Colombia
          </p>
          <h1 id="titulo-heroe" className="mt-5 text-[2.75rem] text-[#3B2A2D] sm:text-6xl lg:text-[3.6rem] xl:text-[4.6rem]">
            <TituloConAcento texto={b.titulo} claseAcento="font-italica italic font-normal text-[#7A2E3D]" />
          </h1>
          <p className="mt-5 max-w-md text-lg text-[#3B2A2D] sm:text-xl">{b.texto}</p>
          <div className="mt-8 flex gap-3">
            <Link href={enlace} className="boton flex-1 !bg-cacao !px-4 hover:!bg-[#2E2023] sm:flex-none sm:!px-6">
              {b.boton} <IconoFlecha tam={18} />
            </Link>
            <a href={enlaceWhatsApp("Hola, Pequeños Sueños. Quiero asesoría para escoger una prenda.")} target="_blank" rel="noopener noreferrer" className="boton-sec !border-transparent bg-papel !px-4 hover:!bg-crema sm:!px-6">
              <IconoWhatsApp tam={22} /> <span className="sm:hidden">Asesoría</span>
              <span className="hidden sm:inline">Asesoría por WhatsApp</span>
            </a>
          </div>
          <ul className="mt-8 flex max-w-md flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#3B2A2D]" aria-label="Lo que nos distingue">
            {["Tallas de 0 a 12 años", "Plan de pago", "Tienda física en el Cc San Miguel"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Estrella className="size-3.5" color="#FFFDF9" />
                {t}
              </li>
            ))}
          </ul>

          {/* Tarjeta de colección (celular) */}
          <Link href="/tienda?q=vestido" className="mt-8 flex items-center gap-4 rounded-3xl bg-papel p-3 pr-5 shadow-[0_12px_30px_-16px_rgba(74,52,56,0.5)] lg:hidden">
            <span className="relative block aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-[999px_999px_0.8rem_0.8rem]">
              <Image src={FOTO_TARJETA} alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
            <span className="flex-1">
              <span className="block text-xs font-extrabold tracking-[0.12em] text-cacao-suave uppercase">Para estrenar</span>
              <span className="titulo block text-xl">Vestidos de fiesta</span>
            </span>
            <IconoFlecha tam={20} />
          </Link>
        </div>
      </div>

      {/* Escritorio: sello del lema y tarjeta flotante en arco */}
      <SelloLema className="absolute top-[11%] left-[49%] z-10 hidden size-28 -rotate-6 xl:grid" />
      <Link
        href="/tienda?q=vestido"
        className="group absolute right-[3%] bottom-[13%] z-10 hidden w-[210px] rotate-[3deg] rounded-[2rem] bg-papel p-3 shadow-[0_24px_50px_-20px_rgba(74,52,56,0.55)] transition-transform duration-300 hover:rotate-0 lg:block xl:right-[5%] xl:w-[230px]"
      >
        <span className="relative block aspect-[3/4] overflow-hidden rounded-[999px_999px_1.25rem_1.25rem] bg-crema">
          <Image src={FOTO_TARJETA} alt="Niña sentada con vestido rojo de flores" fill sizes="230px" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        </span>
        <span className="mt-3 block px-1 text-xs font-extrabold tracking-[0.12em] text-cacao-suave uppercase">Para estrenar</span>
        <span className="flex items-center justify-between px-1 pb-1">
          <span className="titulo text-xl">Vestidos de fiesta</span>
          <span className="grid size-9 place-items-center rounded-full bg-rosa-nube transition-transform group-hover:translate-x-0.5">
            <IconoFlecha tam={16} />
          </span>
        </span>
      </Link>

      <BordeNube />
    </section>
  );
}

export function BannerSecundario() {
  const config = useDatos((r) => r.configuracion());
  const b = (config ?? CONFIG_INICIAL).banners[1] ?? CONFIG_INICIAL.banners[1];
  return (
    <div>
      <h2 className="text-4xl text-cacao sm:text-5xl">
        <TituloConAcento texto={b.titulo} />
      </h2>
      <p className="mt-4 max-w-md text-lg">{b.texto}</p>
      <Link href={rutaInternaSegura(b.enlace, "/tienda")} className="boton mt-7">
        {b.boton}
      </Link>
    </div>
  );
}
