# 01 — Identidade de Marca

## 1. O logo

Monograma **LF** construído como arquitetura: o "L" é formado por quatro perfis verticais de alturas crescentes (como uma empena escalonada), e o "F" é um perfil em balanço com o topo em diagonal — a silhueta geral lê como **fachada de galpão com telhado de duas águas**.

### Leitura semiótica
| Elemento | Significado |
|---|---|
| Perfis verticais escalonados | Pilares, repetição modular, pórticos |
| Diagonal superior | Água do telhado / tesoura |
| Vazios entre perfis | Vão livre — o produto que eles vendem |
| Acabamento metálico chapado | Aço, não desenho |

### Regras de uso no site
- **Área de respiro:** mínimo = altura de um perfil vertical do próprio logo em todos os lados.
- **Tamanho mínimo:** 28px de altura (header mobile). Abaixo disso os vazios fecham.
- **Versões:** `prata` (padrão, sobre fundo escuro) · `dourado` (acento, selo/watermark) · `contorno` (hero animado, line-draw).
- **Proibido:** aplicar sobre fundo claro sem o contêiner escuro; rotacionar; aplicar sombra colorida; distorcer proporção.

---

## 2. Paleta

Derivada do próprio material da marca: fundo preto do avatar, monograma cinza-metálico, e o dourado/bronze recorrente nas peças de feed ("CONCRETO", watermark LF, "o dia inteiro no calor").

### Tokens primários

| Token | Hex | Uso |
|---|---|---|
| `--lk-ink` | `#0A0B0D` | Fundo base do site |
| `--lk-graphite` | `#121417` | Superfícies elevadas, cards |
| `--lk-steel-900` | `#1A1D21` | Superfície 2, hover de card |
| `--lk-steel-700` | `#272B31` | Bordas fortes, divisores |
| `--lk-steel-500` | `#3A4047` | Bordas sutis, linhas de grid |
| `--lk-silver-400` | `#8A9099` | Texto secundário |
| `--lk-silver-200` | `#C2C8CF` | Texto de corpo |
| `--lk-white` | `#F4F6F8` | Títulos, texto primário |

### Acento — dourado/bronze

| Token | Hex | Uso |
|---|---|---|
| `--lk-gold-300` | `#E3C98A` | Topo de gradiente, highlight |
| `--lk-gold-500` | `#C8A45C` | **Acento primário** — CTA, ícone ativo, grifo |
| `--lk-gold-700` | `#9B7B3A` | Base de gradiente, borda de CTA |
| `--lk-gold-900` | `#5C4720` | Fundo tingido, glow a 10% |

### Funcionais

| Token | Hex | Uso |
|---|---|---|
| `--lk-success` | `#4ADE80` | Validação OK, etapa concluída |
| `--lk-danger` | `#F87171` | Erro de formulário |
| `--lk-weld` | `#5AC8FA` | Faísca de solda (só em animação decorativa) |

### Gradientes nomeados
```css
--grad-steel:   linear-gradient(135deg, #272B31 0%, #3A4047 50%, #1A1D21 100%);
--grad-gold:    linear-gradient(135deg, #E3C98A 0%, #C8A45C 45%, #9B7B3A 100%);
--grad-sheen:   linear-gradient(100deg, transparent 35%, rgba(227,201,138,.28) 50%, transparent 65%);
--grad-vignette: radial-gradient(120% 80% at 50% 0%, rgba(200,164,92,.10), transparent 60%);
```

### Contraste verificado (WCAG)

| Par | Ratio | Nível |
|---|---|---|
| `#F4F6F8` sobre `#0A0B0D` | 17.8:1 | AAA |
| `#C2C8CF` sobre `#0A0B0D` | 12.1:1 | AAA |
| `#8A9099` sobre `#0A0B0D` | 6.2:1 | AA |
| `#C8A45C` sobre `#0A0B0D` | 8.4:1 | AAA |
| `#0A0B0D` sobre `#C8A45C` (botão) | 8.4:1 | AAA |
| `#8A9099` sobre `#121417` | 5.6:1 | AA |

> **Regra:** `--lk-silver-400` nunca é usado para texto menor que 14px. Abaixo disso, sobe para `--lk-silver-200`.

---

## 3. Tipografia

Par escolhido para ler como **documentação técnica de engenharia**, não como SaaS.

