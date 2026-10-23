import Link from "next/link";
import { IconoCamion, IconoCandado, IconoChat, IconoFlecha, IconoInstagram, IconoUbicacion, IconoWhatsApp } from "@/components/Iconos";
import { FormConsultaPedido } from "@/components/tienda/FormConsultaPedido";
import { FormSuscripcion } from "@/components/tienda/FormSuscripcion";
import { GrillaViva } from "@/components/tienda/GrillaViva";
import { BannerSecundario, HeroPortada } from "@/components/tienda/HeroPortada";
import { Ilustracion } from "@/components/tienda/Ilustracion";
import { CATALOGO } from "@/lib/catalogo-semilla";
import { pesos } from "@/lib/formato";
import { CATEGORIAS, MARCA, SITE_URL, enlaceWhatsApp } from "@/lib/marca";
import type { Ilustracion as TipoIl } from "@/lib/tipos";

const EDADES: { id: string; titulo: string; edad: string; fondo: string; il: TipoIl; color: string; acento: string }[] = [
  { id: "recien-nacido", titulo: "Recién nacido", edad: "0 a 3 meses", fondo: "bg-durazno", il: "body", color: "#F4E9DA", acento: "#E7B4B4" },
  { id: "bebe", titulo: "Bebé", edad: "3 a 24 meses", fondo: "bg-rosa-nube", il: "jardinera", color: "#E9BDBB", acento: "#D9CBEA" },
  { id: "ninos", titulo: "Niños y niñas", edad: "2 a 12 años", fondo: "bg-salvia", il: "camisa", color: "#EFE4D2", acento: "#C3D2B8" },
];

const OCASIONES: { id: string; il: TipoIl; color: string; acento: string; fondo: string }[] = [
  { id: "bautizo", il: "vestido", color: "#F7F0E3", acento: "#E6D3B3", fondo: "bg-lila" },
  { id: "calzado", il: "zapato", color: "#EBB7B9", acento: "#FFFDF9", fondo: "bg-durazno" },
  { id: "accesorios", il: "balaca", color: "#EDB8BE", acento: "#D9CBEA", fondo: "bg-salvia" },
];

const LOOK = ["p10", "p14", "p20"];

