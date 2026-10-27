import { SELOS_FABRICA } from '../../data/conteudo';
import { IMG } from '../../data/imagens';
import { Foto } from '../ui/Foto';
import { IconCheck } from '../icons';
import { Eyebrow, Reveal } from '../ui';

export function Fabrica() {
  return (
    <section id="fabrica" className="lk-section lk-fabrica lk-dark" aria-labelledby="fabrica-titulo">
      <div className="lk-container lk-fabrica__inner">
        <Reveal className="lk-fabrica__texto" efeito="left">
          <Eyebrow>A fábrica</Eyebrow>
          <h2 id="fabrica-titulo">
            Ela começa <span className="lk-gold">na fábrica</span>.
          </h2>
          <p className="lk-lead">
            Todo galpão que a gente entrega nasce num galpão nosso. Corte CNC, solda com procedimento
            qualificado, tratamento de superfície e pintura — cada peça sai numerada e com ficha de
            inspeção.
          </p>
          <p className="lk-fabrica__p">
            Quando o caminhão chega no seu terreno, a obra já foi montada uma vez: no papel e no chão
            de fábrica.
          </p>

          <ul className="lk-fabrica__selos">
            {SELOS_FABRICA.map((s, i) => (
              <li key={s} style={{ '--i': i } as React.CSSProperties}>
                <IconCheck width={16} height={16} />
                {s}
              </li>
            ))}
          </ul>

          <blockquote className="lk-fabrica__frase">
            Trabalho bem feito também é resultado de pessoas que fazem a diferença.
          </blockquote>
        </Reveal>

        <Reveal className="lk-fabrica__arte" efeito="right" delay={1}>
          <Foto img={IMG.fabrica} sizes="(min-width: 1024px) 50vw, 100vw" />
        </Reveal>
      </div>
    </section>
  );
}
