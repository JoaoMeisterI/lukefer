export const SITE = {
  nome: 'Lukefer',
  nomeCompleto: 'Lukefer | Galpões e Estruturas Metálicas',
  bio: 'Galpões industriais e comerciais sob medida. Projeto, fabricação e montagem. Santa Catarina e região.',
  instagram: 'https://www.instagram.com/lukefer_galpoes/',
  instagramHandle: '@lukefer_galpoes',
  // Dados fictícios — site demonstrativo
  telefone: '(47) 90000-0000',
  telefoneLink: '+5547900000000',
  whatsapp: '5547900000000',
  whatsappMsg: 'Olá! Vim pelo site e gostaria de um orçamento de galpão em estrutura metálica.',
  email: 'contato@lukefer.com.br',
  endereco: 'Rua Industrial, 1200 — Jaraguá do Sul/SC',
  horario: 'Seg a Sex, 8h às 18h',
  cnpj: '00.000.000/0001-00',
} as const;

export function whatsappUrl(msg: string = SITE.whatsappMsg): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export interface ItemNav {
  id: string;
  label: string;
}

export const NAV: ItemNav[] = [
  { id: 'solucoes', label: 'Soluções' },
  { id: 'vantagens', label: 'Vantagens' },
  { id: 'processo', label: 'Processo' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'simulador', label: 'Simulador' },
  { id: 'contato', label: 'Contato' },
];

export const SEGMENTOS: string[] = [
  'Indústria',
  'Logística e armazenagem',
  'Comércio e varejo',
  'Agronegócio',
  'Metalmecânica',
  'Alimentício',
  'Centros de distribuição',
  'Oficinas e garagens',
  'Áreas de apoio',
  'Mezaninos',
];

export const MICRO_PROVAS = [
  'Projeto estrutural próprio',
  'Fabricação na nossa fábrica',
  'Equipe própria de montagem',
];

export const FOOTER_LINKS = {
  solucoes: [
    'Galpões industriais',
    'Galpões comerciais',
    'Mezaninos',
    'Coberturas',
    'Garagens',
    'Estruturas sob medida',
  ],
  empresa: [
    { label: 'Sobre a Lukefer', alvo: 'fabrica' },
    { label: 'Nosso processo', alvo: 'processo' },
    { label: 'Projetos', alvo: 'projetos' },
    { label: 'Simulador', alvo: 'simulador' },
    { label: 'Dúvidas frequentes', alvo: 'faq' },
  ],
};
