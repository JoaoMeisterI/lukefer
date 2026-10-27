import { useId, useMemo } from 'react';

/* ============================================================
   A1 — Pórtico de galpão sendo montado (hero)
   Ordem real de montagem: sapatas -> pilares -> tesouras ->
   terças -> cobertura -> cota de vão livre -> brilho metálico.
   Tudo em CSS; nenhum SMIL, nenhum rAF.
   ============================================================ */

const W = 640;
const H = 420;

const BAYS = 4; // 4 pórticos = 3 vãos de profundidade
const DX = 46;
const DY = -26;

const COL_L = 62;
const COL_R = 418;
const BASE_Y = 348;
const EAVE_Y = 212;
const APEX_X = (COL_L + COL_R) / 2;
const APEX_Y = 132;
const PANELS = 8;

interface Pt {
  x: number;
  y: number;
}

/** Altura do banzo superior (duas águas) num x qualquer */
function topChordY(x: number): number {
  const t = Math.abs(x - APEX_X) / (APEX_X - COL_L);
  return APEX_Y + t * (EAVE_Y - APEX_Y);
}

interface Frame {
  ox: number;
  oy: number;
  colL: Pt[];
  colR: Pt[];
  topChord: string;
  bottomChord: string;
  webs: string[];
  nosTopo: Pt[];
}

