/* ============================================================
   Catálogo de imagens.
   Cada entrada tem as dimensões intrínsecas da versão maior —
   são elas que o <img> usa para reservar espaço e evitar que o
   layout pule enquanto a foto carrega (CLS).
   ============================================================ */

export interface Imagem {
  /** nome base do arquivo em /img, sem extensão */
  base: string;
  w: number;
  h: number;
  /** largura da versão reduzida, quando existe */
  menor?: number;
  alt: string;
}

export const IMG = {
  hero: {
    base: 'hero',
    w: 1920,
    h: 1280,
    menor: 960,
    alt: 'Pórtico de galpão em estrutura metálica sendo erguido por guindaste, com céu nublado ao fundo.',
  },
  vaoLivre: {
    base: 'vao-livre',
    w: 1600,
    h: 1067,
    menor: 800,
    alt: 'Interior de galpão metálico vazio, com vão livre amplo e piso de concreto polido refletindo a luz.',
  },
  fabrica: {
    base: 'fabrica',
    w: 1600,
    h: 1067,
    menor: 800,
    alt: 'Interior da fábrica: ponte rolante transportando uma viga de aço enquanto um soldador trabalha ao fundo.',
  },
  tesouras: {
    base: 'tesouras',
    w: 1920,
    h: 1280,
    menor: 960,
    alt: 'Tesouras metálicas de cobertura vistas de baixo, recortadas contra o céu.',
  },

  etapaProjeto: {
    base: 'etapa-projeto',
    w: 800,
    h: 533,
    menor: 500,
    alt: 'Detalhe de ligação parafusada entre perfis metálicos, com chapa de nó e parafusos.',
  },
  etapaFabricacao: {
    base: 'etapa-fabricacao',
    w: 800,
    h: 1200,
    menor: 500,
    alt: 'Soldador de avental de couro executando solda, com faíscas saltando da peça.',
  },
  etapaMontagem: {
    base: 'etapa-montagem',
    w: 800,
    h: 533,
    menor: 500,
    alt: 'Dois montadores em plataforma elevatória parafusando a ligação de um pilar metálico.',
  },
  etapaEntrega: {
    base: 'etapa-entrega',
    w: 800,
    h: 533,
    menor: 500,
    alt: 'Galpão metálico concluído ao pôr do sol, com área de cobertura aberta na lateral.',
  },

  textura: {
    base: 'textura-aco',
    w: 900,
    h: 900,
    alt: '',
  },
} as const satisfies Record<string, Imagem>;

/** Fotos dos projetos, indexadas pelo id do projeto */
export const IMG_PROJETOS: Record<string, Imagem> = {
  'cd-norte': {
    base: 'proj-cd-norte',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Plataforma de docas do centro de distribuição com seis caminhões encostados ao entardecer.',
  },
  metalpar: {
    base: 'proj-metalpar',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Galpão industrial com ponte rolante sobre o caminho de rolamento e chapas de aço no piso.',
  },
  'beira-rio': {
    base: 'proj-beira-rio',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Interior de atacado com porta-pallets altos e luz natural entrando pelas telhas translúcidas.',
  },
  'vale-verde': {
    base: 'proj-vale-verde',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Armazém de grãos com pá carregadeira trabalhando sob cobertura metálica de grande vão.',
  },
  br470: {
    base: 'proj-br470',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Galpão logístico à beira da rodovia, com a empena de ampliação ainda em estrutura aparente.',
  },
  trevo: {
    base: 'proj-trevo',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Oficina mecânica com caminhão sobre o fosso de serviço e talha suspensa.',
  },
  construir: {
    base: 'proj-construir',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Loja de materiais de construção com pátio coberto por marquise metálica em balanço.',
  },
  'sao-pedro': {
    base: 'proj-sao-pedro',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Barracão agrícola de lateral aberta com trator e implementos abrigados.',
  },
  'alto-serra': {
    base: 'proj-alto-serra',
    w: 1000,
    h: 667,
    menor: 600,
    alt: 'Garagem residencial em estrutura metálica grafite, com três carros, ao anoitecer.',
  },
};
