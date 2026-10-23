export type CategoriaId = "recien-nacido" | "bebe" | "ninos" | "bautizo" | "calzado" | "accesorios";

export type Etiqueta = "nuevo" | "oferta";

export type Ilustracion =
  | "body"
  | "mameluco"
  | "ajuar"
  | "gorro"
  | "jardinera"
  | "vestido"
  | "conjunto"
  | "pijama"
  | "camisa"
  | "polo"
  | "short"
  | "deportivo"
  | "zapato"
  | "tenis"
  | "sandalia"
  | "balaca"
  | "babero"
  | "manta";

export type Patron = "liso" | "rayas" | "cuadros" | "estrellas" | "puntos";

export interface TallaStock {
  talla: string;
  existencias: number;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  categoria: CategoriaId;
  precio: number;
  precioAnterior?: number;
  tallas: TallaStock[];
  etiquetas: Etiqueta[];
  descripcion: string;
  detalles: string[];
  color: { nombre: string; hex: string };
  acento?: string;
  patron: Patron;
  ilustracion: Ilustracion;
  /** Rutas internas (/productos/...) o data URL subidas desde el panel. Vacío = ilustración. */
  imagenes: string[];
  creado: string;
}

export type EstadoPedido =
  | "recibido"
  | "pagado"
  | "preparando"
  | "enviado"
  | "en_reparto"
  | "entregado"
  | "cancelado";

export type MetodoPago = "tarjeta" | "pse" | "contraentrega";

export interface EventoPedido {
  estado: EstadoPedido;
  fecha: string;
  nota?: string;
}

export interface ItemPedido {
  productoId: string;
  slug: string;
  nombre: string;
  categoria: CategoriaId;
  talla: string;
  cantidad: number;
  precio: number;
}

export interface DatosEntrega {
  departamento: string;
  ciudad: string;
  direccion: string;
  complemento?: string;
}

export interface Pedido {
  id: string;
  numero: string;
  clienteId?: string;
  contacto: { nombre: string; apellidos: string; correo: string; celular: string; cedula?: string };
  envio: DatosEntrega;
  items: ItemPedido[];
  subtotal: number;
  costoEnvio: number;
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoPedido;
  historial: EventoPedido[];
  transportadora?: string;
  guia?: string;
  notaCliente?: string;
  fechaEstimada: string;
  creado: string;
}

export interface Cliente extends DatosEntrega {
  id: string;
  nombre: string;
  apellidos: string;
  cedula?: string;
  celular: string;
  correo: string;
  /** Hash SHA-256 con sal. Solo demo: en producción la autenticación va en el servidor. */
  claveHash: string;
  sal: string;
  autorizaDatos: { fecha: string; version: string };
  autorizaCorreos: boolean;
  fechaAutorizaCorreos?: string;
  creado: string;
}

export interface Banner {
  titulo: string;
  texto: string;
  boton: string;
  enlace: string;
}

export interface Configuracion {
  envioGratisDesde: number;
  costoEnvio: number;
  transportadoras: string[];
  anuncio: string;
  banners: Banner[];
}

export type Segmento = "todos" | "compradores" | "sin_compra";

export interface Campana {
  id: string;
  asunto: string;
  segmento: Segmento;
  contenido: string;
  destinatarios: number;
  fecha: string;
  estado: "simulado";
}

export interface Suscriptor {
  correo: string;
  fecha: string;
}

export interface NuevoPedido {
  clienteId?: string;
  contacto: Pedido["contacto"];
  envio: DatosEntrega;
  items: { productoId: string; talla: string; cantidad: number }[];
  metodoPago: MetodoPago;
}

export interface NuevoCliente extends DatosEntrega {
  nombre: string;
  apellidos: string;
  cedula?: string;
  celular: string;
  correo: string;
  clave: string;
  autorizaDatos: boolean;
  autorizaCorreos: boolean;
}
