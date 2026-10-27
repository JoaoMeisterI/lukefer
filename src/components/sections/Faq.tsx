import { useId, useState } from 'react';
import { FAQ } from '../../data/conteudo';
import { IconPlus } from '../icons';
import { Reveal, Section } from '../ui';

export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);
  const uid = useId().replace(/:/g, '');

  return (
    <Section
      id="faq"
      eyebrow="Dúvidas"
      titulo={
        <>
          O que perguntam <span className="lk-gold">antes de fechar</span>.
        </>
      }
      className="lk-cv"
    >
      <ul className="lk-faq">
        {FAQ.map((item, i) => {
          const estaAberto = aberto === i;
          const bid = `faq-b-${uid}-${i}`;
          const pid = `faq-p-${uid}-${i}`;
          return (
            <Reveal as="li" key={item.pergunta} delay={Math.min(i % 4, 3)} className="lk-faq__item">
              <h3 className="lk-faq__h">
                <button
                  type="button"
                  id={bid}
                  className={`lk-faq__btn ${estaAberto ? 'is-open' : ''}`.trim()}
                  aria-expanded={estaAberto}
                  aria-controls={pid}
                  onClick={() => setAberto(estaAberto ? null : i)}
                >
                  <span>{item.pergunta}</span>
                  <IconPlus className="lk-faq__icone" width={20} height={20} />
                </button>
              </h3>
              <div
                className="lk-faq__painel"
                id={pid}
                role="region"
                aria-labelledby={bid}
                data-open={estaAberto}
              >
                <div>
                  <p>{item.resposta}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
