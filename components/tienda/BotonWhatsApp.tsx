import { IconoWhatsApp } from "@/components/Iconos";
import { enlaceWhatsApp } from "@/lib/marca";

/** Botón flotante. Sube cuando la página tiene barra fija inferior (clase `con-barra` en <body>). */
export function BotonWhatsApp() {
  return (
    <a
      href={enlaceWhatsApp("Hola, Pequeños Sueños. Vi la tienda en línea y quiero información.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="boton-whatsapp fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-[#1E7E4A] text-white shadow-[0_8px_24px_-8px_rgba(74,52,56,0.55)] transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <IconoWhatsApp tam={30} />
    </a>
  );
}
