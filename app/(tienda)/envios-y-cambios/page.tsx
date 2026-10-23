import type { Metadata } from "next";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { Pendiente, Prosa } from "@/components/tienda/Pendiente";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Envíos, cambios y preguntas frecuentes",
  description: "Cómo enviamos los pedidos, cuánto tardan, cómo hacer cambios y respuestas a las preguntas más comunes.",
  alternates: { canonical: "/envios-y-cambios" },
};

const PREGUNTAS = [
  { p: "¿Hacen envíos fuera de Sabanalarga?", r: "Sí, enviamos a toda Colombia. En Sabanalarga entregamos con mensajero propio." },
  { p: "¿Cómo sé qué talla escoger?", r: "Escríbenos por WhatsApp con la edad, el peso o la estatura del niño y te ayudamos a escoger." },
  { p: "¿Puedo seguir mi pedido?", r: "Sí. Con tu número de pedido y tu correo lo consultas en “Seguir mi pedido”, sin necesidad de cuenta." },
  { p: "¿Puedo cancelar un pedido?", r: "Sí, mientras no haya salido de la tienda. Lo haces desde el seguimiento del pedido o desde tu cuenta." },
];

export default function EnviosYCambios() {
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Envíos y cambios" }]} titulo="Envíos, cambios y preguntas" />
      <div className="contenedor">
        <Prosa>
          <h2>Envíos</h2>
          <ul>
            <li>Sabanalarga: mensajero local, normalmente al día hábil siguiente.</li>
            <li>Resto del Atlántico: 2 días hábiles aproximadamente.</li>
            <li>Costa Caribe: 3 días hábiles. Resto del país: 5 días hábiles.</li>
          </ul>
          {/* TODO(CLIENTE): tarifas reales, monto de envío gratis y transportadoras. */}
          <Pendiente>
            <p>Los tiempos, tarifas, el monto para envío gratis y las transportadoras de esta demo son de ejemplo y se configuran desde el panel cuando la tienda los confirme.</p>
          </Pendiente>
          <h2>Cambios y devoluciones</h2>
          {/* TODO(CLIENTE): política de cambios (plazo, estado de la prenda, quién paga el envío). */}
          <Pendiente>
            <p>La política de cambios (plazo, condiciones de la prenda y costo del envío) se define con la tienda. Mientras tanto, escríbenos por WhatsApp al {MARCA.whatsappVisible}.</p>
          </Pendiente>
          <p>
            Recuerda que, según el Estatuto del Consumidor (Ley 1480 de 2011), en las compras a distancia tienes derecho de retracto dentro de los cinco días hábiles siguientes a la entrega, con las excepciones de ley.
          </p>
          <h2 id="preguntas">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {PREGUNTAS.map((q) => (
              <details key={q.p} className="tarjeta group px-5 py-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {q.p}
                  <span aria-hidden="true" className="text-2xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-4">{q.r}</p>
              </details>
            ))}
          </div>
          <p>
            ¿Otra pregunta? <Link href="/seguimiento" className="enlace">Sigue tu pedido</Link> o escríbenos por WhatsApp.
          </p>
        </Prosa>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: PREGUNTAS.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
