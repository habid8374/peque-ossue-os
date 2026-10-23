import type { Configuracion } from "./tipos";

export const CUENTA_DEMO = { correo: "demo@correo-demo.co", clave: "demo1234" };

export const CONFIG_INICIAL: Configuracion = {
  // TODO(CLIENTE): valores reales de envío gratis y tarifa.
  envioGratisDesde: 200000,
  costoEnvio: 12000,
  // TODO(CLIENTE): confirmar con qué transportadoras trabaja la tienda.
  transportadoras: ["Mensajero local", "Interrapidísimo", "Servientrega", "Coordinadora", "Envía"],
  anuncio: "Envíos a toda Colombia · Asesoría por WhatsApp",
  banners: [
    {
      titulo: "Ropa suave para sueños grandes",
      texto: "Prendas escogidas una a una para bebés y niños, desde el primer body hasta el vestido del cumpleaños.",
      boton: "Ver la colección",
      enlace: "/tienda",
    },
    {
      titulo: "El día del bautizo, en marfil",
      texto: "Vestidos, conjuntos de lino y mantas para un día que se recuerda siempre.",
      boton: "Ver bautizo",
      enlace: "/coleccion/bautizo",
    },
  ],
};
