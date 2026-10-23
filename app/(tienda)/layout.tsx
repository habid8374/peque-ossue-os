import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Cabecera } from "@/components/tienda/Cabecera";
import { Pie } from "@/components/tienda/Pie";

export default function LayoutTienda({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-cacao focus:px-5 focus:py-3 focus:text-white">
        Saltar al contenido
      </a>
      <Cabecera />
      <main id="contenido" className="min-h-[60vh]">
        {children}
      </main>
      <Pie />
      <BotonWhatsApp />
    </>
  );
}
