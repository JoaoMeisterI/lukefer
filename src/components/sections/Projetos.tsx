import { useMemo, useState } from 'react';
import { CATEGORIAS, PROJETOS, type CategoriaProjeto } from '../../data/projetos';
import { scrollToSection } from '../../hooks';
import { num } from '../../lib/format';
import { GalpaoIso } from '../art/GalpaoIso';
import { IconArrow, IconChevron } from '../icons';
import { Button, Modal, Reveal, Section } from '../ui';

type Filtro = CategoriaProjeto | 'todos';

export function Projetos() {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [indice, setIndice] = useState<number | null>(null);

  const lista = useMemo(
    () => (filtro === 'todos' ? PROJETOS : PROJETOS.filter((p) => p.categoria === filtro)),
    [filtro],
  );

  const atual = indice !== null ? lista[indice] : null;

  const anterior = () => setIndice((i) => (i === null ? null : (i - 1 + lista.length) % lista.length));
  const proximo = () => setIndice((i) => (i === null ? null : (i + 1) % lista.length));

  return (
    <Section
      id="projetos"
      eyebrow="Projetos"
      titulo={
        <>
          Obra entregue <span className="lk-gold">fala mais alto</span>.
        </>
      }
      lead="Uma amostra do que sai da fábrica e vai pro terreno."
      className="lk-cv"
    >
      <div className="lk-filtros" role="group" aria-label="Filtrar projetos por categoria">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`lk-filtro ${filtro === c.id ? 'is-active' : ''}`.trim()}
            aria-pressed={filtro === c.id}
            onClick={() => {
              setFiltro(c.id);
              setIndice(null);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {lista.length} {lista.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}.
      </p>

      {lista.length === 0 ? (
        <p className="lk-vazio">Nenhum projeto nesta categoria.</p>
      ) : (
        <ul className="lk-projetos">
          {lista.map((p, i) => (
            <Reveal as="li" key={p.id} delay={Math.min(i % 3, 2)} efeito="up">
              <button
                type="button"
                className="lk-card lk-card--interactive lk-projeto"
                onClick={() => setIndice(i)}
                aria-haspopup="dialog"
              >
                <span className="lk-projeto__arte">
                  <GalpaoIso
                    modulos={p.arte.modulos}
                    altura={p.arte.altura}
                    tom={p.arte.tom}
                    alt={`Ilustração isométrica do projeto ${p.nome}`}
                  />
                  <span className="lk-projeto__tag lk-mono">{p.ano}</span>
                </span>
                <span className="lk-projeto__corpo">
                  <span className="lk-projeto__cat lk-mono">
                    {CATEGORIAS.find((c) => c.id === p.categoria)?.label}
                  </span>
                  <h3 className="lk-projeto__nome">{p.nome}</h3>
                  <span className="lk-projeto__meta">
                    <span>{p.cidade}</span>
                    <span aria-hidden="true">·</span>
                    <span className="lk-mono">{num(p.area)} m²</span>
                    <span aria-hidden="true">·</span>
                    <span className="lk-mono">vão {p.vao} m</span>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      <Reveal className="lk-projetos__pe" delay={1}>
        <Button
          onClick={() => scrollToSection('contato')}
          iconeDireita={<IconArrow width={18} height={18} />}
        >
          Quero um projeto assim
        </Button>
      </Reveal>

      <Modal
        aberto={atual !== null}
        aoFechar={() => setIndice(null)}
        titulo={atual?.nome ?? ''}
        largo
        aoAnterior={lista.length > 1 ? anterior : undefined}
        aoProximo={lista.length > 1 ? proximo : undefined}
        rodape={
          lista.length > 1 ? (
            <div className="lk-modal__nav">
              <button type="button" onClick={anterior} aria-label="Projeto anterior">
                <IconChevron width={20} height={20} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <span className="lk-mono">
                {(indice ?? 0) + 1} / {lista.length}
              </span>
              <button type="button" onClick={proximo} aria-label="Próximo projeto">
                <IconChevron width={20} height={20} />
              </button>
            </div>
          ) : undefined
        }
      >
        {atual && (
          <>
            <div className="lk-projeto__hero">
              <GalpaoIso
                modulos={atual.arte.modulos}
                altura={atual.arte.altura}
                tom={atual.arte.tom}
                alt={`Ilustração isométrica do projeto ${atual.nome}`}
              />
            </div>
            <p className="lk-modal__p">{atual.descricao}</p>
            <dl className="lk-ficha">
              <div className="lk-ficha__linha">
                <dt>Cidade</dt>
                <dd>{atual.cidade}</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Área construída</dt>
                <dd className="lk-mono">{num(atual.area)} m²</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Vão livre</dt>
                <dd className="lk-mono">{atual.vao} m</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Pé-direito</dt>
                <dd className="lk-mono">{atual.peDireito} m</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Prazo de execução</dt>
                <dd className="lk-mono">{atual.prazo}</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Peso de aço</dt>
                <dd className="lk-mono">{atual.pesoAco}</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Cobertura</dt>
                <dd>{atual.cobertura}</dd>
              </div>
              <div className="lk-ficha__linha">
                <dt>Escopo</dt>
                <dd>{atual.escopo}</dd>
              </div>
            </dl>
          </>
        )}
      </Modal>
    </Section>
  );
}
