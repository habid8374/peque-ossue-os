/** Aviso visible de contenido que falta confirmar con la tienda. TODO(CLIENTE) */
export function Pendiente({ children }: { children: React.ReactNode }) {
  return (
    <div data-todo="cliente" className="my-6 rounded-2xl border-2 border-dashed border-lila-hondo/50 bg-lila/50 px-5 py-4">
      <p className="text-xs font-extrabold tracking-[0.14em] text-lila-hondo uppercase">Próximamente</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function Prosa({ children }: { children: React.ReactNode }) {
  return <div className="prosa max-w-3xl space-y-5 text-lg leading-relaxed [&_h2]:mt-12 [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:tracking-normal [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>;
}
