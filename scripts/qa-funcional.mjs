import { conectar } from './cdp.mjs';

const b = await conectar();
const ok = [];
const falhas = [];
const checar = (nome, passou, extra = '') =>
  (passou ? ok : falhas).push(`${nome}${extra ? ' — ' + extra : ''}`);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/* ========== MOBILE: drawer + scroll lock ========== */
await b.metrica(390, 844, true);
await b.navegar();
await esperar(900);

let r = await b.avaliar(() => {
  window.scrollTo(0, 1200);
  return new Promise((res) => setTimeout(() => {
    const yAntes = window.scrollY;
    document.querySelector('.lk-header__burger').click();
    setTimeout(() => {
      const posTravado = getComputedStyle(document.body).position + '';
      const aberto = document.querySelector('.lk-drawer-wrap').classList.contains('is-open');
      document.querySelector('.lk-drawer__link').click();
      setTimeout(() => {
        res({
          yAntes,
          travou: posTravado === 'fixed',
          aberto,
          fechou: !document.querySelector('.lk-drawer-wrap').classList.contains('is-open'),
          posDepois: getComputedStyle(document.body).position,
        });
      }, 400);
    }, 420);
  }, 300));
});
checar('drawer abre', r.aberto);
checar('drawer trava o scroll do body (position:fixed)', r.travou);
checar('drawer fecha ao clicar no item', r.fechou);
checar('scroll do body destravado ao fechar', r.posDepois !== 'fixed', `pos=${r.posDepois}`);

/* ========== DESKTOP ========== */
await b.metrica(1440, 950, false);
await b.navegar();
await esperar(900);

r = await b.avaliar(() => new Promise((res) => {
  document.querySelectorAll('.lk-header__link')[3].click();
  setTimeout(() => {
    const sec = document.getElementById('projetos').getBoundingClientRect();
    res({ top: Math.round(sec.top), ativo: document.querySelector('.lk-header__link.is-active')?.textContent });
  }, 3000);
}));
checar('navegação por âncora posiciona abaixo do header', r.top > 0 && r.top < 120, `top=${r.top}`);
checar('link ativo acompanha a seção', r.ativo === 'Projetos', `ativo=${r.ativo}`);

r = await b.avaliar(() => new Promise((res) => {
  const botoes = [...document.querySelectorAll('.lk-filtro')];
  const antes = document.querySelectorAll('.lk-projeto').length;
  botoes.find((x) => x.textContent === 'Agro').click();
  setTimeout(() => {
    const depois = document.querySelectorAll('.lk-projeto').length;
    botoes[0].click();
    setTimeout(() => res({ antes, depois, volta: document.querySelectorAll('.lk-projeto').length }), 300);
  }, 300);
}));
checar('filtro de projetos filtra', r.antes === 9 && r.depois === 2, `${r.antes} -> ${r.depois}`);
checar('filtro Todos restaura', r.volta === 9, `volta=${r.volta}`);

