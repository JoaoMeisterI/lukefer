import { useId } from 'react';

/* ============================================================
   A8 — Corte da fábrica: ponte rolante deslizando sobre o
   caminho de rolamento, perfis estocados e faíscas de solda.
   Duas animações contínuas, ambas só em transform/opacity.
   ============================================================ */

const W = 560;
const H = 360;
const PISO = 300;
const COL_L = 46;
const COL_R = 514;
const EAVE = 118;
const APEX_Y = 62;
const TRILHO = 158;

export function FabricaCena({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const gradTelha = `fab-telha-${uid}`;
  const gradPiso = `fab-piso-${uid}`;

  const meio = (COL_L + COL_R) / 2;

  // treliça do telhado
  const nos: { x: number; y: number }[] = [];
  const painéis = 12;
  for (let i = 0; i <= painéis; i += 1) {
    const x = COL_L + ((COL_R - COL_L) * i) / painéis;
    const r = Math.abs(x - meio) / ((COL_R - COL_L) / 2);
    nos.push({ x, y: APEX_Y + r * (EAVE - APEX_Y) });
  }
  const topo = nos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const webs: string[] = [];
  for (let i = 1; i < painéis; i += 1) {
    webs.push(`M${nos[i].x.toFixed(1)} ${nos[i].y.toFixed(1)} L${nos[i].x.toFixed(1)} ${EAVE}`);
  }
  for (let i = 0; i < painéis; i += 1) {
    const a = nos[i];
    const b = nos[i + 1];
    if (i < painéis / 2) webs.push(`M${a.x.toFixed(1)} ${EAVE} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
    else webs.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${EAVE}`);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`lk-fabrica-svg ${className ?? ''}`.trim()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Corte da fábrica: ponte rolante sobre o caminho de rolamento, perfis estocados e posto de solda."
    >
      <defs>
        <linearGradient id={gradTelha} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4047" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a1d21" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={gradPiso} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1d21" />
          <stop offset="100%" stopColor="#0a0b0d" />
        </linearGradient>
      </defs>

      {/* piso */}
      <rect x="0" y={PISO} width={W} height={H - PISO} fill={`url(#${gradPiso})`} />
      <path d={`M0 ${PISO} L${W} ${PISO}`} stroke="#272b31" strokeWidth="2" />

      {/* plano da cobertura */}
      <path d={`${topo} L${COL_R} ${EAVE} L${COL_L} ${EAVE} Z`} fill={`url(#${gradTelha})`} />

      {/* treliça */}
      <g fill="none" strokeLinecap="round">
        {webs.map((d, i) => (
          <path key={i} d={d} stroke="#3a4047" strokeWidth="1.1" />
        ))}
        <path d={topo} stroke="#5c6670" strokeWidth="2.4" strokeLinejoin="round" />
        <path d={`M${COL_L} ${EAVE} L${COL_R} ${EAVE}`} stroke="#5c6670" strokeWidth="2.4" />
      </g>

      {/* pilares */}
      <g stroke="#5c6670" strokeWidth="6" strokeLinecap="square">
        <path d={`M${COL_L} ${PISO} L${COL_L} ${EAVE}`} />
        <path d={`M${COL_R} ${PISO} L${COL_R} ${EAVE}`} />
      </g>

      {/* caminho de rolamento */}
      <g stroke="#3a4047" strokeWidth="4">
        <path d={`M${COL_L} ${TRILHO} L${COL_R} ${TRILHO}`} />
      </g>
      <g stroke="#272b31" strokeWidth="2">
        <path d={`M${COL_L} ${TRILHO + 8} L${COL_R} ${TRILHO + 8}`} />
      </g>

      {/* ponte rolante */}
      <g className="lk-fab__ponte">
        <rect x="150" y={TRILHO - 12} width="128" height="13" rx="2" fill="#272b31" stroke="#5c6670" strokeWidth="1.2" />
        <rect x="196" y={TRILHO + 1} width="36" height="14" rx="2" fill="#3a4047" stroke="#8a9099" strokeWidth="1" />
        {/* cabo e gancho */}
        <g className="lk-fab__gancho">
          <path d={`M214 ${TRILHO + 15} L214 ${TRILHO + 74}`} stroke="#8a9099" strokeWidth="1.2" />
          <path d={`M208 ${TRILHO + 74} L220 ${TRILHO + 74}`} stroke="#8a9099" strokeWidth="2.5" />
          {/* viga içada */}
          <g>
            <rect x="156" y={TRILHO + 78} width="116" height="7" rx="1" fill="#454c54" />
            <rect x="156" y={TRILHO + 85} width="116" height="3" rx="1" fill="#2b3036" />
            <rect x="208" y={TRILHO + 85} width="12" height="22" fill="#3a4047" />
            <rect x="156" y={TRILHO + 107} width="116" height="7" rx="1" fill="#30363d" />
          </g>
        </g>
      </g>

      {/* estoque de perfis */}
      <g>
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 5 - row }, (_, i) => (
            <rect
              key={`${row}-${i}`}
              x={66 + i * 17 + row * 8.5}
              y={PISO - 12 - row * 11}
              width="15"
              height="10"
              rx="1.5"
              fill={row % 2 ? '#2b3036' : '#343a41'}
              stroke="#171a1e"
              strokeWidth="0.8"
            />
          )),
        )}
      </g>

      {/* bancada de solda */}
      <g>
        <rect x="372" y={PISO - 42} width="112" height="7" rx="1.5" fill="#343a41" />
        <path d={`M384 ${PISO - 35} L384 ${PISO}`} stroke="#272b31" strokeWidth="4" />
        <path d={`M472 ${PISO - 35} L472 ${PISO}`} stroke="#272b31" strokeWidth="4" />
        <rect x="398" y={PISO - 54} width="62" height="12" rx="1.5" fill="#454c54" stroke="#171a1e" strokeWidth="0.8" />

        {/* faíscas — apenas opacidade, sem blur */}
        <g className="lk-fab__faiscas" fill="#5ac8fa">
          <circle className="lk-fab__faisca lk-fab__faisca--1" cx="428" cy={PISO - 58} r="2.6" />
          <circle className="lk-fab__faisca lk-fab__faisca--2" cx="436" cy={PISO - 64} r="1.8" />
          <circle className="lk-fab__faisca lk-fab__faisca--3" cx="420" cy={PISO - 66} r="1.5" />
          <circle className="lk-fab__faisca lk-fab__faisca--2" cx="444" cy={PISO - 57} r="1.3" />
        </g>
        <g className="lk-fab__faiscas" fill="#e3c98a">
          <circle className="lk-fab__faisca lk-fab__faisca--3" cx="432" cy={PISO - 60} r="1.6" />
          <circle className="lk-fab__faisca lk-fab__faisca--1" cx="424" cy={PISO - 62} r="1.2" />
        </g>
      </g>

      {/* lanternim */}
      <g stroke="#3a4047" strokeWidth="1.4" fill="none">
        <path d={`M${meio - 42} ${APEX_Y + 6} L${meio - 42} ${APEX_Y - 16} L${meio + 42} ${APEX_Y - 16} L${meio + 42} ${APEX_Y + 6}`} />
        <path d={`M${meio - 20} ${APEX_Y - 16} L${meio - 20} ${APEX_Y + 2}`} opacity="0.6" />
        <path d={`M${meio + 20} ${APEX_Y - 16} L${meio + 20} ${APEX_Y + 2}`} opacity="0.6" />
      </g>
    </svg>
  );
}
