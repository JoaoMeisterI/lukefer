import { IMG } from '../../data/imagens';
import { scrollToSection } from '../../hooks';
import { IconArrow } from '../icons';
import { Reveal } from '../ui';
import { Foto } from '../ui/Foto';

/* ============================================================
   Os 4 ladrilhos de etapa — bloco de assinatura da página.
   Foto em P&B que ganha cor no hover, rótulo embaixo à esquerda,
   botão dourado. Em um olhar, as quatro coisas que a Lukefer faz.
   ============================================================ */

const ETAPAS = [
  {
    n: '01',
    pequeno: 'Começa no',
    grande: 'PROJETO',
    texto: 'Levantamento em campo, memorial de cálculo e detalhamento de cada ligação.',
    img: IMG.etapaProjeto,
    alvo: 'processo',
  },
  {
    n: '02',
    pequeno: 'Passa pela',
    grande: 'FÁBRICA',
    texto: 'Corte CNC, solda qualificada, jateamento e pintura. Peça numerada, uma a uma.',
    img: IMG.etapaFabricacao,
    alvo: 'fabrica',
  },
  {
    n: '03',
    pequeno: 'Sobe na',
    grande: 'MONTAGEM',
    texto: 'Equipe própria, plano de rigging e cronograma semanal que chega toda segunda.',
    img: IMG.etapaMontagem,
    alvo: 'processo',
  },
  {
    n: '04',
    pequeno: 'Termina na',
    grande: 'ENTREGA',
    texto: 'As-built, manual de manutenção e a chave na mão, no prazo que está em contrato.',
    img: IMG.etapaEntrega,
    alvo: 'projetos',
  },
];

export function Etapas() {
  return (
    <section className="lk-etapas lk-dark" aria-labelledby="etapas-titulo">
      <h2 id="etapas-titulo" className="sr-only">
        As quatro etapas de uma obra Lukefer
      </h2>
      <ul className="lk-etapas__grid">
        {ETAPAS.map((e, i) => (
          <Reveal as="li" key={e.n} delay={Math.min(i, 3)} efeito="scale" className="lk-etapa">
            <Foto
              img={e.img}
              className="lk-etapa__foto"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
            <span className="lk-etapa__veu" aria-hidden="true" />
            <div className="lk-etapa__corpo">
              <span className="lk-etapa__n lk-mono">{e.n}</span>
              <h3 className="lk-etapa__titulo">
                <span className="lk-etapa__pequeno">{e.pequeno}</span>
                <span className="lk-etapa__grande">{e.grande}</span>
              </h3>
              <p className="lk-etapa__texto">{e.texto}</p>
              <button
                type="button"
                className="lk-etapa__btn"
                onClick={() => scrollToSection(e.alvo)}
              >
                Saiba mais
                <IconArrow width={15} height={15} />
              </button>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
