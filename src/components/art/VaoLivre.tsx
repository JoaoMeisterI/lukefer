import { useId, useMemo } from 'react';
import { pilaresEliminados } from '../../lib/simulador';

/* ============================================================
   A4 — Corte transversal paramétrico do galpão.
   A geometria é função do vão (12 a 40 m): os pilares se
   afastam, a tesoura se estica e a cota acompanha.
   ============================================================ */

const W = 560;
const H = 300;
const CX = 280;
const BASE_Y = 252;
const EAVE_Y = 148;
const PX_MIN = 190;
const PX_MAX = 450;
const VAO_MIN = 12;
const VAO_MAX = 40;

export function VaoLivre({ vao, className }: { vao: number; className?: string }) {
  const uid = useId().replace(/:/g, '');

  const g = useMemo(() => {
    const t = (vao - VAO_MIN) / (VAO_MAX - VAO_MIN);
    const largura = PX_MIN + t * (PX_MAX - PX_MIN);
    const left = CX - largura / 2;
    const right = CX + largura / 2;
    const apexY = EAVE_Y - (largura / 2) * 0.24;

    const painéis = Math.max(6, Math.min(12, Math.round(vao / 3)));
    const nos: { x: number; y: number }[] = [];
    for (let i = 0; i <= painéis; i += 1) {
      const x = left + (largura * i) / painéis;
      const r = Math.abs(x - CX) / (largura / 2);
      nos.push({ x, y: apexY + r * (EAVE_Y - apexY) });
    }

    const topo = nos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const base = `M${left.toFixed(1)} ${EAVE_Y} L${right.toFixed(1)} ${EAVE_Y}`;

    const webs: string[] = [];
    for (let i = 1; i < painéis; i += 1) {
      webs.push(`M${nos[i].x.toFixed(1)} ${nos[i].y.toFixed(1)} L${nos[i].x.toFixed(1)} ${EAVE_Y}`);
    }
    for (let i = 0; i < painéis; i += 1) {
      const a = nos[i];
      const b = nos[i + 1];
      if (i < painéis / 2) webs.push(`M${a.x.toFixed(1)} ${EAVE_Y} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      else webs.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${EAVE_Y}`);
    }

    // pilares que o concreto exigiria no mesmo vão
    const nFantasma = pilaresEliminados(vao);
    const fantasmas: number[] = [];
    for (let i = 1; i <= nFantasma; i += 1) {
      fantasmas.push(left + (largura * i) / (nFantasma + 1));
    }

    return { largura, left, right, apexY, topo, base, webs, fantasmas };
  }, [vao]);

  const gradId = `vl-roof-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`lk-vao-svg ${className ?? ''}`.trim()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Corte de galpão com vão livre de ${vao} metros`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4047" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a1d21" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* solo */}
      <path d={`M20 ${BASE_Y} L${W - 20} ${BASE_Y}`} stroke="#272b31" strokeWidth="2" />
      {Array.from({ length: 22 }, (_, i) => (
        <path
          key={i}
          d={`M${26 + i * 24} ${BASE_Y + 3} L${18 + i * 24} ${BASE_Y + 11}`}
          stroke="#1a1d21"
          strokeWidth="1.5"
        />
      ))}

      {/* água do telhado */}
      <path
        d={`${g.topo} L${g.right.toFixed(1)} ${EAVE_Y} L${g.left.toFixed(1)} ${EAVE_Y} Z`}
        fill={`url(#${gradId})`}
        stroke="none"
      />

      {/* pilares fantasma do concreto */}
      <g className="lk-vao__fantasma" stroke="#3a4047" strokeWidth="9" strokeDasharray="5 6" opacity="0.5">
        {g.fantasmas.map((x, i) => (
          <path key={i} d={`M${x.toFixed(1)} ${BASE_Y} L${x.toFixed(1)} ${EAVE_Y + 4}`} />
        ))}
      </g>

      {/* treliça */}
      <g fill="none" strokeLinecap="round">
        {g.webs.map((d, i) => (
          <path key={i} d={d} stroke="#5c6670" strokeWidth="1.3" />
        ))}
        <path d={g.topo} stroke="#c2c8cf" strokeWidth="3" strokeLinejoin="round" />
        <path d={g.base} stroke="#c2c8cf" strokeWidth="3" />
      </g>

      {/* pilares reais */}
      <g stroke="#8a9099" strokeWidth="7" strokeLinecap="square" className="lk-vao__pilar">
        <path d={`M${g.left.toFixed(1)} ${BASE_Y} L${g.left.toFixed(1)} ${EAVE_Y}`} />
        <path d={`M${g.right.toFixed(1)} ${BASE_Y} L${g.right.toFixed(1)} ${EAVE_Y}`} />
      </g>

      {/* sapatas */}
      <g fill="#272b31">
        <rect x={g.left - 13} y={BASE_Y - 5} width="26" height="7" rx="1.5" />
        <rect x={g.right - 13} y={BASE_Y - 5} width="26" height="7" rx="1.5" />
      </g>

      {/* cota do vão */}
      <g stroke="#c8a45c" fill="none" strokeWidth="1.3">
        <path d={`M${g.left.toFixed(1)} ${BASE_Y + 26} L${CX - 38} ${BASE_Y + 26}`} />
        <path d={`M${CX + 38} ${BASE_Y + 26} L${g.right.toFixed(1)} ${BASE_Y + 26}`} />
        <path d={`M${g.left.toFixed(1)} ${BASE_Y + 20} L${g.left.toFixed(1)} ${BASE_Y + 32}`} />
        <path d={`M${g.right.toFixed(1)} ${BASE_Y + 20} L${g.right.toFixed(1)} ${BASE_Y + 32}`} />
        <path d={`M${(g.left + 7).toFixed(1)} ${BASE_Y + 22} L${g.left.toFixed(1)} ${BASE_Y + 26} L${(g.left + 7).toFixed(1)} ${BASE_Y + 30}`} />
        <path d={`M${(g.right - 7).toFixed(1)} ${BASE_Y + 22} L${g.right.toFixed(1)} ${BASE_Y + 26} L${(g.right - 7).toFixed(1)} ${BASE_Y + 30}`} />
      </g>
      <rect x={CX - 32} y={BASE_Y + 15} width="64" height="22" rx="11" fill="#0a0b0d" stroke="#5c4720" />
      <text
        x={CX}
        y={BASE_Y + 30}
        textAnchor="middle"
        fill="#c8a45c"
        fontSize="12.5"
        fontFamily="'JetBrains Mono', monospace"
      >
        {vao} m
      </text>
    </svg>
  );
}
