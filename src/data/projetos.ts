export type CategoriaProjeto =
  | 'industrial'
  | 'comercial'
  | 'logistica'
  | 'agro'
  | 'residencial';

export interface Projeto {
  id: string;
  nome: string;
  categoria: CategoriaProjeto;
  cidade: string;
  area: number;
  ano: number;
  vao: number;
  peDireito: number;
  prazo: string;
  cobertura: string;
  pesoAco: string;
  escopo: string;
  descricao: string;
}

export const CATEGORIAS: { id: CategoriaProjeto | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'logistica', label: 'Logística' },
  { id: 'agro', label: 'Agro' },
  { id: 'residencial', label: 'Residencial' },
];

export const PROJETOS: Projeto[] = [
  {
    id: 'cd-norte',
    nome: 'Centro de Distribuição Norte',
    categoria: 'logistica',
    cidade: 'Joinville/SC',
    area: 4800,
    ano: 2025,
    vao: 32,
    peDireito: 12,
    prazo: '152 dias',
    cobertura: 'Termoacústica com lanternim',
    pesoAco: '178 t',
    escopo: 'Projeto, fabricação, montagem e fechamento',
    descricao:
      'Quatro módulos de 32 m de vão livre, seis docas niveladas e lanternim contínuo. O layout de porta-pallet foi fechado antes do projeto estrutural, e a malha de pilares nasceu a partir dele.',
  },
  {
    id: 'metalpar',
    nome: 'Unidade Fabril Metalpar',
    categoria: 'industrial',
    cidade: 'Jaraguá do Sul/SC',
    area: 3200,
    ano: 2025,
    vao: 28,
    peDireito: 10,
    prazo: '128 dias',
    cobertura: 'Termoacústica com translúcidas',
    pesoAco: '121 t',
    escopo: 'Projeto, fabricação e montagem',
    descricao:
      'Galpão de produção com caminho de rolamento para ponte rolante de 10 t em toda a extensão. Montado com a fábrica antiga operando no terreno vizinho.',
  },
  {
    id: 'beira-rio',
    nome: 'Atacado Beira-Rio',
    categoria: 'comercial',
    cidade: 'Blumenau/SC',
    area: 2100,
    ano: 2024,
    vao: 24,
    peDireito: 9,
    prazo: '104 dias',
    cobertura: 'Simples com translúcidas',
    pesoAco: '72 t',
    escopo: 'Projeto, fabricação, montagem e fachada',
    descricao:
      'Área de vendas sem nenhum pilar interno, com mezanino administrativo nos fundos. A fachada recebeu tratamento arquitetônico em ACM sobre a estrutura metálica.',
  },
  {
    id: 'vale-verde',
    nome: 'Armazém de Grãos Vale Verde',
    categoria: 'agro',
    cidade: 'Rio do Sul/SC',
    area: 5600,
    ano: 2024,
    vao: 36,
    peDireito: 11,
    prazo: '168 dias',
    cobertura: 'Simples galvanizada',
    pesoAco: '194 t',
    escopo: 'Projeto, fabricação e montagem',
    descricao:
      'O maior vão que entregamos até hoje: 36 m livres para permitir a movimentação de pá carregadeira dentro do armazém. Montagem executada entre duas safras.',
  },
  {
    id: 'br470',
    nome: 'Galpão Logístico BR-470',
    categoria: 'logistica',
    cidade: 'Gaspar/SC',
    area: 3900,
    ano: 2024,
    vao: 30,
    peDireito: 12,
    prazo: '140 dias',
    cobertura: 'Termoacústica',
    pesoAco: '146 t',
    escopo: 'Projeto, fabricação, montagem e docas',
    descricao:
      'Projetado desde o início para dobrar de tamanho: o pórtico de extremidade é de ampliação, e a fundação da segunda fase já está executada.',
  },
  {
    id: 'trevo',
    nome: 'Oficina Mecânica Trevo',
    categoria: 'industrial',
    cidade: 'Itajaí/SC',
    area: 980,
    ano: 2023,
    vao: 20,
    peDireito: 8,
    prazo: '72 dias',
    cobertura: 'Termoacústica',
    pesoAco: '34 t',
    escopo: 'Projeto, fabricação e montagem',
    descricao:
      'Oficina de caminhões com talha de 5 t e fosso. O vão de 20 m foi definido pelo raio de manobra de um cavalo mecânico com carreta.',
  },
  {
    id: 'construir',
    nome: 'Loja de Materiais Construir',
    categoria: 'comercial',
    cidade: 'Brusque/SC',
    area: 1450,
    ano: 2023,
    vao: 22,
    peDireito: 8,
    prazo: '88 dias',
    cobertura: 'Simples com translúcidas',
    pesoAco: '51 t',
    escopo: 'Projeto, fabricação e montagem',
    descricao:
      'Loja e depósito integrados sob a mesma cobertura, com separação por fechamento interno removível. Pátio de carga coberto em balanço de 6 m.',
  },
  {
    id: 'sao-pedro',
    nome: 'Barracão Agrícola São Pedro',
    categoria: 'agro',
    cidade: 'Ituporanga/SC',
    area: 1800,
    ano: 2023,
    vao: 25,
    peDireito: 7,
    prazo: '82 dias',
    cobertura: 'Simples galvanizada',
    pesoAco: '58 t',
    escopo: 'Projeto, fabricação e montagem',
    descricao:
      'Abrigo de maquinário e armazenagem de insumos, com três faces fechadas e uma totalmente aberta para entrada de implementos.',
  },
  {
    id: 'alto-serra',
    nome: 'Garagem Residencial Alto da Serra',
    categoria: 'residencial',
    cidade: 'Pomerode/SC',
    area: 120,
    ano: 2025,
    vao: 12,
    peDireito: 3,
    prazo: '26 dias',
    cobertura: 'Termoacústica com forro',
    pesoAco: '4,2 t',
    escopo: 'Projeto, fabricação, montagem e pintura',
    descricao:
      'Cobertura de garagem para três carros, laterais abertas e acabamento com pintura eletrostática grafite. Montada em quatro dias de obra.',
  },
];
