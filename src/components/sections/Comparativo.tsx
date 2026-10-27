import { useEffect, useState } from 'react';
import { COMPARATIVO, COMPARATIVO_PILULAS } from '../../data/conteudo';
import { useReveal } from '../../hooks';
import { num } from '../../lib/format';
import { IconRecycle, IconLayers, IconShield } from '../icons';
import { Reveal, Section } from '../ui';

const PILULA_ICONES = [IconLayers, IconShield, IconRecycle];

export function Comparativo() {
  const [cenario, setCenario] = useState(0);
  const [chave, setChave] = useState(0);
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  const dados = COMPARATIVO[cenario];

  // ao trocar o cenário, zera as barras por um instante e reanima
  const trocar = (i: number) => {
    if (i === cenario) return;
    setCenario(i);
    setChave((k) => k + 1);
  };

  const [animar, setAnimar] = useState(false);
  useEffect(() => {
    if (!visible) return;
    setAnimar(false);
    const t = window.setTimeout(() => setAnimar(true), 120);
    return () => window.clearTimeout(t);
  }, [visible, chave]);

  return (
    <Section
      id="vantagens"
      eyebrow="Comparativo"
      titulo={
        <>
          Antes de escolher o concreto, <span className="lk-gold">veja os números</span>.
        </>
      }
      lead="Não é questão de gosto. É prazo, vão, peso de fundação e previsibilidade de orçamento."
      className="lk-cv"
    >
      <Reveal className="lk-toggle" delay={1}>
        <div className="lk-toggle__grupo" role="group" aria-label="Cenário de comparação">
          {COMPARATIVO.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`lk-toggle__btn ${i === cenario ? 'is-active' : ''}`.trim()}
              aria-pressed={i === cenario}
              onClick={() => trocar(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="lk-comp" ref={ref}>
        <div className="lk-comp__legenda" aria-hidden="true">
          <span className="lk-comp__chip lk-comp__chip--metal">Estrutura metálica</span>
          <span className="lk-comp__chip lk-comp__chip--conc">Concreto</span>
        </div>

        <ul className="lk-comp__lista">
          {dados.linhas.map((l, i) => {
            const max = Math.max(l.metalica, l.concreto);
            const fm = l.metalica / max;
            const fc = l.concreto / max;
            return (
              <li className="lk-comp__linha" key={`${chave}-${l.criterio}`} style={{ '--i': i } as React.CSSProperties}>
                <span className="lk-comp__criterio">{l.criterio}</span>

                <span className="lk-comp__barras">
                  <span className="lk-comp__par">
                    <span className="lk-comp__trilho">
                      <span
                        className="lk-comp__fill lk-comp__fill--metal"
                        style={{ transform: `scaleX(${animar ? fm : 0})`, transitionDelay: `${i * 90}ms` }}
                      />
                    </span>
                    <span className="lk-comp__valor lk-mono">
                      {num(l.metalica)} {l.unidade}
                    </span>
                  </span>

                  <span className="lk-comp__par">
                    <span className="lk-comp__trilho">
                      <span
                        className="lk-comp__fill lk-comp__fill--conc"
                        style={{ transform: `scaleX(${animar ? fc : 0})`, transitionDelay: `${i * 90 + 60}ms` }}
                      />
                    </span>
                    <span className="lk-comp__valor lk-mono lk-comp__valor--conc">
                      {num(l.concreto)} {l.unidade}
                    </span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <p className="lk-comp__nota">
          Valores de referência para um galpão padrão, pé-direito de 8 m, em terreno plano. Cada
          projeto tem o seu cálculo.
        </p>
      </div>

      <ul className="lk-pilulas">
        {COMPARATIVO_PILULAS.map((p, i) => {
          const Icone = PILULA_ICONES[i];
          return (
            <Reveal as="li" key={p} delay={i} className="lk-pilulas__item">
              <Icone width={20} height={20} />
              <span>{p}</span>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
