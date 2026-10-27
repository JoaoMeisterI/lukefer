# 00 — Briefing do Projeto

> **Cliente:** Lukefer | Galpões e Estruturas Metálicas
> **Entregável:** Landing page institucional 100% mockada no front-end
> **Data do plano:** 26/10/2026

---

## 1. Quem é o cliente

Construtora especializada em **galpões industriais e comerciais sob medida** em estrutura metálica.
Opera o ciclo completo: **projeto → fabricação própria → logística → montagem**.

**Base de atuação:** Santa Catarina e região.
**Canal atual:** Instagram [@lukefer_galpoes](https://www.instagram.com/lukefer_galpoes/) — 1.936 seguidores, 8 posts.

### Bio oficial (fonte: Instagram)
```
🏗 | Galpões industriais e comerciais sob medida.
⚙ | Projetos completos: fabricação + montagem.
📍 | SC e região.
```

### Destaques do perfil (stories fixados)
`Empresa` · `Processo` · `Projetos` · `Obras`
→ Esses 4 eixos viram a espinha dorsal da arquitetura do site.

---

## 2. Leitura do conteúdo atual (o que já comunicam)

| Post | Tese central | Tradução para o site |
|---|---|---|
| "Antes de escolher o concreto…" | Metálica x concreto | Seção comparativa com dados |
| "Mais liberdade para o seu negócio" | Vão livre, flexibilidade, aproveitamento | Bloco de benefícios do vão livre |
| "Antes de construir um galpão… pense em quem vai trabalhar nele" | Conforto térmico e humano | Pilar "Projetado para quem usa" |
| "Ela começa na fábrica" | Fabricação própria, controle | Seção Fábrica / Processo |
| "Seu projeto pode ser feito com estrutura metálica?" | Consultoria, diagnóstico | CTA de orçamento / simulador |
| "Garagem em estrutura metálica" | Produto de entrada, residencial | Card de solução |
| "Dia do Soldador" | Pessoas, orgulho do ofício | Bloco Sobre / cultura |
| "Já imaginou trabalhar o dia inteiro no calor?" | Ventilação, térmica | Pilar de conforto |

**Padrão de voz identificado:** direto, consultivo, provocativo no gancho ("Antes de…", "Já imaginou…"), sempre terminando em utilidade. **Nada de jargão de engenharia sem tradução.**

---

## 3. Público-alvo

| Persona | Quem é | Dor | O que precisa ver |
|---|---|---|---|
| **P1 — Dono de indústria/distribuidora** | Decisor, 35-60, PME | Prazo de obra, parada operacional, custo imprevisível | Prazo, previsibilidade, vão livre, obras entregues |
| **P2 — Empresário do comércio/varejo** | Quer loja, depósito, centro de distribuição | Não sabe se metálica serve pro caso dele | Comparativo, simulador, exemplos |
| **P3 — Arquiteto / engenheiro parceiro** | Especifica para o cliente final | Confiabilidade técnica do fornecedor | Processo, fabricação própria, ficha técnica |
| **P4 — Residencial** | Garagem, cobertura, área gourmet | Ticket menor, entrada no funil | Card de solução + orçamento rápido |

---

## 4. Objetivos do site

**Primário:** gerar solicitação de orçamento qualificada (com área em m², tipo e localização).
**Secundário:** provar competência técnica e reduzir a objeção "metálica serve pro meu caso?".
**Terciário:** virar o cartão de visitas que hoje é o Instagram.

### Métricas-alvo (do mock)
- CTA de orçamento visível em **100% do scroll** (header sticky + botão flutuante).
- Caminho mais curto até o formulário: **1 clique** de qualquer ponto.
- Formulário multi-etapas para reduzir fricção percebida.

---

## 5. Escopo

### Dentro
- Landing page única, seções ancoradas, navegação suave.
- Todas as interações **mockadas e funcionais** no front (sem back-end).
- Ilustrações e animações **100% SVG/CSS autorais** — zero fotos de banco.
- Responsividade real de 320px a 2560px, com tratamento explícito para iOS Safari.

### Fora
- Back-end, CMS, envio real de e-mail/WhatsApp, autenticação, analytics real.
- Páginas internas (blog, cases individuais) — ficam como roadmap.

---

## 6. Princípios que guiam o projeto

1. **Aço, não pixel.** O visual deve parecer estrutura: linhas, treliças, perfis, módulos. Nada de blob orgânico ou gradiente genérico.
2. **Peso visual escuro.** Grafite e preto como base; dourado/bronze só onde há decisão a tomar.
3. **Movimento com propósito.** Toda animação SVG representa algo real: montagem, vão livre, fluxo de processo.
4. **iPhone é o alvo, não o acessório.** Se não roda liso no Safari iOS, não entra.
5. **Mock que convence.** Formulário valida, filtro filtra, carrossel desliza. O usuário não deve encontrar um botão morto.

---

## 7. Dependências e restrições conhecidas

| Item | Status | Decisão |
|---|---|---|
| Fotos reais de obra | Indisponíveis | Substituir por ilustrações SVG autorais + placeholders geométricos |
| Geração de imagem por IA (Runway/gpt-image) | Sem autorização nesta sessão | Não usar; SVG resolve |
| Dados reais (CNPJ, telefone, endereço) | Não fornecidos | Usar dados fictícios marcados como mock |
| Deploy Vercel | CLI não autenticada | Build pronto + `vercel.json`; deploy ao receber token |
