import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { Pendiente, Prosa } from "@/components/tienda/Pendiente";
import { MARCA, VERSION_POLITICA } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description: "Cómo Pequeños Sueños recolecta, usa y protege tus datos personales, según la Ley 1581 de 2012.",
  alternates: { canonical: "/politica-de-datos" },
};

export default function PoliticaDatos() {
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Política de datos" }]} titulo="Política de tratamiento de datos personales" texto={`Versión ${VERSION_POLITICA}.`} />
      <div className="contenedor">
        <Prosa>
          <div role="note" className="rounded-2xl border-2 border-alerta/60 bg-[#FBEDEC] px-5 py-4">
            <p className="font-extrabold text-alerta">Plantilla pendiente de revisión legal.</p>
            <p className="mt-1">Este texto es un modelo basado en la Ley 1581 de 2012 y el Decreto 1074 de 2015. Debe revisarlo un abogado y completarse con los datos del responsable antes de publicar la tienda.</p>
          </div>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            {MARCA.nombre}, con domicilio en {MARCA.direccion}, {MARCA.ciudad}, {MARCA.departamento}. WhatsApp: {MARCA.whatsappVisible}.
          </p>
          {/* TODO(CLIENTE): razón social o nombre del titular, NIT o cédula, correo para peticiones de datos. */}
          <Pendiente>
            <p>Razón social o nombre del titular del negocio, NIT o cédula, y correo electrónico para consultas y reclamos sobre datos personales.</p>
          </Pendiente>

          <h2>2. Datos que recolectamos</h2>
          <ul>
            <li>Identificación y contacto: nombre, apellidos, cédula (opcional), celular y correo.</li>
            <li>Datos de entrega: departamento, ciudad, dirección y complemento.</li>
            <li>Historial de compras y preferencias (favoritos, tallas consultadas).</li>
          </ul>
          <p>No pedimos ni guardamos datos de tarjetas: los pagos los procesa directamente la pasarela de pagos.</p>
          <p>No recolectamos datos de los niños. Las tallas y edades que nos cuentas solo sirven para asesorarte.</p>

          <h2>3. Finalidades</h2>
          <ul>
            <li>Gestionar tu cuenta, tus pedidos, envíos, cambios y garantías.</li>
            <li>Contactarte sobre el estado de tus compras.</li>
            <li>Cumplir obligaciones legales, contables y tributarias.</li>
            <li>
              <strong>Solo si lo autorizas por separado:</strong> enviarte correos con novedades, ofertas y campañas. Puedes retirar esta autorización en cualquier momento desde tu cuenta o pidiéndolo por WhatsApp.
            </li>
          </ul>

          <h2>4. Tus derechos</h2>
          <p>Como titular de los datos puedes:</p>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos.</li>
            <li>Pedir prueba de la autorización que nos diste.</li>
            <li>Ser informado sobre el uso que les damos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
            <li>Revocar la autorización o pedir que suprimamos tus datos cuando no exista un deber legal de conservarlos.</li>
            <li>Acceder gratuitamente a tus datos.</li>
          </ul>

          <h2>5. Consultas y reclamos</h2>
          <p>Las consultas se responden en un máximo de diez (10) días hábiles, prorrogables por cinco (5) más. Los reclamos se atienden en un máximo de quince (15) días hábiles, prorrogables por ocho (8) más, según la ley.</p>

          <h2>6. Seguridad y encargados</h2>
          <p>Protegemos tus datos con medidas técnicas razonables. Pueden tratarlos, por cuenta nuestra, proveedores de alojamiento web, pasarela de pagos, transportadoras y correo electrónico, solo para las finalidades descritas.</p>

          <h2>7. Vigencia</h2>
          <p>Esta política rige desde su publicación. Los datos se conservan mientras sean necesarios para las finalidades descritas o lo exija la ley.</p>
        </Prosa>
      </div>
    </>
  );
}
