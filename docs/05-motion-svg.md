# 05 — Catálogo de Movimento e SVG

> Princípio: **nenhuma animação é decorativa**. Cada uma representa algo real da operação da Lukefer — montagem, vão, fluxo, fabricação.
> Orçamento de performance: no máximo **2 animações contínuas** visíveis ao mesmo tempo, e nenhuma delas acima de ~8% de CPU num iPhone de 3 anos.

---

## 1. Fundação técnica

### Primitivas permitidas
| Técnica | Quando usar | Observação iOS |
|---|---|---|
| `transform` / `opacity` em CSS | 95% dos casos | Aceleração por GPU garantida |
| `stroke-dasharray` + `stroke-dashoffset` | Desenho de linha (line-draw) | OK no Safari; animar via CSS, não SMIL |
| `transform` em `<g>` do SVG | Mover peças dentro do SVG | Usar `transform-box: fill-box` + `transform-origin` |
| Atributo de path via React state | Slider de vão livre | Recalcula o `d`, sem animação por frame |
| `@keyframes` com `translate3d` | Marquee, ponte rolante | Força camada de composição |

### Proibido
| Técnica | Por quê |
|---|---|
| SMIL (`<animate>`, `<animateTransform>`) | Depreciado, inconsistente, sem controle de reduced-motion |
| `filter: blur()` animado | Repaint caríssimo no Safari iOS |
| `backdrop-filter` em elemento que se move | Trava no iOS |
| `mix-blend-mode` dentro de container animado | Força repaint de toda a árvore |
| Animar `width`, `height`, `top`, `left`, `margin` | Layout thrashing |
| `requestAnimationFrame` em loop infinito decorativo | Dreno de bateria |
| Parallax por evento de `scroll` | Jank no iOS; usar `position: sticky` + transform quando inevitável |
| `background-attachment: fixed` | Simplesmente não funciona no iOS Safari |

### Tokens de movimento
```css
--ease-out-expo:  cubic-bezier(.16, 1, .3, 1);
--ease-out-quart: cubic-bezier(.25, 1, .5, 1);
--ease-snap:      cubic-bezier(.2, .8, .2, 1);
--d-micro: 180ms;
--d-base:  320ms;
--d-enter: 620ms;
--d-draw:  1400ms;
```

### Guarda global de movimento
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```
E no JS, o hook `useReducedMotion()` devolve `true` → componentes pulam direto ao estado final (contadores mostram o valor, carrossel não faz auto-play, marquee para, line-draw já aparece desenhado).

---

## 2. Sistema de revelação no scroll

Um único hook, `useReveal(options)`, baseado em `IntersectionObserver`:

- `threshold: 0.15`, `rootMargin: '0px 0px -8% 0px'`
- Dispara **uma vez** e desconecta (`once: true` por padrão).
- Adiciona a classe `is-visible` ao elemento.
- Stagger via variável CSS inline `--i` no filho: `transition-delay: calc(var(--i) * 70ms)`, teto de 6.

```css
.reveal        { opacity: 0; transform: translate3d(0, 24px, 0); }
.reveal.is-visible { opacity: 1; transform: none;
                     transition: opacity var(--d-enter) var(--ease-out-expo),
                                 transform var(--d-enter) var(--ease-out-expo); }