export default function Portada() {
  const tienda = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: MARCA.nombre,
    slogan: MARCA.lema,
    description: MARCA.descripcion,
    url: SITE_URL,
    logo: `${SITE_URL}/marca/logo-pequenos-suenos.webp`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    telephone: MARCA.telefono,
    address: {
      "@type": "PostalAddress",
      streetAddress: MARCA.direccion,
      addressLocality: MARCA.ciudad,
      addressRegion: MARCA.departamento,
      addressCountry: MARCA.pais,
    },
    sameAs: [MARCA.instagramUrl],
    areaServed: "CO",
    currenciesAccepted: "COP",
  };
  const productosLook = LOOK.map((id) => CATALOGO.find((p) => p.id === id)!).filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tienda).replace(/</g, "\\u003c") }} />
      <HeroPortada />
      <div className="h-14 sm:h-20" aria-hidden="true" />

      {/* Compra por edad */}
      <section aria-labelledby="titulo-edad" className="contenedor">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="sobretitulo">Compra por edad</p>
            <h2 id="titulo-edad" className="mt-2 text-4xl sm:text-5xl">
              ¿Para quién es el <em className="acento">regalo?</em>
            </h2>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-3 gap-3 sm:gap-6">
          {EDADES.map((e) => (
            <li key={e.id}>
              <Link href={`/coleccion/${e.id}`} className="group block">
                <div className={`arco relative aspect-[3/4] overflow-hidden lg:aspect-[6/5] ${e.fondo}`}>
                  <Ilustracion tipo={e.il} color={e.color} acento={e.acento} className="absolute inset-[16%_10%_8%] h-[76%] w-[80%] transition-transform duration-500 group-hover:-translate-y-2" />
                </div>
                <h3 className="mt-3 font-sans text-base font-extrabold tracking-normal sm:text-xl">{e.titulo}</h3>
                <p className="text-sm text-cacao-suave sm:text-base">{e.edad}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recién llegados */}
      <section aria-labelledby="titulo-nuevos" className="contenedor mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="sobretitulo">En tendencia</p>
            <h2 id="titulo-nuevos" className="mt-2 text-4xl sm:text-5xl">
              Recién <em className="acento">llegados</em>
            </h2>
          </div>
          <Link href="/tienda?orden=nuevos" className="enlace inline-flex min-h-11 items-center gap-2">
            Todos los productos <IconoFlecha tam={18} />
          </Link>
        </div>
        <div className="mt-8">
          <GrillaViva iniciales={CATALOGO} modo={{ tipo: "nuevos", n: 4 }} />
        </div>
      </section>

      {/* Banner secundario (editable en el panel) */}
      <section aria-label="Colección destacada" className="contenedor mt-24">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-lila px-6 py-12 sm:px-12 md:grid-cols-2 lg:px-16">
          <BannerSecundario />
          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <div className="arco absolute inset-0 bg-papel/70" />
            <Ilustracion tipo="vestido" color="#F7F0E3" acento="#E6D3B3" className="absolute inset-[14%_12%_6%] h-[80%] w-[76%]" />
          </div>
        </div>
      </section>

      {/* Para cada ocasión */}
      <section aria-labelledby="titulo-ocasion" className="contenedor mt-24">
        <p className="sobretitulo">Nuestras categorías</p>
        <h2 id="titulo-ocasion" className="mt-2 text-4xl sm:text-5xl">
          Para cada <em className="acento">ocasión</em>
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {OCASIONES.map((o) => {
            const c = CATEGORIAS.find((x) => x.id === o.id)!;
            return (
              <li key={o.id}>
                <Link href={`/coleccion/${o.id}`} className="tarjeta group flex items-center gap-4 p-4 hover:border-cacao/40">
                  <div className={`arco relative aspect-[3/4] w-24 shrink-0 overflow-hidden ${o.fondo}`}>
                    <Ilustracion tipo={o.il} color={o.color} acento={o.acento} className="absolute inset-[16%_8%_6%] h-[78%] w-[84%]" />
                  </div>
                  <div>
                    <h3 className="text-2xl">{c.nombre}</h3>
                    <p className="mt-1 text-sm text-cacao-suave">{c.descripcion}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Look */}
      <section aria-labelledby="titulo-look" className="contenedor mt-24">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-salvia md:aspect-square">
            <Ilustracion tipo="camisa" color="#EFE4D2" acento="#A7845F" className="absolute top-[6%] left-[22%] h-[52%] w-[56%]" />
            <Ilustracion tipo="short" color="#C3D2B8" acento="#8FA486" className="absolute top-[50%] left-[30%] h-[36%] w-[40%]" />
            <Ilustracion tipo="tenis" color="#BFD3EA" acento="#FFFDF9" className="absolute right-[6%] bottom-[4%] h-[22%] w-[30%]" />
          </div>
          <div>
            <p className="sobretitulo">Su look, su estilo</p>
            <h2 id="titulo-look" className="mt-2 text-4xl sm:text-5xl">
              Un domingo <em className="acento">fresquito</em>
            </h2>
            <p className="mt-4 max-w-md text-lg text-cacao-suave">Lino que respira, colores suaves y tenis que se ponen solos. Para la misa, el almuerzo donde la abuela o el parque.</p>
            <ul className="mt-6 divide-y divide-linea border-y border-linea">
              {productosLook.map((p) => (
                <li key={p.id}>
                  <Link href={`/producto/${p.slug}`} className="flex min-h-16 items-center justify-between gap-4 py-3 hover:bg-papel">
                    <span className="font-bold">{p.nombre}</span>
                    <span className="shrink-0">{pesos(p.precio)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section aria-labelledby="titulo-confianza" className="mt-24 bg-papel py-16">
        <div className="contenedor">
          <h2 id="titulo-confianza" className="max-w-2xl text-4xl sm:text-5xl">
            Te acompañamos mientras <em className="acento">crecen</em>
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: <IconoCamion tam={28} />, t: "Envíos a toda Colombia", d: "En Sabanalarga entregamos al día hábil siguiente. Sigue tu pedido paso a paso." },
              { i: <IconoChat tam={28} />, t: "Asesoría por WhatsApp", d: "¿Dudas con la talla? Te ayudamos a escoger antes de comprar." },
              { i: <IconoCandado tam={28} />, t: "Pagos seguros", d: "Paga con tarjeta, PSE o en efectivo al recibir tu pedido." },
              { i: <IconoUbicacion tam={28} />, t: "Tienda física", d: `Visítanos en el ${MARCA.direccion}, ${MARCA.ciudad}.` },
            ].map((b) => (
              <li key={b.t}>
                <span className="grid size-14 place-items-center rounded-full bg-rosa-nube text-rosa-hondo">{b.i}</span>
                <h3 className="mt-4 font-sans text-lg font-extrabold tracking-normal">{b.t}</h3>
                <p className="mt-1 text-cacao-suave">{b.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Historias destacadas de Instagram, como secciones */}
      <section aria-labelledby="titulo-historias" className="contenedor mt-24">
        <p className="sobretitulo">Conócenos</p>
        <h2 id="titulo-historias" className="mt-2 text-4xl sm:text-5xl">
          Un lugar creado con <em className="acento">amor</em>
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { href: "/plan-de-pago", t: "Plan de pago", d: "Separa tus prendas y págalas a tu ritmo.", fondo: "bg-rosa-nube" },
            { href: "/sonadores", t: "Soñadores", d: "Los pequeños que visten nuestros sueños.", fondo: "bg-lila" },
            { href: "/quienes-somos", t: "Quiénes somos", d: "La historia detrás de Pequeños Sueños.", fondo: "bg-salvia" },
          ].map((h) => (
            <li key={h.href}>
              <Link href={h.href} className={`group flex min-h-44 flex-col justify-between rounded-[2rem] p-7 ${h.fondo}`}>
                <h3 className="text-3xl">{h.t}</h3>
                <p className="mt-6 flex items-end justify-between gap-4">
                  <span>{h.d}</span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-papel transition-transform group-hover:translate-x-1">
                    <IconoFlecha tam={18} />
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Seguimiento */}
      <section aria-labelledby="titulo-seguimiento" className="contenedor mt-24">
        <div className="tarjeta grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div>
            <h2 id="titulo-seguimiento" className="text-3xl sm:text-4xl">
              ¿Dónde va tu <em className="acento">pedido?</em>
            </h2>
            <p className="mt-3 text-cacao-suave">Consulta el estado con tu número de pedido y tu correo, sin iniciar sesión.</p>
          </div>
          <FormConsultaPedido compacto />
        </div>
      </section>

      {/* Suscripción + Instagram */}
      <section aria-labelledby="titulo-suscripcion" className="contenedor mt-24">
        <div className="grid gap-10 rounded-[2.5rem] bg-durazno px-6 py-12 sm:px-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="titulo-suscripcion" className="text-4xl sm:text-5xl">
              Entérate <em className="acento">primero</em>
            </h2>
            <p className="mt-4 max-w-md text-lg">Novedades, tallas que vuelven y ofertas para quienes están suscritos. Solo te escribimos si lo autorizas.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={MARCA.instagramUrl} target="_blank" rel="noopener noreferrer" className="boton-sec">
                <IconoInstagram /> @{MARCA.instagram}
              </a>
              <a href={enlaceWhatsApp()} target="_blank" rel="noopener noreferrer" className="boton-sec">
                <IconoWhatsApp tam={22} /> {MARCA.whatsappVisible}
              </a>
            </div>
          </div>
          <FormSuscripcion />
        </div>
      </section>
    </>
  );
}
