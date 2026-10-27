import type { CSSProperties } from 'react';
import type { Imagem } from '../../data/imagens';

/* ============================================================
   <Foto> — imagem responsiva.

   - `srcset` com as duas larguras geradas pelo script; o navegador
     baixa a que couber na tela e no DPR.
   - `width`/`height` sempre presentes: reservam a caixa e impedem
     que o texto pule quando a foto chega.
   - `loading="lazy"` por padrão; o hero pede `prioridade`.
   - alt vazio => decorativa, sai da árvore de acessibilidade.
   ============================================================ */

interface Props {
  img: Imagem;
  /** valor do atributo sizes; default assume largura total da viewport */
  sizes?: string;
  className?: string;
  /** hero: carrega imediatamente e com prioridade alta */
  prioridade?: boolean;
  /** sobrescreve o alt do catálogo */
  alt?: string;
  style?: CSSProperties;
}

export function Foto({ img, sizes = '100vw', className, prioridade, alt, style }: Props) {
  const src = `/img/${img.base}.webp`;
  const srcSet = img.menor
    ? `/img/${img.base}-${img.menor}.webp ${img.menor}w, ${src} ${img.w}w`
    : undefined;

  const texto = alt ?? img.alt;

  return (
    <img
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={img.w}
      height={img.h}
      alt={texto}
      style={style}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding={prioridade ? 'sync' : 'async'}
      {...(prioridade ? { fetchPriority: 'high' as const } : {})}
      {...(texto === '' ? { 'aria-hidden': true } : {})}
      draggable={false}
    />
  );
}
