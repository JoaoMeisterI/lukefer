import { PROCESSO, type IconeProcesso } from '../../data/conteudo';
import { useReveal } from '../../hooks';
import { IconBlueprint, IconCrane, IconFactory, IconRuler, IconTruck } from '../icons';
import { Reveal, Section } from '../ui';

const ICONES: Record<IconeProcesso, typeof IconRuler> = {
  ruler: IconRuler,
  blueprint: IconBlueprint,
  factory: IconFactory,
  truck: IconTruck,
  crane: IconCrane,
};

export function Processo() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.12 });

  return (
    <Section
      id="processo"
      className="lk-section--sand"
      eyebrow="Como funciona"
      titulo={
        <>
          Cinco etapas. <span className="lk-gold">Nenhuma surpresa.</span>
        </>
      }
      lead="Você sabe onde o seu projeto está em cada semana. Sem terceirizar o que importa."
      
    >
      <div className={`lk-proc ${visible ? 'is-visible' : ''}`.trim()} ref={ref}>
        <div className="lk-proc__trilho" aria-hidden="true">
          <span className="lk-proc__trilho-fill" />
        </div>

        <ol className="lk-proc__lista">
          {PROCESSO.map((e, i) => {
            const Icone = ICONES[e.icone];
            return (
              <li className="lk-proc__item" key={e.n} style={{ '--i': i } as React.CSSProperties}>
                <span className="lk-proc__marcador" aria-hidden="true">
                  <Icone width={22} height={22} />
                </span>
                <span className="lk-proc__n lk-mono">{e.n}</span>
                <h3 className="lk-proc__titulo">{e.titulo}</h3>
                <p className="lk-proc__texto">{e.texto}</p>
                <span className="lk-proc__prazo lk-mono">{e.prazo}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal className="lk-proc__nota" delay={1}>
        <p>
          Da primeira visita à entrega do as-built, um único interlocutor. O cronograma sai assinado
          junto com o contrato.
        </p>
      </Reveal>
    </Section>
  );
}
