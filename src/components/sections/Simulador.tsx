import { useMemo, useState } from 'react';
import { scrollToSection } from '../../hooks';
import { brl, m2, num, peso, prazo } from '../../lib/format';
import { LIMITES, simular, TIPOS_OBRA, type TipoObra } from '../../lib/simulador';
import { IconAlert, IconArrow, IconClock, IconLayers, IconRuler } from '../icons';
import { Button, Reveal, Section, useApp } from '../ui';

interface Entradas {
  tipo: TipoObra;
  largura: string;
  comprimento: string;
  peDireito: string;
  mezanino: boolean;
}

const INICIAL: Entradas = {
  tipo: 'industrial',
  largura: '25',
  comprimento: '40',
  peDireito: '8',
  mezanino: false,
};

function erroDe(valor: string, min: number, max: number): string | null {
  if (!valor.trim()) return 'Informe um valor.';
  const n = Number(valor.replace(',', '.'));
  if (!Number.isFinite(n)) return 'Digite um número válido.';
  if (n < min || n > max) return `Entre ${min} e ${max} m.`;
  return null;
}

export function Simulador() {
  const [e, setE] = useState<Entradas>(INICIAL);
  const { setPrefill, mostrarToast } = useApp();

  const erros = {
    largura: erroDe(e.largura, LIMITES.largura.min, LIMITES.largura.max),
    comprimento: erroDe(e.comprimento, LIMITES.comprimento.min, LIMITES.comprimento.max),
    peDireito: erroDe(e.peDireito, LIMITES.peDireito.min, LIMITES.peDireito.max),
  };
  const valido = !erros.largura && !erros.comprimento && !erros.peDireito;

  const resultado = useMemo(() => {
    const largura = Number(e.largura.replace(',', '.')) || LIMITES.largura.min;
    const comprimento = Number(e.comprimento.replace(',', '.')) || LIMITES.comprimento.min;
    const peDireito = Number(e.peDireito.replace(',', '.')) || LIMITES.peDireito.min;
    return simular({ tipo: e.tipo, largura, comprimento, peDireito, mezanino: e.mezanino });
  }, [e]);

  const enviar = () => {
    setPrefill({
      tipo: e.tipo,
      area: String(Math.round(resultado.area)),
      peDireito: e.peDireito,
      mezanino: e.mezanino ? 'sim' : 'nao',
    });
    mostrarToast('Simulação carregada no formulário.');
    window.setTimeout(() => scrollToSection('contato'), 80);
  };

  return (
    <Section
      id="simulador"
      eyebrow="Simulador"
      titulo={
        <>
          Uma estimativa em <span className="lk-gold">trinta segundos</span>.
        </>
      }
      lead="Preencha as medidas e veja faixa de investimento, prazo e peso de aço. É estimativa — o número final sai do projeto."
      className="lk-cv"
    >
      <div className="lk-sim">
        <Reveal className="lk-sim__entradas" efeito="left">
          <div className="lk-field">
            <label className="lk-field__label" htmlFor="sim-tipo">
              Tipo de obra
            </label>
            <div className="lk-select-wrap">
              <select
                id="sim-tipo"
                className="lk-input"
                value={e.tipo}
                onChange={(ev) => setE({ ...e, tipo: ev.target.value as TipoObra })}
              >
                {TIPOS_OBRA.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lk-sim__linha">
            <CampoNumero
              id="sim-largura"
              label="Largura"
              unidade="m"
              valor={e.largura}
              erro={erros.largura}
              min={LIMITES.largura.min}
              max={LIMITES.largura.max}
              onChange={(v) => setE({ ...e, largura: v })}
            />
            <CampoNumero
              id="sim-comprimento"
              label="Comprimento"
              unidade="m"
              valor={e.comprimento}
              erro={erros.comprimento}
              min={LIMITES.comprimento.min}
              max={LIMITES.comprimento.max}
              onChange={(v) => setE({ ...e, comprimento: v })}
            />
          </div>

          <CampoNumero
            id="sim-pedireito"
            label="Pé-direito"
            unidade="m"
            valor={e.peDireito}
            erro={erros.peDireito}
            min={LIMITES.peDireito.min}
            max={LIMITES.peDireito.max}
            onChange={(v) => setE({ ...e, peDireito: v })}
          />

          <label className="lk-switch">
            <input
              type="checkbox"
              checked={e.mezanino}
              onChange={(ev) => setE({ ...e, mezanino: ev.target.checked })}
            />
            <span className="lk-switch__trilho" aria-hidden="true">
              <span className="lk-switch__bolinha" />
            </span>
            <span className="lk-switch__texto">
              Vai ter mezanino
              <small>Área adicional em estrutura independente</small>
            </span>
          </label>
        </Reveal>

        <Reveal className="lk-sim__saida" efeito="right" delay={1}>
          <div className="lk-sim__resultado">
            <div className="lk-sim__destaque">
              <span className="lk-sim__rotulo">Faixa de investimento estimada</span>
              <strong className="lk-sim__valor lk-mono">
                {valido ? `${brl(resultado.investMin)} — ${brl(resultado.investMax)}` : '—'}
              </strong>
            </div>

            <dl className="lk-sim__dl">
              <div>
                <dt>
                  <IconRuler width={17} height={17} />
                  Área construída
                </dt>
                <dd className="lk-mono">{valido ? m2(resultado.area) : '—'}</dd>
              </div>
              <div>
                <dt>
                  <IconClock width={17} height={17} />
                  Prazo total estimado
                </dt>
                <dd className="lk-mono">{valido ? prazo(resultado.prazoTotal) : '—'}</dd>
              </div>
              <div>
                <dt>
                  <IconLayers width={17} height={17} />
                  Peso estimado de aço
                </dt>
                <dd className="lk-mono">{valido ? peso(resultado.pesoAco) : '—'}</dd>
              </div>
              <div>
                <dt>
                  <IconLayers width={17} height={17} />
                  Consumo por m²
                </dt>
                <dd className="lk-mono">{valido ? `${num(resultado.kgPorM2)} kg/m²` : '—'}</dd>
              </div>
            </dl>

            <p className="lk-sim__aviso">
              <IconAlert width={16} height={16} />
              Estimativa gerada por fórmula de referência, apenas para fins de demonstração. Não é
              proposta comercial.
            </p>

            <Button
              bloco
              onClick={enviar}
              disabled={!valido}
              iconeDireita={<IconArrow width={18} height={18} />}
            >
              Enviar essa simulação
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function CampoNumero({
  id,
  label,
  unidade,
  valor,
  erro,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  unidade: string;
  valor: string;
  erro: string | null;
  min: number;
  max: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`lk-field ${erro ? 'lk-field--erro' : ''}`.trim()}>
      <label className="lk-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="lk-input-wrap">
        <input
          id={id}
          className="lk-input"
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          value={valor}
          onChange={(ev) => onChange(ev.target.value)}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
        />
        <span className="lk-input__unidade lk-mono" aria-hidden="true">
          {unidade}
        </span>
      </div>
      {erro && (
        <p className="lk-field__erro" id={`${id}-erro`} role="alert">
          <IconAlert width={15} height={15} />
          {erro}
        </p>
      )}
    </div>
  );
}
