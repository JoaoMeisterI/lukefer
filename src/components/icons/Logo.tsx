import { useId } from 'react';

/* ============================================================
   Monograma LF — reconstrução geométrica do logo da Lukefer.
   Quatro perfis verticais escalonados (o "L") + pórtico com
   água de telhado, e o "F" em perfil com arremates diagonais.
   ============================================================ */

/** Perfis verticais escalonados + pé do "L" */
const PATH_L =
  'M0 42.6 L16.7 34 L16.7 108.2 L57.1 108.2 L57.1 120.9 L0 120.9 Z';

/** Segundo perfil */
const PATH_B2 = 'M23.7 25.5 L31.2 20.5 L31.2 108.2 L23.7 108.2 Z';

/** Terceiro perfil */
const PATH_B3 = 'M34.6 18.5 L41.5 13.5 L41.5 108.2 L34.6 108.2 Z';

/** Pilar alto + água do telhado */
const PATH_PORTICO =
  'M45.6 120.9 L45.6 7.5 L58 0 L119 41 L113.4 49.3 L52.8 8.5 L52.8 120.9 Z';

/** "F" com arremates diagonais */
const PATH_F =
  'M62.3 120.9 L62.3 46.6 L119.9 46.6 L111.5 59.8 L76.2 59.8 L76.2 67 L107 67 L98.6 80.2 L76.2 80.2 L76.2 120.9 Z';

const PARTES = [PATH_L, PATH_B2, PATH_B3, PATH_PORTICO, PATH_F];

export type VarianteLogo = 'prata' | 'dourado' | 'contorno';

interface LogoMarcaProps {
  variante?: VarianteLogo;
  size?: number;
  className?: string;
  /** Ativa o desenho progressivo (usado no hero) */
  desenhar?: boolean;
}

export function LogoMarca({
  variante = 'prata',
  size = 32,
  className,
  desenhar = false,
}: LogoMarcaProps) {
  const uid = useId().replace(/:/g, '');
  const gradId = `lk-logo-grad-${uid}`;

  const fill =
    variante === 'dourado'
      ? `url(#${gradId})`
      : variante === 'contorno'
        ? 'none'
        : 'currentColor';

  return (
    <svg
      viewBox="0 0 122 122"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      {variante === 'dourado' && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E3C98A" />
            <stop offset="45%" stopColor="#C8A45C" />
            <stop offset="100%" stopColor="#9B7B3A" />
          </linearGradient>
        </defs>
      )}
      <g
        fill={fill}
        stroke={variante === 'contorno' ? 'currentColor' : 'none'}
        strokeWidth={variante === 'contorno' ? 2 : 0}
        strokeLinejoin="round"
      >
        {PARTES.map((d, i) => (
          <path
            key={i}
            d={d}
            className={desenhar ? 'lk-logo-draw' : undefined}
            style={desenhar ? ({ '--i': i } as React.CSSProperties) : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

interface LogoProps {
  variante?: VarianteLogo;
  size?: number;
  comTexto?: boolean;
  className?: string;
}

export function Logo({ variante = 'prata', size = 34, comTexto = true, className }: LogoProps) {
  return (
    <span className={`lk-logo ${className ?? ''}`.trim()}>
      <LogoMarca variante={variante} size={size} />
      {comTexto && (
        <span className="lk-logo__texto">
          <span className="lk-logo__nome">LUKEFER</span>
          <span className="lk-logo__tag">Galpões e Estruturas Metálicas</span>
        </span>
      )}
    </span>
  );
}
