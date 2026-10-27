import { whatsappUrl } from '../../data/site';
import { useReducedMotion, useScrollProgress } from '../../hooks';
import { IconChevronUp, IconWhatsApp } from '../icons';

export function Flutuantes() {
  const { y } = useScrollProgress();
  const reduced = useReducedMotion();
  const visivel = y > 600;

  return (
    <div className={`lk-flut ${visivel ? 'is-visible' : ''}`.trim()}>
      <button
        type="button"
        className="lk-flut__topo"
        onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
        aria-label="Voltar ao topo"
        tabIndex={visivel ? 0 : -1}
      >
        <IconChevronUp width={20} height={20} />
      </button>

      <a
        className="lk-flut__zap"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        tabIndex={visivel ? 0 : -1}
      >
        <IconWhatsApp width={22} height={22} />
        <span className="lk-flut__texto">Falar no WhatsApp</span>
      </a>
    </div>
  );
}
