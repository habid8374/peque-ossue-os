"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Campo } from "@/components/Formularios";
import { CUENTA_DEMO } from "@/lib/config-inicial";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import { rutaInternaSegura } from "@/lib/seguridad";

export function FormIngreso() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError("");
    try {
      await repo().iniciarSesion(String(f.get("correo") ?? ""), String(f.get("clave") ?? ""));
      router.push(rutaInternaSegura(params.get("siguiente"), "/cuenta"));
    } catch (err) {
      setError(err instanceof ErrorRepositorio ? err.message : "No pudimos iniciar sesión.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <Campo nombre="correo" etiqueta="Correo" type="email" autoComplete="email" />
      <Campo nombre="clave" etiqueta="Contraseña" type="password" autoComplete="current-password" />
      {error && (
        <p role="alert" className="error-campo">
          {error}
        </p>
      )}
      <button type="submit" className="boton w-full" disabled={enviando}>
        {enviando ? "Entrando…" : "Iniciar sesión"}
      </button>
      <p className="text-center">
        ¿No tienes cuenta?{" "}
        <Link href={`/cuenta/registro${params.get("siguiente") ? `?siguiente=${encodeURIComponent(rutaInternaSegura(params.get("siguiente")))}` : ""}`} className="enlace">
          Regístrate
        </Link>
      </p>
      <div role="note" className="rounded-2xl bg-lila px-4 py-3 text-sm">
        <strong>Cuenta de prueba:</strong> {CUENTA_DEMO.correo} / {CUENTA_DEMO.clave}
      </div>
    </form>
  );
}
