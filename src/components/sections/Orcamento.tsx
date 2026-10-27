import { useEffect, useRef, useState } from 'react';
import { SITE, whatsappUrl } from '../../data/site';
import { useReducedMotion } from '../../hooks';
import { gerarProtocolo, maskPhone, num } from '../../lib/format';
import { CHAVES, ler, remover, salvar } from '../../lib/storage';
import { TIPOS_OBRA } from '../../lib/simulador';
import {
  aceite,
  email as regraEmail,
  nomeCompleto,
  numeroEntre,
  obrigatorio,
  telefoneBR,
  validarCampos,
  type Regra,
} from '../../lib/validacao';
import { IconAlert, IconArrow, IconCheck, IconWhatsApp } from '../icons';
import { Button, Eyebrow, Reveal, useApp } from '../ui';

/* ---------- modelo ---------- */

interface Dados {
  tipo: string;
  area: string;
  prazo: string;
  cidade: string;
  peDireito: string;
  mezanino: string;
  terreno: string;
  observacoes: string;
  nome: string;
  email: string;
  whatsapp: string;
  horario: string;
  consentimento: string;
  [campo: string]: string;
}

const VAZIO: Dados = {
  tipo: '',
  area: '',
  prazo: '',
  cidade: '',
  peDireito: '',
  mezanino: '',
  terreno: '',
  observacoes: '',
  nome: '',
  email: '',
  whatsapp: '',
  horario: '',
  consentimento: 'false',
};

const REGRAS: Record<number, Partial<Record<keyof Dados, Regra[]>>> = {
  0: {
    tipo: [obrigatorio],
    area: [numeroEntre(50, 50000, 'm²')],
    prazo: [obrigatorio],
    cidade: [obrigatorio],
  },
  1: {
    peDireito: [numeroEntre(3, 20, 'm')],
    mezanino: [obrigatorio],
    terreno: [obrigatorio],
  },
  2: {
    nome: [nomeCompleto],
    email: [regraEmail],
    whatsapp: [telefoneBR],
    horario: [obrigatorio],
    consentimento: [aceite],
  },
};

const ETAPAS = ['Seu projeto', 'Detalhes', 'Contato'];

const OPCOES_PRAZO = [
  'O quanto antes',
  'Até 3 meses',
  'De 3 a 6 meses',
  'Mais de 6 meses',
  'Ainda estudando',
];
const OPCOES_MEZANINO = [
  { v: 'sim', l: 'Sim' },
  { v: 'nao', l: 'Não' },
  { v: 'naosei', l: 'Não sei ainda' },
];
const OPCOES_TERRENO = [
  { v: 'pronto', l: 'Pronto' },
  { v: 'terraplenagem', l: 'Em terraplenagem' },
  { v: 'nao', l: 'Ainda não' },
  { v: 'semterreno', l: 'Não tenho terreno' },
];
const OPCOES_HORARIO = ['Manhã', 'Tarde', 'Fim do dia', 'Qualquer horário'];

/* ---------- componente ---------- */

