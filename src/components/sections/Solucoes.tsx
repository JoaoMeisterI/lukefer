import { useState } from 'react';
import { SOLUCOES, type IconeSolucao, type Solucao } from '../../data/solucoes';
import { scrollToSection } from '../../hooks';
import {
  IconArrow,
  IconCarport,
  IconCheck,
  IconMezzanine,
  IconRoof,
  IconRuler,
  IconTruss,
  IconWarehouse,
} from '../icons';
import { Button, Modal, Reveal, Section } from '../ui';

const ICONES: Record<IconeSolucao, typeof IconTruss> = {
  truss: IconTruss,
  warehouse: IconWarehouse,
  mezzanine: IconMezzanine,
  roof: IconRoof,
  carport: IconCarport,
  ruler: IconRuler,
};

export function Solucoes() {
  const [aberta, setAberta] = useState<Solucao | null>(null);

  return (
    <Section
      id="solucoes"
      eyebrow="Soluções"
      titulo={
        <>
          Do barracão de 200 m² ao <span className="lk-gold">centro de distribuição</span>.
        </>
      }
      lead="Cada projeto nasce do uso. A gente desenha a estrutura em volta da sua operação — não o contrário."
      className="lk-cv"
    >
      <ul className="lk-bento">
        {SOLUCOES.map((s, i) => {
          const Icone = ICONES[s.icone];
          return (
            <Reveal
              as="li"
              key={s.id}
              delay={Math.min(i, 5)}
              efeito="up"
              className={s.destaque ? 'lk-bento__item lk-bento__item--largo' : 'lk-bento__item'}
            >
              <button
                type="button"
                className="lk-card lk-card--interactive lk-solucao"
                onClick={() => setAberta(s)}
                aria-haspopup="dialog"
              >
                <span className="lk-solucao__icone" aria-hidden="true">
                  <Icone width={26} height={26} />
                </span>
                <h3 className="lk-solucao__titulo">{s.titulo}</h3>
                <p className="lk-solucao__resumo">{s.resumo}</p>
                <ul className="lk-solucao__bullets">
                  {s.bullets.map((b) => (
                    <li key={b}>
                      <IconCheck width={15} height={15} />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="lk-solucao__link">
                  Ver detalhes
                  <IconArrow width={16} height={16} />
                </span>
              </button>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="lk-solucoes__pe" delay={1}>
        <p>Não achou o seu caso? A gente projeta sob medida.</p>
        <Button
          variante="ghost"
          onClick={() => scrollToSection('contato')}
          iconeDireita={<IconArrow width={17} height={17} />}
        >
          Fale com a gente
        </Button>
      </Reveal>

      <Modal
        aberto={aberta !== null}
        aoFechar={() => setAberta(null)}
        titulo={aberta?.titulo ?? ''}
      >
        {aberta && (
          <>
            {aberta.detalhe.paragrafos.map((p) => (
              <p key={p} className="lk-modal__p">
                {p}
              </p>
            ))}
            <dl className="lk-ficha">
              {aberta.detalhe.ficha.map((f) => (
                <div className="lk-ficha__linha" key={f.rotulo}>
                  <dt>{f.rotulo}</dt>
                  <dd className="lk-mono">{f.valor}</dd>
                </div>
              ))}
            </dl>
            <Button
              bloco
              onClick={() => {
                setAberta(null);
                window.setTimeout(() => scrollToSection('contato'), 60);
              }}
              iconeDireita={<IconArrow width={18} height={18} />}
            >
              Quero um orçamento disso
            </Button>
          </>
        )}
      </Modal>
    </Section>
  );
}
