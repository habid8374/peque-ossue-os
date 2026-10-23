"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDatos } from "@/lib/hooks";

/** Devuelve el cliente con sesión; si no hay, redirige al ingreso. `undefined` mientras carga. */
export function useSesionRequerida() {
  const cliente = useDatos((r) => r.clienteActual());
  const router = useRouter();
  const ruta = usePathname();
  useEffect(() => {
    if (cliente === null) router.replace(`/cuenta/ingresar?siguiente=${encodeURIComponent(ruta)}`);
  }, [cliente, router, ruta]);
  return cliente;
}
