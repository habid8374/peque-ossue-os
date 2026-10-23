import type { Metadata } from "next";
import { IconoWhatsApp } from "@/components/Iconos";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { Pendiente, Prosa } from "@/components/tienda/Pendiente";
import { enlaceWhatsApp } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Plan de pago",
  description: "Separa las prendas de Pequeños Sueños y págalas por partes. Pregunta las condiciones por WhatsApp.",
  alternates: { canonical: "/plan-de-pago" },
};

export default function PlanDePago() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Plan de pago" }]}
        sobretitulo="De nuestras historias destacadas"
        titulo={
          <>
            Plan de <em className="acento">pago</em>
          </>
        }
        texto="Sabemos que vestir a los pequeños es una inversión. Por eso en la tienda tenemos un plan de pago para que separes lo que te gusta y lo pagues a tu ritmo."
      />
      <div className="contenedor">
        <Prosa>
          {/* TODO(CLIENTE): condiciones reales del plan de pago (abono inicial, plazos, tiempo de separado, si aplica a ofertas). */}
          <Pendiente>
            <p>Muy pronto publicaremos aquí las condiciones del plan de pago: abono inicial, cuotas y tiempo para recoger tus prendas. Mientras tanto, pregúntanos por WhatsApp.</p>
          </Pendiente>
          <h2>¿Cómo funciona?</h2>
          <ul>
            <li>Escoge las prendas en la tienda en línea o en el Cc San Miguel.</li>
            <li>Escríbenos por WhatsApp con las referencias y tallas.</li>
            <li>Te explicamos las condiciones del plan y acordamos los pagos.</li>
          </ul>
          <a href={enlaceWhatsApp("Hola, Pequeños Sueños. Quiero información sobre el plan de pago.")} target="_blank" rel="noopener noreferrer" className="boton not-prose mt-4">
            <IconoWhatsApp tam={22} /> Preguntar por el plan de pago
          </a>
        </Prosa>
      </div>
    </>
  );
}
