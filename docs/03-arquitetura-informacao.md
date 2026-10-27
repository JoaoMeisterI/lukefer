# 03 — Arquitetura da Informação

## 1. Estrutura: página única, 13 blocos

A jornada é construída como **derrubada sequencial de objeções**, não como catálogo.

```
+- 00  Header fixo + Progresso de scroll
|
+- 01  HERO ................... "o que é e por que importa"
+- 02  FAIXA DE SEGMENTOS ..... "isso é pra mim?"               [marquee]
+- 03  SOLUÇÕES .............. "o que exatamente vocês fazem?"  [bento]
+- 04  METÁLICA x CONCRETO ... "por que não concreto?"          [comparativo animado]
+- 05  VÃO LIVRE ............. "o que eu ganho na prática?"     [SVG interativo]
+- 06  PROCESSO .............. "como vocês trabalham?"          [timeline]
+- 07  NÚMEROS ............... "vocês têm bagagem?"             [contadores]
+- 08  PROJETOS .............. "me mostra feito"                [filtro + lightbox]
+- 09  SIMULADOR ............. "quanto custa e quanto demora?"  [calculadora mock]
+- 10  A FÁBRICA ............. "quem faz? dá pra confiar?"      [split + SVG]
+- 11  DEPOIMENTOS ........... "outros confiaram?"              [carrossel]
+- 12  FAQ ................... "minhas últimas dúvidas"         [acordeão]
+- 13  ORÇAMENTO ............. "quero falar"                    [form multi-etapas]
+- 14  FOOTER
       + WhatsApp flutuante (z-30)
       + Voltar ao topo (z-30)
```

---

## 2. Navegação

### Header (desktop, >= 1024px)

`[LF Lukefer]  Soluções · Vantagens · Processo · Projetos · Simulador · Contato   [Orçamento ->]`

- Fixo no topo, `z-20`, altura 72px.
- Estado inicial: fundo transparente. Após 24px de scroll: `background: rgba(10,11,13,.86)` + `backdrop-filter: blur(14px)` (com prefixo `-webkit-`) + borda inferior `--lk-steel-700`.
- **Link ativo** acompanha a seção visível (IntersectionObserver) — recebe `--lk-gold-500` e um traço de 2px embaixo.
- Barra de progresso de leitura (2px, `--grad-gold`) colada na base do header.

### Header (mobile, < 1024px)

`[LF]                                   [Orçamento]  [hambúrguer]`

- Drawer lateral da direita, 88% da largura, `z-40`, overlay escuro.
- Itens com 56px de altura, ícone + label.
- Abre com `translateX(100%) -> 0` em 320ms; fecha em 220ms.
- Trava o scroll do body com a técnica `position: fixed` (ver doc 06).
- Fecha em: clique no item, clique no overlay, tecla Esc, ou resize para >= 1024px.

### Scroll suave

`scroll-behavior: smooth` no `html` + `scroll-margin-top: 88px` em cada `section[id]` para o header não cobrir o título.
Sob `prefers-reduced-motion`, o `scroll-behavior` volta a `auto`.

---

## 3. Detalhamento dos blocos

### 01 · HERO

**Objetivo:** em 3 segundos, comunicar categoria + diferencial + ação.

Layout desktop: 2 colunas (texto 52% / SVG 48%). Mobile: empilhado, SVG abaixo do CTA, altura reduzida.

- Eyebrow: `SANTA CATARINA E REGIÃO`
- H1 com palavra-chave em dourado
- Parágrafo de apoio (máx. 2 linhas)
- 2 CTAs: `Solicitar orçamento` (primary) + `Ver projetos` (secondary)
- 3 micro-provas em linha: `Projeto próprio` · `Fabricação própria` · `Montagem própria`
- **Arte:** SVG do pórtico de galpão sendo montado (ver `05-motion-svg.md`, animação A1)
- Fundo: grid de planta baixa + vinheta dourada no topo
- Altura: `min-height: 100svh` com fallback. **Nunca `100vh` puro.**

### 02 · FAIXA DE SEGMENTOS

Marquee horizontal contínuo com 10 segmentos atendidos, separados por ícone de perfil I.
Duplica o conteúdo e usa `translateX(-50%)` para loop sem costura. Pausa no hover e com reduced-motion.
Máscara de fade nas laterais via `mask-image` (com `-webkit-mask-image`).

### 03 · SOLUÇÕES

Bento de 6 cards, assimétrico no desktop (2 cards grandes ocupando 2 colunas), 1 coluna no mobile.
Cada card: ícone SVG autoral (24px, traço 1.5) + título + descrição + 3 bullets + "Ver detalhes" que abre o lightbox.

### 04 · METÁLICA x CONCRETO

Comparativo em 5 critérios. Cada critério é uma linha com duas barras horizontais que **crescem na entrada** (`scaleX`, origem à esquerda), uma dourada (metálica) e uma cinza (concreto), com o valor em mono à direita.
Toggle no topo alterna entre `Obra de 1.000 m²` e `Obra de 3.000 m²`, reanimando os valores.

### 05 · VÃO LIVRE

