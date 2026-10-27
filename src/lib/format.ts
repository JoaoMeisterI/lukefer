const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export const num = (v: number) => nf0.format(Math.round(v));
export const num1 = (v: number) => nf1.format(v);

export const m2 = (v: number) => `${num(v)} m²`;

/** Moeda compacta e legível: R$ 1.248.000 */
export const brl = (v: number) =>
  `R$ ${nf0.format(Math.round(v / 1000) * 1000)}`;

/** Faixa de investimento */
export const brlRange = (min: number, max: number) => `${brl(min)} — ${brl(max)}`;

/** Peso: usa toneladas acima de 1.000 kg */
export const peso = (kg: number) =>
  kg >= 1000 ? `${num1(kg / 1000)} t` : `${num(kg)} kg`;

/** Prazo em dias -> "≈ 5 meses (147 dias)" */
export function prazo(dias: number): string {
  const meses = dias / 30;
  if (dias < 45) return `${num(dias)} dias`;
  const label = meses < 1.5 ? '1 mês' : `${num(meses)} meses`;
  return `${label} (${num(dias)} dias)`;
}

/** Máscara de telefone BR preservando o que o usuário digitou */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Só dígitos */
export const digits = (v: string) => v.replace(/\D/g, '');

/** Protocolo mock: LKF-2026-A7K3 */
export function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let i = 0; i < 4; i += 1) {
    sufixo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `LKF-${ano}-${sufixo}`;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Iniciais para o avatar-monograma dos depoimentos */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
