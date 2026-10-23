import { catalogoSemilla } from "../catalogo-semilla";
import { VERSION_POLITICA } from "../marca";
import { diasDeEntrega, sumarDiasHabiles } from "../pedidos";
import type { Cliente, Configuracion, EstadoPedido, EventoPedido, MetodoPago, Pedido, Producto } from "../tipos";
import { hashClave } from "../clave";
import { CONFIG_INICIAL, CUENTA_DEMO } from "../config-inicial";

export { CONFIG_INICIAL, CUENTA_DEMO };

// Generador determinista de datos de demostración. Las fechas son relativas al
// momento en que se cargan, para que el panel siempre se vea "al día".



function mulberry32(semilla: number) {
  let a = semilla;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOMBRES_F = ["María José", "Valentina", "Daniela", "Laura", "Andrea", "Carolina", "Paola", "Yuranis", "Katherine", "Luisa", "Mariana", "Diana", "Sandra", "Melissa", "Yesenia", "Lorena", "Natalia", "Kelly", "Tatiana", "Adriana", "Liliana", "Rosa", "Claudia", "Wendy", "Shirley", "Yulieth", "Angélica", "Camila", "Estefanía", "Milena"];
const NOMBRES_M = ["Carlos", "Jorge", "Luis", "Andrés", "José", "Juan David", "Rafael", "Kevin", "Alberto", "Fabián", "Miguel", "Iván"];
const APELLIDOS = ["Rodríguez", "Pérez", "Gómez", "Martínez", "Charris", "De la Hoz", "Mercado", "Ospino", "Barrios", "Polo", "Ariza", "Cantillo", "Escorcia", "Pacheco", "Torres", "Ruiz", "Molina", "Fontalvo", "Orozco", "Villa", "Navarro", "Jiménez", "Palacio", "Herrera", "Coll", "Bolaño", "Castro", "Guerrero"];
const BARRIOS = ["Barrio Abajo", "Centro", "Villa Rosa", "El Carmen", "Los Almendros", "San Fernando", "La Concepción", "Santa Catalina", "El Prado", "Las Mercedes", "Villa Estadio", "El Recreo"];

const CIUDADES: [string, string, number][] = [
  ["Atlántico", "Sabanalarga", 34],
  ["Atlántico", "Barranquilla", 18],
  ["Atlántico", "Soledad", 7],
  ["Atlántico", "Baranoa", 6],
  ["Atlántico", "Malambo", 4],
  ["Atlántico", "Campo de la Cruz", 4],
  ["Atlántico", "Repelón", 3],
  ["Atlántico", "Luruaco", 3],
  ["Atlántico", "Puerto Colombia", 2],
  ["Bolívar", "Cartagena", 6],
  ["Magdalena", "Santa Marta", 4],
  ["Córdoba", "Montería", 2],
  ["Bogotá D.C.", "Bogotá", 2],
  ["Antioquia", "Medellín", 2],
];

// Peso relativo de ventas por mes (enero = 0). Temporada alta: diciembre, noviembre, mayo y junio.
const PESO_MES = [0.55, 0.5, 0.65, 0.9, 1.3, 1.1, 1.05, 0.8, 0.75, 1.0, 1.35, 2.0];

const DIA = 86400000;

function elegirPonderado<T>(r: () => number, items: T[], peso: (t: T) => number) {
  const total = items.reduce((s, t) => s + peso(t), 0);
  let x = r() * total;
  for (const t of items) {
    x -= peso(t);
    if (x <= 0) return t;
  }
  return items[items.length - 1];
}

function quitarTildes(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");
}

function avanzar(creado: Date, hasta: EstadoPedido, r: () => number, cancelar = false): EventoPedido[] {
  const pasos: EstadoPedido[] = ["recibido", "pagado", "preparando", "enviado", "en_reparto", "entregado"];
  const horas = [0, 0.3, 14, 30, 50, 58];
  const eventos: EventoPedido[] = [];
  for (let i = 0; i < pasos.length; i++) {
    const t = new Date(creado.getTime() + (horas[i] + r() * 4) * 3600000);
    eventos.push({ estado: pasos[i], fecha: t.toISOString() });
    if (pasos[i] === hasta) break;
  }
  if (cancelar) {
    const ultimo = new Date(eventos[eventos.length - 1].fecha);
    eventos.push({ estado: "cancelado", fecha: new Date(ultimo.getTime() + 5 * 3600000).toISOString(), nota: "Cancelado a solicitud del cliente." });
  }
  return eventos;
}

export interface DatosDemo {
  productos: Producto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  config: Configuracion;
}

export async function generarDatosDemo(ahora = new Date()): Promise<DatosDemo> {
  const r = mulberry32(20261023);
  const productos = catalogoSemilla(ahora);
  const config = structuredClone(CONFIG_INICIAL);
  const hoy = ahora.getTime();

  // ---------- Clientes ----------
  const clientes: Cliente[] = [];
  const usados = new Set<string>();
  const totalClientes = 50;
  for (let i = 0; i < totalClientes; i++) {
    const mujer = r() < 0.82;
    const nombre = mujer ? NOMBRES_F[Math.floor(r() * NOMBRES_F.length)] : NOMBRES_M[Math.floor(r() * NOMBRES_M.length)];
    const ap1 = APELLIDOS[Math.floor(r() * APELLIDOS.length)];
    const ap2 = APELLIDOS[Math.floor(r() * APELLIDOS.length)];
    let base = `${quitarTildes(nombre.split(" ")[0])}.${quitarTildes(ap1)}`;
    while (usados.has(base)) base += Math.floor(r() * 9);
    usados.add(base);
    const [departamento, ciudad] = elegirPonderado(r, CIUDADES, (c) => c[2]);
    // 6 clientes nuevos en los últimos 30 días; el resto repartido en 13 meses.
    const diasAtras = i >= totalClientes - 6 ? Math.floor(r() * 28) + 1 : Math.floor(30 + r() * 365);
    const creado = new Date(hoy - diasAtras * DIA - Math.floor(r() * 10) * 3600000);
    const autoriza = r() < 0.64;
    clientes.push({
      id: `c${String(i + 1).padStart(3, "0")}`,
      nombre,
      apellidos: `${ap1} ${ap2}`,
      cedula: r() < 0.5 ? String(1040000000 + Math.floor(r() * 9000000)) : undefined,
      celular: `3${["00", "01", "04", "05", "10", "12", "14", "15", "17", "20", "23", "24"][Math.floor(r() * 12)]} ${String(100 + Math.floor(r() * 899))} ${String(1000 + Math.floor(r() * 8999))}`,
      correo: `${base}@correo-demo.co`,
      departamento,
      ciudad,
      direccion: `Calle ${Math.floor(r() * 40) + 1} # ${Math.floor(r() * 30) + 1}-${Math.floor(r() * 90) + 10}`,
      complemento: r() < 0.5 ? BARRIOS[Math.floor(r() * BARRIOS.length)] : undefined,
      claveHash: "sin-clave-demo",
      sal: "demo",
      autorizaDatos: { fecha: creado.toISOString(), version: VERSION_POLITICA },
      autorizaCorreos: autoriza,
      fechaAutorizaCorreos: autoriza ? creado.toISOString() : undefined,
      creado: creado.toISOString(),
    });
  }

  // Cuenta de prueba
  const salDemo = "sal-demo-ps";
  const demoCreado = new Date(hoy - 120 * DIA);
  const demo: Cliente = {
    id: "c-demo",
    nombre: "Ana Lucía",
    apellidos: "Prueba Demo",
    cedula: undefined,
    celular: "300 000 0000",
    correo: CUENTA_DEMO.correo,
    departamento: "Atlántico",
    ciudad: "Sabanalarga",
    direccion: "Calle 20 # 18-45",
    complemento: "Casa de rejas blancas",
    claveHash: await hashClave(CUENTA_DEMO.clave, salDemo),
    sal: salDemo,
    autorizaDatos: { fecha: demoCreado.toISOString(), version: VERSION_POLITICA },
    autorizaCorreos: true,
    fechaAutorizaCorreos: demoCreado.toISOString(),
    creado: demoCreado.toISOString(),
  };

  // ---------- Pedidos ----------
  // 8 clientes sin compras (segmento "sin compra"); el resto compra con distinta frecuencia.
  const compradores = clientes.slice(0, totalClientes - 8);
  // Clientas frecuentes: sobre todo de Sabanalarga y municipios cercanos.
  const lealtad = new Map(compradores.map((c) => [c.id, c.departamento === "Atlántico" && r() < 0.32 ? 3 + r() * 3 : c.departamento === "Atlántico" ? 1 : 0.6]));
  const objetivo = 172;
  const fechas: Date[] = [];
  const dias: { t: number; peso: number }[] = [];
  for (let d = 364; d >= 0; d--) {
    const t = hoy - d * DIA;
    const f = new Date(t);
    const finDeSemana = f.getDay() === 0 || f.getDay() === 6 ? 1.25 : 1;
    // Crecimiento suave de la tienda a lo largo del año.
    const crecimiento = 0.75 + 0.5 * ((364 - d) / 364);
    dias.push({ t, peso: PESO_MES[f.getMonth()] * finDeSemana * crecimiento });
  }
  for (let i = 0; i < objetivo; i++) {
    const dia = elegirPonderado(r, dias, (x) => x.peso);
    const hora = 8 + Math.floor(r() * 12);
    const f = new Date(dia.t);
    f.setHours(hora, Math.floor(r() * 60), 0, 0);
    if (f.getTime() > hoy) f.setTime(hoy - Math.floor(r() * 5) * 3600000);
    fechas.push(f);
  }
  fechas.sort((a, b) => a.getTime() - b.getTime());

  const pedidos: Pedido[] = [];
  let numero = 10001;
  const metodos: MetodoPago[] = ["tarjeta", "pse", "contraentrega"];

  const crearPedido = (cliente: Cliente, creado: Date, estado: EstadoPedido, cancelado: boolean, itemsFijos?: { p: Producto; talla: string; cantidad: number }[]) => {
    // Los productos de catálogo base (más de 100 días) se venden todo el año; los nuevos, solo desde su llegada.
    const disponibles = productos.filter((p) => new Date(p.creado).getTime() <= creado.getTime() || hoy - new Date(p.creado).getTime() > 100 * DIA);
    const nItems = itemsFijos ? itemsFijos.length : r() < 0.55 ? 1 : r() < 0.8 ? 2 : 3;
    const elegidos = itemsFijos ?? Array.from({ length: nItems }, () => {
      const p = elegirPonderado(r, disponibles, (x) => (x.categoria === "accesorios" ? 1.4 : x.categoria === "bautizo" ? 0.45 : 1));
      const talla = p.tallas[Math.floor(r() * p.tallas.length)].talla;
      return { p, talla, cantidad: r() < 0.88 ? 1 : 2 };
    });
    const items = elegidos.map(({ p, talla, cantidad }) => ({
      productoId: p.id,
      slug: p.slug,
      nombre: p.nombre,
      categoria: p.categoria,
      talla,
      cantidad,
      precio: p.precio,
    }));
    const subtotal = items.reduce((s, it) => s + it.precio * it.cantidad, 0);
    const envio = subtotal >= config.envioGratisDesde ? 0 : config.costoEnvio;
    const metodo = elegirPonderado(r, metodos, (m) => (m === "contraentrega" ? 0.9 : m === "pse" ? 1.1 : 1));
    const local = cliente.ciudad === "Sabanalarga";
    const transportadora = local ? "Mensajero local" : config.transportadoras[1 + Math.floor(r() * (config.transportadoras.length - 1))];
    const historial = avanzar(creado, estado, r, cancelado);
    const enviado = historial.some((e) => e.estado === "enviado");
    const p: Pedido = {
      id: `o${numero}`,
      numero: `PS-${numero}`,
      clienteId: cliente.id,
      contacto: { nombre: cliente.nombre, apellidos: cliente.apellidos, correo: cliente.correo, celular: cliente.celular, cedula: cliente.cedula },
      envio: { departamento: cliente.departamento, ciudad: cliente.ciudad, direccion: cliente.direccion, complemento: cliente.complemento },
      items,
      subtotal,
      costoEnvio: envio,
      total: subtotal + envio,
      metodoPago: metodo,
      estado: cancelado ? "cancelado" : estado,
      historial,
      transportadora: enviado || estado === "preparando" ? transportadora : undefined,
      guia: enviado && !local ? String(2400000000 + Math.floor(r() * 99999999)) : undefined,
      fechaEstimada: sumarDiasHabiles(creado, diasDeEntrega(cliente.departamento, cliente.ciudad) + 1).toISOString(),
      creado: creado.toISOString(),
    };
    numero++;
    return p;
  };

  for (const f of fechas) {
    const candidatos = compradores.filter((c) => new Date(c.creado).getTime() <= f.getTime());
    const cliente = candidatos.length ? elegirPonderado(r, candidatos, (c) => lealtad.get(c.id) ?? 1) : compradores[0];
    if (new Date(cliente.creado).getTime() > f.getTime()) cliente.creado = new Date(f.getTime() - DIA).toISOString();
    const edad = (hoy - f.getTime()) / DIA;
    let estado: EstadoPedido = "entregado";
    if (edad < 0.5) estado = "recibido";
    else if (edad < 1) estado = "pagado";
    else if (edad < 2.5) estado = "preparando";
    else if (edad < 3.5) estado = "enviado";
    else if (edad < 4.5) estado = "en_reparto";
    const cancelado = estado === "entregado" ? r() < 0.05 : false;
    pedidos.push(crearPedido(cliente, f, cancelado ? "preparando" : estado, cancelado));
  }

  // Tres pedidos de la cuenta de prueba, en etapas distintas.
  const porSlug = (s: string) => productos.find((p) => p.slug === s)!;
  const demoPedidos = [
    crearPedido(demo, new Date(hoy - 38 * DIA), "entregado", false, [
      { p: porSlug("vestido-campanita"), talla: "12 M", cantidad: 1 },
      { p: porSlug("balacas-con-mono-pack-3"), talla: "Única", cantidad: 1 },
    ]),
    crearPedido(demo, new Date(hoy - 3.2 * DIA), "en_reparto", false, [
      { p: porSlug("jardinera-arcoiris"), talla: "12 M", cantidad: 1 },
      { p: porSlug("baletas-primeros-pasos"), talla: "19", cantidad: 1 },
    ]),
    crearPedido(demo, new Date(hoy - 1.2 * DIA), "preparando", false, [
      { p: porSlug("ajuar-de-bienvenida-5-piezas"), talla: "0-3 M", cantidad: 1 },
      { p: porSlug("manta-de-muselina-arcoiris"), talla: "Única", cantidad: 1 },
      { p: porSlug("body-nubecita-de-algodon"), talla: "3-6 M", cantidad: 2 },
    ]),
  ];
  demoPedidos[0].metodoPago = "tarjeta";
  demoPedidos[1].metodoPago = "pse";
  demoPedidos[1].transportadora = "Mensajero local";
  demoPedidos[1].historial[demoPedidos[1].historial.length - 1].nota = "Tu pedido salió con el mensajero esta mañana.";
  demoPedidos[1].notaCliente = "Te escribiremos por WhatsApp cuando el mensajero esté cerca.";
  demoPedidos[2].metodoPago = "contraentrega";

  // Pedidos aún en camino: la fecha estimada nunca queda en el pasado.
  const finDeHoy = new Date(hoy);
  finDeHoy.setHours(18, 0, 0, 0);
  for (const p of [...pedidos, ...demoPedidos]) {
    if (p.estado === "entregado" || p.estado === "cancelado") continue;
    const minimo = p.estado === "en_reparto" ? finDeHoy : sumarDiasHabiles(finDeHoy, 1);
    if (new Date(p.fechaEstimada) < minimo) p.fechaEstimada = minimo.toISOString();
  }

  return {
    productos,
    clientes: [...clientes, demo],
    pedidos: [...pedidos, ...demoPedidos].sort((a, b) => a.creado.localeCompare(b.creado)),
    config,
  };
}
