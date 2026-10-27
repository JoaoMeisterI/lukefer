import { IMG } from '../../data/imagens';
import { SEGMENTOS } from '../../data/site';
import { scrollToSection } from '../../hooks';
import { IconArrow, IconBeam } from '../icons';
import { Button } from '../ui';
import { Foto } from '../ui/Foto';

export function Hero() {
  return (
    <>
      <section className="lk-hero lk-dark" id="topo" aria-labelledby="hero-titulo">
        <div className="lk-hero__midia">
          <Foto img={IMG.hero} prioridade sizes="100vw" className="lk-hero__foto" />
          <span className="lk-hero__veu" aria-hidden="true" />
        </div>

        <div className="lk-container lk-hero__inner">
          <p className="lk-hero__eyebrow lk-mono">
            <span aria-hidden="true" />
            Santa Catarina e região
          </p>

          <h1 id="hero-titulo" className="lk-hero__titulo">
            Galpões em estrutura metálica,
            <br />
            <em>do primeiro traço à última viga.</em>
          </h1>

          <p className="lk-hero__lead">
            Projeto estrutural, fabricação na nossa fábrica e montagem com equipe própria.
            Prazo em contrato.
          </p>

          <div className="lk-hero__ctas">
            <Button
              onClick={() => scrollToSection('contato')}
              iconeDireita={<IconArrow width={18} height={18} />}
            >
              Solicitar orçamento
            </Button>
            <Button variante="secondary" onClick={() => scrollToSection('projetos')}>
              Ver obras entregues
            </Button>
          </div>
        </div>

        <Segmentos />
      </section>
    </>
  );
}

/* ---------- Faixa de segmentos (marquee) ---------- */

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
              <IconBeam width={13} height={13} className="lk-marquee__sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
