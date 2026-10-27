import { useEffect } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { Solucoes } from './components/sections/Solucoes';
import { Comparativo } from './components/sections/Comparativo';
import { VaoLivreSection } from './components/sections/VaoLivreSection';
import { Processo } from './components/sections/Processo';
import { Numeros } from './components/sections/Numeros';
import { Projetos } from './components/sections/Projetos';
import { Simulador } from './components/sections/Simulador';
import { Fabrica } from './components/sections/Fabrica';
import { Depoimentos } from './components/sections/Depoimentos';
import { Faq } from './components/sections/Faq';
import { Orcamento } from './components/sections/Orcamento';
import { Footer } from './components/sections/Footer';
import { Flutuantes } from './components/sections/Flutuantes';
import { AppProvider } from './components/ui';

export default function App() {
  // marca que o JS subiu — o CSS usa isso para liberar as animações de entrada
  useEffect(() => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js-ready');
  }, []);

  // aviso de overflow horizontal só em desenvolvimento
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const checar = () => {
      const doc = document.documentElement;
      if (doc.scrollWidth > window.innerWidth + 1) {
        const culpado = Array.from(document.querySelectorAll<HTMLElement>('body *')).find(
          (el) => el.getBoundingClientRect().right > window.innerWidth + 1,
        );
        // eslint-disable-next-line no-console
        console.warn('[QA] overflow horizontal detectado:', culpado ?? '(elemento não identificado)');
      }
    };
    const t = window.setTimeout(checar, 1200);
    window.addEventListener('resize', checar);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', checar);
    };
  }, []);

  return (
    <AppProvider>
      <a className="lk-skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo">
        <Hero />
        <Solucoes />
        <Comparativo />
        <VaoLivreSection />
        <Processo />
        <Numeros />
        <Projetos />
        <Simulador />
        <Fabrica />
        <Depoimentos />
        <Faq />
        <Orcamento />
      </main>

      <Footer />
      <Flutuantes />
    </AppProvider>
  );
}
