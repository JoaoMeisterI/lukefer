# 02 — Design System

Estilo-base: **Exaggerated Minimalism industrial** — tipografia display enorme, muito respiro, alto contraste, e densidade de informação concentrada em blocos bento. Escuro por padrão, sem tema claro (decisão: a marca vive no preto).

---

## 1. Espaçamento

Escala base 4px.

| Token | px |
|---|---|
| `--sp-1` | 4 |
| `--sp-2` | 8 |
| `--sp-3` | 12 |
| `--sp-4` | 16 |
| `--sp-5` | 24 |
| `--sp-6` | 32 |
| `--sp-7` | 48 |
| `--sp-8` | 64 |
| `--sp-9` | 96 |
| `--sp-10` | 128 |

**Ritmo vertical de seção:** `padding-block: clamp(4.5rem, 9vw, 9rem)`.
**Gutter horizontal:** `clamp(1.25rem, 5vw, 3rem)` + `env(safe-area-inset-*)`.
**Container:** `max-width: 1280px`, centralizado. Hero e faixas de textura podem sangrar até `100vw`.

---

## 2. Grid

| Breakpoint | Colunas | Gap |
|---|---|---|
| < 640px | 4 | 16px |
| 640–1023px | 8 | 20px |
| ≥ 1024px | 12 | 24px |

Bento usa `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))` para nunca estourar em telas estreitas.

---

## 3. Camadas (z-index)

| Valor | Camada |
|---|---|
| 0 | Conteúdo |
| 10 | Elementos sticky internos |
| 20 | Header fixo |
| 30 | Botão flutuante WhatsApp / topo |
| 40 | Drawer mobile + overlay |
| 50 | Lightbox / modal |
| 60 | Toast |

> Nenhum valor fora dessa tabela. Nada de `z-index: 9999`.

---

## 4. Componentes

### 4.1 Botão

| Variante | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| `primary` | `--grad-gold` | `--lk-ink` | — | CTA principal (1 por seção, no máximo) |
| `secondary` | `transparent` | `--lk-white` | `1px --lk-steel-700` | Ação alternativa |
| `ghost` | `transparent` | `--lk-silver-200` | — | Nav, terciária |
| `whatsapp` | `#1FA855` | `#fff` | — | Flutuante |

- Altura mínima: **48px** (`44px` é o piso de toque; 48 dá folga).
- Padding: `0 var(--sp-6)`.
- `border-radius: var(--r-full)` para CTA, `var(--r-md)` para botões de UI.
- **Hover:** só muda cor/brilho (`filter: brightness(1.08)`) e `--sh-gold`. **Nunca `scale`** — causa shift de layout.
- **Active:** `transform: translateY(1px)`.
- **Focus-visible:** `outline: 2px solid var(--lk-gold-500); outline-offset: 3px`.
- **Disabled:** `opacity: .45; cursor: not-allowed`.
- **Loading:** spinner SVG inline + `aria-busy="true"` + botão desabilitado.
- `cursor: pointer` obrigatório.

### 4.2 Card

```
bg: --lk-graphite
border: 1px solid --lk-steel-700
radius: --r-lg
padding: --sp-6
hover: border-color --lk-gold-700 + bg --lk-steel-900 (transition 220ms ease-out)
```
Cards clicáveis recebem `cursor: pointer`, `role="button"` ou `<a>` real, e `:focus-visible`.
Nenhum card usa `transform: scale` no hover. O feedback é borda + fundo + um traço dourado que cresce na base (`::after` com `transform: scaleX()`, origem à esquerda).

### 4.3 Eyebrow (sobretítulo de seção)
Linha curta + label mono maiúsculo.
```
[———]  PROCESSO
```
`--lk-gold-500`, `--fs-eyebrow`, `letter-spacing: .18em`. O traço é um `<span>` de 32px × 1px que anima a largura de 0 → 32px na entrada.

### 4.4 Campo de formulário
- Label **sempre visível** acima (nunca só placeholder).
- `font-size: 16px` no input — evita o zoom automático do Safari iOS.
- Altura 52px, `bg: --lk-ink`, `border: 1px --lk-steel-700`, foco → borda `--lk-gold-500` + `box-shadow: 0 0 0 3px rgba(200,164,92,.15)`.
- Erro: borda `--lk-danger` + mensagem abaixo com ícone, `role="alert"`, `aria-invalid="true"`, `aria-describedby`.
- Grupos de rádio viram **cards selecionáveis** com `input` real visualmente oculto (`.sr-only`) — mantém teclado e leitor de tela.

### 4.5 Acordeão (FAQ)
`<button aria-expanded>` + painel com `grid-template-rows: 0fr → 1fr` (anima altura sem `height: auto` e sem JS de medição). Ícone `+` rotaciona 45°.

### 4.6 Lightbox de projeto
- `role="dialog" aria-modal="true"`, foco preso dentro, `Esc` fecha, `←/→` navegam.
- Scroll do body travado via `position: fixed` no `<body>` guardando `scrollY` — **padrão obrigatório no iOS**, pois `overflow: hidden` sozinho não segura o Safari.

### 4.7 Toast
Canto inferior, `role="status" aria-live="polite"`, auto-dismiss em 4s, respeita safe-area.

---

## 5. Movimento — regras gerais

| Papel | Duração | Easing |
|---|---|---|
| Micro (hover, foco) | 150–220ms | `cubic-bezier(.2,.8,.2,1)` |
| Entrada de elemento | 480–700ms | `cubic-bezier(.16,1,.3,1)` |
| Desenho de SVG | 900–1800ms | `ease-out` |
| Saída | 160ms | `ease-in` |

- **Só `transform` e `opacity`.** Nunca `width`, `height`, `top`, `left`, `margin`.
- Stagger entre irmãos: 60–90ms, teto de 6 itens (depois disso, entram juntos).
- Nenhuma animação infinita decorativa acima de 2 por viewport.
- `will-change` só durante a animação, removido depois.
- `prefers-reduced-motion: reduce` → tudo vira estado final, duração 0.01ms, loops param.

---

## 6. Estados obrigatórios por componente

Todo componente interativo implementa os 6: `default` · `hover` · `focus-visible` · `active` · `disabled` · `loading/erro` (quando aplicável).

---

## 7. Acessibilidade — piso inegociável

- Contraste ≥ 4.5:1 em texto, ≥ 3:1 em borda de controle.
- Alvo de toque ≥ 44×44px com ≥ 8px de separação.
- Ordem de tabulação = ordem visual.
- `:focus-visible` visível em **todos** os focáveis.
- Ícone sozinho → `aria-label`.
- SVG decorativo → `aria-hidden="true"`; SVG informativo → `role="img"` + `<title>`.
- Skip link "Pular para o conteúdo" como primeiro elemento focável.
- Cor nunca é o único indicador (erro tem ícone + texto; etapa ativa tem marcador + peso).
- `<html lang="pt-BR">`.