.reveal-l      { opacity: 0; transform: translate3d(-24px, 0, 0); }
.reveal-r      { opacity: 0; transform: translate3d(24px, 0, 0); }
.reveal-scale  { opacity: 0; transform: scale(.96); }
```

**Fallback obrigatório:** se `IntersectionObserver` não existir (ou JS falhar), todos os `.reveal` ficam visíveis — nunca deixar conteúdo invisível por dependência de script. Garantido por `.no-js .reveal { opacity: 1; transform: none; }` e pela classe `js-ready` adicionada no mount.

---

## 3. Catálogo de animações

### A1 — Pórtico sendo montado *(Hero)*
**Conceito:** a estrutura de um galpão se ergue peça por peça, na mesma ordem de uma montagem real.

| Fase | Elemento | Animação | Delay | Duração |
|---|---|---|---|---|
| 0 | Grid de fundo (planta) | fade 0 → .18 | 0 | 900ms |
| 1 | Sapatas / base | fade + `translateY(8px → 0)` | 200ms | 400ms |
| 2 | Pilares (4 pares) | `scaleY(0 → 1)`, origem na base, stagger 90ms | 500ms | 520ms |
| 3 | Tesouras / treliça | line-draw `stroke-dashoffset` | 1100ms | 1400ms |
| 4 | Terças longitudinais | line-draw, stagger 60ms | 1900ms | 700ms |
| 5 | Telha (plano da cobertura) | fade + `translateY(-6px → 0)` | 2400ms | 600ms |
| 6 | Cota de vão livre | line-draw + fade do número | 2900ms | 600ms |
| 7 | Brilho metálico (sheen) | `translateX(-120% → 120%)` sobre a estrutura | 3600ms | 2200ms, loop a cada 9s |

**Única animação em loop do hero:** o sheen (fase 7). Tudo mais roda uma vez.
**Reduced motion:** estado final imediato, sem sheen.
**Viewport do SVG:** `0 0 640 420`, `preserveAspectRatio="xMidYMid meet"`.

### A2 — Marquee de segmentos
`@keyframes lk-marquee { to { transform: translate3d(-50%, 0, 0); } }`
Conteúdo duplicado, `animation: lk-marquee 38s linear infinite`.
Pausa: `:hover`, `:focus-within`, `prefers-reduced-motion`.
Fade lateral com `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)` + variante `-webkit-`.

### A3 — Barras comparativas *(Metálica x Concreto)*
Cada barra: `transform: scaleX(0 → valor)`, `transform-origin: left`, `transition: 900ms var(--ease-out-quart)`, stagger 90ms por linha.
Valor numérico sobe junto com um contador de 420ms.
Ao trocar o toggle, as barras voltam a `scaleX(0)` por 120ms e re-animam — reforça que o dado mudou.

### A4 — Vão livre interativo *(seção de assinatura)*
Não é uma animação com tempo: é **uma função do valor do slider**.

- Estado: `span` de 12 a 40 (metros), passo 1.
- A cada mudança, recalcula em JS puro:
  - `x` dos dois pilares
  - `d` do path da tesoura (banzo superior em duas águas, montantes e diagonais gerados por laço)
  - `x1/x2` da linha de cota e posição do rótulo
  - altura do cume proporcional ao vão (inclinação de 10%)
- Transição suave via `transition: all 220ms var(--ease-snap)` nos elementos SVG (atributos geométricos não transicionam em CSS, então os pilares e a cota se movem por `transform: translateX()`, e a treliça é redesenhada — a mudança é pequena o suficiente para ler como contínua).
- `input[type=range]` nativo, estilizado, altura de alvo de 44px, `aria-valuetext="{n} metros"`.
- Números de saída com `tabular-nums` e transição de opacidade de 160ms na troca.

### A5 — Linha de processo
Linha conectora com `stroke-dasharray` total e `stroke-dashoffset` controlado pelo progresso do scroll **da própria seção** (um único `IntersectionObserver` com múltiplos thresholds, sem listener de scroll).
Cada marcador de etapa: ao ser ultrapassado, muda de `--lk-steel-500` para `--lk-gold-500` com `transition: 240ms`, e o ícone faz um `scale(.9 → 1)`.

### A6 — Contadores
`requestAnimationFrame` com easing `easeOutExpo`, duração 1600ms, **para ao terminar**.
Formatação `pt-BR` com `Intl.NumberFormat`.
Dispara uma única vez por elemento, via `useReveal`.

### A7 — Cards de projeto (arte isométrica SVG)
Função `GalpaoIso({ modules, height, tone })` gera o SVG do galpão em isometria:
- `modules` (3–7) define quantos pórticos desenhar,
- `height` define o pé-direito proporcional,
- `tone` escolhe o par de cinzas do telhado e da fachada.

**Hover:** o telhado ganha um `sheen` diagonal e a borda do card acende em dourado. Sem `scale` no card.
**Entrada:** `reveal-scale` com stagger.

### A8 — Ponte rolante *(A Fábrica)*
Grupo `<g>` com `animation: lk-crane 14s var(--ease-out-quart) infinite alternate` fazendo `translateX(0 → 180px)`.
O gancho acompanha com um leve atraso (mesma duração, `animation-delay: -0.4s`) — cria a sensação de inércia.
3 faíscas: pontos com `opacity` pulsando em ciclos dessincronizados de 2.6s/3.4s/4.1s. **Só opacidade**, sem blur.
Esta seção é a única da página com animação contínua além do marquee — e as duas nunca aparecem juntas na viewport.

### A9 — Progresso de scroll do header
`transform: scaleX(progresso)` com `transform-origin: left` numa barra de 2px.
Progresso calculado com `scroll` listener **passivo** + `requestAnimationFrame` throttle. É a única leitura de scroll contínua da página.

### A10 — Acordeão do FAQ
```css
.faq-panel { display: grid; grid-template-rows: 0fr;
             transition: grid-template-rows 320ms var(--ease-out-expo); }
