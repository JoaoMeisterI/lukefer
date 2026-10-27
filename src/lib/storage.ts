/* ============================================================
   Acesso a localStorage com guarda total.
   O Safari em navegação privada LANÇA exceção ao escrever —
   nada aqui pode derrubar a página.
   ============================================================ */

const PREFIXO = 'lkf:';
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

interface Envelope<T> {
  ts: number;
  dados: T;
}

function disponivel(): boolean {
  try {
    const k = `${PREFIXO}__probe`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const ok = typeof window !== 'undefined' && disponivel();

export function salvar<T>(chave: string, dados: T): void {
  if (!ok) return;
  try {
    const env: Envelope<T> = { ts: Date.now(), dados };
    window.localStorage.setItem(PREFIXO + chave, JSON.stringify(env));
  } catch {
    /* cota estourada ou modo privado — ignora */
  }
}

export function ler<T>(chave: string): T | null {
  if (!ok) return null;
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chave);
    if (!bruto) return null;
    const env = JSON.parse(bruto) as Envelope<T>;
    if (!env || typeof env.ts !== 'number') return null;
    if (Date.now() - env.ts > VALIDADE_MS) {
      remover(chave);
      return null;
    }
    return env.dados;
  } catch {
    return null;
  }
}

export function remover(chave: string): void {
  if (!ok) return;
  try {
    window.localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* ignora */
  }
}

export const CHAVES = {
  rascunho: 'orcamento:rascunho',
  protocolos: 'orcamento:protocolos',
} as const;
