import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ============================================================
   useReducedMotion — respeita prefers-reduced-motion
   ============================================================ */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    // Safari < 14 só tem addListener
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, []);

  return reduced;
}

/* ============================================================
   useMediaQuery
   ============================================================ */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, [query]);

  return matches;
}

/* ============================================================
   useReveal — IntersectionObserver com fallback seguro
   Se o observer não existir, o elemento já nasce visível.
   ============================================================ */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible } as const;
}

/* ============================================================
   useScrollLock — trava o scroll do body de forma confiável no iOS
   `overflow:hidden` não segura o Safari; só position:fixed resolve.
   Usa contador de referência para drawer + modal empilhados.
   ============================================================ */
let lockCount = 0;
let savedScrollY = 0;

function applyLock() {
  const body = document.body;
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}

function releaseLock() {
  const body = document.body;
  const html = document.documentElement;
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  // desliga o smooth scroll para a restauração não ser animada
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedScrollY);
  html.style.scrollBehavior = previous;
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    if (lockCount === 1) applyLock();
    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [active]);
}

/* ============================================================
   useFocusTrap — prende o foco dentro de um container (modais)
   Devolve o foco ao elemento que abriu.
   ============================================================ */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    openerRef.current = document.activeElement as HTMLElement | null;

    const node = ref.current;
    if (!node) return;

    const focusFirst = () => {
      const items = node.querySelectorAll<HTMLElement>(FOCUSABLE);
      (items[0] ?? node).focus();
    };
    // rAF garante que o nó já está pintado antes de focar (iOS)
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus?.();
    };
  }, [active]);

  return ref;
}

/* ============================================================
   useScrollProgress — único listener de scroll da página,
   passivo e com throttle por requestAnimationFrame.
   ============================================================ */
export function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, scrolled: false, y: 0 });

  useEffect(() => {
    let ticking = false;

    const read = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - document.documentElement.clientHeight,
      );
      setState({ progress: Math.min(1, Math.max(0, y / max)), scrolled: y > 24, y });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return state;
}

/* ============================================================
   useActiveSection — marca o item de nav da seção visível
   ============================================================ */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) return;
        let best = '';
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    nodes.forEach((n) => io.observe(n));

    return () => io.disconnect();
  }, [ids]);

  return active;
}

/* ============================================================
   useCountUp — contador animado, dispara uma vez
   ============================================================ */
export function useCountUp(target: number, run: boolean, duration = 1600) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;

    if (reduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduced]);

  return value;
}

/* ============================================================
   useIsomorphicLayoutEffect
   ============================================================ */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ============================================================
   scrollToSection — rolagem com desconto do header
   ============================================================ */
/**
 * Rola até uma seção descontando a altura do header.
 *
 * Numa página única com revelações no scroll, o documento pode crescer DURANTE
 * a rolagem (um contador que ganha dígitos, um bloco que entra em cena), e o
 * destino calculado no clique deixa de valer. Por isso, quando a rolagem para,
 * o alvo é remedido e corrigido se escorregou.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const destino = () => {
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68',
      10,
    );
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerH - 12);
  };

  window.scrollTo({ top: destino(), behavior: reduced ? 'auto' : 'smooth' });
  if (reduced) return;

  // espera a rolagem estabilizar e corrige o desvio, se houver
  let anterior = -1;
  let paradas = 0;
  let tentativas = 0;

  const conferir = () => {
    tentativas += 1;
    const y = Math.round(window.scrollY);
    paradas = y === anterior ? paradas + 1 : 0;
    anterior = y;

    if (paradas >= 3) {
      const alvo = destino();
      if (Math.abs(alvo - y) > 4) {
        window.scrollTo({ top: alvo, behavior: 'auto' });
      }
      return;
    }
    if (tentativas < 180) requestAnimationFrame(conferir);
  };

  requestAnimationFrame(conferir);
}

/* ============================================================
   useEscape — fecha com Esc
   ============================================================ */
export function useEscape(active: boolean, onEscape: () => void) {
  const cb = useRef(onEscape);
  cb.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cb.current();
    };
    document.addEventListener('keydown', on);
    return () => document.removeEventListener('keydown', on);
  }, [active]);
}

/* ============================================================
   useStableCallback
   ============================================================ */
export function useStableCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: A) => ref.current(...args), []);
}
