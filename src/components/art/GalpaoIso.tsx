import { useId, useMemo } from 'react';

/* ============================================================
   A7 — Galpão em isometria, gerado por parâmetros.
   modulos: quantos pórticos de profundidade (3 a 7)
   altura:  fator de pé-direito (0.4 a 1.0)
   tom:     par de cinzas
   ============================================================ */

const W = 400;
const H = 250;
const DX = 30;
const DY = -17;

const LX = 34;
const RX = 196;
const BASE_Y = 200;

const TONS = [
  { telhado: '#454c54', telhadoEsc: '#343a41', parede: '#2b3036', paredeEsc: '#1e2227' },
  { telhado: '#3e444b', telhadoEsc: '#2f343a', parede: '#262b31', paredeEsc: '#1b1f23' },
  { telhado: '#4c545d', telhadoEsc: '#3a4149', parede: '#30363d', paredeEsc: '#22262b' },
] as const;

interface Props {
  modulos: number;
  altura: number;
  tom: 0 | 1 | 2;
  className?: string;
  alt?: string;
}

export function GalpaoIso({ modulos, altura, tom, className, alt }: Props) {
  const uid = useId().replace(/:/g, '');
  const c = TONS[tom];

  const g = useMemo(() => {
    const n = Math.max(2, Math.min(8, modulos));
    const eaveY = BASE_Y - 46 - altura * 62;
    const apexX = (LX + RX) / 2;
    const apexY = eaveY - 30;
    const ddx = n * DX;
    const ddy = n * DY;

    const p = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

    return {
      n,
      eaveY,
      apexX,
      apexY,
      ddx,
      ddy,
      lateral: `M${p(RX, BASE_Y)} L${p(RX, eaveY)} L${p(RX + ddx, eaveY + ddy)} L${p(RX + ddx, BASE_Y + ddy)} Z`,
      aguaEsq: `M${p(LX, eaveY)} L${p(apexX, apexY)} L${p(apexX + ddx, apexY + ddy)} L${p(LX + ddx, eaveY + ddy)} Z`,
      aguaDir: `M${p(apexX, apexY)} L${p(RX, eaveY)} L${p(RX + ddx, eaveY + ddy)} L${p(apexX + ddx, apexY + ddy)} Z`,
      frente: `M${p(LX, BASE_Y)} L${p(LX, eaveY)} L${p(apexX, apexY)} L${p(RX, eaveY)} L${p(RX, BASE_Y)} Z`,
      cumeeira: `M${p(apexX, apexY)} L${p(apexX + ddx, apexY + ddy)}`,
    };
  }, [modulos, altura]);

  const sheenId = `iso-sheen-${uid}`;
  const clipId = `iso-clip-${uid}`;

  // portão proporcional
  const portaoW = 56;
  const portaoH = Math.min(52, (BASE_Y - g.eaveY) * 0.6);
  const portaoX = (LX + RX) / 2 - portaoW / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`lk-iso ${className ?? ''}`.trim()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={alt ?? 'Ilustração isométrica de galpão em estrutura metálica'}
    >
      <defs>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="30%" stopColor="#e3c98a" stopOpacity="0" />
          <stop offset="50%" stopColor="#e3c98a" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#e3c98a" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={g.aguaEsq} />
          <path d={g.aguaDir} />
        </clipPath>
      </defs>

      {/* sombra projetada */}
      <ellipse
        cx={(LX + RX) / 2 + g.ddx / 2}
        cy={BASE_Y + 14}
        rx={(RX - LX + g.ddx) / 2}
        ry="11"
        fill="#000"
        opacity="0.35"
      />

      {/* lateral */}
      <path d={g.lateral} fill={c.paredeEsc} stroke="#171a1e" strokeWidth="1" />
      <g stroke="#171a1e" strokeWidth="1" opacity="0.8">
        {Array.from({ length: g.n - 1 }, (_, i) => {
          const x = RX + DX * (i + 1);
          const y = g.eaveY + DY * (i + 1);
          return <path key={i} d={`M${x} ${BASE_Y + DY * (i + 1)} L${x} ${y}`} />;
        })}
      </g>

      {/* águas do telhado */}
      <path d={g.aguaEsq} fill={c.telhado} stroke="#171a1e" strokeWidth="1" />
      <path d={g.aguaDir} fill={c.telhadoEsc} stroke="#171a1e" strokeWidth="1" />

      {/* terças sobre a água direita */}
      <g stroke="#171a1e" strokeWidth="0.8" opacity="0.55">
        {Array.from({ length: g.n }, (_, i) => {
          const f = (i + 1) / (g.n + 1);
          return (
            <path
              key={i}
              d={`M${g.apexX + g.ddx * f} ${g.apexY + g.ddy * f} L${RX + g.ddx * f} ${g.eaveY + g.ddy * f}`}
            />
          );
        })}
      </g>

      {/* cumeeira */}
      <path d={g.cumeeira} stroke="#8a9099" strokeWidth="2" opacity="0.7" />

      {/* brilho metálico no hover */}
      <g clipPath={`url(#${clipId})`}>
        <rect className="lk-iso__sheen" x="-150" y="0" width="120" height={H} fill={`url(#${sheenId})`} />
      </g>

      {/* fachada */}
      <path d={g.frente} fill={c.parede} stroke="#171a1e" strokeWidth="1.2" />

      {/* tesoura aparente na fachada */}
      <g stroke="#5c6670" strokeWidth="1" fill="none" opacity="0.55">
        <path d={`M${LX} ${g.eaveY} L${RX} ${g.eaveY}`} />
        <path d={`M${g.apexX} ${g.apexY} L${g.apexX} ${g.eaveY}`} />
        <path d={`M${LX} ${g.eaveY} L${g.apexX - (g.apexX - LX) / 2} ${(g.apexY + g.eaveY) / 2}`} />
        <path d={`M${RX} ${g.eaveY} L${g.apexX + (RX - g.apexX) / 2} ${(g.apexY + g.eaveY) / 2}`} />
      </g>

      {/* portão */}
      <rect
        x={portaoX}
        y={BASE_Y - portaoH}
        width={portaoW}
        height={portaoH}
        fill={c.paredeEsc}
        stroke="#171a1e"
        strokeWidth="1"
      />
      <g stroke="#171a1e" strokeWidth="0.8" opacity="0.7">
        {Array.from({ length: 4 }, (_, i) => (
          <path
            key={i}
            d={`M${portaoX} ${BASE_Y - portaoH + ((i + 1) * portaoH) / 5} L${portaoX + portaoW} ${BASE_Y - portaoH + ((i + 1) * portaoH) / 5}`}
          />
        ))}
      </g>

      {/* chão */}
      <path
        d={`M${LX} ${BASE_Y} L${RX + g.ddx} ${BASE_Y + g.ddy} `}
        stroke="#171a1e"
        strokeWidth="1"
        opacity="0"
      />
    </svg>
  );
}
