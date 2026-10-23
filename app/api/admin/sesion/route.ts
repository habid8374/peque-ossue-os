import { NextResponse } from "next/server";
import { z } from "zod";
import { COOKIE_ADMIN, claveCorrecta, crearToken } from "@/lib/sesion-admin";

const Esquema = z.object({ clave: z.string().min(1, "Escribe la contraseña.").max(200) });

export async function POST(req: Request) {
  const r = Esquema.safeParse(await req.json().catch(() => null));
  if (!r.success) return NextResponse.json({ ok: false, error: r.error.issues[0]?.message }, { status: 400 });
  if (!claveCorrecta(r.data.clave)) {
    await new Promise((res) => setTimeout(res, 600));
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta." }, { status: 401 });
  }
  const { token, vence } = await crearToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(vence),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
