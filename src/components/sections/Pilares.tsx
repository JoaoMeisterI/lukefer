import { IconBlueprint, IconFactory, IconCrane } from '../icons';
import { Reveal } from '../ui';

const PILARES = [
  {
    icone: IconBlueprint,
    titulo: 'Projeto próprio',
    texto:
      'Memorial de cálculo, detalhamento e compatibilização feitos aqui dentro. Você aprova um projeto, não uma ideia.',
  },
  {
    icone: IconFactory,
    titulo: 'Fabricação própria',
    texto:
      'Corte, furação, solda e pintura na nossa fábrica. Peça numerada, com ficha de inspeção, antes de sair para a obra.',
  },
  {
    icone: IconCrane,
    titulo: 'Montagem própria',
    texto:
      'Equipe nossa no seu terreno, com plano de rigging e cronograma semanal. Sem terceirizar o que importa.',
  },
];

export function Pilares() {
  return (
    <section className="lk-section lk-pilares" aria-labelledby="pilares-titulo">
      <div className="lk-container">
        <h2 id="pilares-titulo" className="sr-only">
          O que a Lukefer faz de ponta a ponta
        </h2>
        <ul className="lk-pilares__grid">
          {PILARES.map((p, i) => {
            const Icone = p.icone;
            return (
              <Reveal as="li" key={p.titulo} delay={i} className="lk-pilar">
                <span className="lk-pilar__icone" aria-hidden="true">
                  <Icone width={34} height={34} strokeWidth={1.1} />
                </span>
                <h3 className="lk-pilar__titulo">{p.titulo}</h3>
                <p className="lk-pilar__texto">{p.texto}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
