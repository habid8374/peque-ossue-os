import { hashClave, nuevaSal } from "../clave";
import { CONFIG_INICIAL, generarDatosDemo } from "../demo/generar";
import { ESTADOS_CANCELABLES, VERSION_POLITICA } from "../marca";
import { costoEnvio, diasDeEntrega, sumarDiasHabiles } from "../pedidos";
import type { Campana, Cliente, Configuracion, Pedido, Producto, Suscriptor } from "../tipos";
import { ErrorRepositorio, type ClientePublico, type Repositorio } from "./interfaz";

const CLAVE_DB = "ps:db:v1";
const CLAVE_SESION = "ps:sesion";
export const EVENTO_CAMBIO = "ps:cambio";

interface BaseDatos {
  version: 1;
  productos: Producto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  config: Configuracion;
  campanas: Campana[];
  suscriptores: Suscriptor[];
}

function publico(c: Cliente): ClientePublico {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { claveHash, sal, ...resto } = c;
  return resto;
}

function normalizarCorreo(correo: string) {
  return correo.trim().toLowerCase();
}

function id(prefijo: string) {
  return `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Implementación de demostración: todo vive en el navegador (localStorage). */
export class RepositorioLocal implements Repositorio {
  private cache: BaseDatos | null = null;
  private cargando: Promise<BaseDatos> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === CLAVE_DB || e.key === CLAVE_SESION) {
          this.cache = null;
          window.dispatchEvent(new Event(EVENTO_CAMBIO));
        }
      });
    }
  }

  private async db(): Promise<BaseDatos> {
    if (this.cache) return this.cache;
    if (this.cargando) return this.cargando;
    this.cargando = (async () => {
      let datos: BaseDatos | null = null;
      try {
        const crudo = localStorage.getItem(CLAVE_DB);
        if (crudo) datos = JSON.parse(crudo) as BaseDatos;
      } catch {
        datos = null;
      }
      if (!datos || datos.version !== 1) {
        datos = await this.semilla();
        this.escribir(datos, false);
      }
      this.cache = datos;
      this.cargando = null;
      return datos;
    })();
    return this.cargando;
  }

  private async semilla(): Promise<BaseDatos> {
    const demo = await generarDatosDemo();
    return { version: 1, ...demo, campanas: [], suscriptores: [] };
  }

  private escribir(datos: BaseDatos, avisar = true) {
    this.cache = datos;
    try {
      localStorage.setItem(CLAVE_DB, JSON.stringify(datos));
    } catch {
      throw new ErrorRepositorio("No hay espacio en el navegador para guardar más datos. Usa imágenes más livianas o restablece la demo.");
    }
    if (avisar && typeof window !== "undefined") window.dispatchEvent(new Event(EVENTO_CAMBIO));
  }

  // ---------------- Catálogo ----------------
  async listarProductos() {
    return (await this.db()).productos;
  }

  async productoPorSlug(slug: string) {
    return (await this.db()).productos.find((p) => p.slug === slug);
  }

  async guardarProducto(producto: Producto) {
    const db = await this.db();
    const duplicado = db.productos.find((p) => p.slug === producto.slug && p.id !== producto.id);
    if (duplicado) throw new ErrorRepositorio("Ya existe un producto con ese nombre. Cambia el nombre.");
    const i = db.productos.findIndex((p) => p.id === producto.id);
    const productos = [...db.productos];
    if (i >= 0) productos[i] = producto;
    else productos.unshift(producto);
    this.escribir({ ...db, productos });
    return producto;
  }

  async eliminarProducto(idProducto: string) {
    const db = await this.db();
    this.escribir({ ...db, productos: db.productos.filter((p) => p.id !== idProducto) });
  }

  // ---------------- Clientes ----------------
  async registrar(datos: Parameters<Repositorio["registrar"]>[0]) {
    const db = await this.db();
    const correo = normalizarCorreo(datos.correo);
    if (!datos.autorizaDatos) throw new ErrorRepositorio("Debes autorizar el tratamiento de datos para crear la cuenta.");
    if (db.clientes.some((c) => c.correo === correo)) throw new ErrorRepositorio("Ya hay una cuenta con ese correo. Inicia sesión.");
    const sal = nuevaSal();
    const ahora = new Date().toISOString();
    const cliente: Cliente = {
      id: id("c"),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      cedula: datos.cedula?.trim() || undefined,
      celular: datos.celular.trim(),
      correo,
      departamento: datos.departamento,
      ciudad: datos.ciudad,
      direccion: datos.direccion.trim(),
      complemento: datos.complemento?.trim() || undefined,
      claveHash: await hashClave(datos.clave, sal),
      sal,
      autorizaDatos: { fecha: ahora, version: VERSION_POLITICA },
      autorizaCorreos: datos.autorizaCorreos,
      fechaAutorizaCorreos: datos.autorizaCorreos ? ahora : undefined,
      creado: ahora,
    };
    this.escribir({ ...db, clientes: [...db.clientes, cliente] });
    localStorage.setItem(CLAVE_SESION, cliente.id);
    return publico(cliente);
  }

  async iniciarSesion(correo: string, clave: string) {
    const db = await this.db();
    const c = db.clientes.find((x) => x.correo === normalizarCorreo(correo));
    if (!c || (await hashClave(clave, c.sal)) !== c.claveHash) {
      throw new ErrorRepositorio("Correo o contraseña incorrectos.");
    }
    localStorage.setItem(CLAVE_SESION, c.id);
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
    return publico(c);
  }

  async cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
  }

  async clienteActual() {
    const idSesion = localStorage.getItem(CLAVE_SESION);
    if (!idSesion) return null;
    const c = (await this.db()).clientes.find((x) => x.id === idSesion);
    return c ? publico(c) : null;
  }

  async actualizarEntrega(clienteId: string, datos: Parameters<Repositorio["actualizarEntrega"]>[1]) {
    const db = await this.db();
    const i = db.clientes.findIndex((c) => c.id === clienteId);
    if (i < 0) throw new ErrorRepositorio("No encontramos la cuenta.");
    const previo = db.clientes[i];
    const ahora = new Date().toISOString();
    const actualizado: Cliente = {
      ...previo,
      celular: datos.celular.trim(),
      departamento: datos.departamento,
      ciudad: datos.ciudad,
      direccion: datos.direccion.trim(),
      complemento: datos.complemento?.trim() || undefined,
      autorizaCorreos: datos.autorizaCorreos,
      fechaAutorizaCorreos: datos.autorizaCorreos ? previo.fechaAutorizaCorreos ?? ahora : undefined,
    };
    const clientes = [...db.clientes];
    clientes[i] = actualizado;
    this.escribir({ ...db, clientes });
    return publico(actualizado);
  }

  async listarClientes() {
    return (await this.db()).clientes.map(publico);
  }

  // ---------------- Pedidos ----------------
  async crearPedido(datos: Parameters<Repositorio["crearPedido"]>[0]) {
    const db = await this.db();
    if (!datos.items.length) throw new ErrorRepositorio("Tu carrito está vacío.");
    const productos = db.productos.map((p) => ({ ...p, tallas: p.tallas.map((t) => ({ ...t })) }));
    const items = datos.items.map((it) => {
      const p = productos.find((x) => x.id === it.productoId);
      if (!p) throw new ErrorRepositorio("Un producto de tu carrito ya no está disponible.");
      const t = p.tallas.find((x) => x.talla === it.talla);
      if (!t || t.existencias < it.cantidad) {
        throw new ErrorRepositorio(`No hay suficientes unidades de ${p.nombre} en talla ${it.talla}.`);
      }
      t.existencias -= it.cantidad;
      return { productoId: p.id, slug: p.slug, nombre: p.nombre, categoria: p.categoria, talla: it.talla, cantidad: it.cantidad, precio: p.precio };
    });
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const envio = costoEnvio(subtotal, db.config);
    const ahora = new Date();
    const ultimo = db.pedidos.reduce((m, p) => Math.max(m, Number(p.numero.replace(/\D/g, "")) || 0), 10000);
    const numero = `PS-${ultimo + 1}`;
    const historial: Pedido["historial"] = [{ estado: "recibido", fecha: ahora.toISOString() }];
    if (datos.metodoPago !== "contraentrega") {
      historial.push({ estado: "pagado", fecha: new Date(ahora.getTime() + 1000).toISOString(), nota: "Pago simulado aprobado (demostración)." });
    }
    const pedido: Pedido = {
      id: id("o"),
      numero,
      clienteId: datos.clienteId,
      contacto: { ...datos.contacto, correo: normalizarCorreo(datos.contacto.correo) },
      envio: datos.envio,
      items,
      subtotal,
      costoEnvio: envio,
      total: subtotal + envio,
      metodoPago: datos.metodoPago,
      estado: historial[historial.length - 1].estado,
      historial,
      fechaEstimada: sumarDiasHabiles(ahora, diasDeEntrega(datos.envio.departamento, datos.envio.ciudad) + 1).toISOString(),
      creado: ahora.toISOString(),
    };
    this.escribir({ ...db, productos, pedidos: [...db.pedidos, pedido] });
    return pedido;
  }

  async pedidosDeCliente(clienteId: string) {
    const db = await this.db();
    return db.pedidos.filter((p) => p.clienteId === clienteId).sort((a, b) => b.creado.localeCompare(a.creado));
  }

  async buscarPedido(numero: string, correo: string) {
    const n = numero.trim().toUpperCase().replace(/^(PS)?-?/, "PS-");
    return (await this.db()).pedidos.find((p) => p.numero === n && p.contacto.correo === normalizarCorreo(correo));
  }

  async pedidoDeCliente(clienteId: string, numero: string) {
    return (await this.db()).pedidos.find((p) => p.numero === numero && p.clienteId === clienteId);
  }

  async cancelarPedido(numero: string, correo: string) {
    const db = await this.db();
    const i = db.pedidos.findIndex((p) => p.numero === numero && p.contacto.correo === normalizarCorreo(correo));
    if (i < 0) throw new ErrorRepositorio("No encontramos el pedido.");
    const pedido = db.pedidos[i];
    if (!ESTADOS_CANCELABLES.includes(pedido.estado)) {
      throw new ErrorRepositorio("Este pedido ya salió de la tienda y no se puede cancelar. Escríbenos por WhatsApp.");
    }
    // Devolver existencias
    const productos = db.productos.map((p) => {
      const its = pedido.items.filter((it) => it.productoId === p.id);
      if (!its.length) return p;
      return { ...p, tallas: p.tallas.map((t) => ({ ...t, existencias: t.existencias + its.filter((x) => x.talla === t.talla).reduce((s, x) => s + x.cantidad, 0) })) };
    });
    const actualizado: Pedido = {
      ...pedido,
      estado: "cancelado",
      historial: [...pedido.historial, { estado: "cancelado", fecha: new Date().toISOString(), nota: "Cancelado por el cliente." }],
    };
    const pedidos = [...db.pedidos];
    pedidos[i] = actualizado;
    this.escribir({ ...db, productos, pedidos });
    return actualizado;
  }

  async listarPedidos() {
    return [...(await this.db()).pedidos].sort((a, b) => b.creado.localeCompare(a.creado));
  }

  async actualizarPedido(numero: string, cambio: Parameters<Repositorio["actualizarPedido"]>[1]) {
    const db = await this.db();
    const i = db.pedidos.findIndex((p) => p.numero === numero);
    if (i < 0) throw new ErrorRepositorio("No encontramos el pedido.");
    const previo = db.pedidos[i];
    const historial = [...previo.historial];
    if (cambio.estado && cambio.estado !== previo.estado) {
      historial.push({ estado: cambio.estado, fecha: new Date().toISOString(), nota: cambio.notaHistorial?.trim() || undefined });
    }
    const actualizado: Pedido = {
      ...previo,
      estado: cambio.estado ?? previo.estado,
      transportadora: cambio.transportadora !== undefined ? cambio.transportadora || undefined : previo.transportadora,
      guia: cambio.guia !== undefined ? cambio.guia.trim() || undefined : previo.guia,
      notaCliente: cambio.notaCliente !== undefined ? cambio.notaCliente.trim() || undefined : previo.notaCliente,
      historial,
    };
    const pedidos = [...db.pedidos];
    pedidos[i] = actualizado;
    this.escribir({ ...db, pedidos });
    return actualizado;
  }

  // ---------------- Configuración y campañas ----------------
  async configuracion() {
    return (await this.db()).config ?? CONFIG_INICIAL;
  }

  async guardarConfiguracion(config: Configuracion) {
    const db = await this.db();
    this.escribir({ ...db, config });
    return config;
  }

  async suscribir(correo: string) {
    const db = await this.db();
    const c = normalizarCorreo(correo);
    if (db.suscriptores.some((s) => s.correo === c)) return;
    this.escribir({ ...db, suscriptores: [...db.suscriptores, { correo: c, fecha: new Date().toISOString() }] });
  }

  async listarSuscriptores() {
    return (await this.db()).suscriptores;
  }

  async listarCampanas() {
    return [...(await this.db()).campanas].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async registrarCampana(datos: Parameters<Repositorio["registrarCampana"]>[0]) {
    const db = await this.db();
    const campana: Campana = { ...datos, id: id("k"), fecha: new Date().toISOString(), estado: "simulado" };
    this.escribir({ ...db, campanas: [...db.campanas, campana] });
    return campana;
  }

  async restablecer() {
    const datos = await this.semilla();
    localStorage.removeItem(CLAVE_SESION);
    this.escribir(datos);
  }
}
