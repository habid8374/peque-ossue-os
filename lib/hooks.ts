"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { EVENTO_CAMBIO, repo, type Repositorio } from "./repositorio";

/**
 * Ejecuta una consulta al repositorio y la repite cada vez que los datos cambian
 * (en esta pestaña o en otra). `undefined` mientras carga.
 */
export function useDatos<T>(consulta: (r: Repositorio) => Promise<T>, deps: unknown[] = []): T | undefined {
  const [valor, setValor] = useState<{ v: T } | undefined>(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ejecutar = useCallback(consulta, deps);
  useEffect(() => {
    let vivo = true;
    const cargar = () => {
      ejecutar(repo()).then((v) => {
        if (vivo) setValor({ v });
      });
    };
    cargar();
    window.addEventListener(EVENTO_CAMBIO, cargar);
    return () => {
      vivo = false;
      window.removeEventListener(EVENTO_CAMBIO, cargar);
    };
  }, [ejecutar]);
  return valor?.v;
}

/** Almacén pequeño en localStorage con suscripción (carrito, favoritos). */
export function crearAlmacen<T>(clave: string, inicial: T) {
  const oyentes = new Set<() => void>();
  let cache: { crudo: string | null; valor: T } | null = null;
  const leer = (): T => {
    let crudo: string | null = null;
    try {
      crudo = localStorage.getItem(clave);
    } catch {
      crudo = null;
    }
    if (cache && cache.crudo === crudo) return cache.valor;
    let valor = inicial;
    try {
      if (crudo) valor = JSON.parse(crudo) as T;
    } catch {
      valor = inicial;
    }
    cache = { crudo, valor };
    return valor;
  };
  const avisar = () => oyentes.forEach((o) => o());
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === clave) avisar();
    });
  }
  return {
    obtener: leer,
    fijar(actualizar: (previo: T) => T) {
      const nuevo = actualizar(leer());
      try {
        localStorage.setItem(clave, JSON.stringify(nuevo));
      } catch {
        /* sin almacenamiento disponible */
      }
      avisar();
    },
    suscribir(o: () => void) {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
    inicial,
  };
}

export function useAlmacen<T>(almacen: ReturnType<typeof crearAlmacen<T>>) {
  return useSyncExternalStore(almacen.suscribir, almacen.obtener, () => almacen.inicial);
}

/** true solo después de hidratar (evita diferencias servidor/cliente). */
export function useMontado() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
