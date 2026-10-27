# 08 — Checklist de Implementação e QA

Ordem de construção, com critério de pronto para cada etapa.

---

## Fase 1 — Fundação

- [ ] Scaffold Vite + React + TS
- [ ] `tokens.css` com todas as variáveis dos docs 01 e 02
- [ ] `base.css`: reset, `box-sizing`, tipografia, regras iOS (seção 2 do doc 06), `prefers-reduced-motion`, `:focus-visible`, `.sr-only`, skip link
- [ ] `utilities.css`: container, grid, `.reveal*`, `.no-js`
- [ ] `index.html` completo com meta, OG, JSON-LD, preconnect, noscript
- [ ] Hooks: `useReveal`, `useReducedMotion`, `useScrollLock`, `useActiveSection`, `useScrollProgress`, `useCountUp`, `useFocusTrap`, `useMediaQuery`
- [ ] `lib/format.ts`, `lib/validacao.ts`, `lib/storage.ts`, `lib/simulador.ts`
- [ ] Dados mockados tipados em `src/data/`

**Pronto quando:** `npm run dev` sobe uma página em branco com o fundo correto e as fontes carregadas.

---

## Fase 2 — Componentes base

- [ ] `Logo` (3 variantes: prata, dourado, contorno animado)
- [ ] Biblioteca de ícones (24 ícones do doc 05, seção 4)
- [ ] `Button` com as 6 variações de estado × 4 variantes
- [ ] `Eyebrow`, `Section`, `Reveal`, `Field`, `Modal`, `Toast`
- [ ] Texturas: grid de planta baixa, padrão de treliça

**Pronto quando:** cada componente responde a teclado, tem `:focus-visible` e não quebra em 320px.

---

## Fase 3 — Arte SVG

- [ ] `PorticoHero` com as 7 fases da animação A1
- [ ] `VaoLivre` paramétrico (12–40 m) com geração de treliça
- [ ] `GalpaoIso` paramétrico (módulos, altura, tom)
- [ ] `FabricaCena` com ponte rolante e faíscas

**Pronto quando:** cada arte renderiza corretamente de 280px a 900px de largura e respeita reduced-motion.

---

## Fase 4 — Seções

- [ ] Header + drawer mobile + progresso
- [ ] Hero
- [ ] Segmentos (marquee)
- [ ] Soluções (bento + modal de detalhe)
- [ ] Comparativo (barras + toggle)
- [ ] Vão Livre (slider interativo)
- [ ] Processo (timeline)
- [ ] Números (contadores)
- [ ] Projetos (filtro + lightbox)
- [ ] Simulador (calculadora + prefill)
- [ ] Fábrica
- [ ] Depoimentos (carrossel com swipe)
- [ ] FAQ (acordeão)
- [ ] Orçamento (form 3 etapas + sucesso)
- [ ] Footer
- [ ] Flutuantes (WhatsApp + topo)

---

## Fase 5 — QA funcional

Toda interação precisa funcionar de verdade. Nenhum botão morto.

- [ ] Todo link de nav rola para a seção certa, com o header descontando a altura
- [ ] Link ativo do nav acompanha o scroll
- [ ] Drawer: abre, fecha por item / overlay / Esc / resize; trava e devolve o scroll
- [ ] Marquee: pausa no hover e com reduced-motion
- [ ] Modal de solução: abre, prende o foco, fecha por Esc e por botão
- [ ] Toggle do comparativo: reanima as barras e troca os números
- [ ] Slider do vão: arrasta por mouse, toque e teclado (setas, Home/End); números acompanham
- [ ] Timeline preenche conforme o scroll
- [ ] Contadores disparam uma única vez, formatados em pt-BR
- [ ] Filtro de projetos: filtra, mostra estado vazio, mantém acessibilidade
- [ ] Lightbox: abre, navega por setas e teclado, prende foco, fecha, devolve o scroll
- [ ] Simulador: recalcula ao vivo, valida limites, formata saída
- [ ] "Enviar essa simulação": preenche o formulário, rola até lá, mostra toast
- [ ] Carrossel: swipe por toque, setas, dots, auto-play que pausa
- [ ] FAQ: um aberto por vez, `aria-expanded` correto
- [ ] Formulário: valida por etapa, foca o campo com erro, salva rascunho, restaura rascunho, limpa rascunho, envia, gera protocolo, permite nova solicitação
- [ ] Botão de topo aparece após scroll e volta ao topo
- [ ] WhatsApp abre com mensagem pré-preenchida

---

## Fase 6 — QA responsivo e iOS

Rodar a matriz completa do doc 06, seção 6.

