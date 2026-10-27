import { useState } from 'react';
import { scrollToSection } from '../../hooks';
import { num } from '../../lib/format';
import { pilaresEliminados, usoRecomendado } from '../../lib/simulador';
import { VaoLivre } from '../art/VaoLivre';
import { IconArrow } from '../icons';
import { Button, Eyebrow, Reveal } from '../ui';

const MIN = 12;
const MAX = 40;

export function VaoLivreSection() {
  const [vao, setVao] = useState(28);

  const areaModulo = vao * 6;
  const pilares = pilaresEliminados(vao);

  return (
    <section id="vao" className="lk-section lk-vao" aria-labelledby="vao-titulo">
      <div className="lk-container">
        <div className="lk-vao__topo">
          <Reveal className="lk-vao__intro">
            <Eyebrow>Vão livre</Eyebrow>
            <h2 id="vao-titulo" className="lk-display">
              <span className="lk-display__fino">Vão livre</span>
              <span className="lk-display__forte">sem pilar no meio.</span>
            </h2>
            <p className="lk-lead">
              Pilar no meio do galpão é metro quadrado que você paga e não usa. Arraste a medida e
              veja o que muda na prática.
            </p>
          </Reveal>

          <Reveal className="lk-vao__arte" efeito="scale" delay={1}>
            <VaoLivre vao={vao} />
          </Reveal>
        </div>

        <Reveal className="lk-vao__base" delay={1}>
          <div className="lk-vao__controle">
            <div className="lk-vao__controle-topo">
              <label className="lk-vao__label" htmlFor="slider-vao">
                Largura do vão livre
              </label>
              <output className="lk-vao__output lk-mono" htmlFor="slider-vao">
                {vao}
                <small>m</small>
              </output>
            </div>
            <input
              id="slider-vao"
              className="lk-range"
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={vao}
              onChange={(e) => setVao(Number(e.target.value))}
              aria-valuetext={`${vao} metros`}
            />
            <div className="lk-vao__escala lk-mono" aria-hidden="true">
              <span>{MIN} m</span>
              <span>{MAX} m</span>
            </div>
          </div>

          <dl className="lk-vao__dados">
            <div>
              <dt>Área útil por módulo</dt>
              <dd className="lk-mono">
                {num(areaModulo)} <small>m²</small>
              </dd>
            </div>
            <div>
              <dt>Pilares internos eliminados</dt>
              <dd className="lk-mono">{pilares}</dd>
            </div>
            <div className="lk-vao__dados--full">
              <dt>Uso recomendado</dt>
              <dd className="lk-vao__uso">{usoRecomendado(vao)}</dd>
            </div>
          </dl>

          <Button
            variante="secondary"
            onClick={() => scrollToSection('simulador')}
            iconeDireita={<IconArrow width={17} height={17} />}
          >
            Simular o meu galpão
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
