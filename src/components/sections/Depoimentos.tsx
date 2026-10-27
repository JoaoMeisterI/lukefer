import { useCallback, useEffect, useRef, useState } from 'react';
import { DEPOIMENTOS } from '../../data/conteudo';
import { useReducedMotion, useReveal } from '../../hooks';
import { iniciais } from '../../lib/format';
import { IconChevron } from '../icons';
import { Section } from '../ui';

const AUTO_MS = 6000;
const LIMIAR = 0.18;

export function Depoimentos() {
  const [idx, setIdx] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [dx, setDx] = useState(0);
  const [pausado, setPausado] = useState(false);

  const reduced = useReducedMotion();
  const { ref: visRef, visible } = useReveal<HTMLDivElement>({ threshold: 0.3, once: false });

  const trilhoRef = useRef<HTMLDivElement | null>(null);
  const inicio = useRef({ x: 0, y: 0, t: 0, travado: false, horizontal: false });

  const total = DEPOIMENTOS.length;
  const ir = useCallback((n: number) => setIdx(((n % total) + total) % total), [total]);

  // auto-play: pausa com hover/foco, fora da viewport ou com reduced-motion
  useEffect(() => {
    if (reduced || pausado || arrastando || !visible) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % total), AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduced, pausado, arrastando, visible, total]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    inicio.current = { x: e.clientX, y: e.clientY, t: performance.now(), travado: false, horizontal: false };
    setArrastando(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!arrastando) return;
    const difX = e.clientX - inicio.current.x;
    const difY = e.clientY - inicio.current.y;

    // decide uma única vez se o gesto é horizontal; se for vertical, devolve o scroll à página
    if (!inicio.current.travado && (Math.abs(difX) > 6 || Math.abs(difY) > 6)) {
      inicio.current.travado = true;
      inicio.current.horizontal = Math.abs(difX) > Math.abs(difY);
      if (inicio.current.horizontal) {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    }
    if (!inicio.current.horizontal) return;
    setDx(difX);
  };

  const soltar = (e: React.PointerEvent) => {
    if (!arrastando) return;
    const largura = trilhoRef.current?.clientWidth ?? 1;
    const dt = Math.max(1, performance.now() - inicio.current.t);
    const velocidade = Math.abs(dx) / dt;

    if (inicio.current.horizontal && (Math.abs(dx) > largura * LIMIAR || velocidade > 0.4)) {
      ir(idx + (dx < 0 ? 1 : -1));
    }
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    setArrastando(false);
    setDx(0);
  };

  const deslocamento = `calc(${-idx * 100}% + ${arrastando ? dx : 0}px)`;

  return (
    <Section
      id="depoimentos"
      className="lk-section--sand"
      eyebrow="Depoimentos"
      titulo={
        <>
          Quem já <span className="lk-gold">levantou com a gente</span>.
        </>
      }
      centro
      
    >
      <div
        className="lk-carrossel"
        ref={visRef}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onFocusCapture={() => setPausado(true)}
        onBlurCapture={() => setPausado(false)}
      >
        <button
          type="button"
          className="lk-carrossel__seta lk-carrossel__seta--esq"
          onClick={() => ir(idx - 1)}
          aria-label="Depoimento anterior"
        >
          <IconChevron width={20} height={20} style={{ transform: 'rotate(180deg)' }} />
        </button>

        <div className="lk-carrossel__janela">
          <div
            ref={trilhoRef}
            className={`lk-carrossel__trilho ${arrastando ? 'is-dragging' : ''}`.trim()}
            style={{ transform: `translate3d(${deslocamento}, 0, 0)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={soltar}
            onPointerCancel={soltar}
          >
            {DEPOIMENTOS.map((d, i) => (
              <article
                className="lk-depo"
                key={d.nome}
                aria-hidden={i !== idx}
                inert={i !== idx}
              >
                <svg className="lk-depo__aspas" viewBox="0 0 48 32" aria-hidden="true">
                  <path
                    d="M0 32V18C0 8 6 1.5 17 0l2 6c-6 1.5-9 5-9 10h8v16H0Zm28 0V18C28 8 34 1.5 45 0l2 6c-6 1.5-9 5-9 10h8v16H28Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="lk-depo__texto">{d.texto}</p>
                <footer className="lk-depo__autor">
                  <span className="lk-depo__avatar lk-mono" aria-hidden="true">
                    {iniciais(d.nome)}
                  </span>
                  <span>
                    <strong>{d.nome}</strong>
                    <small>
                      {d.cargo} · {d.cidade}
                    </small>
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="lk-carrossel__seta lk-carrossel__seta--dir"
          onClick={() => ir(idx + 1)}
          aria-label="Próximo depoimento"
        >
          <IconChevron width={20} height={20} />
        </button>
      </div>

      <div className="lk-carrossel__dots" role="tablist" aria-label="Escolher depoimento">
        {DEPOIMENTOS.map((d, i) => (
          <button
            key={d.nome}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Depoimento ${i + 1} de ${total}`}
            className={`lk-dot ${i === idx ? 'is-active' : ''}`.trim()}
            onClick={() => ir(i)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className="lk-numeros__nota">Depoimentos fictícios, criados para esta demonstração.</p>
    </Section>
  );
}
