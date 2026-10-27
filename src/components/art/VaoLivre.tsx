import { useId, useMemo } from 'react';
import { pilaresEliminados } from '../../lib/simulador';

/* ============================================================
   Corte transversal paramétrico do galpão — a peça interativa
   da página. A geometria é função do vão (12 a 40 m): os pilares
   se afastam, a tesoura se estica e a cota acompanha.
   Paleta de desenho técnico sobre papel branco.
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

    const paineis = Math.max(6, Math.min(12, Math.round(vao / 3)));
    const nos: { x: number; y: number }[] = [];
    for (let i = 0; i <= paineis; i += 1) {
      const x = left + (largura * i) / paineis;
      const r = Math.abs(x - CX) / (largura / 2);
      nos.push({ x, y: apexY + r * (EAVE_Y - apexY) });
    }

    const topo = nos
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    const base = `M${left.toFixed(1)} ${EAVE_Y} L${right.toFixed(1)} ${EAVE_Y}`;

    const webs: string[] = [];
    for (let i = 1; i < paineis; i += 1) {
      webs.push(`M${nos[i].x.toFixed(1)} ${nos[i].y.toFixed(1)} L${nos[i].x.toFixed(1)} ${EAVE_Y}`);
    }
    for (let i = 0; i < paineis; i += 1) {
      const a = nos[i];
      const b = nos[i + 1];
      if (i < paineis / 2) {
        webs.push(`M${a.x.toFixed(1)} ${EAVE_Y} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      } else {
        webs.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${EAVE_Y}`);
      }
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
          <stop offset="0%" stopColor="#16181a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#16181a" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* solo */}
      <path d={`M20 ${BASE_Y} L${W - 20} ${BASE_Y}`} stroke="#c9c9c3" strokeWidth="1.6" />
      {Array.from({ length: 22 }, (_, i) => (
        <path
          key={i}
          d={`M${26 + i * 24} ${BASE_Y + 3} L${18 + i * 24} ${BASE_Y + 11}`}
          stroke="#e3e3df"
          strokeWidth="1.4"
        />
      ))}

      {/* água do telhado */}
      <path
        d={`${g.topo} L${g.right.toFixed(1)} ${EAVE_Y} L${g.left.toFixed(1)} ${EAVE_Y} Z`}
        fill={`url(#${gradId})`}
        stroke="none"
      />

      {/* pilares que o concreto exigiria no mesmo vão */}
      <g stroke="#c9c9c3" strokeWidth="8" strokeDasharray="4 6">
        {g.fantasmas.map((x, i) => (
          <path key={i} d={`M${x.toFixed(1)} ${BASE_Y} L${x.toFixed(1)} ${EAVE_Y + 4}`} />
        ))}
      </g>

      {/* treliça */}
      <g fill="none" strokeLinecap="round">
        {g.webs.map((d, i) => (
          <path key={i} d={d} stroke="#8b8d91" strokeWidth="1.2" />
        ))}
        <path d={g.topo} stroke="#16181a" strokeWidth="2.6" strokeLinejoin="round" />
        <path d={g.base} stroke="#16181a" strokeWidth="2.6" />
      </g>

      {/* pilares reais */}
      <g stroke="#16181a" strokeWidth="6.5" strokeLinecap="square">
        <path d={`M${g.left.toFixed(1)} ${BASE_Y} L${g.left.toFixed(1)} ${EAVE_Y}`} />
        <path d={`M${g.right.toFixed(1)} ${BASE_Y} L${g.right.toFixed(1)} ${EAVE_Y}`} />
      </g>

      {/* sapatas */}
      <g fill="#16181a">
        <rect x={g.left - 13} y={BASE_Y - 5} width="26" height="6" />
        <rect x={g.right - 13} y={BASE_Y - 5} width="26" height="6" />
      </g>

      {/* cota do vão — linha partida para não cruzar o rótulo */}
      <g stroke="#8a6520" fill="none" strokeWidth="1.3">
        <path d={`M${g.left.toFixed(1)} ${BASE_Y + 26} L${CX - 38} ${BASE_Y + 26}`} />
        <path d={`M${CX + 38} ${BASE_Y + 26} L${g.right.toFixed(1)} ${BASE_Y + 26}`} />
        <path d={`M${g.left.toFixed(1)} ${BASE_Y + 20} L${g.left.toFixed(1)} ${BASE_Y + 32}`} />
        <path d={`M${g.right.toFixed(1)} ${BASE_Y + 20} L${g.right.toFixed(1)} ${BASE_Y + 32}`} />
        <path
          d={`M${(g.left + 7).toFixed(1)} ${BASE_Y + 22} L${g.left.toFixed(1)} ${BASE_Y + 26} L${(g.left + 7).toFixed(1)} ${BASE_Y + 30}`}
        />
        <path
          d={`M${(g.right - 7).toFixed(1)} ${BASE_Y + 22} L${g.right.toFixed(1)} ${BASE_Y + 26} L${(g.right - 7).toFixed(1)} ${BASE_Y + 30}`}
        />
      </g>
      <text
        x={CX}
        y={BASE_Y + 31}
        textAnchor="middle"
        fill="#8a6520"
        fontSize="14"
        fontWeight="500"
        fontFamily="'JetBrains Mono', monospace"
      >
        {vao} m
      </text>
    </svg>
  );
}