function montarFrame(k: number): Frame {
  const ox = k * DX;
  const oy = k * DY;
  const off = (p: Pt): Pt => ({ x: p.x + ox, y: p.y + oy });

  const nosTopo: Pt[] = [];
  const webs: string[] = [];

  for (let i = 0; i <= PANELS; i += 1) {
    const x = COL_L + ((COL_R - COL_L) * i) / PANELS;
    nosTopo.push(off({ x, y: topChordY(x) }));
  }

  // montantes verticais
  for (let i = 1; i < PANELS; i += 1) {
    const no = nosTopo[i];
    webs.push(`M${no.x} ${no.y} L${no.x} ${EAVE_Y + oy}`);
  }
  // diagonais em zigue-zague
  for (let i = 0; i < PANELS; i += 1) {
    const a = nosTopo[i];
    const b = nosTopo[i + 1];
    if (i < PANELS / 2) webs.push(`M${a.x} ${EAVE_Y + oy} L${b.x} ${b.y}`);
    else webs.push(`M${a.x} ${a.y} L${b.x} ${EAVE_Y + oy}`);
  }

  const topChord = nosTopo
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`)
    .join(' ');

  const bottomChord = `M${COL_L + ox} ${EAVE_Y + oy} L${COL_R + ox} ${EAVE_Y + oy}`;

  return {
    ox,
    oy,
    colL: [off({ x: COL_L, y: BASE_Y }), off({ x: COL_L, y: EAVE_Y })],
    colR: [off({ x: COL_R, y: BASE_Y }), off({ x: COL_R, y: EAVE_Y })],
    topChord,
    bottomChord,
    webs,
    nosTopo,
  };
}

export function PorticoHero({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const frames = useMemo(() => Array.from({ length: BAYS }, (_, k) => montarFrame(k)), []);

  const first = frames[0];
  const last = frames[BAYS - 1];

  // Terças: ligam nós correspondentes do banzo superior entre pórticos
  const tercas = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i <= PANELS; i += 1) {
      const a = first.nosTopo[i];
      const b = last.nosTopo[i];
      out.push(`M${a.x} ${a.y} L${b.x} ${b.y}`);
    }
    return out;
  }, [first, last]);

  // Planos da cobertura (duas águas, em perspectiva)
  const aguaEsq = `M${first.nosTopo[0].x} ${first.nosTopo[0].y} L${APEX_X + first.ox} ${APEX_Y + first.oy} L${APEX_X + last.ox} ${APEX_Y + last.oy} L${last.nosTopo[0].x} ${last.nosTopo[0].y} Z`;
  const aguaDir = `M${APEX_X + first.ox} ${APEX_Y + first.oy} L${first.nosTopo[PANELS].x} ${first.nosTopo[PANELS].y} L${last.nosTopo[PANELS].x} ${last.nosTopo[PANELS].y} L${APEX_X + last.ox} ${APEX_Y + last.oy} Z`;

  const sheenId = `sheen-${uid}`;
  const roofId = `roof-${uid}`;
  const maskId = `mask-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`lk-portico ${className ?? ''}`.trim()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby={`t-${uid}`}
    >
      <title id={`t-${uid}`}>
        Ilustração de um pórtico de galpão em estrutura metálica: pilares, tesouras treliçadas,
        terças e cobertura, com a cota do vão livre de 30 metros.
      </title>

      <defs>
        <linearGradient id={roofId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#3a4047" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a1d21" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="35%" stopColor="#e3c98a" stopOpacity="0" />
          <stop offset="50%" stopColor="#e3c98a" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#e3c98a" stopOpacity="0" />
        </linearGradient>
        <clipPath id={maskId}>
          <path d={aguaEsq} />
          <path d={aguaDir} />
        </clipPath>
      </defs>

      {/* fase 0 — malha de planta baixa */}
      <g className="lk-po lk-po--f0" stroke="#3a4047" strokeWidth="0.75">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`gx${i}`} d={`M${40 + i * 70} ${H} L${40 + i * 70 + 110} ${H - 150}`} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <path key={`gy${i}`} d={`M${10 + i * 20} ${H - i * 36} L${W - 30} ${H - i * 36 - 40}`} />
        ))}
      </g>

      {/* fase 1 — sapatas */}
      <g className="lk-po lk-po--f1" fill="#272b31" stroke="#3a4047" strokeWidth="1">
        {frames.map((f, k) => (
          <g key={`sap${k}`}>
            <rect x={f.colL[0].x - 11} y={f.colL[0].y - 3} width="22" height="9" rx="1.5" />
            <rect x={f.colR[0].x - 11} y={f.colR[0].y - 3} width="22" height="9" rx="1.5" />
          </g>
        ))}
      </g>

      {/* fase 2 — pilares */}
      <g className="lk-po lk-po--f2" stroke="#8a9099" strokeWidth="4.5" strokeLinecap="square">
        {frames.map((f, k) => (
          <g
            key={`col${k}`}
            className="lk-po__col"
            style={{ '--i': k } as React.CSSProperties}
          >
            <path d={`M${f.colL[0].x} ${f.colL[0].y} L${f.colL[1].x} ${f.colL[1].y}`} />
            <path d={`M${f.colR[0].x} ${f.colR[0].y} L${f.colR[1].x} ${f.colR[1].y}`} />
          </g>
        ))}
      </g>

      {/* fase 3 — tesouras (line-draw) */}
      <g fill="none" strokeLinecap="round">
        {frames.map((f, k) => (
          <g key={`tr${k}`} style={{ '--i': k } as React.CSSProperties}>
            <path
              className="lk-po lk-po--f3 lk-draw"
              d={f.topChord}
              pathLength={1}
              stroke="#c2c8cf"
              strokeWidth="3"
            />
            <path
              className="lk-po lk-po--f3 lk-draw"
              d={f.bottomChord}
              pathLength={1}
              stroke="#c2c8cf"
              strokeWidth="3"
            />
            {f.webs.map((d, i) => (
              <path
                key={i}
                className="lk-po lk-po--f3b lk-draw"
                d={d}
                pathLength={1}
                stroke="#5c6670"
                strokeWidth="1.4"
              />
            ))}
          </g>
        ))}
      </g>

      {/* fase 4 — terças */}
      <g fill="none" stroke="#3a4047" strokeWidth="1.3" strokeLinecap="round">
        {tercas.map((d, i) => (
          <path
            key={i}
            className="lk-po lk-po--f4 lk-draw"
            d={d}
            pathLength={1}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>

      {/* fase 5 — cobertura */}
      <g className="lk-po lk-po--f5">
        <path d={aguaEsq} fill={`url(#${roofId})`} stroke="#3a4047" strokeWidth="1" />
        <path d={aguaDir} fill={`url(#${roofId})`} stroke="#3a4047" strokeWidth="1" />
      </g>

      {/* fase 7 — brilho metálico percorrendo a cobertura */}
      <g clipPath={`url(#${maskId})`}>
        <rect className="lk-po__sheen" x="-280" y="60" width="240" height="300" fill={`url(#${sheenId})`} />
      </g>

      {/* fase 6 — cota do vão livre */}
      <g className="lk-po lk-po--f6" stroke="#c8a45c" fill="none" strokeWidth="1.3">
        <path
          className="lk-draw"
          pathLength={1}
          d={`M${COL_L} ${BASE_Y + 28} L${APEX_X - 52} ${BASE_Y + 28}`}
        />
        <path
          className="lk-draw"
          pathLength={1}
          d={`M${APEX_X + 52} ${BASE_Y + 28} L${COL_R} ${BASE_Y + 28}`}
        />
        <path d={`M${COL_L} ${BASE_Y + 22} L${COL_L} ${BASE_Y + 34}`} />
        <path d={`M${COL_R} ${BASE_Y + 22} L${COL_R} ${BASE_Y + 34}`} />
        <path d={`M${COL_L + 7} ${BASE_Y + 24} L${COL_L} ${BASE_Y + 28} L${COL_L + 7} ${BASE_Y + 32}`} />
        <path d={`M${COL_R - 7} ${BASE_Y + 24} L${COL_R} ${BASE_Y + 28} L${COL_R - 7} ${BASE_Y + 32}`} />
      </g>
      <g className="lk-po lk-po--f6b">
        <rect
          x={APEX_X - 46}
          y={BASE_Y + 16}
          width="92"
          height="24"
          rx="12"
          fill="#0a0b0d"
          stroke="#5c4720"
        />
        <text
          x={APEX_X}
          y={BASE_Y + 32}
          textAnchor="middle"
          fill="#c8a45c"
          fontSize="13"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.5"
        >
          30 m livres
        </text>
      </g>
    </svg>
  );
}