export function Orcamento() {
  const { prefill, setPrefill, mostrarToast } = useApp();
  const reduced = useReducedMotion();

  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState<Dados>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Dados, string>>>({});
  const [tocados, setTocados] = useState<Partial<Record<keyof Dados, boolean>>>({});
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [restaurado, setRestaurado] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const debounce = useRef<number | null>(null);

  /* restaura rascunho */
  useEffect(() => {
    const r = ler<{ etapa: number; dados: Dados }>(CHAVES.rascunho);
    if (r && r.dados) {
      setDados({ ...VAZIO, ...r.dados });
      setEtapa(Math.min(2, Math.max(0, r.etapa ?? 0)));
      setRestaurado(true);
    }
  }, []);

  /* salva rascunho com debounce */
  useEffect(() => {
    if (protocolo) return;
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      const vazio = Object.entries(dados).every(
        ([k, v]) => v === '' || (k === 'consentimento' && v === 'false'),
      );
      if (!vazio) salvar(CHAVES.rascunho, { etapa, dados });
    }, 600);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [dados, etapa, protocolo]);

  /* recebe os dados do simulador */
  useEffect(() => {
    if (!prefill) return;
    setDados((d) => ({
      ...d,
      tipo: prefill.tipo,
      area: prefill.area,
      peDireito: prefill.peDireito,
      mezanino: prefill.mezanino,
    }));
    setEtapa(0);
    setProtocolo(null);
    setPrefill(null);
  }, [prefill, setPrefill]);

  const set = (campo: keyof Dados, valor: string) => {
    setDados((d) => ({ ...d, [campo]: valor }));
    if (tocados[campo]) {
      const regras = REGRAS[etapa][campo];
      if (regras) {
        const e = validarCampos({ [campo]: valor } as never, { [campo]: regras } as never);
        setErros((old) => ({ ...old, [campo]: e[campo as never] }));
      }
    }
  };

  const blur = (campo: keyof Dados) => {
    setTocados((t) => ({ ...t, [campo]: true }));
    const regras = REGRAS[etapa][campo];
    if (!regras) return;
    const e = validarCampos({ [campo]: dados[campo] } as never, { [campo]: regras } as never);
    setErros((old) => ({ ...old, [campo]: e[campo as never] }));
  };

  const validarEtapa = (): boolean => {
    const e = validarCampos(dados, REGRAS[etapa]);
    setErros(e);
    const campos = Object.keys(REGRAS[etapa]) as (keyof Dados)[];
    setTocados((t) => {
      const novo = { ...t };
      campos.forEach((c) => {
        novo[c] = true;
      });
      return novo;
    });

    const primeiro = campos.find((c) => e[c]);
    if (primeiro) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${String(primeiro)}"]`);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      return false;
    }
    return true;
  };

  const avancar = () => {
    if (!validarEtapa()) return;
    setErros({});
    setEtapa((s) => Math.min(2, s + 1));
    formRef.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  };

  const voltar = () => {
    setErros({});
    setEtapa((s) => Math.max(0, s - 1));
  };

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (etapa < 2) {
      avancar();
      return;
    }
    if (!validarEtapa()) return;

    setEnviando(true);
    window.setTimeout(() => {
      const p = gerarProtocolo();
      const antigos = ler<string[]>(CHAVES.protocolos) ?? [];
      salvar(CHAVES.protocolos, [p, ...antigos].slice(0, 5));
      remover(CHAVES.rascunho);
      setProtocolo(p);
      setEnviando(false);
      mostrarToast('Solicitação registrada com sucesso.');
    }, 1400);
  };

  const limparRascunho = () => {
    remover(CHAVES.rascunho);
    setDados(VAZIO);
    setErros({});
    setTocados({});
    setEtapa(0);
    setRestaurado(false);
    mostrarToast('Rascunho apagado.');
  };

  const novaSolicitacao = () => {
    setProtocolo(null);
    setDados(VAZIO);
    setErros({});
    setTocados({});
    setEtapa(0);
  };

  const tipoLabel = TIPOS_OBRA.find((t) => t.id === dados.tipo)?.label ?? dados.tipo;

  return (
    <section id="contato" className="lk-section lk-orc lk-cv" aria-labelledby="orc-titulo">
      <div className="lk-grid-bg lk-orc__bg" aria-hidden="true" />
      <div className="lk-container">
        <header className="lk-section__head lk-section__head--center">
          <Eyebrow centro>Orçamento</Eyebrow>
          <Reveal delay={1}>
            <h2 id="orc-titulo">
              Conta pra gente o que você <span className="lk-gold">precisa construir</span>.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lk-lead">
              Três passos rápidos. A gente responde em até 1 dia útil com uma primeira leitura do seu
              caso.
            </p>
          </Reveal>
        </header>

        <Reveal className="lk-orc__card" efeito="scale">
          <p className="lk-orc__mock">
            <IconAlert width={16} height={16} />
            Demonstração — nada é enviado ou armazenado em servidor.
          </p>

          {protocolo ? (
            <Sucesso protocolo={protocolo} dados={dados} tipoLabel={tipoLabel} aoReiniciar={novaSolicitacao} />
          ) : (
            <>
              <ol className="lk-passos" aria-label="Etapas do formulário">
                {ETAPAS.map((nome, i) => (
                  <li
                    key={nome}
                    className={`lk-passos__item ${i === etapa ? 'is-atual' : ''} ${i < etapa ? 'is-feito' : ''}`.trim()}
                    aria-current={i === etapa ? 'step' : undefined}
                  >
                    <span className="lk-passos__bolha lk-mono">
                      {i < etapa ? <IconCheck width={15} height={15} /> : i + 1}
                    </span>
                    <span className="lk-passos__nome">{nome}</span>
                  </li>
                ))}
                <li className="lk-passos__trilho" aria-hidden="true">
                  <span style={{ transform: `scaleX(${etapa / (ETAPAS.length - 1)})` }} />
                </li>
              </ol>

              {restaurado && (
                <p className="lk-orc__rascunho">
                  Recuperamos seu rascunho.
                  <button type="button" onClick={limparRascunho}>
                    Limpar
                  </button>
                </p>
              )}

              <form ref={formRef} onSubmit={enviar} noValidate>
                {etapa === 0 && (
                  <div className="lk-orc__grid">
                    <Campo label="Tipo de obra" erro={erros.tipo} nome="tipo" obrigatorio>
                      <select
                        name="tipo"
                        id="tipo"
                        className="lk-input"
                        value={dados.tipo}
                        onChange={(e) => set('tipo', e.target.value)}
                        onBlur={() => blur('tipo')}
                        aria-invalid={Boolean(erros.tipo)}
                      >
                        <option value="">Selecione…</option>
                        {TIPOS_OBRA.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                        <option value="outro">Outro</option>
                      </select>
                    </Campo>

                    <Campo label="Área aproximada (m²)" erro={erros.area} nome="area" obrigatorio>
                      <input
                        name="area"
                        id="area"
                        className="lk-input"
                        type="number"
                        inputMode="numeric"
                        placeholder="Ex.: 1200"
                        value={dados.area}
                        onChange={(e) => set('area', e.target.value)}
                        onBlur={() => blur('area')}
                        aria-invalid={Boolean(erros.area)}
                      />
                    </Campo>

                    <div className="lk-orc__full">
                      <GrupoRadio
                        legenda="Prazo desejado"
                        nome="prazo"
                        valor={dados.prazo}
                        erro={erros.prazo}
                        opcoes={OPCOES_PRAZO.map((p) => ({ v: p, l: p }))}
                        aoMudar={(v) => {
                          set('prazo', v);
                          setTocados((t) => ({ ...t, prazo: true }));
                          setErros((e) => ({ ...e, prazo: undefined }));
                        }}
                      />
                    </div>

                    <div className="lk-orc__full">
                      <Campo label="Cidade e UF" erro={erros.cidade} nome="cidade" obrigatorio>
                        <input
                          name="cidade"
                          id="cidade"
                          className="lk-input"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Ex.: Jaraguá do Sul/SC"
                          value={dados.cidade}
                          onChange={(e) => set('cidade', e.target.value)}
                          onBlur={() => blur('cidade')}
                          aria-invalid={Boolean(erros.cidade)}
                        />
                      </Campo>
                    </div>
                  </div>
                )}

                {etapa === 1 && (
                  <div className="lk-orc__grid">
                    <Campo label="Pé-direito desejado (m)" erro={erros.peDireito} nome="peDireito" obrigatorio>
                      <input
                        name="peDireito"
                        id="peDireito"
                        className="lk-input"
                        type="number"
                        inputMode="decimal"
                        placeholder="Ex.: 8"
                        value={dados.peDireito}
                        onChange={(e) => set('peDireito', e.target.value)}
                        onBlur={() => blur('peDireito')}
                        aria-invalid={Boolean(erros.peDireito)}
                      />
                    </Campo>

                    <GrupoRadio
                      legenda="Vai ter mezanino?"
                      nome="mezanino"
                      valor={dados.mezanino}
                      erro={erros.mezanino}
                      opcoes={OPCOES_MEZANINO}
                      aoMudar={(v) => {
                        set('mezanino', v);
                        setTocados((t) => ({ ...t, mezanino: true }));
                        setErros((e) => ({ ...e, mezanino: undefined }));
                      }}
                    />

                    <div className="lk-orc__full">
                      <GrupoRadio
                        legenda="O terreno já está pronto?"
                        nome="terreno"
                        valor={dados.terreno}
                        erro={erros.terreno}
                        opcoes={OPCOES_TERRENO}
                        aoMudar={(v) => {
                          set('terreno', v);
                          setTocados((t) => ({ ...t, terreno: true }));
                          setErros((e) => ({ ...e, terreno: undefined }));
                        }}
                      />
                    </div>

                    <div className="lk-orc__full">
                      <Campo label="Observações" nome="observacoes" dica="Opcional. Conte o que for relevante sobre a operação, o terreno ou o prazo.">
                        <textarea
                          name="observacoes"
                          id="observacoes"
                          className="lk-input lk-textarea"
                          rows={4}
                          value={dados.observacoes}
                          onChange={(e) => set('observacoes', e.target.value)}
                        />
                      </Campo>
                    </div>
                  </div>
                )}

                {etapa === 2 && (
                  <div className="lk-orc__grid">
                    <div className="lk-orc__full">
                      <Campo label="Nome completo" erro={erros.nome} nome="nome" obrigatorio>
                        <input
                          name="nome"
                          id="nome"
                          className="lk-input"
                          type="text"
                          autoComplete="name"
                          value={dados.nome}
                          onChange={(e) => set('nome', e.target.value)}
                          onBlur={() => blur('nome')}
                          aria-invalid={Boolean(erros.nome)}
                        />
                      </Campo>
                    </div>

                    <Campo label="E-mail" erro={erros.email} nome="email" obrigatorio>
                      <input
                        name="email"
                        id="email"
                        className="lk-input"
                        type="email"
                        autoComplete="email"
                        value={dados.email}
                        onChange={(e) => set('email', e.target.value)}
                        onBlur={() => blur('email')}
                        aria-invalid={Boolean(erros.email)}
                      />
                    </Campo>

                    <Campo label="WhatsApp" erro={erros.whatsapp} nome="whatsapp" obrigatorio>
                      <input
                        name="whatsapp"
                        id="whatsapp"
                        className="lk-input"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(47) 99999-9999"
                        value={dados.whatsapp}
                        onChange={(e) => set('whatsapp', maskPhone(e.target.value))}
                        onBlur={() => blur('whatsapp')}
                        aria-invalid={Boolean(erros.whatsapp)}
                      />
                    </Campo>

                    <div className="lk-orc__full">
                      <GrupoRadio
                        legenda="Melhor horário para falar"
                        nome="horario"
                        valor={dados.horario}
                        erro={erros.horario}
                        opcoes={OPCOES_HORARIO.map((h) => ({ v: h, l: h }))}
                        aoMudar={(v) => {
                          set('horario', v);
                          setTocados((t) => ({ ...t, horario: true }));
                          setErros((e) => ({ ...e, horario: undefined }));
                        }}
                      />
                    </div>

                    <div className="lk-orc__full">
                      <label className={`lk-check ${erros.consentimento ? 'lk-check--erro' : ''}`.trim()}>
                        <input
                          name="consentimento"
                          type="checkbox"
                          checked={dados.consentimento === 'true'}
                          onChange={(e) => {
                            set('consentimento', String(e.target.checked));
                            setErros((old) => ({ ...old, consentimento: undefined }));
                          }}
                          aria-invalid={Boolean(erros.consentimento)}
                        />
                        <span className="lk-check__box" aria-hidden="true">
                          <IconCheck width={14} height={14} />
                        </span>
                        <span>Aceito ser contatado sobre esta solicitação.</span>
                      </label>
                      {erros.consentimento && (
                        <p className="lk-field__erro" role="alert">
                          <IconAlert width={15} height={15} />
                          {erros.consentimento}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="lk-orc__acoes">
                  {etapa > 0 && (
                    <Button type="button" variante="secondary" onClick={voltar}>
                      Voltar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    carregando={enviando}
                    iconeDireita={!enviando ? <IconArrow width={18} height={18} /> : undefined}
                  >
                    {enviando ? 'Enviando…' : etapa < 2 ? 'Continuar' : 'Enviar solicitação'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- subcomponentes ---------- */

function Campo({
  label,
  erro,
  dica,
  nome,
  obrigatorio: req,
  children,
}: {
  label: string;
  erro?: string;
  dica?: string;
  nome: string;
  obrigatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`lk-field ${erro ? 'lk-field--erro' : ''}`.trim()}>
      <label className="lk-field__label" htmlFor={nome}>
        {label}
        {req && (
          <span className="lk-field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {dica && !erro && <p className="lk-field__dica">{dica}</p>}
      {erro && (
        <p className="lk-field__erro" role="alert">
          <IconAlert width={15} height={15} />
          {erro}
        </p>
      )}
    </div>
  );
}

function GrupoRadio({
  legenda,
  nome,
  valor,
  opcoes,
  erro,
  aoMudar,
}: {
  legenda: string;
  nome: string;
  valor: string;
  opcoes: { v: string; l: string }[];
  erro?: string;
  aoMudar: (v: string) => void;
}) {
  return (
    <fieldset className={`lk-radios ${erro ? 'lk-field--erro' : ''}`.trim()}>
      <legend className="lk-field__label">
        {legenda}
        <span className="lk-field__req" aria-hidden="true">
          *
        </span>
      </legend>
      <div className="lk-radios__lista">
        {opcoes.map((o) => (
          <label key={o.v} className={`lk-radio ${valor === o.v ? 'is-active' : ''}`.trim()}>
            <input
              type="radio"
              name={nome}
              value={o.v}
              checked={valor === o.v}
              onChange={() => aoMudar(o.v)}
              className="sr-only"
            />
            <span>{o.l}</span>
          </label>
        ))}
      </div>
      {erro && (
        <p className="lk-field__erro" role="alert">
          <IconAlert width={15} height={15} />
          {erro}
        </p>
      )}
    </fieldset>
  );
}

function Sucesso({
  protocolo,
  dados,
  tipoLabel,
  aoReiniciar,
}: {
  protocolo: string;
  dados: Dados;
  tipoLabel: string;
  aoReiniciar: () => void;
}) {
  const msg = `Olá! Acabei de enviar uma solicitação pelo site. Protocolo ${protocolo}.`;
  return (
    <div className="lk-sucesso">
      <span className="lk-sucesso__selo" aria-hidden="true">
        <IconCheck width={28} height={28} />
      </span>
      <h3>Solicitação registrada.</h3>
      <p>
        Seu protocolo é <strong className="lk-mono">{protocolo}</strong>. Guarde esse número. Nossa
        equipe responde em até 1 dia útil — e se quiser agilizar, chama no WhatsApp.
      </p>

      <dl className="lk-ficha lk-sucesso__resumo">
        <div className="lk-ficha__linha">
          <dt>Tipo de obra</dt>
          <dd>{tipoLabel || '—'}</dd>
        </div>
        <div className="lk-ficha__linha">
          <dt>Área aproximada</dt>
          <dd className="lk-mono">{dados.area ? `${num(Number(dados.area))} m²` : '—'}</dd>
        </div>
        <div className="lk-ficha__linha">
          <dt>Cidade</dt>
          <dd>{dados.cidade || '—'}</dd>
        </div>
        <div className="lk-ficha__linha">
          <dt>Prazo desejado</dt>
          <dd>{dados.prazo || '—'}</dd>
        </div>
        <div className="lk-ficha__linha">
          <dt>Contato</dt>
          <dd>{dados.whatsapp || dados.email || '—'}</dd>
        </div>
      </dl>

      <div className="lk-sucesso__acoes">
        <a
          className="lk-btn lk-btn--whatsapp"
          href={whatsappUrl(msg)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWhatsApp width={18} height={18} />
          Falar no WhatsApp
        </a>
        <Button variante="secondary" onClick={aoReiniciar}>
          Fazer nova solicitação
        </Button>
      </div>

      <p className="lk-sucesso__nota">
        Demonstração: nenhum dado saiu do seu navegador. Em produção, isso cairia no CRM da {SITE.nome}.
      </p>
    </div>
  );
}
