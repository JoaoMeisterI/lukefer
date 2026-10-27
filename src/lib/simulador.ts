import { clamp } from './format';

/* ============================================================
   Simulador — fórmulas de referência (docs/07, seção 4)
   TODAS as constantes são demonstrativas. Não é proposta comercial.
   ============================================================ */

export type TipoObra =
  | 'industrial'
  | 'comercial'
  | 'logistica'
  | 'agro'
  | 'mezanino'
  | 'cobertura'
  | 'garagem';

export const TIPOS_OBRA: { id: TipoObra; label: string }[] = [
  { id: 'industrial', label: 'Galpão industrial' },
  { id: 'comercial', label: 'Galpão comercial' },
  { id: 'logistica', label: 'Logística e armazenagem' },
  { id: 'agro', label: 'Agro / armazém' },
  { id: 'mezanino', label: 'Mezanino' },
  { id: 'cobertura', label: 'Cobertura / telhado' },
  { id: 'garagem', label: 'Garagem / área de apoio' },
];

const FATOR_TIPO: Record<TipoObra, number> = {
  industrial: 1.0,
  comercial: 0.94,
  logistica: 1.08,
  agro: 0.86,
  mezanino: 1.15,
  cobertura: 0.72,
  garagem: 0.68,
};

export const LIMITES = {
  largura: { min: 6, max: 60 },
  comprimento: { min: 6, max: 300 },
  peDireito: { min: 3, max: 20 },
} as const;

export interface EntradaSimulador {
  tipo: TipoObra;
  largura: number;
  comprimento: number;
  peDireito: number;
  mezanino: boolean;
}

export interface ResultadoSimulador {
  area: number;
  pesoAco: number;
  kgPorM2: number;
  precoM2: number;
  investMin: number;
  investMax: number;
  prazoProjeto: number;
  prazoFabrica: number;
  prazoMontagem: number;
  prazoTotal: number;
}

export function simular(e: EntradaSimulador): ResultadoSimulador {
  const largura = clamp(e.largura, LIMITES.largura.min, LIMITES.largura.max);
  const comprimento = clamp(e.comprimento, LIMITES.comprimento.min, LIMITES.comprimento.max);
  const peDireito = clamp(e.peDireito, LIMITES.peDireito.min, LIMITES.peDireito.max);

  const area = largura * comprimento;

  const fatorTipo = FATOR_TIPO[e.tipo];
  const fatorAltura = 1 + (peDireito - 6) * 0.035;
  const fatorVao = 1 + Math.max(0, largura - 20) * 0.01;
  const fatorMezanino = e.mezanino ? 1.22 : 1;

  const kgPorM2 = 32 * fatorTipo * fatorAltura * fatorVao;
  const pesoAco = area * kgPorM2;

  const escala = area > 3000 ? 0.9 : area > 1500 ? 0.95 : 1;
  const precoM2 = 780 * fatorTipo * fatorAltura * fatorVao * fatorMezanino * escala;

  const investMin = area * precoM2 * 0.88;
  const investMax = area * precoM2 * 1.14;

  const prazoProjeto = 14;
  const prazoFabrica = Math.ceil(pesoAco / 2600) * 7;
  const prazoMontagem = Math.ceil(area / 420) * 7;
  const prazoTotal = clamp(prazoProjeto + prazoFabrica + prazoMontagem, 45, 420);

  return {
    area,
    pesoAco,
    kgPorM2,
    precoM2,
    investMin,
    investMax,
    prazoProjeto,
    prazoFabrica,
    prazoMontagem,
    prazoTotal,
  };
}

/* ---------- Vão livre: textos por faixa (docs/04, seção 05) ---------- */

export function usoRecomendado(vao: number): string {
  if (vao <= 18) return 'Oficinas, garagens e áreas de apoio';
  if (vao <= 25) return 'Comércio, depósito e produção leve';
  if (vao <= 32) return 'Indústria com ponte rolante e circulação de empilhadeira';
  return 'Logística, centro de distribuição e armazenagem vertical';
}

/** Quantos pilares internos um galpão de concreto precisaria no mesmo vão */
export function pilaresEliminados(vao: number): number {
  // concreto trabalha confortável até ~8 m entre pilares
  return Math.max(0, Math.ceil(vao / 8) - 1);
}