Peça de assinatura. SVG em corte transversal de galpão com **slider de 12 m a 40 m**: ao arrastar, a largura do vão muda, os pilares se afastam, a tesoura se estica e a cota de medida acompanha. Texto lateral atualiza: área útil por módulo, pilares eliminados, uso recomendado.
No mobile o slider é um `input[type=range]` nativo com alvo de 44px e `touch-action` adequado para não brigar com o scroll.

### 06 · PROCESSO

Timeline de 5 etapas. Desktop: horizontal com linha conectora que se preenche conforme o scroll. Mobile: vertical, mesma lógica.
`1 Diagnóstico` -> `2 Projeto estrutural` -> `3 Fabricação` -> `4 Logística` -> `5 Montagem e entrega`
Cada etapa: número em mono, ícone SVG, título, descrição, prazo estimado.

### 07 · NÚMEROS

4 contadores que animam de 0 ao valor quando entram na viewport (uma vez só).
`+180 obras` · `+420.000 m² construídos` · `12 anos` · `98% entregues no prazo`
`tabular-nums` obrigatório. Sob reduced-motion, mostra o valor final direto.

### 08 · PROJETOS

Galeria de 9 projetos mockados. Filtro por categoria: `Todos · Industrial · Comercial · Logística · Agro · Residencial`.
Cada card: arte SVG isométrica gerada por parâmetros (tom, nº de módulos, altura), nome, cidade, área, ano.
Clique -> lightbox com ficha técnica, navegação por setas, foco preso, Esc fecha.

### 09 · SIMULADOR

Calculadora mockada, 100% client-side:

- Entradas: tipo de obra, largura (m), comprimento (m), pé-direito (m), mezanino (toggle).
- Saídas em tempo real: área total, faixa de investimento estimada, prazo de fabricação + montagem, peso estimado de aço.
- Fórmulas determinísticas documentadas em `07-arquitetura-tecnica.md` — plausíveis e **marcadas como estimativa**.
- Botão "Enviar essa simulação" pré-preenche o formulário da seção 13 e rola até ele.

### 10 · A FÁBRICA

Split 50/50. Texto à esquerda ("Ela começa na fábrica"), SVG à direita: corte de galpão industrial com ponte rolante que **desliza lentamente** e faíscas de solda discretas.
3 selos: `Corte CNC` · `Solda certificada` · `Pintura e tratamento`.

### 11 · DEPOIMENTOS

Carrossel de 5 depoimentos. Arraste por toque (pointer events), setas no desktop, dots sempre.
Auto-play de 6s que **pausa** no hover, no foco e com reduced-motion.
Cada card: aspas em SVG, texto, nome, empresa, cidade, avatar como monograma gerado (iniciais sobre `--grad-steel`).

### 12 · FAQ

8 perguntas em acordeão, 2 colunas no desktop, 1 no mobile. Apenas um aberto por vez.

### 13 · ORÇAMENTO

Formulário de 3 etapas com barra de progresso:

1. **Projeto** — tipo, área aproximada, prazo desejado, cidade/UF
2. **Detalhes** — pé-direito, mezanino, terreno pronto, observações
3. **Contato** — nome, e-mail, WhatsApp, melhor horário

- Validação por etapa, bloqueia o avanço com erro visível e foca o primeiro campo inválido.
- Rascunho salvo em `localStorage`, restaurado ao recarregar com aviso e botão de limpar.
- Envio: 1,4s de estado `loading` -> tela de sucesso com protocolo gerado (`LKF-AAAA-XXXX`), resumo do pedido e CTA de WhatsApp.
- Banner de mock: "Demonstração — nenhum dado é enviado ou armazenado em servidor."

### 14 · FOOTER

4 colunas no desktop (marca+bio / soluções / empresa / contato), empilhadas no mobile.
Instagram real linkado. Telefone, e-mail, endereço e CNPJ **fictícios**, com nota de mock.
Linha final: créditos + aviso de que é uma demonstração.

---

## 4. Estratégia de CTA

| Posição | CTA | Tipo |
|---|---|---|
| Header (sempre visível) | Orçamento | primary, compacto |
| Hero | Solicitar orçamento / Ver projetos | primary + secondary |
| Fim de Soluções | Não achou seu caso? Fale com a gente | ghost |
| Fim de Vão Livre | Simular meu galpão | secondary |
| Simulador | Enviar essa simulação | primary |
| Fim de Projetos | Quero um projeto assim | primary |
| Seção 13 | Enviar solicitação | primary |
| Flutuante (todo o scroll) | WhatsApp | whatsapp |

**Regra:** no máximo **um** botão `primary` visível por viewport.

---

## 5. SEO e metadados (mock)

- `title`: Lukefer | Galpões e Estruturas Metálicas em SC
- `description`: Projeto, fabricação e montagem de galpões industriais e comerciais sob medida em estrutura metálica. Santa Catarina e região.
- Open Graph + Twitter Card.
- JSON-LD `LocalBusiness` com dados mockados.
- Um único `h1` na página; hierarquia `h2` por seção, `h3` em cards.
- `section[aria-labelledby]` apontando para o id do título de cada seção.
- `html lang="pt-BR"`.
