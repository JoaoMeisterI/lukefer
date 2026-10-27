import { FOOTER_LINKS, SITE } from '../../data/site';
import { scrollToSection } from '../../hooks';
import { IconInstagram, IconMail, IconPhone, IconPin, IconClock } from '../icons';
import { Logo } from '../icons/Logo';

export function Footer() {
  return (
    <footer className="lk-footer lk-dark" aria-labelledby="footer-titulo">
      <h2 id="footer-titulo" className="sr-only">
        Rodapé
      </h2>
      <div className="lk-container">
        <div className="lk-footer__grid">
          <div className="lk-footer__marca">
            <Logo size={40} />
            <p>{SITE.bio}</p>
            <a
              className="lk-footer__insta"
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconInstagram width={18} height={18} />
              {SITE.instagramHandle}
            </a>
          </div>

          <nav className="lk-footer__col" aria-label="Soluções">
            <h3>Soluções</h3>
            <ul>
              {FOOTER_LINKS.solucoes.map((s) => (
                <li key={s}>
                  <a
                    href="#solucoes"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('solucoes');
                    }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lk-footer__col" aria-label="Empresa">
            <h3>Empresa</h3>
            <ul>
              {FOOTER_LINKS.empresa.map((l) => (
                <li key={l.label}>
                  <a
                    href={`#${l.alvo}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(l.alvo);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lk-footer__col">
            <h3>Contato</h3>
            <ul className="lk-footer__contato">
              <li>
                <IconPhone width={17} height={17} />
                <a href={`tel:${SITE.telefoneLink}`}>{SITE.telefone}</a>
              </li>
              <li>
                <IconMail width={17} height={17} />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <IconPin width={17} height={17} />
                <span>{SITE.endereco}</span>
              </li>
              <li>
                <IconClock width={17} height={17} />
                <span>{SITE.horario}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="lk-hairline" />

        <div className="lk-footer__legal">
          <p>
            © {new Date().getFullYear()} Lukefer Galpões e Estruturas Metálicas. CNPJ {SITE.cnpj}.
          </p>
          <p className="lk-footer__mock">
            Site demonstrativo. Dados de contato, números, projetos e depoimentos são fictícios.
          </p>
        </div>
      </div>
    </footer>
  );
}
