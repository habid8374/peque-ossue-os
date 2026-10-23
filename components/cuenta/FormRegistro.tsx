"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Campo, CamposEntrega, CasillaAutorizacionDatos, CasillaCorreos, ErrorGeneral } from "@/components/Formularios";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import { rutaInternaSegura } from "@/lib/seguridad";
import type { NuevoCliente } from "@/lib/tipos";
import { validarEnServidor, type Errores } from "@/lib/validar";

export function FormRegistro() {
  const router = useRouter();
  const params = useSearchParams();
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    const locales: Errores = {};
    if (g("clave") !== g("confirmacion")) locales.confirmacion = "Las contraseñas no coinciden.";
    const datos = {
      nombre: g("nombre"),
      apellidos: g("apellidos"),
      cedula: g("cedula") || undefined,
      celular: g("celular"),
      correo: g("correo"),
      departamento: g("departamento"),
      ciudad: g("ciudad"),
      direccion: g("direccion"),
      complemento: g("complemento") || undefined,
      clave: g("clave"),
      autorizaDatos: f.get("autorizaDatos") === "on",
      autorizaCorreos: f.get("autorizaCorreos") === "on",
    };
    setEnviando(true);
    const v = await validarEnServidor<NuevoCliente>("/api/cuenta/validar", { tipo: "registro", datos });
    if (!v.ok || Object.keys(locales).length) {
      setErrores({ ...(v.ok ? {} : v.errores), ...locales });
      setEnviando(false);
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    try {
      // La ruta del servidor solo valida la contraseña (no la guarda); el repositorio demo guarda su hash.
      await repo().registrar({ ...v.datos, clave: datos.clave });
      router.push(rutaInternaSegura(params.get("siguiente"), "/cuenta"));
    } catch (err) {
      setErrores({ _: err instanceof ErrorRepositorio ? err.message : "No pudimos crear la cuenta." });
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-10">
      <ErrorGeneral errores={errores} />
      <fieldset className="space-y-4">
        <legend className="titulo mb-2 text-2xl">Tus datos</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nombre="nombre" etiqueta="Nombre" autoComplete="given-name" errores={errores} />
          <Campo nombre="apellidos" etiqueta="Apellidos" autoComplete="family-name" errores={errores} />
          <Campo nombre="cedula" etiqueta="Cédula" opcional inputMode="numeric" errores={errores} ayuda="Solo si quieres factura a tu nombre." />
          <Campo nombre="celular" etiqueta="Celular" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="300 123 4567" errores={errores} />
          <Campo nombre="correo" etiqueta="Correo" type="email" autoComplete="email" errores={errores} className="sm:col-span-2" />
        </div>
      </fieldset>
      <fieldset className="space-y-4">
        <legend className="titulo mb-2 text-2xl">Dirección de entrega</legend>
        <CamposEntrega errores={errores} />
      </fieldset>
      <fieldset className="space-y-4">
        <legend className="titulo mb-2 text-2xl">Contraseña</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nombre="clave" etiqueta="Contraseña" type="password" autoComplete="new-password" errores={errores} ayuda="Mínimo 8 caracteres." />
          <Campo nombre="confirmacion" etiqueta="Repite la contraseña" type="password" autoComplete="new-password" errores={errores} />
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="titulo mb-2 text-2xl">Autorizaciones</legend>
        <CasillaAutorizacionDatos errores={errores} />
        <CasillaCorreos />
      </fieldset>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? "Creando cuenta…" : "Crear mi cuenta"}
        </button>
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link href="/cuenta/ingresar" className="enlace">
            Inicia sesión
          </Link>
        </p>
      </div>
    </form>
  );
}
