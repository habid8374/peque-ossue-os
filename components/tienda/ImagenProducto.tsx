import Image from "next/image";
import type { Producto } from "@/lib/tipos";
import { Ilustracion } from "./Ilustracion";

const FONDOS: Record<string, string> = {
  "recien-nacido": "bg-durazno",
  bebe: "bg-rosa-nube",
  ninos: "bg-salvia",
  bautizo: "bg-lila",
  calzado: "bg-durazno",
  accesorios: "bg-lila",
};

/** Ventana en arco con la foto del producto o su ilustración. */
export function ImagenProducto({
  producto,
  indice = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  prioridad = false,
  className = "",
}: {
  producto: Pick<Producto, "nombre" | "categoria" | "imagenes" | "ilustracion" | "color" | "acento" | "patron">;
  indice?: number;
  sizes?: string;
  prioridad?: boolean;
  className?: string;
}) {
  const src = producto.imagenes[indice];
  return (
    <div className={`arco relative aspect-[4/5] overflow-hidden ${FONDOS[producto.categoria] ?? "bg-rosa-nube"} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={producto.nombre}
          fill
          sizes={sizes}
          priority={prioridad}
          unoptimized={src.startsWith("data:")}
          className="object-cover"
        />
      ) : (
        <Ilustracion
          tipo={producto.ilustracion}
          color={producto.color.hex}
          acento={producto.acento}
          patron={producto.patron}
          titulo={`Ilustración: ${producto.nombre}`}
          className="absolute inset-[12%_8%_6%] h-[82%] w-[84%]"
        />
      )}
    </div>
  );
}
