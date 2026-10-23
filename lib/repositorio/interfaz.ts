import type {
  Campana,
  Cliente,
  Configuracion,
  DatosEntrega,
  EstadoPedido,
  NuevoCliente,
  NuevoPedido,
  Pedido,
  Producto,
  Suscriptor,
} from "../tipos";

export type ClientePublico = Omit<Cliente, "claveHash" | "sal">;

export interface CambioEstado {
  estado?: EstadoPedido;
  transportadora?: string;
  guia?: string;
  notaCliente?: string;
  notaHistorial?: string;
}

/**
 * Contrato de datos de la tienda. Las pantallas solo hablan con esta interfaz.
 * La demo usa `RepositorioLocal` (datos de ejemplo + localStorage); para
 * producción basta con otra implementación (Supabase, Postgres vía API) que cumpla
 * este mismo contrato.
 */
export interface Repositorio {
  // Catálogo
  listarProductos(): Promise<Producto[]>;
  productoPorSlug(slug: string): Promise<Producto | undefined>;
  guardarProducto(producto: Producto): Promise<Producto>;
  eliminarProducto(id: string): Promise<void>;

  // Clientes y sesión
  registrar(datos: NuevoCliente): Promise<ClientePublico>;
  iniciarSesion(correo: string, clave: string): Promise<ClientePublico>;
  cerrarSesion(): Promise<void>;
  clienteActual(): Promise<ClientePublico | null>;
  actualizarEntrega(clienteId: string, datos: DatosEntrega & { celular: string; autorizaCorreos: boolean }): Promise<ClientePublico>;
  listarClientes(): Promise<ClientePublico[]>;

  // Pedidos
  crearPedido(datos: NuevoPedido): Promise<Pedido>;
  pedidosDeCliente(clienteId: string): Promise<Pedido[]>;
  buscarPedido(numero: string, correo: string): Promise<Pedido | undefined>;
  pedidoDeCliente(clienteId: string, numero: string): Promise<Pedido | undefined>;
  cancelarPedido(numero: string, correo: string): Promise<Pedido>;
  listarPedidos(): Promise<Pedido[]>;
  actualizarPedido(numero: string, cambio: CambioEstado): Promise<Pedido>;

  // Configuración, suscripciones y campañas
  configuracion(): Promise<Configuracion>;
  guardarConfiguracion(config: Configuracion): Promise<Configuracion>;
  suscribir(correo: string): Promise<void>;
  listarSuscriptores(): Promise<Suscriptor[]>;
  listarCampanas(): Promise<Campana[]>;
  registrarCampana(campana: Omit<Campana, "id" | "fecha" | "estado">): Promise<Campana>;

  // Demo
  restablecer(): Promise<void>;
}

export class ErrorRepositorio extends Error {}
