import { digits } from './format';

export type Regra = (valor: string) => string | null;

export const obrigatorio: Regra = (v) =>
  v && v.trim().length > 0 ? null : 'Esse campo é obrigatório.';

export const email: Regra = (v) => {
  if (!v.trim()) return 'Esse campo é obrigatório.';
  const ok = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim());
  return ok ? null : 'Digite um e-mail válido.';
};

export const telefoneBR: Regra = (v) => {
  const d = digits(v);
  if (!d) return 'Esse campo é obrigatório.';
  if (d.length < 10 || d.length > 11) return 'Digite um número com DDD.';
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return 'DDD inválido.';
  return null;
};

export const numeroEntre =
  (min: number, max: number, unidade = ''): Regra =>
  (v) => {
    if (!v.trim()) return 'Esse campo é obrigatório.';
    const n = Number(String(v).replace(',', '.'));
    if (!Number.isFinite(n)) return 'Digite um número válido.';
    if (n < min || n > max) {
      const fmt = (x: number) => new Intl.NumberFormat('pt-BR').format(x);
      return `Informe um valor entre ${fmt(min)} e ${fmt(max)}${unidade ? ` ${unidade}` : ''}.`;
    }
    return null;
  };

export const aceite: Regra = (v) =>
  v === 'true' ? null : 'É preciso aceitar para continuar.';

export const nomeCompleto: Regra = (v) => {
  if (!v.trim()) return 'Esse campo é obrigatório.';
  if (v.trim().split(/\s+/).length < 2) return 'Digite o nome e o sobrenome.';
  return null;
};

/** Roda um conjunto de regras e devolve o primeiro erro */
export function validar(valor: string, regras: Regra[]): string | null {
  for (const regra of regras) {
    const erro = regra(valor);
    if (erro) return erro;
  }
  return null;
}

/** Valida um objeto inteiro contra um mapa de regras */
export function validarCampos<T extends Record<string, string>>(
  dados: T,
  mapa: Partial<Record<keyof T, Regra[]>>,
): Partial<Record<keyof T, string>> {
  const erros: Partial<Record<keyof T, string>> = {};
  (Object.keys(mapa) as (keyof T)[]).forEach((campo) => {
    const regras = mapa[campo];
    if (!regras) return;
    const erro = validar(dados[campo] ?? '', regras);
    if (erro) erros[campo] = erro;
  });
  return erros;
}
