import Link from "next/link";

export function Migas({ items }: { items: { href?: string; nombre: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-cacao-suave">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link href={it.href} className="inline-flex min-h-11 items-center hover:underline">
                {it.nombre}
              </Link>
            ) : (
              <span aria-current="page" className="font-bold text-cacao">
                {it.nombre}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EncabezadoPagina({ sobretitulo, titulo, texto, migas }: { sobretitulo?: string; titulo: React.ReactNode; texto?: React.ReactNode; migas?: { href?: string; nombre: string }[] }) {
  return (
    <div className="contenedor pt-6 pb-8 md:pt-8 md:pb-12">
      {migas && <Migas items={migas} />}
      {sobretitulo && <p className="sobretitulo mt-4">{sobretitulo}</p>}
      <h1 className="mt-2 text-[2.4rem] sm:text-5xl lg:text-6xl">{titulo}</h1>
      {texto && <div className="mt-4 max-w-2xl text-lg text-cacao-suave">{texto}</div>}
    </div>
  );
}
