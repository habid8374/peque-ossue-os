import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { COOKIE_ADMIN, tokenValido } from "@/lib/sesion-admin";

const Esquema = z.object({
  asunto: z.string().trim().min(3, "El asunto es muy corto.").max(120),
  contenido: z.string().trim().min(10, "Escribe el mensaje de la campaña.").max(5000),
  segmento: z.enum(["todos", "compradores", "sin_compra"]),
  destinatarios: z.array(z.string().email()).max(5000),
});

/**
 * Envío de campañas. En la demo SIEMPRE es simulado.
 *
 * Punto de integración con Resend (producción):
 *   1. Autenticación real de administradores en el servidor (no la contraseña de demo).
 *   2. Leer los destinatarios desde la base de datos (solo clientes con
 *      `autorizaCorreos = true`), nunca desde el navegador.
 *   3. Enviar con `fetch("https://api.resend.com/emails", { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } })`
 *      o el SDK `resend`, en lotes, con enlace de baja en cada correo.
 */
export async function POST(req: Request) {
  const jar = await cookies();
  if (!(await tokenValido(jar.get(COOKIE_ADMIN)?.value))) {
    return NextResponse.json({ ok: false, error: "Sesión de administrador no válida." }, { status: 401 });
  }
  const r = Esquema.safeParse(await req.json().catch(() => null));
  if (!r.success) return NextResponse.json({ ok: false, error: r.error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 });

  return NextResponse.json({
    ok: true,
    simulado: true,
    enviados: r.data.destinatarios.length,
    mensaje: "Envío simulado: en la demo no se envían correos reales.",
  });
}
