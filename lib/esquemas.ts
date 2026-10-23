import { z } from "zod";
import { DEPARTAMENTOS } from "./marca";

const texto = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, "Es demasiado largo.");

export const celular = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^\+?57/, ""))
  .refine((v) => /^3\d{9}$/.test(v), "Escribe un celular colombiano de 10 dígitos (empieza por 3).")
  .transform((v) => `${v.slice(0, 3)} ${v.slice(3, 6)} ${v.slice(6)}`);

const cedula = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/[.\s]/g, "") : undefined))
  .refine((v) => !v || /^\d{5,11}$/.test(v), "La cédula debe tener solo números (5 a 11 dígitos).");

export const entrega = z
  .object({
    departamento: z.string().refine((d) => d in DEPARTAMENTOS, "Elige un departamento."),
    ciudad: texto(2, 60, "Elige la ciudad."),
    direccion: texto(5, 120, "Escribe la dirección de entrega."),
    complemento: z.string().trim().max(120, "Es demasiado largo.").optional(),
  })
  .refine((d) => DEPARTAMENTOS[d.departamento]?.includes(d.ciudad), { message: "Elige una ciudad de la lista.", path: ["ciudad"] });

export const contacto = z.object({
  nombre: texto(2, 60, "Escribe tu nombre."),
  apellidos: texto(2, 80, "Escribe tus apellidos."),
  correo: z.string().trim().toLowerCase().email("Escribe un correo válido.").max(160),
  celular,
  cedula,
});

export const registro = z
  .object({
    clave: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(100),
    autorizaDatos: z.literal(true, { error: "Debes autorizar el tratamiento de datos para crear la cuenta." }),
    autorizaCorreos: z.boolean(),
  })
  .and(contacto)
  .and(entrega);

export const pedido = z
  .object({
    contacto,
    envio: entrega,
    metodoPago: z.enum(["tarjeta", "pse", "contraentrega"], { error: "Elige un método de pago." }),
    autorizaDatos: z.literal(true, { error: "Debes autorizar el tratamiento de datos para hacer el pedido." }),
    items: z
      .array(z.object({ productoId: z.string().min(1).max(40), talla: z.string().min(1).max(20), cantidad: z.number().int().min(1).max(20) }))
      .min(1, "Tu carrito está vacío.")
      .max(50),
  });

/** Convierte los errores de Zod en { "contacto.nombre": "mensaje" }. */
export function erroresPorCampo(error: z.ZodError) {
  const salida: Record<string, string> = {};
  for (const i of error.issues) {
    const clave = i.path.join(".") || "_";
    if (!salida[clave]) salida[clave] = i.message;
  }
  return salida;
}
