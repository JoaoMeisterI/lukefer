import { useState } from 'react';
import { scrollToSection } from '../../hooks';
import { num } from '../../lib/format';
import { pilaresEliminados, usoRecomendado } from '../../lib/simulador';
import { VaoLivre } from '../art/VaoLivre';
import { IconArrow, IconSpan } from '../icons';
import { Button, Reveal, Section } from '../ui';

const MIN = 12;
const MAX = 40;

export function VaoLivreSection() {
  const [vao, setVao] = useState(28);

  const areaModulo = vao * 6;
  const pilares = pilaresEliminados(vao);

  return (
    <Section
      id="vao"
      eyebrow="Vão livre"
      titulo={
        <>
          Mais liberdade para o <span className="lk-gold">seu negócio</span>.
        </>
      }
      lead="Pilar no meio do galpão é metro quadrado que você paga e não usa. Arraste e veja o que muda."
      className="lk-cv"
    >
      <div className="lk-vao">
        <Reveal className="lk-vao__arte" efeito="scale">
          <VaoLivre vao={vao} />
        </Reveal>

        <Reveal className="lk-vao__painel" efeito="right" delay={1}>
          <div className="lk-vao__controle">
            <label className="lk-vao__label" htmlFor="slider-vao">
              <IconSpan width={20} height={20} />
              Largura do vão livre
            </label>
            <output className="lk-vao__output lk-mono" htmlFor="slider-vao">
              {vao} <small>m</small>
            </output>
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
              <dd className="lk-mono">{num(areaModulo)} m²</dd>
            </div>
            <div>
              <dt>Pilares internos eliminados</dt>
              <dd className="lk-mono">{pilares}</dd>
            </div>
            <div className="lk-vao__dados--full">
              <dt>Uso recomendado</dt>
              <dd>{usoRecomendado(vao)}</dd>
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
    </Section>
  );
}
