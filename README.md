# Lukefer — Galpões e Estruturas Metálicas

Landing page institucional **100% mockada no front-end**. Sem back-end, sem CMS, sem chamada de rede além das fontes do Google. Toda interação funciona de verdade no navegador.

> **Demonstração.** Telefone, e-mail, CNPJ, endereço, projetos, números e depoimentos são fictícios. O único dado real é o Instagram: [@lukefer_galpoes](https://www.instagram.com/lukefer_galpoes/).

---

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # confere a build de produção
npm run typecheck  # TypeScript sem emitir
```

---

## O que tem dentro

**v2 — base clara, peso fotográfico.** A primeira versão era escura de ponta a ponta com ilustração vetorial, e caiu no visual padrão de SaaS. A referência que o cliente trouxe (manufatura italiana) mostrou o caminho certo: base branca, foto carregando o peso, aresta viva, um acento quente e um objeto técnico grande sobre o branco.

Página única, 15 blocos, construída como derrubada sequencial de objeções:

| # | Seção | Interação |
|---|---|---|
| 01 | Hero | Foto full-bleed, título embaixo à esquerda |
| 02 | Segmentos | Marquee contínuo em faixa escura, pausa no hover |
| 03 | Pilares | Três colunas, ícone de traço fino, muito ar |
| 04 | **Etapas** | **Quatro ladrilhos de foto em P&B que ganham cor no hover** — bloco de assinatura |
| 05 | Vão livre | **Corte SVG paramétrico** com slider de 12 a 40 m, sobre o branco |
| 06 | Metálica x Concreto | Barras animadas + toggle de cenário |
| 07 | Soluções | Bento de 6 cards + modal com ficha técnica |
| 08 | Processo | Timeline com linha que se preenche no scroll |
| 09 | Projetos | Nove obras em foto, filtro por categoria + lightbox com teclado |
| 10 | Números | Faixa escura sobre foto, contadores animados |
| 11 | Simulador | Calculadora ao vivo que empurra os dados para o formulário |
| 12 | A Fábrica | Escuro, split com foto da fabricação |
| 13 | Depoimentos | Carrossel com swipe por toque, setas e dots |
| 14 | FAQ | Acordeão, um aberto por vez |
| 15 | Orçamento | Formulário de 3 etapas sobre foto, rascunho em `localStorage`, protocolo |

Mais: header com progresso de leitura e link ativo, drawer mobile, WhatsApp flutuante, voltar ao topo e toasts.

---

## Stack

| Camada | Escolha |
|---|---|
| Build | Vite 7 (`target: es2019`, `cssTarget: safari14`) |
| UI | React 19 + TypeScript |
| Estilo | CSS puro com custom properties |
| Animação | CSS + IntersectionObserver |
| Ícones e desenho técnico | SVG autorais inline |
| Fotografia | 18 imagens, WebP em duas larguras com `srcset` |

**Dependências de produção: `react` e `react-dom`. Mais nada.**

Nenhuma biblioteca de animação. Framer Motion custaria ~40 KB e colocaria uma camada de JS entre o navegador e o compositor — num site que precisa ser impecável no Safari do iPhone, isso é risco sem retorno. Todo movimento é `transform`/`opacity` em CSS, mais `stroke-dashoffset` para o desenho de linha.

**Saída da build:** JS ≈ 98 KB gzip · CSS ≈ 10 KB gzip · imagens 2,5 MB (eram 47 MB em PNG).

### Imagens

Os originais são PNG de 1536px. `scripts/preparar-imagens.mjs` converte tudo para WebP em duas larguras e renomeia pelo papel na página:

```bash
node scripts/preparar-imagens.mjs <pasta-com-os-png>
```

O componente `<Foto>` monta o `srcset`, grava `width`/`height` para reservar a caixa (sem CLS) e marca o hero como `fetchpriority="high"`. Todo o resto é `loading="lazy"`.

### Tema claro e escuro na mesma página

A base é clara. Blocos escuros recebem a classe `.lk-dark`, que **remapeia os tokens de cor** em vez de duplicar regra por regra — tudo dentro do bloco se inverte sozinho.

Uma armadilha vale registro: dentro de `.lk-dark`, os valores precisam ser **literais**. Escrever `--lk-paper: var(--lk-ink)` faz o CSS resolver para o `--lk-ink` *novo* (claro), e fundo e texto saem da mesma cor. Foi exatamente o que aconteceu com a seção Fábrica, e só a auditoria de contraste pegou.

---

## iPhone

O site foi construído em cima das sete armadilhas conhecidas do Safari iOS. Cada uma tem solução explícita no código — detalhes em [`docs/06-responsivo-ios.md`](docs/06-responsivo-ios.md).

1. **`100vh` corta o conteúdo** → cascata `100vh` → `-webkit-fill-available` → `100svh`
2. **`overflow: hidden` no body não trava o scroll** → `position: fixed` com restauração da posição exata (`useScrollLock`, com contador de referência)
3. **`background-attachment: fixed` não funciona** → não é usado em lugar nenhum
4. **`backdrop-filter` precisa de prefixo e custa caro** → só no header, com fundo opaco de fallback
5. **Campo com fonte < 16px dispara zoom** → todo campo em 16px
6. **Notch e barra inferior** → `env(safe-area-inset-*)` + `viewport-fit=cover`
7. **Flash cinza no toque** → `-webkit-tap-highlight-color: transparent`

Mais: `:hover` só dentro de `@media (hover: hover)`, `touch-action: pan-y` no carrossel, `overflow-x: clip` com fallback para Safari < 16, e `prefers-reduced-motion` desligando todo movimento sem esconder informação.

---

## QA automatizado

Scripts em `scripts/`, sem dependências — driver CDP próprio usando o `WebSocket` nativo do Node.

```bash
# 1. sobe a build
npm run preview -- --port 4199 --host 127.0.0.1

# 2. sobe o Chrome em modo headless com depuração
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --remote-debugging-port=9333 \
  --user-data-dir=/tmp/chrome-qa --no-first-run about:blank

# 3. roda a bateria
node scripts/qa-overflow.mjs   # estouro horizontal em 8 larguras
node scripts/qa-funcional.mjs  # 37 checagens de interação
node scripts/qa-a11y.mjs       # 20 checagens de acessibilidade e iOS
node scripts/qa-contraste.mjs  # razão WCAG de cada nó de texto da página
```

### Resultado da última execução

| Bateria | Resultado |
|---|---|
| Estouro horizontal — 320, 360, 375, 390, 430, 768, 1024, 1440 px | **0 estouro em todas** |
| Funcional — drawer, âncoras, filtro, lightbox, toggle, slider, FAQ, carrossel, simulador, formulário | **37/37** |
| Acessibilidade e iOS — alvos de toque, fontes de campo, headings, labels, reduced-motion, teclado | **20/20** |
| Contraste — 1.281 nós de texto medidos contra o fundo efetivo | **0 abaixo de WCAG AA** |

---

## Bugs reais que a bateria pegou

### Na v2 (base clara)

1. **Fundo e texto da mesma cor na seção Fábrica.** `--lk-paper: var(--lk-ink)` dentro de `.lk-dark` resolve para o `--lk-ink` redefinido no mesmo bloco. Razão de contraste exatamente 1:1 — invisível em teste visual rápido porque a seção simplesmente parecia vazia. Uma causa raiz, seis falhas de contraste.
2. **Branco sobre o verde do WhatsApp dava 4,32:1**, logo abaixo do mínimo de 4,5. Verde escurecido.
3. **Rótulos de uma e duas linhas desalinhavam os valores** no vão livre e os quatro títulos dos ladrilhos. Resolvido com `min-height` em linhas, não com altura fixa em px.

### Na v1 (base escura)

Vale registrar, porque nenhum deles aparece olhando a tela parada:

1. **A navegação por âncora errava o alvo em 52px.** O contador `+420.000 m²` ia de `0` ao valor cheio durante o scroll, ganhava uma segunda linha e empurrava o documento 52px para baixo — exatamente a altura de uma linha. Corrigido na causa (`white-space: nowrap` + sufixo em `<small>`) e blindado em `scrollToSection`, que agora remede o alvo quando a rolagem para e corrige o desvio.
2. **O último glifo do texto com gradiente dourado era cortado** ("construi**r**"). `background-clip: text` recorta na caixa do texto; resolvido com folga de `0.08em` devolvida por margem negativa.
3. **A ponte rolante da fábrica invadia a bancada de solda** no fim do curso. Curso reduzido de 174px para 84px.
4. **O CTA do header estourava em exatamente 1024px**, onde a nav completa aparece. Nav compacta entre 1024 e 1199px.
5. **A linha de cota cruzava o rótulo** nos dois desenhos técnicos. Linha quebrada em dois trechos, como num desenho de verdade.

---

## Planejamento

Os 9 documentos em [`docs/`](docs/) foram escritos antes do código e são a fonte da verdade do projeto — marca, design system, arquitetura da informação, copy, catálogo de animações, regras de iOS, arquitetura técnica e checklist.

---

## Deploy

```bash
npx vercel --prod
```

Requer `vercel login` ou `--token=$VERCEL_TOKEN`. `vercel.json` já define framework, output e headers de cache.
