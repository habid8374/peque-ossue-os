import { NextResponse } from "next/server";
import { erroresPorCampo, pedido } from "@/lib/esquemas";

// Valida y normaliza los datos del checkout. En la demo el pedido se guarda luego
// en el navegador; en producción esta ruta lo crearía en la base de datos y
// iniciaría el pago con la pasarela (Wompi, ePayco o Mercado Pago).
export async function POST(req: Request) {
  const r = pedido.safeParse(await req.json().catch(() => null));
  if (!r.success) return NextResponse.json({ ok: false, errores: erroresPorCampo(r.error) }, { status: 422 });
  return NextResponse.json({ ok: true, datos: r.data });
}
