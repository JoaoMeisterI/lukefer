/* ============================================================
   Processo, números, comparativo, depoimentos e FAQ
   Fonte: docs/04-conteudo-copy.md
   ============================================================ */

export type IconeProcesso = 'blueprint' | 'ruler' | 'factory' | 'truck' | 'crane';

export interface EtapaProcesso {
  n: string;
  titulo: string;
  texto: string;
  prazo: string;
  icone: IconeProcesso;
}

export const PROCESSO: EtapaProcesso[] = [
  {
    n: '01',
    titulo: 'Diagnóstico e visita',
    texto:
      'A gente entende a operação, mede o terreno e levanta as restrições antes de desenhar qualquer coisa.',
    prazo: '3 a 7 dias',
    icone: 'ruler',
  },
  {
    n: '02',
    titulo: 'Projeto estrutural',
    texto:
      'Memorial de cálculo, detalhamento e compatibilização. Você aprova o projeto, não uma ideia.',
    prazo: '10 a 20 dias',
    icone: 'blueprint',
  },
  {
    n: '03',
    titulo: 'Fabricação',
    texto:
      'Corte, furação, solda, tratamento e pintura na nossa fábrica. Peça numerada, com controle de qualidade.',
    prazo: '25 a 60 dias',
    icone: 'factory',
  },
  {
    n: '04',
    titulo: 'Logística',
    texto:
      'Carregamento sequenciado na ordem da montagem. A peça chega quando precisa chegar.',
    prazo: '2 a 5 dias',
    icone: 'truck',
  },
  {
    n: '05',
    titulo: 'Montagem e entrega',
    texto:
      'Equipe própria, plano de rigging e cronograma semanal. Entrega com as-built e manual de manutenção.',
    prazo: '20 a 45 dias',
    icone: 'crane',
  },
];

/* ---------- Números ---------- */

export interface Numero {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
}

export const NUMEROS: Numero[] = [
  { valor: 180, prefixo: '+', rotulo: 'obras entregues' },
  { valor: 420000, prefixo: '+', sufixo: ' m²', rotulo: 'construídos' },
  { valor: 12, rotulo: 'anos de estrada' },
  { valor: 98, sufixo: '%', rotulo: 'entregues no prazo' },
];

/* ---------- Comparativo metálica x concreto ---------- */

export interface LinhaComparativo {
  criterio: string;
  /** [valor metálica, valor concreto] por cenário */
  metalica: number;
  concreto: number;
  unidade: string;
  /** true = menor é melhor */
  menorMelhor: boolean;
}

export interface CenarioComparativo {
  id: string;
  label: string;
  linhas: LinhaComparativo[];
}

export const COMPARATIVO: CenarioComparativo[] = [
  {
    id: 'm1000',
    label: 'Obra de 1.000 m²',
    linhas: [
      { criterio: 'Prazo de execução', metalica: 90, concreto: 210, unidade: 'dias', menorMelhor: true },
      { criterio: 'Vão livre máximo', metalica: 40, concreto: 12, unidade: 'm', menorMelhor: false },
      { criterio: 'Carga na fundação', metalica: 100, concreto: 185, unidade: '%', menorMelhor: true },
      { criterio: 'Área útil aproveitada', metalica: 97, concreto: 88, unidade: '%', menorMelhor: false },
      { criterio: 'Resíduo gerado na obra', metalica: 100, concreto: 420, unidade: '%', menorMelhor: true },
    ],
  },
  {
    id: 'm3000',
    label: 'Obra de 3.000 m²',
    linhas: [
      { criterio: 'Prazo de execução', metalica: 148, concreto: 395, unidade: 'dias', menorMelhor: true },
      { criterio: 'Vão livre máximo', metalica: 40, concreto: 14, unidade: 'm', menorMelhor: false },
      { criterio: 'Carga na fundação', metalica: 100, concreto: 205, unidade: '%', menorMelhor: true },
      { criterio: 'Área útil aproveitada', metalica: 98, concreto: 85, unidade: '%', menorMelhor: false },
      { criterio: 'Resíduo gerado na obra', metalica: 100, concreto: 480, unidade: '%', menorMelhor: true },
    ],
  },
];

export const COMPARATIVO_PILULAS = [
  'Ampliar depois é parafusar módulo novo, não quebrar parede.',
  'Peça errada na fábrica é peça refeita na fábrica — não na sua obra.',
  'Aço é 100% reciclável e sai da obra como sobra mínima.',
];

