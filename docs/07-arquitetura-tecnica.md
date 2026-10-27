# 07 — Arquitetura Técnica

## 1. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build | **Vite 7** | Build estático em segundos, saída 100% compatível com o preset Vercel |
| UI | **React 19 + TypeScript** | Componentização das 14 seções, tipagem dos dados mockados |
| Estilo | **CSS puro com custom properties** | Controle total sobre o que vai pro iOS; zero runtime; sem surpresa de purge. Tokens do doc 02 viram variáveis CSS reais |
| Animação | **CSS + IntersectionObserver** | Nenhuma biblioteca. Framer Motion traria ~40 KB e uma camada de JS entre o browser e o compositor — num site que precisa ser impecável no Safari, isso é risco sem retorno |
| Ícones | **SVG autorais inline** | Sem requisição, herdam `currentColor`, peso controlado |
| Dados | **Módulos TS estáticos** | Tudo mockado em `src/data/*.ts`, tipado |
| Deploy | **Vercel (estático)** | `vercel.json` com rewrite de SPA e headers de cache |

**Dependências de produção: apenas `react` e `react-dom`.** Nada mais.

---

## 2. Estrutura de arquivos

```
lukeferGalpoes/
├── docs/                          # os 9 documentos de planejamento
├── public/
│   ├── favicon.svg                # monograma LF
│   ├── og-image.svg
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/
│   │   ├── solucoes.ts
│   │   ├── projetos.ts
│   │   ├── processo.ts
│   │   ├── depoimentos.ts
│   │   ├── faq.ts
│   │   ├── comparativo.ts
│   │   ├── numeros.ts
│   │   └── site.ts                # nav, contato, segmentos, metadados
│   ├── hooks/
│   │   ├── useReveal.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useScrollLock.ts
│   │   ├── useActiveSection.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useCountUp.ts
│   │   ├── useFocusTrap.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── format.ts              # Intl pt-BR: número, moeda, m²
│   │   ├── simulador.ts           # fórmulas da calculadora
│   │   ├── validacao.ts           # validadores do formulário
│   │   └── storage.ts             # rascunho em localStorage
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Eyebrow.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── Field.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Reveal.tsx
│   │   ├── icons/
│   │   │   ├── index.tsx          # todos os ícones 24x24
│   │   │   └── Logo.tsx           # monograma LF (3 variantes)
│   │   ├── art/
│   │   │   ├── PorticoHero.tsx    # A1
│   │   │   ├── VaoLivre.tsx       # A4
│   │   │   ├── GalpaoIso.tsx      # A7
│   │   │   ├── FabricaCena.tsx    # A8
│   │   │   └── Texturas.tsx       # grid de planta, padrão de treliça
│   │   └── sections/
│   │       ├── Header.tsx
│   │       ├── Hero.tsx
│   │       ├── Segmentos.tsx
│   │       ├── Solucoes.tsx
│   │       ├── Comparativo.tsx
│   │       ├── VaoLivreSection.tsx
│   │       ├── Processo.tsx
│   │       ├── Numeros.tsx
│   │       ├── Projetos.tsx
│   │       ├── Simulador.tsx
│   │       ├── Fabrica.tsx
│   │       ├── Depoimentos.tsx
│   │       ├── Faq.tsx
│   │       ├── Orcamento.tsx
│   │       ├── Footer.tsx
│   │       └── Flutuantes.tsx     # WhatsApp + voltar ao topo
│   └── styles/
│       ├── tokens.css             # custom properties do doc 01 e 02
│       ├── base.css               # reset, tipografia, a11y, regras iOS
│       ├── utilities.css          # container, reveal, sr-only, grid
│       └── sections.css           # estilos das 14 seções
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
└── README.md
```

---

## 3. Estado da aplicação

Sem biblioteca de estado. Tudo é local ao componente, exceto um contexto mínimo:

```ts
// AppContext
{
  prefillOrcamento: PrefillOrcamento | null;   // o simulador empurra dados pro formulário
  setPrefillOrcamento: (p) => void;
  toast: { msg: string; tone: 'ok' | 'erro' } | null;
  showToast: (msg, tone?) => void;
}
```

Fluxo do prefill: `Simulador` monta um objeto `{ tipo, area, peDireito, mezanino }` -> grava no contexto -> chama `scrollToSection('orcamento')` -> `Orcamento` lê no `useEffect` e preenche a etapa 1 e 2, exibindo um toast "Simulação carregada no formulário."

---

## 4. Fórmulas do simulador (determinísticas, documentadas)

> Todas as constantes são **de referência para demonstração**. O site exibe aviso explícito.

