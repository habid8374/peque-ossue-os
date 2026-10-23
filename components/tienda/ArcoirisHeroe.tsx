import { Ilustracion } from "./Ilustracion";

/** Pieza visual de la portada: el arcoíris del logo que se dibuja una sola vez. */
export function ArcoirisHeroe() {
  const arcos = [
    { r: 200, color: "#E7B4B4", w: 30 },
    { r: 164, color: "#CDB9E3", w: 30 },
    { r: 128, color: "#F3CF9C", w: 30 },
    { r: 92, color: "#C9D6BF", w: 30 },
  ];
  return (
    <div className="arco-anim relative mx-auto aspect-[5/4] w-full max-w-[230px] sm:max-w-[440px] lg:max-w-[560px]" aria-hidden="true">
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
        <g fill="none" strokeLinecap="round">
          {arcos.map((a) => {
            const largo = Math.PI * a.r;
            return (
              <path
                key={a.r}
                d={`M ${250 - a.r} 330 A ${a.r} ${a.r} 0 0 1 ${250 + a.r} 330`}
                stroke={a.color}
                strokeWidth={a.w}
                style={{ "--largo": largo.toFixed(1) } as React.CSSProperties}
              />
            );
          })}
        </g>
        {/* Luna dormida */}
        <g transform="translate(46 70)">
          <path d="M40 0 A40 40 0 1 0 72 62 A32 32 0 1 1 40 0 Z" fill="#F7E3B5" stroke="#4A3438" strokeOpacity={0.25} strokeWidth={2} />
          <path d="M26 44 Q32 49 38 44" fill="none" stroke="#4A3438" strokeOpacity={0.6} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={24} cy={54} r={5} fill="#EDB8BE" />
        </g>
        {/* Estrellas */}
        {[
          [430, 70, 1],
          [392, 26, 0.7],
          [150, 30, 0.6],
        ].map(([x, y, s], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${s})`}
            d="M0 -14 L4 -4 L15 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-15 -4 L-4 -4 Z"
            fill={["#F3CF9C", "#CDB9E3", "#EDB8BE"][i]}
          />
        ))}
        <g className="nube-heroe">
          <path
            d="M120 352 Q96 352 96 330 Q96 306 122 306 Q126 276 158 276 Q176 252 208 262 Q230 236 264 252 Q296 238 314 266 Q348 262 356 292 Q392 290 396 322 Q398 352 370 352 Z"
            fill="#FFFDF9"
            stroke="#4A3438"
            strokeOpacity={0.2}
            strokeWidth={2.5}
          />
          <path d="M250 312 C240 300 226 312 236 322 L250 334 L264 322 C274 312 260 300 250 312 Z" fill="#E7B4B4" />
        </g>
      </svg>
      <div className="absolute top-[30%] left-1/2 w-[36%] -translate-x-1/2">
        <Ilustracion tipo="vestido" color="#EDB8BE" acento="#FFFDF9" patron="puntos" className="h-auto w-full drop-shadow-sm" />
      </div>
    </div>
  );
}