r = await b.avaliar(() => new Promise((res) => {
  document.querySelector('.lk-projeto').click();
  setTimeout(() => {
    const dlg = document.querySelector('[role="dialog"][aria-modal="true"]');
    const titulo1 = dlg?.querySelector('h3')?.textContent;
    const focoDentro = dlg?.contains(document.activeElement);
    const travou = getComputedStyle(document.body).position === 'fixed';
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    setTimeout(() => {
      const titulo2 = document.querySelector('[role="dialog"] h3')?.textContent;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      setTimeout(() => res({
        titulo1, titulo2, focoDentro, travou,
        fechou: !document.querySelector('[role="dialog"][aria-modal="true"]'),
        destravou: getComputedStyle(document.body).position !== 'fixed',
      }), 400);
    }, 400);
  }, 500);
}));
checar('lightbox abre', Boolean(r.titulo1), r.titulo1);
checar('lightbox prende o foco', r.focoDentro);
checar('lightbox trava o scroll', r.travou);
checar('seta direita navega', r.titulo1 !== r.titulo2, `${r.titulo1} -> ${r.titulo2}`);
checar('Esc fecha', r.fechou);
checar('scroll destravado ao fechar', r.destravou);

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('vantagens');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const v1 = document.querySelector('.lk-comp__valor').textContent.trim();
    document.querySelectorAll('.lk-toggle__btn')[1].click();
    setTimeout(() => {
      const v2 = document.querySelector('.lk-comp__valor').textContent.trim();
      const largura = document.querySelector('.lk-comp__fill').style.transform;
      res({ v1, v2, largura });
    }, 1200);
  }, 1600);
}));
checar('toggle do comparativo troca os valores', r.v1 !== r.v2, `${r.v1} -> ${r.v2}`);
checar('barras animam (scaleX maior que 0)', !/scaleX\(0\)/.test(r.largura), r.largura);

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('vao');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const el = document.getElementById('slider-vao');
    const antes = document.querySelector('.lk-vao__output').textContent.trim();
    const dadosAntes = document.querySelector('.lk-vao__dados dd').textContent;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '40');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => res({
      antes, depois: document.querySelector('.lk-vao__output').textContent.trim(),
      dadosAntes, dadosDepois: document.querySelector('.lk-vao__dados dd').textContent,
      aria: el.getAttribute('aria-valuetext'),
      altura: getComputedStyle(el).height,
    }), 320);
  }, 900);
}));
checar('slider muda o vão', r.antes !== r.depois, `${r.antes} -> ${r.depois}`);
checar('dados recalculam', r.dadosAntes !== r.dadosDepois, `${r.dadosAntes} -> ${r.dadosDepois}`);
checar('slider com aria-valuetext', /40 metros/.test(r.aria || ''), r.aria);
checar('alvo de toque do slider tem 44px ou mais', parseFloat(r.altura) >= 44, r.altura);

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('faq');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const bs = [...document.querySelectorAll('.lk-faq__btn')];
    bs[2].click();
    setTimeout(() => {
      const abertos = bs.filter((x) => x.getAttribute('aria-expanded') === 'true').length;
      res({ abertos, controla: bs[2].getAttribute('aria-controls') });
    }, 450);
  }, 700);
}));
checar('FAQ abre so um por vez', r.abertos === 1, `abertos=${r.abertos}`);
checar('FAQ com aria-controls', Boolean(r.controla));

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('depoimentos');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const trilho = document.querySelector('.lk-carrossel__trilho');
    const t1 = trilho.style.transform;
    document.querySelector('.lk-carrossel__seta--dir').click();
    setTimeout(() => {
      const t2 = trilho.style.transform;
      document.querySelectorAll('.lk-dot')[3].click();
      setTimeout(() => res({
        t1, t2,
        touchAction: getComputedStyle(trilho).touchAction,
        dotAtivo: document.querySelector('.lk-dot.is-active')?.getAttribute('aria-label'),
      }), 600);
    }, 600);
  }, 700);
}));
checar('carrossel avança pela seta', r.t1 !== r.t2);
checar('dots navegam', (r.dotAtivo || '').includes('4'), r.dotAtivo);
checar('trilho com touch-action pan-y (não rouba o scroll)', r.touchAction === 'pan-y', r.touchAction);

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('simulador');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const valor1 = document.querySelector('.lk-sim__valor').textContent.trim();
    const el = document.getElementById('sim-largura');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '40');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
      const valor2 = document.querySelector('.lk-sim__valor').textContent.trim();
      [...document.querySelectorAll('.lk-sim__resultado .lk-btn')].pop().click();
      setTimeout(() => res({
        valor1, valor2,
        area: document.getElementById('area')?.value,
        tipo: document.getElementById('tipo')?.value,
        toast: document.querySelector('.lk-toast')?.textContent,
      }), 900);
    }, 400);
  }, 700);
}));
checar('simulador recalcula ao vivo', r.valor1 !== r.valor2, `${r.valor1} -> ${r.valor2}`);
checar('Enviar simulação preenche o formulário', r.area === '1600' && r.tipo === 'industrial', `area=${r.area} tipo=${r.tipo}`);
checar('toast de confirmação aparece', Boolean(r.toast), r.toast);

