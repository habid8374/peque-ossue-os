import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NoEncontrado() {
  return (
    <main className="contenedor grid min-h-dvh place-items-center py-16 text-center">
      <div>
        <Logo tam={96} conTexto={false} />
        <h1 className="mt-6 text-5xl">
          Esta página se fue a <em className="acento">soñar</em>
        </h1>
        <p className="mt-4 text-lg text-cacao-suave">No encontramos lo que buscabas.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="boton">
            Ir al inicio
          </Link>
          <Link href="/tienda" className="boton-sec">
            Ver la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
