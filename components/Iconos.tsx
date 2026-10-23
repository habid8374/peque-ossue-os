import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tam?: number };

function Base({ tam = 22, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  );
}

export const IconoBuscar = (p: P) => <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>;
export const IconoCuenta = (p: P) => <Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Base>;
export const IconoCorazon = ({ lleno, ...p }: P & { lleno?: boolean }) => (
  <Base {...p} fill={lleno ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-9.2-9.4C1.7 7.2 4 4 7.3 4c2 0 3.6 1.1 4.7 2.8C13.1 5.1 14.7 4 16.7 4 20 4 22.3 7.2 21.2 10.6 19.5 15.4 12 20 12 20Z" />
  </Base>
);
export const IconoBolsa = (p: P) => <Base {...p}><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></Base>;
export const IconoMenu = (p: P) => <Base {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Base>;
export const IconoCerrar = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>;
export const IconoCamion = (p: P) => <Base {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></Base>;
export const IconoChat = (p: P) => <Base {...p}><path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 2.5Z" /><path d="M8 9h8M8 12h5" /></Base>;
export const IconoCaja = (p: P) => <Base {...p}><path d="M3 8l9-4 9 4-9 4-9-4Z" /><path d="M3 8v8l9 4 9-4V8M12 12v8" /></Base>;
export const IconoCandado = (p: P) => <Base {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Base>;
export const IconoUbicacion = (p: P) => <Base {...p}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></Base>;
export const IconoCheck = (p: P) => <Base {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Base>;
export const IconoAlerta = (p: P) => <Base {...p}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></Base>;
export const IconoFlecha = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const IconoMas = (p: P) => <Base {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const IconoMenos = (p: P) => <Base {...p}><path d="M5 12h14" /></Base>;
export const IconoBasura = (p: P) => <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>;
export const IconoInstagram = (p: P) => <Base {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></Base>;
export const IconoDescargar = (p: P) => <Base {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Base>;

export function IconoWhatsApp({ tam = 26 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M16.04 3C9 3 3.3 8.7 3.3 15.74c0 2.25.6 4.45 1.72 6.38L3.2 28.8l6.85-1.8a12.7 12.7 0 0 0 5.99 1.52h.01c7.03 0 12.75-5.7 12.75-12.75S23.08 3 16.04 3Zm0 23.36h-.01c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.07 1.07 1.09-3.97-.25-.41a10.56 10.56 0 0 1-1.62-5.6c0-5.86 4.77-10.62 10.64-10.62 2.84 0 5.5 1.1 7.51 3.12a10.55 10.55 0 0 1 3.11 7.51c0 5.86-4.77 10.62-10.61 10.62Zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.09 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.82.67.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}
