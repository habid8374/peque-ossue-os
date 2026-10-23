"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { CLAVE_CONSULTA } from "@/lib/claves";

/** Consulta de pedido sin cuenta. El correo no viaja en la URL: se guarda en sessionStorage. */
export function FormConsultaPedido({ alConsultar, compacto = false }: { alConsultar?: (numero: string, correo: string) => void; compacto?: boolean }) {
  const id = useId();
  const router = useRouter();
  const [error, setError] = useState("");

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const numero = String(f.get("numero") ?? "").trim();
    const correo = String(f.get("correo") ?? "").trim();
    if (!/^(ps-?)?\d{5,}$/i.test(numero)) return setError("Escribe el número de pedido, por ejemplo PS-10180.");
    if (!/^\S+@\S+\.\S+$/.test(correo)) return setError("Escribe el correo con el que hiciste la compra.");
    setError("");
    if (alConsultar) return alConsultar(numero, correo);
    try {
      sessionStorage.setItem(CLAVE_CONSULTA, JSON.stringify({ numero, correo }));
    } catch {
      /* sin almacenamiento */
    }
    router.push("/seguimiento");
  }

  return (
    <form onSubmit={enviar} noValidate className={compacto ? "grid gap-3 sm:grid-cols-[1fr_1.3fr_auto] sm:items-end" : "space-y-4"}>
      <div>
        <label htmlFor={`${id}-n`} className="etiqueta-campo">
          Número de pedido
        </label>
        <input id={`${id}-n`} name="numero" className="campo" placeholder="PS-10180" autoComplete="off" aria-invalid={error.includes("número") || undefined} />
      </div>
      <div>
        <label htmlFor={`${id}-c`} className="etiqueta-campo">
          Correo de la compra
        </label>
        <input id={`${id}-c`} name="correo" type="email" className="campo" placeholder="tucorreo@ejemplo.com" autoComplete="email" aria-invalid={error.includes("correo") || undefined} />
      </div>
      <button type="submit" className="boton">
        Ver mi pedido
      </button>
      {error && (
        <p role="alert" className="error-campo sm:col-span-3">
          {error}
        </p>
      )}
    </form>
  );
}
