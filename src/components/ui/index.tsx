import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useEscape, useFocusTrap, useReveal, useScrollLock } from '../../hooks';
import { IconAlert, IconClose, IconSpinner } from '../icons';

/* ============================================================
   Reveal — envolve qualquer conteúdo com entrada no scroll
   ============================================================ */

type Efeito = 'up' | 'left' | 'right' | 'scale';

const CLASSE: Record<Efeito, string> = {
  up: 'reveal',
  left: 'reveal-l',
  right: 'reveal-r',
  scale: 'reveal-scale',
};

export function Reveal({
  children,
  efeito = 'up',
  delay = 0,
  as: Tag = 'div',
  className,
  ...rest
}: {
  children: ReactNode;
  efeito?: Efeito;
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
  className?: string;
} & Record<string, unknown>) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`${CLASSE[efeito]} ${visible ? 'is-visible' : ''} ${className ?? ''}`.trim()}
      style={{ '--i': delay } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   Eyebrow
   ============================================================ */

export function Eyebrow({ children, centro }: { children: ReactNode; centro?: boolean }) {
  const { ref, visible } = useReveal<HTMLSpanElement>({ threshold: 0.4 });
  return (
    <span
      ref={ref}
      className={`lk-eyebrow ${centro ? 'lk-eyebrow--center' : ''} ${visible ? 'is-visible' : ''}`.trim()}
    >
      {children}
    </span>
  );
}

/* ============================================================
   Section — casca padrão com id, título acessível e cabeçalho
   ============================================================ */

export function Section({
  id,
  eyebrow,
  titulo,
  lead,
  centro,
  children,
  className,
  semCabecalho,
  acima,
}: {
  id: string;
  eyebrow?: string;
  titulo?: ReactNode;
  lead?: ReactNode;
  centro?: boolean;
  children: ReactNode;
  className?: string;
  semCabecalho?: boolean;
  acima?: ReactNode;
}) {
  const tid = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={titulo ? tid : undefined} className={`lk-section ${className ?? ''}`.trim()}>
      {acima}
      <div className="lk-container">
        {!semCabecalho && (
          <header className={`lk-section__head ${centro ? 'lk-section__head--center' : ''}`.trim()}>
            {eyebrow && <Eyebrow centro={centro}>{eyebrow}</Eyebrow>}
            {titulo && (
              <Reveal delay={1}>
                <h2 id={tid}>{titulo}</h2>
              </Reveal>
            )}
            {lead && (
              <Reveal delay={2}>
                <p className="lk-lead">{lead}</p>
              </Reveal>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   Button
   ============================================================ */

type Variante = 'primary' | 'secondary' | 'ghost' | 'whatsapp';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  pequeno?: boolean;
  bloco?: boolean;
  carregando?: boolean;
  iconeDireita?: ReactNode;
  iconeEsquerda?: ReactNode;
}

export function Button({
  variante = 'primary',
  pequeno,
  bloco,
  carregando,
  iconeDireita,
  iconeEsquerda,
  children,
  className,
  disabled,
  ...rest
}: BotaoProps) {
  return (
    <button
      type="button"
      className={[
        'lk-btn',
        `lk-btn--${variante}`,
        pequeno ? 'lk-btn--sm' : '',
        bloco ? 'lk-btn--block' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...rest}
    >
      {carregando ? <IconSpinner className="lk-btn__spinner" /> : iconeEsquerda}
      {children}
      {!carregando && iconeDireita}
    </button>
  );
}

/* ============================================================
   Campos de formulário
   ============================================================ */

interface CampoBase {
  label: string;
  erro?: string | null;
  dica?: string;
  obrigatorio?: boolean;
}

export function Field({
  label,
  erro,
  dica,
  obrigatorio,
  children,
  id,
}: CampoBase & { children: (props: { id: string; descrito?: string; invalido: boolean }) => ReactNode; id?: string }) {
  const auto = useId().replace(/:/g, '');
  const fid = id ?? `f-${auto}`;
  const eid = `${fid}-erro`;
  const did = `${fid}-dica`;
  const descrito = [erro ? eid : null, dica ? did : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`lk-field ${erro ? 'lk-field--erro' : ''}`.trim()}>
      <label className="lk-field__label" htmlFor={fid}>
        {label}
        {obrigatorio && (
          <span className="lk-field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({ id: fid, descrito, invalido: Boolean(erro) })}
      {dica && !erro && (
        <p className="lk-field__dica" id={did}>
          {dica}
        </p>
      )}
      {erro && (
        <p className="lk-field__erro" id={eid} role="alert">
          <IconAlert width={15} height={15} />
          {erro}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   Modal — diálogo acessível com foco preso e scroll travado
   ============================================================ */

export function Modal({
  aberto,
  aoFechar,
  titulo,
  children,
  rodape,
  largo,
  aoAnterior,
  aoProximo,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  rodape?: ReactNode;
  largo?: boolean;
  aoAnterior?: () => void;
  aoProximo?: () => void;
}) {
  const trapRef = useFocusTrap<HTMLDivElement>(aberto);
  const tid = useId().replace(/:/g, '');
  useScrollLock(aberto);
  useEscape(aberto, aoFechar);

  useEffect(() => {
    if (!aberto || (!aoAnterior && !aoProximo)) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') aoAnterior?.();
      if (e.key === 'ArrowRight') aoProximo?.();
    };
    document.addEventListener('keydown', on);
    return () => document.removeEventListener('keydown', on);
  }, [aberto, aoAnterior, aoProximo]);

  if (!aberto || typeof document === 'undefined') return null;

  return createPortal(
    <div className="lk-modal" role="presentation">
      <div className="lk-modal__overlay" onClick={aoFechar} aria-hidden="true" />
      <div
        className={`lk-modal__painel ${largo ? 'lk-modal__painel--largo' : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`m-${tid}`}
        ref={trapRef}
        tabIndex={-1}
      >
        <header className="lk-modal__head">
          <h3 id={`m-${tid}`}>{titulo}</h3>
          <button type="button" className="lk-modal__fechar" onClick={aoFechar} aria-label="Fechar">
            <IconClose />
          </button>
        </header>
        <div className="lk-modal__corpo">{children}</div>
        {rodape && <footer className="lk-modal__rodape">{rodape}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/* ============================================================
   Toast + contexto da aplicação
   ============================================================ */

export interface PrefillOrcamento {
  tipo: string;
  area: string;
  peDireito: string;
  mezanino: string;
}

interface AppCtx {
  prefill: PrefillOrcamento | null;
  setPrefill: (p: PrefillOrcamento | null) => void;
  mostrarToast: (msg: string, tom?: 'ok' | 'erro') => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp fora do AppProvider');
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<PrefillOrcamento | null>(null);
  const [toast, setToast] = useState<{ msg: string; tom: 'ok' | 'erro'; id: number } | null>(null);
  const timer = useRef<number | null>(null);

  const mostrarToast = useCallback((msg: string, tom: 'ok' | 'erro' = 'ok') => {
    setToast({ msg, tom, id: Date.now() });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const valor = useMemo(() => ({ prefill, setPrefill, mostrarToast }), [prefill, mostrarToast]);

  return (
    <Ctx.Provider value={valor}>
      {children}
      <div className="lk-toast-area" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className={`lk-toast lk-toast--${toast.tom}`}>
            {toast.msg}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
