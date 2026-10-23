import Image from "next/image";
import Link from "next/link";
import { MARCA } from "@/lib/marca";

export function Logo({ tam = 56, conTexto = true, href = "/" }: { tam?: number; conTexto?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-3 rounded-full" aria-label={`${MARCA.nombre}, ir al inicio`}>
      <Image
        src="/marca/logo-pequenos-suenos.webp"
        alt=""
        width={tam}
        height={tam}
        priority
        className="rounded-full"
        sizes={`${tam}px`}
      />
      {conTexto && (
        <span className="leading-none">
          <span className="titulo block text-[1.35rem] text-cacao sm:text-2xl lg:text-xl xl:text-2xl">Pequeños Sueños</span>
          <span className="mt-1 hidden text-[0.72rem] font-bold tracking-[0.12em] text-cacao-suave uppercase sm:block lg:hidden xl:block">Ropa infantil · Sabanalarga</span>
        </span>
      )}
    </Link>
  );
}
