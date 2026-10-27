import { NUMEROS, type Numero } from '../../data/conteudo';
import { useCountUp, useReveal } from '../../hooks';
import { num } from '../../lib/format';

export function Numeros() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="lk-section lk-section--tight lk-numeros lk-cv" aria-labelledby="numeros-titulo">
      <div className="lk-container">
        <h2 id="numeros-titulo" className="sr-only">
          Números da Lukefer
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
