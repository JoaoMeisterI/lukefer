import { MICRO_PROVAS, SEGMENTOS } from '../../data/site';
import { scrollToSection } from '../../hooks';
import { PorticoHero } from '../art/PorticoHero';
import { IconArrow, IconBeam, IconCheck } from '../icons';
import { Button } from '../ui';

export function Hero() {
  return (
    <section className="lk-hero" id="topo" aria-labelledby="hero-titulo">
      <div className="lk-grid-bg" aria-hidden="true" />
      <div className="lk-vignette" aria-hidden="true" />

      <div className="lk-container lk-hero__inner">
        <div className="lk-hero__texto">
          <span className="lk-eyebrow is-visible lk-hero__eyebrow">Santa Catarina e região</span>

          <h1 id="hero-titulo" className="lk-hero__titulo">
            Estruturas metálicas que <span className="lk-gold">sustentam o seu negócio</span>.
          </h1>

          <p className="lk-hero__lead">
            Galpões industriais e comerciais sob medida. Projeto, fabricação e montagem — tudo com a
            gente, do primeiro traço à última viga.
          </p>

          <div className="lk-hero__ctas">
            <Button
              onClick={() => scrollToSection('contato')}
              iconeDireita={<IconArrow width={18} height={18} />}
            >
              Solicitar orçamento
            </Button>
            <Button variante="secondary" onClick={() => scrollToSection('projetos')}>
              Ver projetos entregues
            </Button>
          </div>

          <ul className="lk-hero__provas">
            {MICRO_PROVAS.map((p, i) => (
              <li key={p} style={{ '--i': i } as React.CSSProperties}>
                <IconCheck width={16} height={16} />
                {p}
              </li>
            ))}
          </ul>

          <p className="lk-hero__badge">
            <IconBeam width={16} height={16} />
            Prazo em contrato. Obra limpa. Vão livre de verdade.
          </p>
        </div>

        <div className="lk-hero__arte">
          <PorticoHero />
        </div>
      </div>

      <Segmentos />
    </section>
  );
}

/* ---------- 02 · Faixa de segmentos (marquee) ---------- */

function Segmentos() {
  const lista = [...SEGMENTOS, ...SEGMENTOS];
  return (
    <div className="lk-marquee" aria-label="Segmentos atendidos">
      <span className="lk-marquee__rotulo lk-mono">Atendemos</span>
      <div className="lk-marquee__janela">
        <div className="lk-marquee__trilho">
          {lista.map((s, i) => (
            <span className="lk-marquee__item" key={`${s}-${i}`} aria-hidden={i >= SEGMENTOS.length}>
              {s}
              <IconBeam width={14} height={14} className="lk-marquee__sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
