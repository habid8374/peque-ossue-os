import { NextResponse } from "next/server";
import { z } from "zod";

const Esquema = z.object({
  correo: z.string().trim().toLowerCase().email("Escribe un correo válido.").max(160),
  autoriza: z.literal(true, { error: "Debes autorizar el envío de correos para suscribirte." }),
});

export async function POST(req: Request) {
  const cuerpo = await req.json().catch(() => null);
  const r = Esquema.safeParse(cuerpo);
  if (!r.success) {
    return NextResponse.json({ ok: false, error: r.error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 });
  }
  // Demo: la suscripción se guarda en el navegador (repositorio local).
  // Producción: guardar aquí en la base de datos con fecha y versión de la autorización.
  return NextResponse.json({ ok: true, correo: r.data.correo, autorizadoEn: new Date().toISOString() });
}