r = await b.avaliar(() => new Promise((res) => {
  const sec = document.getElementById('contato');
  window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 80);
  setTimeout(() => {
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype
        : el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const achaRadio = (txt) => [...document.querySelectorAll('#contato .lk-radio')].find((x) => x.textContent.includes(txt));

    document.querySelector('#contato form').requestSubmit();
    setTimeout(() => {
      const errosEtapa1 = document.querySelectorAll('#contato [role="alert"]').length;
      const aindaEtapa1 = document.querySelector('.lk-passos__item.is-atual .lk-passos__nome').textContent;
      achaRadio('Até 3 meses').click();
      setVal('cidade', 'Jaraguá do Sul/SC');
      setTimeout(() => {
        document.querySelector('#contato form').requestSubmit();
        setTimeout(() => {
          const etapa2 = document.querySelector('.lk-passos__item.is-atual .lk-passos__nome').textContent;
          setVal('peDireito', '9');
          achaRadio('Sim').click();
          achaRadio('Pronto').click();
          setTimeout(() => {
            document.querySelector('#contato form').requestSubmit();
            setTimeout(() => {
              const etapa3 = document.querySelector('.lk-passos__item.is-atual .lk-passos__nome').textContent;
              setVal('nome', 'João Pedro Teste');
              setVal('email', 'joao@exemplo.com.br');
              setVal('whatsapp', '47999998888');
              achaRadio('Manhã').click();
              document.querySelector('#contato .lk-check input').click();
              const mascaraAntesDoEnvio = document.getElementById('whatsapp').value;
              setTimeout(() => {
                document.querySelector('#contato form').requestSubmit();
                setTimeout(() => {
                  res({
                    errosEtapa1, aindaEtapa1, etapa2, etapa3,
                    mascara: mascaraAntesDoEnvio,
                    sucesso: document.querySelector('.lk-sucesso h3')?.textContent,
                    protocolo: document.querySelector('.lk-sucesso .lk-mono')?.textContent,
                    rascunhoLimpo: !window.localStorage.getItem('lkf:orcamento:rascunho'),
                  });
                }, 2200);
              }, 300);
            }, 400);
          }, 300);
        }, 400);
      }, 300);
    }, 500);
  }, 800);
}));
checar('formulário bloqueia avanço com erro', r.errosEtapa1 >= 2 && r.aindaEtapa1 === 'Seu projeto', `erros=${r.errosEtapa1} etapa=${r.aindaEtapa1}`);
checar('avança para a etapa 2', r.etapa2 === 'Detalhes', r.etapa2);
checar('avança para a etapa 3', r.etapa3 === 'Contato', r.etapa3);
checar('máscara de WhatsApp aplicada', r.mascara === '(47) 99999-8888', r.mascara);
checar('envio chega à tela de sucesso', r.sucesso === 'Solicitação registrada.', r.sucesso);
checar('protocolo no formato LKF-AAAA-XXXX', /^LKF-\d{4}-[A-Z0-9]{4}$/.test(r.protocolo || ''), r.protocolo);
checar('rascunho limpo após envio', r.rascunhoLimpo);

r = await b.avaliar(() => {
  const a = document.querySelector('.lk-flut__zap');
  return { href: a?.getAttribute('href'), visivel: document.querySelector('.lk-flut')?.classList.contains('is-visible') };
});
checar('WhatsApp flutuante visível após scroll', r.visivel);
checar('WhatsApp com mensagem pré-preenchida', /wa\.me\/\d+\?text=/.test(r.href || ''));

console.log('\n===== PASSOU (' + ok.length + ') =====');
ok.forEach((x) => console.log('  OK  ' + x));
console.log('\n===== FALHOU (' + falhas.length + ') =====');
falhas.forEach((x) => console.log('  XX  ' + x));

b.fechar();
process.exit(falhas.length ? 1 : 0);
