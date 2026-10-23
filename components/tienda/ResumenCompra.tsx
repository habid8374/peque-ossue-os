import { pesos } from "@/lib/formato";

export function ResumenCompra({ subtotal, envio, envioGratisDesde }: { subtotal: number; envio: number; envioGratisDesde: number }) {
  const falta = Math.max(0, envioGratisDesde - subtotal);
  const avance = Math.min(100, Math.round((subtotal / envioGratisDesde) * 100));
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold">{falta > 0 ? <>Te faltan {pesos(falta)} para el envío gratis.</> : <>¡Tienes envío gratis!</>}</p>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-rosa-nube" role="progressbar" aria-label="Avance hacia el envío gratis" aria-valuemin={0} aria-valuemax={100} aria-valuenow={avance}>
          <div className="h-full rounded-full bg-rosa" style={{ width: `${avance}%` }} />
        </div>
      </div>
      <dl className="space-y-2 border-t border-linea pt-4">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{pesos(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{envio === 0 ? "Gratis" : pesos(envio)}</dd>
        </div>
        <div className="flex justify-between border-t border-linea pt-3 text-lg font-extrabold">
          <dt>Total</dt>
          <dd>{pesos(subtotal + envio)}</dd>
        </div>
      </dl>
    </div>
  );
}
