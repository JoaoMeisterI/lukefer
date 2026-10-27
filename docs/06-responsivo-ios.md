# 06 — Responsividade e Compatibilidade iOS

> Requisito do cliente: **100% responsivo em qualquer celular, incluindo iPhone**, que notoriamente quebra animações, alturas de viewport e travas de scroll.
> Este documento é a lista de regras que o código **tem** que seguir. Cada item tem a razão e a solução.

---

## 1. Breakpoints

| Nome | Faixa | Alvo típico |
|---|---|---|
| `xs` | 320–389px | iPhone SE (1ª/2ª gen), Android pequeno |
| `sm` | 390–479px | iPhone 13/14/15/16, Pixel |
| `md` | 480–767px | Phablet, iPhone Pro Max em paisagem |
| `lg` | 768–1023px | iPad retrato |
| `xl` | 1024–1279px | iPad paisagem, notebook pequeno |
| `2xl` | 1280–1919px | Desktop |
| `3xl` | >= 1920px | Monitor grande |

**Piso de projeto: 320px.** Nada pode gerar scroll horizontal nessa largura.

### Abordagem
Mobile-first. CSS base é a versão de celular; `min-width` adiciona complexidade.
Usamos `clamp()` para tipografia e espaçamento, de modo que a maioria das seções precise de **zero** media queries.

---

## 2. Os sete problemas do iOS Safari — e a solução adotada

### 2.1 `100vh` é maior que a tela visível
No Safari iOS, `100vh` ignora a barra de endereço, cortando o conteúdo e criando scroll fantasma.

```css
.hero {
  min-height: 100vh;                 /* fallback universal */
  min-height: -webkit-fill-available; /* iOS antigo */
  min-height: 100svh;                 /* iOS 15.4+ / moderno — vence */
}
```
A ordem importa: a última declaração que o navegador entende ganha.
Para o drawer e o lightbox usamos `100dvh` (acompanha a barra que recolhe).

### 2.2 `overflow: hidden` no body não trava o scroll
No iOS, o body continua rolando por trás do modal. A única técnica confiável:

```js
// ao abrir
const y = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${y}px`;
document.body.style.left = '0';
document.body.style.right = '0';
document.body.style.width = '100%';
document.body.dataset.scrollY = String(y);

// ao fechar
const back = Number(document.body.dataset.scrollY || 0);
document.body.style.position = '';
document.body.style.top = '';
document.body.style.left = '';
document.body.style.right = '';
document.body.style.width = '';
window.scrollTo(0, back);
```
Encapsulado no hook `useScrollLock(active)`, com contador de referência para o caso de drawer e lightbox abertos em sequência.
**Importante:** desligar `scroll-behavior: smooth` durante o `scrollTo` de restauração, senão o iOS faz um scroll animado visível ao fechar.

### 2.3 `background-attachment: fixed` não funciona
Simplesmente ignorado no iOS. **Não usamos em lugar nenhum.** Onde queremos profundidade, usamos `position: sticky` num elemento de fundo dentro de um container com `isolation: isolate`.

### 2.4 `backdrop-filter` precisa de prefixo e custa caro em movimento
```css
.header--scrolled {
  -webkit-backdrop-filter: blur(14px) saturate(130%);
          backdrop-filter: blur(14px) saturate(130%);
  background: rgba(10, 11, 13, .86); /* fallback opaco o bastante sozinho */
}
```
Regras: só no header (elemento que não se move), nunca em elemento animado, e o `background` por trás já garante contraste caso o blur não aplique.

### 2.5 Input com `font-size < 16px` dispara zoom automático
Todo `input`, `select` e `textarea` tem `font-size: 16px` no mobile — sem exceção. Se o design pede texto menor, reduz-se o padding, nunca a fonte.
Também adicionamos `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. **Não** usamos `maximum-scale=1` nem `user-scalable=no` (quebra acessibilidade e a Apple ignora mesmo).

### 2.6 Safe areas (notch e barra inferior)
```css
:root {
  --safe-t: env(safe-area-inset-top, 0px);
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-l: env(safe-area-inset-left, 0px);
  --safe-r: env(safe-area-inset-right, 0px);
}
.header  { padding-top: var(--safe-t); }
.fab     { bottom: calc(var(--sp-5) + var(--safe-b));
           right:  calc(var(--sp-5) + var(--safe-r)); }
.footer  { padding-bottom: calc(var(--sp-8) + var(--safe-b)); }
.drawer  { padding: calc(var(--sp-6) + var(--safe-t)) var(--sp-5)
                    calc(var(--sp-6) + var(--safe-b)); }
```
Requer `viewport-fit=cover` na meta tag, senão `env()` retorna 0.

### 2.7 Flash cinza no toque e seleção acidental
```css
* { -webkit-tap-highlight-color: transparent; }
button, a, [role="button"], label { -webkit-user-select: none; user-select: none; }
body { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
```
O `text-size-adjust` evita que o Safari aumente fontes sozinho em paisagem.

---

## 3. Outras armadilhas tratadas

