// Driver CDP mínimo, sem dependências (Node 24 tem WebSocket nativo).
const PORT = process.env.CDP_PORT || 9333;
const URL_ALVO = process.env.ALVO || 'http://127.0.0.1:4199/';

async function alvo() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Chrome CDP não respondeu');
}

export async function conectar() {
  const t = await alvo();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 0;
  const pendentes = new Map();
  const eventos = new Map();

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) {
      const { resolve, reject } = pendentes.get(msg.id);
      pendentes.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) {
      (eventos.get(msg.method) ?? []).forEach((fn) => fn(msg.params));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      id += 1;
      pendentes.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const on = (method, fn) => {
    if (!eventos.has(method)) eventos.set(method, []);
    eventos.get(method).push(fn);
  };

  const avaliar = async (fn, ...args) => {
    const expressao = `(${fn.toString()})(${args.map((a) => JSON.stringify(a)).join(',')})`;
    const r = await send('Runtime.evaluate', {
      expression: expressao,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'erro');
    return r.result.value;
  };

  const metrica = (width, height, mobile = false) =>
    send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile,
      screenWidth: width, screenHeight: height,
    });

  const navegar = async (url = URL_ALVO) => {
    const pronto = new Promise((res) => on('Page.loadEventFired', res));
    await send('Page.navigate', { url });
    await pronto;
    await new Promise((r) => setTimeout(r, 900));
  };

  const screenshot = async (caminho, fullPage = false) => {
    const fs = await import('node:fs');
    const opt = { format: 'png', captureBeyondViewport: fullPage };
    if (fullPage) {
      const m = await send('Page.getLayoutMetrics');
      opt.clip = { x: 0, y: 0, width: m.cssContentSize.width, height: Math.min(m.cssContentSize.height, 16000), scale: 1 };
    }
    const r = await send('Page.captureScreenshot', opt);
    fs.writeFileSync(caminho, Buffer.from(r.data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  return { send, on, avaliar, metrica, navegar, screenshot, fechar: () => ws.close() };
}
