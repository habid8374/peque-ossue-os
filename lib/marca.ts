import type { CategoriaId, EstadoPedido, MetodoPago } from "./tipos";

export const MARCA = {
  nombre: "Pequeños Sueños",
  lema: "Donde vestir también es soñar.",
  descripcion:
    "Tienda de ropa infantil y para bebés en Sabanalarga, Atlántico. Un lugar creado con amor para vestir a los más pequeños.",
  instagram: "pequeno_suenos.co",
  instagramUrl: "https://www.instagram.com/pequeno_suenos.co/",
  whatsappVisible: "310 453 8375",
  whatsappNumero: "573104538375",
  telefono: "+573104538375",
  direccion: "Cc San Miguel, segundo piso",
  ciudad: "Sabanalarga",
  departamento: "Atlántico",
  pais: "CO",
  // TODO(CLIENTE): correo de atención, horario y razón social (ver PENDIENTES.md).
  correo: null as string | null,
  horario: null as string | null,
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pequenos-suenos.vercel.app").replace(/\/$/, "");

export function enlaceWhatsApp(mensaje?: string) {
  const base = `https://wa.me/${MARCA.whatsappNumero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  corto: string;
  edad: string;
  descripcion: string;
  tono: "rosa" | "lila" | "salvia" | "durazno";
}

export const CATEGORIAS: Categoria[] = [
  { id: "recien-nacido", nombre: "Recién nacido", corto: "Recién nacido", edad: "0 a 3 meses", descripcion: "Bodies, mamelucos y ajuares suaves para la llegada a casa.", tono: "durazno" },
  { id: "bebe", nombre: "Bebé", corto: "Bebé", edad: "3 a 24 meses", descripcion: "Jardineras, vestidos y conjuntos para gatear, jugar y descubrir.", tono: "rosa" },
  { id: "ninos", nombre: "Niños y niñas", corto: "Niños", edad: "2 a 12 años", descripcion: "Camisas, vestidos y conjuntos frescos para el calor del Caribe.", tono: "salvia" },
  { id: "bautizo", nombre: "Bautizo", corto: "Bautizo", edad: "Ocasión especial", descripcion: "Prendas en tonos marfil para un día que se recuerda siempre.", tono: "lila" },
  { id: "calzado", nombre: "Calzado", corto: "Calzado", edad: "Primeros pasos y más", descripcion: "Baletas, tenis y sandalias cómodas para pies que crecen.", tono: "durazno" },
  { id: "accesorios", nombre: "Accesorios", corto: "Accesorios", edad: "Para completar el look", descripcion: "Balacas, baberos y mantas que hacen la diferencia.", tono: "lila" },
];

export function categoriaPorId(id: string) {
  return CATEGORIAS.find((c) => c.id === id);
}

export const ETAPAS: { estado: EstadoPedido; nombre: string; detalle: string }[] = [
  { estado: "recibido", nombre: "Recibido", detalle: "Tu pedido llegó a la tienda." },
  { estado: "pagado", nombre: "Pagado", detalle: "Confirmamos tu pago." },
  { estado: "preparando", nombre: "Preparando", detalle: "Estamos empacando tu pedido con cariño." },
  { estado: "enviado", nombre: "Enviado", detalle: "Lo entregamos a la transportadora." },
  { estado: "en_reparto", nombre: "En reparto", detalle: "Va camino a tu dirección." },
  { estado: "entregado", nombre: "Entregado", detalle: "¡Llegó! Que lo disfruten." },
];

export const NOMBRE_ESTADO: Record<EstadoPedido, string> = {
  recibido: "Recibido",
  pagado: "Pagado",
  preparando: "Preparando",
  enviado: "Enviado",
  en_reparto: "En reparto",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ESTADOS_CANCELABLES: EstadoPedido[] = ["recibido", "pagado", "preparando"];

export const NOMBRE_PAGO: Record<MetodoPago, string> = {
  tarjeta: "Tarjeta",
  pse: "PSE",
  contraentrega: "Contraentrega",
};

export const DEPARTAMENTOS: Record<string, string[]> = {
  Atlántico: ["Sabanalarga", "Barranquilla", "Soledad", "Malambo", "Baranoa", "Puerto Colombia", "Galapa", "Campo de la Cruz", "Repelón", "Luruaco", "Manatí", "Ponedera", "Polonuevo", "Sabanagrande", "Santo Tomás", "Palmar de Varela", "Candelaria", "Usiacurí", "Juan de Acosta", "Tubará", "Piojó", "Santa Lucía", "Suan"],
  Bolívar: ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"],
  Magdalena: ["Santa Marta", "Ciénaga", "Fundación", "El Banco"],
  Cesar: ["Valledupar", "Aguachica", "Bosconia"],
  Córdoba: ["Montería", "Lorica", "Cereté", "Sahagún"],
  Sucre: ["Sincelejo", "Corozal", "Tolú"],
  "La Guajira": ["Riohacha", "Maicao"],
  Antioquia: ["Medellín", "Bello", "Envigado", "Itagüí"],
  "Bogotá D.C.": ["Bogotá"],
  Cundinamarca: ["Soacha", "Chía", "Zipaquirá"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
  Santander: ["Bucaramanga", "Floridablanca"],
};

export const VERSION_POLITICA = "2026-10 (plantilla)";