- [ ] 320 / 375 / 390 / 393 / 430 / 360 / 768 / 1024 / 1440 / 1920
- [ ] Zero scroll horizontal em todas as larguras
- [ ] Hero sem corte com e sem barra de endereço (teste de `svh`)
- [ ] Nenhum input dispara zoom no iOS
- [ ] Safe area respeitada em paisagem com notch
- [ ] Scroll lock devolve a posição exata
- [ ] 60fps no scroll com as animações rodando
- [ ] Teclado virtual não cobre o campo em foco

---

## Fase 7 — QA de acessibilidade

- [ ] Navegação completa só por teclado, do skip link ao footer
- [ ] `:focus-visible` visível em 100% dos focáveis
- [ ] Contraste conferido em todos os pares da tabela do doc 01
- [ ] Hierarquia de headings: um `h1`, `h2` por seção, sem pulo de nível
- [ ] Todo ícone sozinho tem `aria-label`
- [ ] SVG decorativo com `aria-hidden`, informativo com `role="img"` + `title`
- [ ] Formulário: label associado, erro anunciado, `aria-invalid`
- [ ] Modais com `role="dialog"`, `aria-modal`, foco preso e devolvido ao gatilho
- [ ] `prefers-reduced-motion`: nada se move, nenhuma informação se perde
- [ ] Zoom de 200% sem perda de conteúdo ou scroll horizontal

---

## Fase 8 — Build e publicação

- [ ] `npm run build` sem erro e sem warning de TS
- [ ] `npm run preview` confere a build de produção
- [ ] Bundle JS < 120 KB gzip; CSS < 30 KB gzip
- [ ] `vercel.json` presente
- [ ] README com instruções
- [ ] Deploy na Vercel + URL de produção entregue

---

## Critérios de aceite final

| # | Critério | Como verificar |
|---|---|---|
| 1 | Site 100% mockado, sem back-end | Nenhuma chamada de rede além das fontes |
| 2 | Toda interação funciona | Checklist da Fase 5 inteiro marcado |
| 3 | Responsivo de 320px a 2560px | Checklist da Fase 6 |
| 4 | Funciona no iPhone, incluindo animações | Regras do doc 06 seção 2 aplicadas e testadas |
| 5 | Animações SVG concisas e com propósito | Catálogo do doc 05 implementado, orçamento de performance respeitado |
| 6 | Cores da marca | Paleta do doc 01 aplicada, zero cor fora dos tokens |
| 7 | Publicado na Vercel | URL ativa |

---

## Resultado da verificação (26/10/2026)

Tudo abaixo foi verificado com execução real no Chrome, via driver CDP próprio (`scripts/`), não por inspeção visual.

| Bateria | Script | Resultado |
|---|---|---|
| Estouro horizontal em 320, 360, 375, 390, 430, 768, 1024 e 1440 px | `qa-overflow.mjs` | **0 estouro em todas as larguras** |
| Interações (37 checagens) | `qa-funcional.mjs` | **37/37** |
| Acessibilidade e iOS (19 checagens) | `qa-a11y.mjs` | **19/19** |
| Build TypeScript | `npm run build` | sem erro, sem aviso |
| Bundle | — | JS 100 KB gzip (alvo < 120), CSS 11 KB gzip (alvo < 30) |

### Defeitos encontrados e corrigidos

| # | Defeito | Causa | Correção |
|---|---|---|---|
| 1 | Navegação por âncora parava 52px abaixo do alvo | O contador `+420.000 m²` ganhava uma segunda linha ao animar de `0` ao valor cheio, crescendo o documento durante o scroll | `white-space: nowrap` + sufixo em `<small>`; e `scrollToSection` passou a remedir o alvo quando a rolagem para |
| 2 | Último glifo do texto dourado cortado | `background-clip: text` recorta na caixa do texto | Folga de `0.08em` devolvida por margem negativa + `box-decoration-break: clone` |
| 3 | Ponte rolante invadia a bancada de solda | Curso de 174px excedia o espaço livre | Curso reduzido para 84px |
| 4 | CTA do header estourava em 1024px | Nav completa + CTA não cabiam no container | Nav compacta entre 1024 e 1199px |
| 5 | Linha de cota cruzava o rótulo nos desenhos | Linha contínua sob o rótulo | Linha quebrada em dois trechos |
| 6 | Alvos de toque de 39 a 42px | Logo do header, toggle do comparativo e links do rodapé | Todos elevados a 44px ou mais |
| 7 | Rótulos decorativos a 10 e 11px | Ordinais, categorias e escalas | Piso de 12px aplicado |
| 8 | `content-visibility: auto` | Fazia o `getBoundingClientRect` de seções não renderizadas usar o tamanho estimado, errando a âncora | Removido |

### Pendente

- [ ] Deploy na Vercel — a CLI precisa de `vercel login` ou de um `VERCEL_TOKEN`; sem credencial, o projeto fica pronto mas não publicado.
