import type { Metadata } from "next";
import { Suspense } from "react";
import { FormIngresoAdmin } from "@/components/admin/FormIngresoAdmin";

export const metadata: Metadata = { title: "Ingresar" };

export default function IngresarAdmin() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="tarjeta w-full max-w-md p-8">
        <p className="sobretitulo">Pequeños Sueños</p>
        <h1 className="mt-2 text-4xl">Panel de administración</h1>
        <Suspense>
          <FormIngresoAdmin />
        </Suspense>
      </div>
    </main>
  );
}