.faq-panel[data-open="true"] { grid-template-rows: 1fr; }
.faq-panel > div { overflow: hidden; }
```
Ícone `+` → `transform: rotate(45deg)`.
Fallback para navegadores sem `grid-template-rows` animável: a transição simplesmente não ocorre, o conteúdo abre instantâneo. Aceitável.

### A11 — Carrossel de depoimentos
Trilho com `transform: translate3d(calc(var(--idx) * -100%), 0, 0)`, `transition: 520ms var(--ease-out-expo)`.
Arraste por Pointer Events com `setPointerCapture`; durante o arraste a transição é desligada e o trilho segue o dedo; ao soltar, decide por limiar de 18% da largura ou velocidade > 0.4px/ms.
`touch-action: pan-y` no trilho — permite rolar a página verticalmente enquanto arrasta na horizontal.

### A12 — Lightbox
Overlay: `opacity 0 → 1` em 200ms.
Painel: `opacity + translateY(12px → 0) + scale(.98 → 1)` em 320ms.
Saída em 180ms.
Foco preso, `Esc` fecha, setas navegam, scroll do body travado pela técnica de `position: fixed`.

### A13 — Botão flutuante de WhatsApp
Entra depois de 600px de scroll: `opacity + translateY(16px → 0)` em 320ms.
**Sem pulso infinito.** Um anel sutil aparece apenas no hover/focus.

### A14 — Textura de treliça (fundo)
SVG estático em `<pattern>`, sem animação. Opacidade 0.04. Aplicado em 3 seções no máximo, como `background-image` em `data:` URI inline para evitar requisição extra.

---

## 4. Biblioteca de ícones (SVG autorais, 24×24, stroke 1.5, `currentColor`)

| Nome | Uso |
|---|---|
| `IconBeam` | Perfil I — bullets, divisores, marquee |
| `IconTruss` | Tesoura/treliça — galpão industrial |
| `IconWarehouse` | Galpão com portão — comercial/logística |
| `IconMezzanine` | Dois níveis com escada — mezanino |
| `IconRoof` | Duas águas com calha — coberturas |
| `IconCarport` | Cobertura em balanço com carro — garagens |
| `IconRuler` | Cota com setas — sob medida / medidas |
| `IconBlueprint` | Prancha com planta — projeto |
| `IconFactory` | Fábrica com shed — fabricação |
| `IconTruck` | Caminhão com perfis — logística |
| `IconCrane` | Guindaste — montagem |
| `IconSpan` | Setas opostas com pilares — vão livre |
| `IconShield` | Escudo com check — garantia |
| `IconClock` | Relógio — prazo |
| `IconThermo` | Termômetro/ventilação — conforto térmico |
| `IconRecycle` | Setas cíclicas — aço reciclável |
| `IconWhatsApp` | Marca (path oficial Simple Icons) |
| `IconInstagram` | Marca (path oficial Simple Icons) |
| `IconArrow`, `IconChevron`, `IconClose`, `IconMenu`, `IconCheck`, `IconAlert`, `IconPlus` | UI |

**Regra:** todos herdam `currentColor`, nunca cor fixa. Decorativos recebem `aria-hidden="true"`; informativos recebem `role="img"` + `<title>`.

---

## 5. Orçamento de performance

| Métrica | Alvo |
|---|---|
| Elementos animados simultâneos | <= 12 |
| Animações infinitas na página | 3 no total (marquee, ponte rolante, sheen do hero), nunca 2 na mesma viewport |
| Listeners de `scroll` | 1, passivo, com rAF throttle |
| `IntersectionObserver` | 1 compartilhado para reveals + 1 para nav ativa |
| Peso total de SVG inline | < 60 KB |
| Camadas de composição (`will-change`) | adicionadas no início da animação, removidas no `animationend` |
| JS de terceiros | zero |
