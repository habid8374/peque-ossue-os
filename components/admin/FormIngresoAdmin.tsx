"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Campo } from "@/components/Formularios";
import { rutaInternaSegura } from "@/lib/seguridad";

export function FormIngresoAdmin() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    const clave = String(new FormData(e.currentTarget).get("clave") ?? "");
    const r = await fetch("/api/admin/sesion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave }) });
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!r.ok || !j.ok) {
      setError(j.error ?? "No se pudo ingresar.");
      setEnviando(false);
      return;
    }
    const destino = rutaInternaSegura(params.get("siguiente"), "/admin");
    router.replace(destino.startsWith("/admin") ? destino : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-4">
      <Campo nombre="clave" etiqueta="Contraseña" type="password" autoComplete="current-password" errores={error ? { clave: error } : undefined} />
      <button type="submit" className="boton w-full" disabled={enviando}>
        {enviando ? "Ingresando…" : "Ingresar"}
      </button>
      <p className="text-sm text-cacao-suave">La contraseña de la demo se configura con la variable de entorno ADMIN_DEMO_PASSWORD.</p>
    </form>
  );
}
