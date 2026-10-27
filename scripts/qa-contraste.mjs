import { conectar } from './cdp.mjs';

/* ============================================================
   Auditoria de contraste real: percorre cada nó de texto da
   página, resolve a cor de fundo efetiva subindo a árvore até
   achar um fundo opaco, e calcula a razão WCAG.
   ============================================================ */

const b = await conectar();
await b.metrica(1440, 1000, false);
await b.navegar();
await new Promise((r) => setTimeout(r, 2000));

// revela tudo antes de medir, senão opacity:0 mascara o problema
await b.avaliar(() => {
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .lk-proc__item')
    .forEach((el) => el.classList.add('is-visible'));
  document.querySelectorAll('.lk-proc').forEach((el) => el.classList.add('is-visible'));
});
await new Promise((r) => setTimeout(r, 400));

const r = await b.avaliar(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };

  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const razao = (a, c) => {
    const l1 = lum(a);
    const l2 = lum(c);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const mistura = (frente, fundo) => ({
    r: frente.r * frente.a + fundo.r * (1 - frente.a),
    g: frente.g * frente.a + fundo.g * (1 - frente.a),
    b: frente.b * frente.a + fundo.b * (1 - frente.a),
    a: 1,
  });

  const fundoEfetivo = (el) => {
    let n = el;
    let acumulado = null;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        acumulado = acumulado ? mistura(acumulado, c) : c;
        if (acumulado.a >= 0.999) return acumulado;
      }
      n = n.parentElement;
    }
    return acumulado && acumulado.a >= 0.999 ? acumulado : { r: 255, g: 255, b: 255, a: 1 };
  };

  const falhas = [];
  const vistos = new Set();

  document.querySelectorAll('body *').forEach((el) => {
    // só elementos com texto próprio
    const texto = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!texto) return;

    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (parseFloat(cs.opacity) < 0.95) return;
    if (el.closest('.sr-only, .lk-skip, [inert]')) return;
    // texto sobre foto: o contraste depende do pixel, fora do escopo deste teste
    if (el.closest('.lk-hero__inner, .lk-etapa__corpo, .lk-numeros__inner')) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const cor = parse(cs.color);
    if (!cor) return;

    const fundo = fundoEfetivo(el);
    const corFinal = cor.a < 1 ? mistura(cor, fundo) : cor;
    const ratio = razao(corFinal, fundo);

    const px = parseFloat(cs.fontSize);
    const peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    const minimo = grande ? 3 : 4.5;

    if (ratio < minimo) {
      const chave = `${el.className}|${Math.round(ratio * 10)}`;
      if (vistos.has(chave)) return;
      vistos.add(chave);
      falhas.push({
        sel: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`,
        texto: texto.slice(0, 32),
        ratio: Math.round(ratio * 100) / 100,
        minimo,
        px: Math.round(px),
      });
    }
  });

  return { falhas, total: document.querySelectorAll('body *').length };
});

console.log(`\nnós inspecionados: ${r.total}`);
if (r.falhas.length === 0) {
  console.log('CONTRASTE: nenhum texto abaixo do mínimo WCAG AA');
} else {
  console.log(`CONTRASTE: ${r.falhas.length} falha(s)\n`);
  r.falhas
    .sort((a, c) => a.ratio - c.ratio)
    .forEach((f) =>
      console.log(`  ${f.ratio}:1 (min ${f.minimo}) ${f.px}px  ${f.sel}  "${f.texto}"`),
    );
}

b.fechar();
process.exit(0);
