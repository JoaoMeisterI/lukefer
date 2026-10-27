import { NUMEROS, type Numero } from '../../data/conteudo';
import { IMG } from '../../data/imagens';
import { useCountUp, useReveal } from '../../hooks';
import { num } from '../../lib/format';
import { Foto } from '../ui/Foto';

export function Numeros() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="lk-numeros lk-dark" aria-labelledby="numeros-titulo">
      <div className="lk-numeros__midia">
        <Foto img={IMG.vaoLivre} sizes="100vw" className="lk-numeros__foto" alt="" />
        <span className="lk-numeros__veu" aria-hidden="true" />
      </div>

      <div className="lk-container lk-numeros__inner">
        <h2 id="numeros-titulo" className="lk-numeros__h">
          Doze anos <em>levantando estrutura</em>.
        </h2>

        <div className="lk-numeros__grid" ref={ref}>
          {NUMEROS.map((n, i) => (
            <Contador key={n.rotulo} dado={n} rodar={visible} indice={i} />
          ))}
        </div>

        <p className="lk-numeros__nota">Números demonstrativos para este mock.</p>
      </div>
    </section>
  );
}

function Contador({ dado, rodar, indice }: { dado: Numero; rodar: boolean; indice: number }) {
  const valor = useCountUp(dado.valor, rodar, 1600);

  return (
    <div className="lk-numeros__item" style={{ '--i': indice } as React.CSSProperties}>
      <span className="lk-numeros__valor lk-mono">
        {dado.prefixo}
        {num(valor)}
        {dado.sufixo && <small>{dado.sufixo}</small>}
      </span>
      <span className="lk-numeros__rotulo">{dado.rotulo}</span>
    </div>
  );
}
