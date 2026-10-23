import { useId } from "react";
import type { Ilustracion as Tipo, Patron } from "@/lib/tipos";

// Ilustraciones vectoriales propias de cada prenda. Son marcadores mientras
// llegan las fotos reales (ver PENDIENTES.md).

const TRAZO = "#4A3438";

function formas(tipo: Tipo, relleno: string, acento: string) {
  const comun = { fill: relleno, stroke: TRAZO, strokeOpacity: 0.55, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const linea = { fill: "none", stroke: TRAZO, strokeOpacity: 0.45, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const boton = (x: number, y: number, r = 3.2) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={acento} stroke={TRAZO} strokeOpacity={0.5} strokeWidth={1.4} />;

  switch (tipo) {
    case "body":
      return (
        <>
          <path {...comun} d="M74 38 Q100 56 126 38 L160 56 L148 86 L134 80 L134 138 Q134 160 116 168 L110 174 L90 174 L84 168 Q66 160 66 138 L66 80 L52 86 L40 56 Z" />
          <path {...linea} d="M78 40 Q100 62 122 40" />
          {[92, 100, 108].map((x) => boton(x, 168, 2.6))}
        </>
      );
    case "mameluco":
      return (
        <>
          <path {...comun} d="M74 28 Q100 44 126 28 L158 46 L170 100 L156 104 L146 70 L142 118 L140 178 Q130 190 116 184 L106 130 L94 130 L84 184 Q70 190 60 178 L58 118 L54 70 L44 104 L30 100 L42 46 Z" />
          <path {...linea} d="M78 30 Q100 50 122 30" />
          <path {...linea} d="M100 44 L100 128" strokeDasharray="3 5" />
          <path {...linea} d="M62 172 Q72 178 82 174 M118 174 Q128 178 138 172" />
        </>
      );
    case "vestido":
      return (
        <>
          <path {...comun} d="M80 34 Q100 48 120 34 L130 38 Q148 40 152 58 Q146 70 132 66 L128 86 L170 168 Q100 186 30 168 L72 86 L68 66 Q54 70 48 58 Q52 40 70 38 Z" />
          <path {...linea} d="M84 36 Q100 54 116 36" />
          <path {...linea} d="M72 86 Q100 94 128 86" />
          <path fill={acento} stroke={TRAZO} strokeOpacity={0.5} strokeWidth={1.6} d="M100 90 L86 82 L86 98 Z M100 90 L114 82 L114 98 Z" />
          <circle cx={100} cy={90} r={3.4} fill={acento} stroke={TRAZO} strokeOpacity={0.5} strokeWidth={1.4} />
          <path {...linea} d="M58 140 Q66 160 62 172 M100 130 L100 178 M142 140 Q134 160 138 172" strokeOpacity={0.18} />
        </>
      );
    case "camisa":
      return (
        <>
          <path {...comun} d="M70 34 L88 28 L100 40 L112 28 L130 34 L166 56 L152 88 L138 80 L138 176 L62 176 L62 80 L48 88 L34 56 Z" />
          <path {...comun} fill={acento} d="M88 28 L100 40 L92 56 L80 36 Z M112 28 L100 40 L108 56 L120 36 Z" />
          <path {...linea} d="M100 40 L100 176" />
          {[64, 92, 120, 148].map((y) => boton(104, y, 2.8))}
          <path {...linea} d="M116 96 L132 96 L132 112 L116 112 Z" />
        </>
      );
    case "polo":
      return (
        <>
          <path {...comun} d="M72 32 L88 28 Q100 36 112 28 L128 32 L166 56 L152 88 L138 80 L138 176 L62 176 L62 80 L48 88 L34 56 Z" />
          <path {...comun} fill={acento} d="M88 28 Q100 36 112 28 L116 36 Q100 46 84 36 Z" />
          <path {...linea} d="M100 38 L100 78 L108 78 L108 38" />
          {[50, 66].map((y) => boton(104, y, 2.6))}
          <path {...linea} d="M38 64 L50 70 M162 64 L150 70" />
        </>
      );
    case "short":
      return (
        <>
          <path {...comun} d="M56 56 L144 56 L154 152 L110 158 L100 104 L90 158 L46 152 Z" />
          <path {...comun} fill={acento} d="M56 56 L144 56 L145 72 L55 72 Z" />
          <path {...linea} d="M94 72 Q96 84 92 90 M106 72 Q104 84 108 90" />
          <path {...linea} d="M62 84 Q72 92 70 104 M138 84 Q128 92 130 104" />
        </>
      );
    case "jardinera":
      return (
        <>
          <path {...linea} d="M72 72 L64 30 M128 72 L136 30" strokeWidth={6} stroke={relleno} strokeOpacity={1} />
          <path {...linea} d="M72 72 L64 30 M128 72 L136 30" />
          <path {...comun} d="M70 70 L130 70 L132 106 L150 110 L156 170 L110 174 L100 138 L90 174 L44 170 L50 110 L68 106 Z" />
          <path {...linea} d="M84 80 L116 80 L116 102 L84 102 Z" />
          <path fill="none" stroke={acento} strokeWidth={3.2} strokeLinecap="round" d="M90 98 Q100 84 110 98" />
          {boton(74, 76)}
          {boton(126, 76)}
        </>
      );
    case "conjunto":
      return (
        <>
          <g transform="translate(22 6) scale(0.78)">
            <path {...comun} strokeWidth={3} d="M70 34 L88 28 L100 40 L112 28 L130 34 L166 56 L152 88 L138 80 L138 150 L62 150 L62 80 L48 88 L34 56 Z" />
            <path {...comun} strokeWidth={3} fill="#FFFDF9" d="M80 30 L100 44 L120 30 L132 40 L100 62 L68 40 Z" />
            <path {...linea} strokeWidth={2.6} d="M76 44 L100 58 L124 44" stroke={acento === "#FFFDF9" ? TRAZO : acento} />
          </g>
          <g transform="translate(36 112) scale(0.64)">
            <path {...comun} strokeWidth={3.6} fill={acento === "#FFFDF9" ? relleno : acento} d="M56 30 L144 30 L154 110 L110 116 L100 70 L90 116 L46 110 Z" />
          </g>
        </>
      );
    case "pijama":
      return (
        <>
          <path {...comun} d="M72 26 L128 26 L164 46 L172 92 L158 96 L146 64 L142 112 L58 112 L54 64 L42 96 L28 92 L36 46 Z" />
          <path {...linea} d="M84 26 Q100 40 116 26" />
          <path {...comun} d="M62 116 L138 116 L144 186 L108 188 L100 140 L92 188 L56 186 Z" />
          <path {...linea} d="M64 126 L136 126" />
        </>
      );
    case "deportivo":
      return (
        <>
          <path {...comun} d="M80 30 Q100 6 120 30 L158 48 L170 98 L156 102 L146 68 L142 114 L58 114 L54 68 L44 102 L30 98 L42 48 Z" />
          <path {...comun} fill={acento} d="M84 30 Q100 14 116 30 Q108 40 100 40 Q92 40 84 30 Z" />
          <path {...linea} d="M100 40 L100 112 M78 84 L122 84 L118 104 L82 104 Z" />
          <path {...comun} d="M62 118 L138 118 L140 184 L108 186 L100 140 L92 186 L60 184 Z" />
          <path {...linea} d="M62 176 L92 178 M108 178 L140 176" />
        </>
      );
    case "gorro":
      return (
        <>
          <path {...comun} d="M54 112 Q54 40 100 40 Q146 40 146 112 Z" />
          <path {...comun} fill={acento} d="M50 108 L150 108 Q152 124 150 130 L50 130 Q48 124 50 108 Z" />
          <path {...linea} d="M66 112 L66 128 M82 112 L82 128 M100 112 L100 128 M118 112 L118 128 M134 112 L134 128" strokeOpacity={0.25} />
          <path {...comun} d="M58 150 Q58 140 66 140 L80 140 Q88 140 88 150 L88 178 Q74 186 58 178 Z" />
          <path {...comun} d="M112 150 Q112 140 120 140 L134 140 Q142 140 142 150 L142 178 Q128 186 112 178 Z" />
        </>
      );
    case "ajuar":
      return (
        <>
          <path {...comun} fill={acento} d="M30 150 L170 150 L162 186 L38 186 Z" />
          <path {...comun} d="M44 118 L156 118 L160 150 L40 150 Z" />
          <path {...comun} d="M58 96 Q100 104 142 96 L150 118 L50 118 Z" />
          <path {...comun} d="M76 52 Q76 22 100 22 Q124 22 124 52 Z" />
          <path {...comun} fill={acento} d="M72 50 L128 50 L128 60 L72 60 Z" />
          <path fill="none" stroke="#A8495A" strokeWidth={3} d="M100 118 L100 186 M30 166 L170 166" strokeOpacity={0.55} />
          <path fill="#E7B4B4" stroke={TRAZO} strokeOpacity={0.5} strokeWidth={1.6} d="M100 150 L84 140 L86 158 Z M100 150 L116 140 L114 158 Z" />
        </>
      );
    case "zapato":
      return (
        <>
          <path {...comun} d="M34 136 Q32 106 64 102 L116 98 Q150 96 166 120 Q172 138 152 144 L48 146 Q34 146 34 136 Z" />
          <path {...comun} fill="#FFFDF9" d="M34 138 Q38 154 52 154 L154 152 Q170 150 168 138 Q160 146 150 146 L48 148 Z" />
          <path {...linea} d="M80 102 Q96 120 120 98" />
          <path {...comun} fill={acento} d="M66 104 L76 128 L84 126 L74 102 Z" />
          {boton(78, 124, 3)}
        </>
      );
    case "tenis":
      return (
        <>
          <path {...comun} d="M30 132 Q28 96 60 92 L84 90 Q96 80 110 88 L134 102 Q168 110 170 132 L170 140 L30 142 Z" />
          <path {...comun} fill="#FFFDF9" d="M28 140 L172 138 Q174 154 160 156 L42 158 Q28 158 28 140 Z" />
          <path {...linea} d="M90 96 L112 112 M84 104 L106 120 M96 90 L118 104" />
          <path fill="#FFFDF9" stroke={TRAZO} strokeOpacity={0.5} strokeWidth={1.6} d="M54 106 L57 113 L65 114 L59 119 L61 127 L54 123 L47 127 L49 119 L43 114 L51 113 Z" />
          <path {...linea} d="M140 108 L170 120" strokeOpacity={0.3} />
        </>
      );
    case "sandalia":
      return (
        <>
          <path {...comun} fill="#FFFDF9" d="M30 146 Q30 132 46 132 L156 130 Q172 132 172 146 Q172 158 156 158 L46 158 Q30 158 30 146 Z" />
          <path {...comun} d="M58 132 Q60 96 84 96 L92 132 Z" />
          <path {...comun} d="M108 131 Q114 102 134 108 Q148 112 150 130 Z" />
          <path {...comun} d="M40 132 Q36 110 54 110 L60 112 L58 132 Z" />
          {boton(70, 116, 3)}
        </>
      );
    case "balaca":
      return (
        <>
          <path fill="none" stroke={TRAZO} strokeOpacity={0.55} strokeWidth={14} strokeLinecap="round" d="M44 150 Q44 52 100 52 Q156 52 156 150" />
          <path fill="none" stroke={relleno} strokeWidth={10} strokeLinecap="round" d="M44 150 Q44 52 100 52 Q156 52 156 150" />
          <path {...comun} fill={acento} d="M100 58 Q76 30 62 46 Q54 62 72 70 Q86 74 100 62 Z M100 58 Q124 30 138 46 Q146 62 128 70 Q114 74 100 62 Z" />
          <path {...comun} fill={acento} d="M96 62 L86 92 L96 88 L100 64 L104 88 L114 92 L104 62 Z" />
          <circle cx={100} cy={60} r={7} fill={relleno} stroke={TRAZO} strokeOpacity={0.55} strokeWidth={2} />
        </>
      );
    case "babero":
      return (
        <>
          <path {...comun} d="M30 52 Q100 76 170 52 L162 70 Q140 150 100 178 Q60 150 38 70 Z" />
          <path {...comun} fill="#FFFDF9" d="M64 62 Q100 92 136 62 Q120 50 100 56 Q80 50 64 62 Z" />
          {boton(36, 60, 3)}
          {boton(164, 60, 3)}
        </>
      );
    case "manta":
      return (
        <>
          <path {...comun} d="M40 70 L150 54 L166 150 L56 170 Z" />
          <path {...linea} d="M48 78 L148 64 M60 160 L158 142" strokeOpacity={0.25} />
          <path {...comun} fill={acento} d="M120 160 Q118 128 140 120 Q164 114 170 140 Q172 160 152 166 Q132 170 120 160 Z" />
          <path {...linea} d="M136 140 Q144 130 154 140" />
        </>
      );
  }
}

function patron(id: string, p: Patron, acento: string, base: string) {
  if (p === "liso") return null;
  const tinta = acento === "#FFFDF9" ? "#FFFDF9" : acento;
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={p === "cuadros" ? 22 : p === "rayas" ? 14 : 18} height={p === "cuadros" ? 22 : p === "rayas" ? 14 : 18}>
      <rect width="100%" height="100%" fill={base} />
      {p === "rayas" && <rect y={0} width={14} height={6} fill={tinta} opacity={0.9} />}
      {p === "cuadros" && (
        <>
          <rect width={11} height={22} fill={tinta} opacity={0.55} />
          <rect width={22} height={11} fill="#F6D9A8" opacity={0.5} />
        </>
      )}
      {p === "puntos" && <circle cx={9} cy={9} r={2.4} fill={tinta === base ? "#FFFDF9" : tinta} opacity={0.95} />}
      {p === "estrellas" && <path d="M9 3 L10.6 7.2 L15 7.4 L11.6 10.2 L12.8 14.6 L9 12 L5.2 14.6 L6.4 10.2 L3 7.4 L7.4 7.2 Z" fill={tinta} opacity={0.9} />}
    </pattern>
  );
}

export function Ilustracion({
  tipo,
  color,
  acento = "#FFFDF9",
  patron: p = "liso",
  className,
  titulo,
}: {
  tipo: Tipo;
  color: string;
  acento?: string;
  patron?: Patron;
  className?: string;
  titulo?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const idPatron = `pt-${uid}`;
  const relleno = p === "liso" ? color : `url(#${idPatron})`;
  return (
    <svg viewBox="0 0 200 200" className={className} role={titulo ? "img" : undefined} aria-hidden={titulo ? undefined : true} aria-label={titulo}>
      <defs>{patron(idPatron, p, acento, color)}</defs>
      <ellipse cx={100} cy={190} rx={62} ry={6} fill="#4A3438" opacity={0.07} />
      {formas(tipo, relleno, acento)}
    </svg>
  );
}
