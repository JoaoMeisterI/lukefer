import { conectar } from './cdp.mjs';

const LARGURAS = [320, 360, 375, 390, 430, 768, 1024, 1440];

const browser = await conectar();

for (const w of LARGURAS) {
  await browser.metrica(w, 800, w < 768);
  await browser.navegar();

  const r = await browser.avaliar(() => {
    const doc = document.documentElement;
    const vw = window.innerWidth;
    const culpados = [];
    document.querySelectorAll('body *').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        culpados.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute('class') || '').slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
    });
    return {
      vw,
      scrollW: doc.scrollWidth,
      overflow: doc.scrollWidth - vw,
      heroH: Math.round(document.querySelector('.lk-hero')?.getBoundingClientRect().height ?? 0),
      culpados: culpados.slice(0, 8),
    };
  });

  console.log(`\n=== ${w}px ===  scrollWidth=${r.scrollW} overflow=${r.overflow} heroH=${r.heroH}`);
  r.culpados.forEach((c) => console.log(`  ${c.tag}.${c.cls}  L${c.left} R${c.right} W${c.w}`));
  if (r.culpados.length === 0) console.log('  sem estouro');
}

browser.fechar();
process.exit(0);