| Problema | Solução |
|---|---|
| Scroll horizontal fantasma | `html, body { overflow-x: clip; max-width: 100%; }` + nenhum elemento com largura fixa > 320px + imagens/SVG com `max-width: 100%` |
| `position: sticky` não gruda | Garantir que nenhum ancestral tenha `overflow: hidden/auto`. Por isso usamos `overflow-x: clip` (não cria contexto de scroll) em vez de `hidden` |
| Momentum scroll travado em container | `-webkit-overflow-scrolling: touch` nos poucos containers com scroll interno |
| `vw` conta a barra de rolagem no desktop e cria scroll horizontal | Larguras full-bleed usam `width: 100%` + técnica de margem negativa, não `100vw` |
| Carrossel rouba o scroll vertical | `touch-action: pan-y` no trilho; o handler só captura quando `Math.abs(dx) > Math.abs(dy)` |
| Slider do vão livre conflita com scroll | `input[type=range]` nativo (o navegador já resolve o gesto), estilizado via `::-webkit-slider-thumb` / `::-moz-range-thumb` |
| Teclado virtual cobre o campo em foco | `scrollIntoView({ block: 'center' })` no foco de input dentro do form multi-etapas, com guarda de `prefers-reduced-motion` |
| Fonte não carrega e o layout pula | `font-display: swap` + `preconnect` + stack de fallback com métricas próximas (`system-ui, -apple-system, Segoe UI, Roboto`) |
| `:hover` fica "grudado" após o toque | Toda regra de hover dentro de `@media (hover: hover) and (pointer: fine)` |
| Elemento de 100% de largura com `padding` estourando | `*, *::before, *::after { box-sizing: border-box; }` global |
| Animação some ao voltar da aba | Nenhuma lógica depende de `visibilitychange`; animações CSS retomam sozinhas |

---

## 4. Alvos de toque

- Mínimo **44×44px** para tudo que é clicável; o padrão do projeto é **48px**.
- Espaçamento mínimo de **8px** entre dois alvos adjacentes.
- Links dentro de parágrafo recebem `padding: 2px 0` e área estendida via `::after` quando isolados.
- Itens do drawer: 56px de altura.
- Dots do carrossel: alvo real de 44×44 com o ponto visível de 8px centralizado.
- `cursor: pointer` em tudo que é clicável (desktop).

---

## 5. Comportamento por seção, por breakpoint

| Seção | < 640px | 640–1023px | >= 1024px |
|---|---|---|---|
| Header | Logo + CTA compacto + hambúrguer | idem | Nav completa inline |
| Hero | Empilhado, SVG abaixo, `min-height: auto` com padding generoso | Empilhado, SVG maior | 2 colunas, `min-height: 100svh` |
| Marquee | 1 linha, velocidade 28s | 32s | 38s |
| Soluções | 1 coluna | 2 colunas | Bento 4 colunas com 2 cards duplos |
| Comparativo | Barras empilhadas, rótulo acima | 2 colunas | Linha única por critério |
| Vão livre | SVG acima, slider abaixo, dados em grid 2×2 | idem com SVG maior | Split 60/40 |
| Processo | Timeline vertical | Timeline vertical | Timeline horizontal, 5 colunas |
| Números | Grid 2×2 | Grid 2×2 | 4 colunas |
| Projetos | 1 coluna, filtros com scroll horizontal e fade | 2 colunas | 3 colunas |
| Simulador | Entradas empilhadas, resultado abaixo (sticky no fim) | 2 colunas | Split 50/50 com resultado sticky |
| Fábrica | SVG acima, texto abaixo | idem | Split 50/50 |
| Depoimentos | 1 card por vista, swipe | 1 card maior | 1 card centralizado com setas |
| FAQ | 1 coluna | 1 coluna | 2 colunas |
| Orçamento | Etapas empilhadas, 1 campo por linha | 2 campos por linha | 2 campos por linha, card centralizado em 760px |
| Footer | Acordeão de colunas empilhadas | 2 colunas | 4 colunas |

---

## 6. Matriz de QA

### Dispositivos (largura × altura em CSS px)
- [ ] 320 × 568 — iPhone SE 1ª gen
- [ ] 375 × 667 — iPhone SE 2/3
- [ ] 390 × 844 — iPhone 13/14/15
- [ ] 393 × 852 — iPhone 15 Pro
- [ ] 430 × 932 — iPhone 15 Pro Max
- [ ] 360 × 800 — Android médio
- [ ] 768 × 1024 — iPad retrato
- [ ] 1024 × 768 — iPad paisagem
- [ ] 1440 × 900 — Notebook
- [ ] 1920 × 1080 — Desktop

### Checklist por dispositivo
- [ ] Nenhum scroll horizontal (testar: `document.documentElement.scrollWidth <= window.innerWidth`)
- [ ] Hero visível por inteiro sem corte, com e sem barra de endereço
- [ ] Drawer abre, trava o fundo e devolve o scroll na posição exata
- [ ] Lightbox idem
- [ ] Nenhum texto abaixo de 14px; corpo em 16px
- [ ] Nenhum alvo de toque abaixo de 44px
- [ ] Formulário navegável com teclado virtual aberto, campo em foco visível
- [ ] Input não dispara zoom ao focar
- [ ] Conteúdo respeita notch em paisagem
- [ ] Animações rodam a 60fps, sem engasgo no scroll
- [ ] Com `prefers-reduced-motion` ligado: nada se move, tudo legível
- [ ] Com JS desabilitado: todo o conteúdo textual permanece visível

### Verificação automatizada incluída no projeto
Script `scripts/qa-overflow.mjs` — abre a página em várias larguras (quando houver browser headless disponível) e reporta elementos que estouram a viewport. Opcional, não bloqueia o build.
Em runtime, no modo dev, um aviso no console aponta o primeiro elemento com `scrollWidth > clientWidth`.
