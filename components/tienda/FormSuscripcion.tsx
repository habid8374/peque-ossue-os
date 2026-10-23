"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { repo } from "@/lib/repositorio";

export function FormSuscripcion({ oscuro = false }: { oscuro?: boolean }) {
  const id = useId();
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const correo = String(f.get("correo") ?? "");
    const autoriza = f.get("autoriza") === "on";
    setEstado("enviando");
    setError("");
    try {
      const r = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, autoriza }),
      });
      const datos = (await r.json()) as { ok: boolean; error?: string };
      if (!r.ok || !datos.ok) throw new Error(datos.error ?? "No pudimos registrar tu correo.");
      await repo().suscribir(correo);
      setEstado("ok");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "No pudimos registrar tu correo.");
    }
  }

  if (estado === "ok") {
    return (
      <p role="status" className={`rounded-2xl px-4 py-3 font-bold ${oscuro ? "bg-crema/10" : "bg-salvia"}`}>
        ¡Listo! Te contaremos primero de las novedades y ofertas.
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-3">
      <div className={`flex flex-col gap-2 ${oscuro ? "" : "sm:flex-row"}`}>
        <label htmlFor={`${id}-correo`} className="sr-only">
          Tu correo
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          required
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          className="campo"
          aria-invalid={estado === "error" ? true : undefined}
          aria-describedby={estado === "error" ? `${id}-error` : undefined}
        />
        <button type="submit" className="boton shrink-0" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      <label className="flex min-h-11 items-start gap-3 text-sm">
        <input type="checkbox" name="autoriza" className="mt-1 size-5 shrink-0 accent-rosa" />
        <span>
          Autorizo recibir correos con novedades y ofertas, y el tratamiento de mi correo según la{" "}
          <Link href="/politica-de-datos" className={oscuro ? "font-bold underline underline-offset-2" : "enlace"}>
            política de datos
          </Link>
          . Puedo darme de baja cuando quiera.
        </span>
      </label>
      {estado === "error" && (
        <p id={`${id}-error`} role="alert" className={oscuro ? "font-bold text-durazno" : "error-campo"}>
          {error}
        </p>
      )}
    </form>
  );
}