```ts
area        = largura * comprimento                        // m²
fatorTipo   = { industrial:1.00, comercial:0.94, logistica:1.08,
                agro:0.86, mezanino:1.15, cobertura:0.72, garagem:0.68 }
fatorAltura = 1 + (peDireito - 6) * 0.035                  // base 6 m
fatorVao    = 1 + max(0, largura - 20) * 0.010             // vãos > 20 m encarecem
fatorMezan  = mezanino ? 1.22 : 1

// Peso de aço
kgPorM2     = 32 * fatorTipo * fatorAltura * fatorVao
pesoAco     = area * kgPorM2                                // kg

// Investimento (R$/m²)
basePorM2   = 780
precoM2     = basePorM2 * fatorTipo * fatorAltura * fatorVao * fatorMezan
// desconto de escala
escala      = area > 3000 ? 0.90 : area > 1500 ? 0.95 : 1
precoM2     = precoM2 * escala
investMin   = area * precoM2 * 0.88
investMax   = area * precoM2 * 1.14

// Prazo (dias corridos)
prazoProjeto   = 14
prazoFabrica   = ceil(pesoAco / 2600) * 7      // ~2,6 t por semana de fábrica
prazoMontagem  = ceil(area / 420) * 7          // ~420 m² por semana de montagem
prazoTotal     = prazoProjeto + prazoFabrica + prazoMontagem
// limites de sanidade
prazoTotal     = clamp(prazoTotal, 45, 420)
```

Saída formatada em pt-BR: `R$ 1.248.000 — R$ 1.617.000`, `4.800 m²`, `96 t de aço`, `≈ 5 meses (147 dias)`.

Limites de entrada: largura 6–60 m, comprimento 6–300 m, pé-direito 3–20 m. Fora disso, o campo mostra erro e o resultado congela no último valor válido.

---

## 5. Validação do formulário

```ts
type Regra = (v: string) => string | null;   // devolve a mensagem de erro, ou null

obrigatorio
email          // regex conservador + exige TLD
telefoneBR     // 10 ou 11 dígitos após limpar máscara; DDD entre 11 e 99
numeroEntre(min, max)
aceite         // checkbox marcado
```

- Máscara de WhatsApp aplicada no `onChange`: `(47) 99999-9999`, preservando a posição do cursor.
- Validação dispara no `blur` e no `submit` da etapa — nunca a cada tecla antes do primeiro blur (evita erro "piscando" enquanto digita).
- Ao falhar, o primeiro campo inválido recebe `focus()` + `scrollIntoView({ block: 'center' })`.
- `aria-invalid`, `aria-describedby` e `role="alert"` na mensagem.

---

## 6. Persistência (localStorage)

| Chave | Conteúdo | Quando grava |
|---|---|---|
| `lkf:orcamento:rascunho` | `{ etapa, dados, ts }` | debounce de 600ms a cada alteração |
| `lkf:orcamento:protocolos` | lista dos últimos 5 protocolos gerados | no envio |

Todo acesso passa por `lib/storage.ts`, com `try/catch` — o Safari em navegação privada lança exceção ao escrever. Falha silenciosa, o site continua funcionando.
Rascunho com mais de 7 dias é descartado na leitura.

---

## 7. Performance

| Técnica | Aplicação |
|---|---|
| Code splitting | Dispensável — o bundle inteiro fica abaixo de 120 KB gzip. Uma página, um chunk. |
| Fontes | `preconnect` + `display=swap` + apenas os pesos usados (Archivo 600/700/800, Inter 400/500/600, JetBrains Mono 400/500) |
| SVG | Tudo inline; nenhum request de imagem na página |
| CSS | Importado no `main.tsx`, extraído pelo Vite num único arquivo |
| Listeners | `{ passive: true }` em scroll e touch |
| Observers | Desconectados no cleanup de todo `useEffect` |
| `content-visibility` | `auto` nas seções abaixo da dobra, com `contain-intrinsic-size` para não pular o scrollbar |
| Hidratação | Não aplicável (CSR puro, SPA estática) |

**Alvos:** LCP < 1,8s em 4G simulado · CLS < 0,02 · TBT < 100ms · bundle JS < 120 KB gzip.

---

## 8. Configuração

### `vite.config.ts`
```ts
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { target: 'es2019', cssTarget: 'safari14', sourcemap: false },
});
```
`cssTarget: 'safari14'` impede o esbuild de gerar sintaxe CSS que o Safari antigo não entende.
`target: 'es2019'` cobre iOS 13+.

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

### `index.html` — cabeça obrigatória
```html
<html lang="pt-BR">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0A0B0D">
<meta name="color-scheme" content="dark">
```
Mais: title, description, Open Graph, Twitter Card, JSON-LD `LocalBusiness`, preconnect de fontes, e um `<noscript>` com aviso.

---

## 9. Deploy

```bash
npm install
npm run build        # gera dist/
npm run preview      # confere local em http://localhost:4173

# Vercel
npx vercel --prod    # requer login ou VERCEL_TOKEN
```

Requisito: a CLI da Vercel precisa estar autenticada (`vercel login`) **ou** receber `--token=$VERCEL_TOKEN`. Sem isso o deploy não acontece — o projeto fica pronto, mas não publicado.
