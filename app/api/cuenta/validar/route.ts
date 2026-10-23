import { NextResponse } from "next/server";
import { z } from "zod";
import { entrega, erroresPorCampo, registro, celular } from "@/lib/esquemas";

const actualizacion = z.object({ celular, autorizaCorreos: z.boolean() }).and(entrega);

// Valida registro y edición de datos. La contraseña nunca se guarda en el servidor
// en la demo; en producción esta ruta crearía el usuario en el proveedor de autenticación.
export async function POST(req: Request) {
  const cuerpo = (await req.json().catch(() => null)) as { tipo?: string; datos?: unknown } | null;
  const esquema = cuerpo?.tipo === "actualizacion" ? actualizacion : registro;
  const r = esquema.safeParse(cuerpo?.datos);
  if (!r.success) return NextResponse.json({ ok: false, errores: erroresPorCampo(r.error) }, { status: 422 });
  return NextResponse.json({ ok: true, datos: r.data });
}