| Papel | Fonte | Pesos | Por quê |
|---|---|---|---|
| Display / Títulos | **Archivo** | 600, 700, 800 | Grotesca semicondensada, ombros retos, muito próxima da tipografia das peças do feed. Aguenta `letter-spacing` negativo sem fechar. |
| Corpo / UI | **Inter** | 400, 500, 600 | Legibilidade a 14-18px em tela, altura-x alta, ótimo hinting no iOS. |
| Numérico / técnico | **JetBrains Mono** | 400, 500 | Medidas, m², códigos de projeto, contadores. Tabular por padrão. |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Escala tipográfica (fluida, `clamp`)

| Token | clamp() | Uso |
|---|---|---|
| `--fs-hero` | `clamp(2.75rem, 1.6rem + 5.8vw, 6.5rem)` | H1 do hero |
| `--fs-h2` | `clamp(2rem, 1.3rem + 3.2vw, 3.75rem)` | Título de seção |
| `--fs-h3` | `clamp(1.375rem, 1.1rem + 1.2vw, 1.875rem)` | Título de card |
| `--fs-h4` | `clamp(1.125rem, 1rem + .5vw, 1.375rem)` | Subtítulo |
| `--fs-lead` | `clamp(1.0625rem, 1rem + .4vw, 1.3125rem)` | Parágrafo de abertura |
| `--fs-body` | `1rem` | Corpo (nunca abaixo de 16px no mobile) |
| `--fs-sm` | `.875rem` | Legenda, meta |
| `--fs-eyebrow` | `.75rem` | Sobretítulo, `tracking: .18em`, uppercase |

### Regras
- H1/H2: `font-family: Archivo`, `font-weight: 800`, `letter-spacing: -0.03em`, `line-height: 0.98–1.04`.
- Corpo: `line-height: 1.65`, `max-width: 68ch`.
- Nunca usar `text-transform: uppercase` em bloco com mais de 4 palavras.
- Números em destaque: `font-variant-numeric: tabular-nums` para não "pular" durante a contagem animada.

---

## 4. Tom de voz

| Faça | Não faça |
|---|---|
| "Seu galpão em 90 dias, com prazo em contrato." | "Soluções inovadoras e disruptivas em construção." |
| "Vão livre de até 40 m. Sem pilar no meio do seu estoque." | "Grandes vãos estruturais otimizados." |
| "Começa na nossa fábrica, termina no seu terreno." | "Excelência de ponta a ponta." |
| Abrir com pergunta ou provocação curta | Abrir com "Somos uma empresa que…" |
| Número concreto sempre que possível | Adjetivo sem lastro |

**Assinatura verbal recorrente:** frases de 3 a 7 palavras, ponto final forte, sem reticências decorativas.
**Pessoa:** "você" para o cliente, "a gente / nós" para a Lukefer. Nunca "o cliente" em terceira pessoa.

---

## 5. Linguagem visual

### Motivos gráficos autorizados
1. **Treliça / tesoura** — padrão de triângulos em linha fina `--lk-steel-500`, usado como textura de fundo.
2. **Perfil I (viga)** — seção transversal como ícone, divisor e bullet.
3. **Grid modular** — linhas de 1px a cada 80px, opacidade 0.05, evocando planta baixa.
4. **Cota de medida** — setas duplas com traço, para indicar vão livre e dimensões.
5. **Faísca de solda** — pontos `--lk-weld` com fade, uso raríssimo e só no hero.

### Proibido
- Gradiente roxo/rosa de IA.
- Blobs orgânicos, formas "líquidas".
- Glassmorphism pesado (custa caro no iOS e não combina com aço).
- Sombra colorida difusa. Sombras aqui são duras e escuras, como sombra de estrutura ao sol.
- Emoji como ícone.

### Sombras
```css
--sh-1: 0 1px 2px rgba(0,0,0,.6);
--sh-2: 0 8px 24px -8px rgba(0,0,0,.75);
--sh-3: 0 24px 60px -20px rgba(0,0,0,.85);
--sh-gold: 0 0 0 1px rgba(200,164,92,.35), 0 10px 30px -12px rgba(200,164,92,.30);
```

### Raios
`--r-sm: 6px` · `--r-md: 10px` · `--r-lg: 16px` · `--r-xl: 24px` · `--r-full: 999px`
> Nada acima de 24px em contêiner grande — aço não é macio.
