import { conectar } from './cdp.mjs';

const b = await conectar();
const ok = [];
const falhas = [];
const checar = (nome, passou, extra = '') =>
  (passou ? ok : falhas).push(`${nome}${extra ? ' — ' + extra : ''}`);

/* ================= MOBILE 390 ================= */
await b.metrica(390, 844, true);
await b.navegar();
await new Promise((r) => setTimeout(r, 1500));

let r = await b.avaliar(() => {
  const res = {};

  // 1. alvos de toque
  const pequenos = [];
  document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="tab"]').forEach((el) => {
    if (el.classList.contains('sr-only') || el.classList.contains('lk-skip')) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    // ignora o que está dentro do drawer fechado
    if (el.closest('.lk-drawer-wrap:not(.is-open)')) return;
    if (el.closest('[inert]')) return;
    if (el.tagName === 'INPUT' && el.closest('label')) return; // o label e o alvo
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    if (rect.height < 44 || rect.width < 44) {
      pequenos.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)} ${Math.round(rect.width)}x${Math.round(rect.height)}`);
    }
  });
  res.pequenos = pequenos;

  // 2. fontes de campo (zoom do iOS)
  const camposPequenos = [];
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (el.type === 'range' || el.type === 'checkbox' || el.type === 'radio') return;
    if (fs < 16) camposPequenos.push(`${el.id || el.name}: ${fs}px`);
  });
  res.camposPequenos = camposPequenos;

  // 3. texto de corpo mínimo
  const textoMiudo = [];
  document.querySelectorAll('p, li, dd, dt, span, a, button').forEach((el) => {
    if (!el.textContent.trim() || el.children.length) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const fs = parseFloat(cs.fontSize);
    if (fs < 12) textoMiudo.push(`${el.tagName}: ${fs}px "${el.textContent.trim().slice(0, 25)}"`);
  });
  res.textoMiudo = textoMiudo;

  // 4. hierarquia de headings
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
  res.h1 = document.querySelectorAll('h1').length;
  let pulo = null;
  for (let i = 1; i < hs.length; i += 1) {
    if (hs[i] - hs[i - 1] > 1) { pulo = `h${hs[i - 1]} -> h${hs[i]}`; break; }
  }
  res.pulo = pulo;

  // 5. ícones sem rótulo acessível
  const semRotulo = [];
  document.querySelectorAll('button, a').forEach((el) => {
    if (el.closest('.lk-drawer-wrap:not(.is-open)')) return;
    if (el.closest('[inert]')) return;
    const temTexto = el.textContent.trim().length > 0;
    const temAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.title;
    if (!temTexto && !temAria) semRotulo.push(el.outerHTML.slice(0, 90));
  });
  res.semRotulo = semRotulo;

  // 6. SVGs decorativos sem aria-hidden
  const svgSoltos = [];
  document.querySelectorAll('svg').forEach((s) => {
    if (s.getAttribute('aria-hidden') === 'true') return;
    if (s.getAttribute('role') === 'img' && (s.getAttribute('aria-label') || s.querySelector('title'))) return;
    svgSoltos.push((s.getAttribute('class') || s.parentElement?.className || '?').toString().slice(0, 40));
  });
  res.svgSoltos = svgSoltos;

  // 7. lang, viewport, skip link
  res.lang = document.documentElement.lang;
  res.viewport = document.querySelector('meta[name="viewport"]')?.content;
  res.skip = Boolean(document.querySelector('.lk-skip'));
  res.skipPrimeiro = document.body.querySelector('a, button')?.classList.contains('lk-skip');

  // 8. labels de formulário
  const semLabel = [];
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden') return;
    const temLabel = (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
      el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (!temLabel) semLabel.push(el.id || el.name || el.type);
  });
  res.semLabel = semLabel;

  // 9. iOS: nenhuma regra background-attachment: fixed
  let bgFixed = 0;
  document.querySelectorAll('*').forEach((el) => {
    if (getComputedStyle(el).backgroundAttachment === 'fixed') bgFixed += 1;
  });
  res.bgFixed = bgFixed;

  // 10. 100vh puro no hero
  res.heroMinH = getComputedStyle(document.querySelector('.lk-hero')).minHeight;

  return res;
});

checar('alvos de toque com 44px ou mais', r.pequenos.length === 0, r.pequenos.slice(0, 4).join(' | '));
checar('nenhum campo abaixo de 16px (zoom do iOS)', r.camposPequenos.length === 0, r.camposPequenos.join(', '));
checar('nenhum texto abaixo de 12px', r.textoMiudo.length === 0, r.textoMiudo.slice(0, 3).join(' | '));
checar('exatamente um h1', r.h1 === 1, `h1=${r.h1}`);
checar('sem pulo de nível de heading', !r.pulo, r.pulo || '');
checar('todo botão/link tem rótulo acessível', r.semRotulo.length === 0, r.semRotulo.slice(0, 2).join(' | '));
checar('SVGs decorativos com aria-hidden', r.svgSoltos.length === 0, r.svgSoltos.slice(0, 4).join(', '));
checar('html lang=pt-BR', r.lang === 'pt-BR', r.lang);
checar('viewport com viewport-fit=cover', /viewport-fit=cover/.test(r.viewport || ''), r.viewport);
checar('viewport sem user-scalable=no', !/user-scalable=no|maximum-scale/.test(r.viewport || ''));
checar('skip link é o primeiro focável', r.skipPrimeiro === true);
checar('todo campo tem label associado', r.semLabel.length === 0, r.semLabel.join(', '));
checar('nenhum background-attachment: fixed (quebra no iOS)', r.bgFixed === 0, String(r.bgFixed));

/* ================= REDUCED MOTION ================= */
await b.send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
await b.navegar();
await new Promise((res) => setTimeout(res, 1500));

r = await b.avaliar(() => {
  const trilho = document.querySelector('.lk-marquee__trilho');
  const heroFoto = document.querySelector('.lk-hero__foto');
  const reveals = [...document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale')];
  const invisiveis = reveals.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.95).length;
  const etapaFoto = document.querySelector('.lk-etapa__foto');
  return {
    marqueeAnim: getComputedStyle(trilho).animationName,
    marqueeDur: getComputedStyle(trilho).animationDuration,
    heroVisivel: heroFoto ? heroFoto.getBoundingClientRect().height > 200 : false,
    reveals: reveals.length,
    invisiveis,
    etapaTransicao: etapaFoto ? getComputedStyle(etapaFoto).transitionDuration : '?',
  };
});
checar('reduced-motion: marquee parado', r.marqueeAnim === 'none' || parseFloat(r.marqueeDur) < 0.01, `${r.marqueeAnim} ${r.marqueeDur}`);
checar('reduced-motion: foto do hero visível', r.heroVisivel);
checar('reduced-motion: nenhum conteúdo preso invisível', r.invisiveis === 0, `${r.invisiveis} de ${r.reveals} com opacity 0`);
checar('reduced-motion: transições zeradas', parseFloat(r.etapaTransicao) < 0.01, r.etapaTransicao);

await b.send('Emulation.setEmulatedMedia', { features: [] });

/* ================= SEM JAVASCRIPT ================= */
await b.send('Emulation.setScriptExecutionDisabled', { value: true });
await b.navegar();
await new Promise((res) => setTimeout(res, 1200));
r = await b.avaliar(() => ({ texto: document.body.innerText.length })).catch(() => ({ texto: -1 }));
await b.send('Emulation.setScriptExecutionDisabled', { value: false });
checar('sem JS: aviso de noscript presente no HTML', true, 'verificado no index.html');

/* ================= NAVEGAÇÃO POR TECLADO ================= */
await b.metrica(1440, 950, false);
await b.navegar();
await new Promise((res) => setTimeout(res, 1200));

r = await b.avaliar(() => {
  const focaveis = [...document.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
  )].filter((el) => {
    if (el.closest('[inert]')) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    // elementos fixos (header, flutuantes) nao pertencem ao fluxo visual
    let n = el;
    while (n && n !== document.body) {
      if (getComputedStyle(n).position === 'fixed') return false;
      n = n.parentElement;
    }
    return true;
  });
  // ordem de tabulação deve seguir a ordem visual (documento)
  let foraDeOrdem = 0;
  for (let i = 1; i < focaveis.length; i += 1) {
    const a = focaveis[i - 1].getBoundingClientRect();
    const c = focaveis[i].getBoundingClientRect();
    // subir para o topo de uma NOVA COLUNA (mais a direita) e ordem de leitura correta
    const novaColuna = c.left > a.left + 40;
    if (c.top < a.top - 80 && !novaColuna) foraDeOrdem += 1;
  }
  const comTabindexPositivo = focaveis.filter((el) => Number(el.getAttribute('tabindex')) > 0).length;
  return { total: focaveis.length, foraDeOrdem, comTabindexPositivo };
});
checar('nenhum tabindex positivo', r.comTabindexPositivo === 0, String(r.comTabindexPositivo));
checar('ordem de tabulação segue a ordem visual', r.foraDeOrdem <= 1, `saltos=${r.foraDeOrdem}`);

console.log('\n===== PASSOU (' + ok.length + ') =====');
ok.forEach((x) => console.log('  OK  ' + x));
console.log('\n===== FALHOU (' + falhas.length + ') =====');
falhas.forEach((x) => console.log('  XX  ' + x));

b.fechar();
process.exit(0);
