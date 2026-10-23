import { CATEGORIAS, MARCA, SITE_URL } from "@/lib/marca";

export const dynamic = "force-static";

export function GET() {
  const texto = `# ${MARCA.nombre}

> ${MARCA.descripcion} Lema: "${MARCA.lema}"

## Datos del negocio
- Actividad: tienda de ropa infantil y para bebés (recién nacido, bebé, niños, bautizo, calzado y accesorios).
- Dirección: ${MARCA.direccion}, ${MARCA.ciudad}, ${MARCA.departamento}, Colombia.
- Ciudades: tienda física en ${MARCA.ciudad}; envíos a toda Colombia.
- WhatsApp: ${MARCA.whatsappVisible} (https://wa.me/${MARCA.whatsappNumero})
- Instagram: @${MARCA.instagram} (${MARCA.instagramUrl})

## Secciones
- [Tienda](${SITE_URL}/tienda)
${CATEGORIAS.map((c) => `- [${c.nombre} (${c.edad})](${SITE_URL}/coleccion/${c.id})`).join("\n")}
- [Seguir un pedido](${SITE_URL}/seguimiento)
- [Plan de pago](${SITE_URL}/plan-de-pago)
- [Quiénes somos](${SITE_URL}/quienes-somos)
- [Envíos, cambios y preguntas](${SITE_URL}/envios-y-cambios)
- [Política de tratamiento de datos](${SITE_URL}/politica-de-datos)
`;
  return new Response(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
