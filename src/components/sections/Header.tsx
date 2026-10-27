import { useEffect, useState } from 'react';
import { NAV, SITE } from '../../data/site';
import { useActiveSection, useEscape, useScrollLock, useScrollProgress, scrollToSection } from '../../hooks';
import { Logo, LogoMarca } from '../icons/Logo';
import { IconArrow, IconClose, IconInstagram, IconMenu } from '../icons';
import { Button } from '../ui';

const IDS = NAV.map((n) => n.id);

export function Header() {
  const { progress, scrolled } = useScrollProgress();
  const ativo = useActiveSection(IDS);
  const [aberto, setAberto] = useState(false);

  useScrollLock(aberto);
  useEscape(aberto, () => setAberto(false));

  // fecha o drawer ao passar para desktop
  useEffect(() => {
    if (!aberto) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => {
      if (mq.matches) setAberto(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, [aberto]);

  const ir = (id: string) => {
    setAberto(false);
    // espera o scroll lock soltar antes de rolar
    window.setTimeout(() => scrollToSection(id), 20);
  };

  return (
    <>
      <header className={`lk-header ${scrolled ? 'lk-header--scrolled' : ''}`.trim()}>
        <div className="lk-header__inner lk-container">
          <a
            className="lk-header__marca"
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Lukefer — ir para o topo"
          >
            <Logo size={32} />
          </a>

          <nav className="lk-header__nav" aria-label="Navegação principal">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`lk-header__link ${ativo === item.id ? 'is-active' : ''}`.trim()}
                aria-current={ativo === item.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  ir(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lk-header__acoes">
            <Button
              pequeno
              className="lk-header__cta"
              onClick={() => ir('contato')}
              iconeDireita={<IconArrow width={17} height={17} />}
            >
              Orçamento
            </Button>
            <button
              type="button"
              className="lk-header__burger"
              onClick={() => setAberto(true)}
              aria-label="Abrir menu de navegação"
              aria-expanded={aberto}
            >
              <IconMenu />
            </button>
          </div>
        </div>

        <div className="lk-header__progresso" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      {/* Drawer mobile */}
      <div className={`lk-drawer-wrap ${aberto ? 'is-open' : ''}`.trim()}>
        <div className="lk-drawer__overlay" onClick={() => setAberto(false)} aria-hidden="true" />
        <aside
          className="lk-drawer"
          role="dialog"
          aria-modal={aberto || undefined}
          aria-label="Menu de navegação"
          inert={!aberto}
        >
          <div className="lk-drawer__head">
            <LogoMarca size={34} variante="dourado" />
            <button
              type="button"
              className="lk-drawer__fechar"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
            >
              <IconClose />
            </button>
          </div>

          <nav className="lk-drawer__nav" aria-label="Navegação mobile">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`lk-drawer__link ${ativo === item.id ? 'is-active' : ''}`.trim()}
                style={{ '--i': i } as React.CSSProperties}
                onClick={(e) => {
                  e.preventDefault();
                  ir(item.id);
                }}
              >
                <span className="lk-drawer__n">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lk-drawer__pe">
            <Button bloco onClick={() => ir('contato')} iconeDireita={<IconArrow width={18} height={18} />}>
              Solicitar orçamento
            </Button>
            <a
              className="lk-drawer__social"
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconInstagram width={18} height={18} />
              {SITE.instagramHandle}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
