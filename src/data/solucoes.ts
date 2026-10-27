export type IconeSolucao =
  | 'truss'
  | 'warehouse'
  | 'mezzanine'
  | 'roof'
  | 'carport'
  | 'ruler';

export interface Solucao {
  id: string;
  titulo: string;
  resumo: string;
  bullets: string[];
  icone: IconeSolucao;
  destaque: boolean;
  /** Conteúdo extra do modal de detalhe */
  detalhe: {
    paragrafos: string[];
    ficha: { rotulo: string; valor: string }[];
  };
}

export const SOLUCOES: Solucao[] = [
  {
    id: 'industrial',
    titulo: 'Galpões industriais',
    resumo:
      'Estrutura dimensionada para produção: ponte rolante, carga de equipamento, ventilação e iluminação natural pensadas desde o projeto.',
    bullets: ['Vão livre de até 40 m', 'Preparado para ponte rolante', 'Telha termoacústica opcional'],
    icone: 'truss',
    destaque: true,
    detalhe: {
      paragrafos: [
        'O galpão industrial não é uma caixa — é o invólucro de um processo. Antes de desenhar o pórtico, a gente mapeia o fluxo da sua produção: onde entra matéria-prima, por onde circula, onde sai produto acabado.',
        'Isso define o vão, a posição dos portões, a altura da ponte rolante e a estratégia de ventilação. A estrutura vem depois — e vem certa.',
      ],
      ficha: [
        { rotulo: 'Vão livre', valor: '12 a 40 m' },
        { rotulo: 'Pé-direito', valor: '6 a 14 m' },
        { rotulo: 'Ponte rolante', valor: 'Até 20 t' },
        { rotulo: 'Cobertura', valor: 'Simples ou termoacústica' },
        { rotulo: 'Prazo típico', valor: '90 a 150 dias' },
      ],
    },
  },
  {
    id: 'comercial',
    titulo: 'Galpões comerciais e logística',
    resumo:
      'Pé-direito alto, docas e circulação planejada para empilhadeira. O metro quadrado útil é o que conta.',
    bullets: ['Docas e plataformas de carga', 'Pé-direito de 8 a 14 m', 'Expansão modular futura'],
    icone: 'warehouse',
    destaque: true,
    detalhe: {
      paragrafos: [
        'Em logística, cada metro de pé-direito é uma prateleira a mais e cada pilar no meio é uma rua de porta-pallet a menos. A conta é direta.',
        'Projetamos a malha estrutural em cima do seu layout de armazenagem — não o contrário. E deixamos o pórtico de extremidade preparado para a ampliação que você ainda não contratou.',
      ],
      ficha: [
        { rotulo: 'Vão livre', valor: '18 a 40 m' },
        { rotulo: 'Pé-direito', valor: '8 a 14 m' },
        { rotulo: 'Docas', valor: 'Niveladoras e abrigos' },
        { rotulo: 'Piso', valor: 'Projeto de carga compatibilizado' },
        { rotulo: 'Prazo típico', valor: '110 a 180 dias' },
      ],
    },
  },
  {
    id: 'mezanino',
    titulo: 'Mezaninos',
    resumo:
      'Mais área sem comprar mais terreno. Estrutura independente, montada com a operação rodando.',
    bullets: ['Montagem sem parar a produção', 'Carga de 300 a 800 kg/m²', 'Escada e guarda-corpo inclusos'],
    icone: 'mezzanine',
    destaque: false,
    detalhe: {
      paragrafos: [
        'O mezanino é a forma mais barata de ganhar área: você já tem o terreno, já tem a cobertura, já tem o pé-direito ocioso.',
        'A estrutura é autoportante e aparafusada, o que permite montar em etapas, fora do horário de produção, e desmontar se um dia o layout mudar.',
      ],
      ficha: [
        { rotulo: 'Carga útil', valor: '300 a 800 kg/m²' },
        { rotulo: 'Vão entre pilares', valor: '5 a 9 m' },
        { rotulo: 'Piso', valor: 'Chapa xadrez, grating ou laje seca' },
        { rotulo: 'Acessos', valor: 'Escada, guarda-corpo e portão de carga' },
        { rotulo: 'Prazo típico', valor: '35 a 70 dias' },
      ],
    },
  },
  {
    id: 'cobertura',
    titulo: 'Coberturas e telhados',
    resumo:
      'Substituição, ampliação ou cobertura de pátio. Vence vãos que a madeira e o concreto não vencem.',
    bullets: ['Troca de cobertura existente', 'Pátios e áreas de manobra', 'Calhas e rufos dimensionados'],
    icone: 'roof',
    destaque: false,
    detalhe: {
      paragrafos: [
        'Trocar uma cobertura é mais delicado que fazer uma nova: tem operação embaixo, estrutura antiga que precisa ser avaliada e um cronograma que não pode escorregar.',
        'A gente levanta a estrutura existente, calcula o que ela ainda aguenta e propõe a solução — reforço, substituição parcial ou cobertura nova independente.',
      ],
      ficha: [
        { rotulo: 'Vão livre', valor: '8 a 36 m' },
        { rotulo: 'Inclinação', valor: '5% a 15%' },
        { rotulo: 'Telha', valor: 'Simples, termoacústica ou translúcida' },
        { rotulo: 'Drenagem', valor: 'Calha, rufo e condutor dimensionados' },
        { rotulo: 'Prazo típico', valor: '25 a 60 dias' },
      ],
    },
  },
  {
    id: 'garagem',
    titulo: 'Garagens e áreas de apoio',
    resumo:
      'A opção para quem quer cobrir sem fechar as laterais. Leve, rápida e com acabamento de obra fina.',
    bullets: ['Montagem em poucos dias', 'Lateral aberta ou fechada', 'Acabamento residencial'],
    icone: 'carport',
    destaque: false,
    detalhe: {
      paragrafos: [
        'É o nosso produto de entrada e o que mais surpreende: estrutura metálica com acabamento de obra residencial, pintura eletrostática e nenhum pilar atrapalhando a manobra.',
        'Serve para garagem, área gourmet, cobertura de piscina ou abrigo de equipamento. Chega pronta e monta em dias.',
      ],
      ficha: [
        { rotulo: 'Vão livre', valor: '4 a 14 m' },
        { rotulo: 'Pé-direito', valor: '2,6 a 4 m' },
        { rotulo: 'Acabamento', valor: 'Pintura eletrostática' },
        { rotulo: 'Fechamento', valor: 'Aberto, parcial ou total' },
        { rotulo: 'Prazo típico', valor: '15 a 35 dias' },
      ],
    },
  },
  {
    id: 'sobmedida',
    titulo: 'Estruturas sob medida',
    resumo:
      'Passarela, torre, suporte de equipamento, reforço estrutural. Se é aço, a gente projeta e fabrica.',
    bullets: ['Projeto dedicado', 'Peças especiais', 'Laudo e memorial de cálculo'],
    icone: 'ruler',
    destaque: false,
    detalhe: {
      paragrafos: [
        'Nem todo problema de aço cabe num catálogo. Passarela entre prédios, torre de suporte, base de silo, reforço de estrutura existente, escada industrial.',
        'Nesses casos o trabalho começa no levantamento em campo e termina com memorial de cálculo assinado. A fabricação é a parte fácil.',
      ],
      ficha: [
        { rotulo: 'Escopo', valor: 'Projeto, fabricação e montagem' },
        { rotulo: 'Documentação', valor: 'Memorial de cálculo e ART' },
        { rotulo: 'Levantamento', valor: 'Em campo, antes do projeto' },
        { rotulo: 'Tratamento', valor: 'Jateamento, primer e pintura' },
        { rotulo: 'Prazo típico', valor: 'Sob consulta' },
      ],
    },
  },
];