/* ---------- Depoimentos ---------- */

export interface Depoimento {
  nome: string;
  cargo: string;
  cidade: string;
  texto: string;
}

export const DEPOIMENTOS: Depoimento[] = [
  {
    nome: 'Marcos Ferreira',
    cargo: 'Diretor Industrial, Metalpar',
    cidade: 'Jaraguá do Sul/SC',
    texto:
      'O que mais pesou foi o prazo. Eles entregaram a estrutura em 88 dias com a produção rodando do lado. Ninguém parou.',
  },
  {
    nome: 'Carla Monteiro',
    cargo: 'Sócia, Atacado Beira-Rio',
    cidade: 'Blumenau/SC',
    texto:
      'Eu queria loja sem pilar no meio e achava que ia custar o dobro. Custou menos que o orçamento de concreto e ficou pronta antes.',
  },
  {
    nome: 'Rodrigo Hinkel',
    cargo: 'Gerente de Operações, CD Norte',
    cidade: 'Joinville/SC',
    texto:
      'Vão de 32 metros mudou nosso layout inteiro. Ganhamos duas ruas de porta-pallet que não cabiam no projeto antigo.',
  },
  {
    nome: 'Sandra Reis',
    cargo: 'Proprietária, Agro Vale Verde',
    cidade: 'Rio do Sul/SC',
    texto:
      'Montaram no meio da safra sem atrapalhar a operação. O cronograma semanal chegava toda segunda, certinho.',
  },
  {
    nome: 'Eduardo Prates',
    cargo: 'Arquiteto',
    cidade: 'Itajaí/SC',
    texto:
      'Especifico Lukefer porque o memorial de cálculo vem completo e a compatibilização não volta pra mim três vezes.',
  },
];

/* ---------- FAQ ---------- */

export interface ItemFaq {
  pergunta: string;
  resposta: string;
}

export const FAQ: ItemFaq[] = [
  {
    pergunta: 'Estrutura metálica é mais cara que concreto?',
    resposta:
      'No metro quadrado bruto, às vezes. No custo total da obra, quase nunca: a fundação é mais leve, o prazo é menor e você começa a operar antes. Em obras acima de 800 m² a conta costuma virar a favor do aço.',
  },
  {
    pergunta: 'Quanto tempo leva do contrato à entrega?',
    resposta:
      'Para um galpão padrão de 1.000 m², entre 90 e 120 dias no total — projeto, fabricação e montagem somados. O cronograma sai assinado junto com o contrato.',
  },
  {
    pergunta: 'Vocês fazem o projeto ou só montam?',
    resposta:
      'Fazemos o projeto estrutural completo, com memorial de cálculo e detalhamento, e montamos com equipe própria. Se você já tem projeto de arquitetura, a gente compatibiliza.',
  },
  {
    pergunta: 'Dá para ampliar o galpão depois?',
    resposta:
      'Sim, e é aí que a metálica brilha. Se a ampliação já for prevista no projeto inicial, basta dar sequência nos pórticos. Sem quebrar nada.',
  },
  {
    pergunta: 'Qual o vão livre máximo?',
    resposta:
      'Trabalhamos com conforto até 40 m de vão livre. Acima disso é possível, mas entra em análise caso a caso.',
  },
  {
    pergunta: 'E o calor dentro do galpão?',
    resposta:
      'Resolve-se no projeto, não depois: telha termoacústica, lanternim, exaustores eólicos e pé-direito adequado. A gente dimensiona a ventilação junto com a estrutura.',
  },
  {
    pergunta: 'Vocês atendem fora de Santa Catarina?',
    resposta:
      'Nossa base é SC e atendemos a região com estrutura própria. Para obras em estados vizinhos, avaliamos logística e prazo caso a caso.',
  },
  {
    pergunta: 'Preciso ter o terreno pronto?',
    resposta:
      'Não para orçar. Para montar, sim: terreno terraplenado e fundação liberada. A gente entrega o projeto de fundação para o seu engenheiro executar — ou indica quem executa.',
  },
];

/* ---------- Selos da fábrica ---------- */

export const SELOS_FABRICA = [
  'Corte e furação CNC',
  'Solda com procedimento qualificado',
  'Jateamento, primer e pintura',
];
