"use client";

import Link from "next/link";
import { useState } from "react";
import { DEPARTAMENTOS } from "@/lib/marca";
import type { Errores } from "@/lib/validar";

type CampoProps = React.InputHTMLAttributes<HTMLInputElement> & {
  nombre: string;
  etiqueta: string;
  errores?: Errores;
  ayuda?: string;
  opcional?: boolean;
};

export function Campo({ nombre, etiqueta, errores, ayuda, opcional, className = "", ...rest }: CampoProps) {
  const id = `campo-${nombre.replace(/\./g, "-")}`;
  const error = errores?.[nombre];
  const describe = [error ? `${id}-error` : "", ayuda ? `${id}-ayuda` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta-campo">
        {etiqueta} {opcional && <span className="font-normal text-cacao-suave">(opcional)</span>}
      </label>
      <input id={id} name={nombre} className="campo" aria-invalid={error ? true : undefined} aria-describedby={describe} required={!opcional} {...rest} />
      {ayuda && (
        <p id={`${id}-ayuda`} className="mt-1 text-sm text-cacao-suave">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="error-campo">
          {error}
        </p>
      )}
    </div>
  );
}

export function CamposEntrega({
  prefijo = "",
  errores,
  inicial,
}: {
  prefijo?: string;
  errores?: Errores;
  inicial?: { departamento?: string; ciudad?: string; direccion?: string; complemento?: string };
}) {
  const [dep, setDep] = useState(inicial?.departamento ?? "Atlántico");
  const ciudades = DEPARTAMENTOS[dep] ?? [];
  const n = (c: string) => `${prefijo}${c}`;
  const id = (c: string) => `campo-${n(c).replace(/\./g, "-")}`;
  const err = (c: string) => errores?.[n(c)];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={id("departamento")} className="etiqueta-campo">
          Departamento
        </label>
        <select id={id("departamento")} name={n("departamento")} className="campo" value={dep} onChange={(e) => setDep(e.target.value)} aria-invalid={err("departamento") ? true : undefined} aria-describedby={err("departamento") ? `${id("departamento")}-error` : undefined}>
          {Object.keys(DEPARTAMENTOS).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {err("departamento") && (
          <p id={`${id("departamento")}-error`} role="alert" className="error-campo">
            {err("departamento")}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={id("ciudad")} className="etiqueta-campo">
          Ciudad o municipio
        </label>
        <select
          key={dep}
          id={id("ciudad")}
          name={n("ciudad")}
          className="campo"
          defaultValue={inicial?.departamento === dep ? inicial?.ciudad : ciudades[0]}
          aria-invalid={err("ciudad") ? true : undefined}
          aria-describedby={err("ciudad") ? `${id("ciudad")}-error` : undefined}
        >
          {ciudades.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {err("ciudad") && (
          <p id={`${id("ciudad")}-error`} role="alert" className="error-campo">
            {err("ciudad")}
          </p>
        )}
      </div>
      <Campo nombre={n("direccion")} etiqueta="Dirección" autoComplete="street-address" defaultValue={inicial?.direccion} errores={errores} placeholder="Calle 20 # 18-45" className="sm:col-span-2" />
      <Campo nombre={n("complemento")} etiqueta="Complemento" opcional autoComplete="address-line2" defaultValue={inicial?.complemento} errores={errores} placeholder="Barrio, apartamento, punto de referencia" className="sm:col-span-2" />
    </div>
  );
}

export function CasillaAutorizacionDatos({ errores, nombre = "autorizaDatos" }: { errores?: Errores; nombre?: string }) {
  const error = errores?.[nombre];
  return (
    <div>
      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input type="checkbox" name={nombre} className="mt-1 size-5 shrink-0 accent-rosa" aria-invalid={error ? true : undefined} aria-describedby={error ? `${nombre}-error` : undefined} />
        <span>
          <strong>Autorizo el tratamiento de mis datos personales</strong> para gestionar mis compras, envíos y mi cuenta, según la{" "}
          <Link href="/politica-de-datos" className="enlace" target="_blank">
            política de tratamiento de datos
          </Link>{" "}
          (Ley 1581 de 2012). <span className="text-cacao-suave">Obligatoria.</span>
        </span>
      </label>
      {error && (
        <p id={`${nombre}-error`} role="alert" className="error-campo">
          {error}
        </p>
      )}
    </div>
  );
}

export function CasillaCorreos({ inicial = false }: { inicial?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3">
      <input type="checkbox" name="autorizaCorreos" defaultChecked={inicial} className="mt-1 size-5 shrink-0 accent-rosa" />
      <span>
        <strong>Quiero recibir correos</strong> con novedades, ofertas y campañas de Pequeños Sueños. <span className="text-cacao-suave">Opcional; puedo cancelarlo cuando quiera.</span>
      </span>
    </label>
  );
}

export function ErrorGeneral({ errores }: { errores: Errores }) {
  const n = Object.keys(errores).length;
  if (!n) return null;
  return (
    <div role="alert" className="rounded-2xl border-[1.5px] border-alerta bg-[#FBEDEC] px-4 py-3 font-bold text-alerta">
      {errores._ ?? (n === 1 ? "Revisa el campo marcado." : `Revisa los ${n} campos marcados.`)}
    </div>
  );
}
