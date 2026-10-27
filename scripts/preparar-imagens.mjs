/**
 * Converte os PNGs originais (≈47 MB) em WebP responsivo.
 *
 * Cada imagem sai em dois tamanhos para alimentar o `srcset`:
 * a maior para desktop, a menor para celular. O navegador escolhe.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ORIGEM = process.argv[2];
const DESTINO = path.resolve('public/img');

if (!ORIGEM) {
  console.error('uso: node scripts/preparar-imagens.mjs <pasta-com-os-png>');
  process.exit(1);
}

/** arquivo de origem -> nome final + larguras desejadas */
const MAPA = {
  // --- hero e grandes bandas ---
  '21.png': { nome: 'hero', larguras: [1920, 960], q: 76 },
  '23.png': { nome: 'vao-livre', larguras: [1600, 800], q: 76 },
  '22.png': { nome: 'fabrica', larguras: [1600, 800], q: 76 },
  '19.png': { nome: 'tesouras', larguras: [1920, 960], q: 76 },

  // --- os 4 ladrilhos de processo ---
  '20.png': { nome: 'etapa-projeto', larguras: [800, 500], q: 74 },
  '7.png': { nome: 'etapa-fabricacao', larguras: [800, 500], q: 74 },
  '6.png': { nome: 'etapa-montagem', larguras: [800, 500], q: 74 },
  '18.png': { nome: 'etapa-entrega', larguras: [800, 500], q: 74 },

  // --- os 9 projetos ---
  '16.png': { nome: 'proj-cd-norte', larguras: [1000, 600], q: 74 },
  '17.png': { nome: 'proj-metalpar', larguras: [1000, 600], q: 74 },
  '12.png': { nome: 'proj-beira-rio', larguras: [1000, 600], q: 74 },
  '13.png': { nome: 'proj-vale-verde', larguras: [1000, 600], q: 74 },
  '15.png': { nome: 'proj-br470', larguras: [1000, 600], q: 74 },
  '14.png': { nome: 'proj-trevo', larguras: [1000, 600], q: 74 },
  '10.png': { nome: 'proj-construir', larguras: [1000, 600], q: 74 },
  '11.png': { nome: 'proj-sao-pedro', larguras: [1000, 600], q: 74 },
  '8.png': { nome: 'proj-alto-serra', larguras: [1000, 600], q: 74 },

  // --- textura ---
  '9.png': { nome: 'textura-aco', larguras: [900], q: 70 },
};

await mkdir(DESTINO, { recursive: true });

const disponiveis = new Set(await readdir(ORIGEM));
let totalEntrada = 0;
let totalSaida = 0;
const faltando = [];

for (const [arquivo, cfg] of Object.entries(MAPA)) {
  if (!disponiveis.has(arquivo)) {
    faltando.push(arquivo);
    continue;
  }
  const origem = path.join(ORIGEM, arquivo);
  totalEntrada += (await stat(origem)).size;

  for (const largura of cfg.larguras) {
    const maior = largura === Math.max(...cfg.larguras);
    const saida = path.join(DESTINO, `${cfg.nome}${maior ? '' : `-${largura}`}.webp`);
    await sharp(origem)
      .resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: cfg.q, effort: 6 })
      .toFile(saida);
    totalSaida += (await stat(saida)).size;
    console.log(`${arquivo} -> ${path.basename(saida)} (${largura}px)`);
  }
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`\nentrada: ${mb(totalEntrada)} MB  ->  saida: ${mb(totalSaida)} MB`);
if (faltando.length) console.log('nao encontrados:', faltando.join(', '));
