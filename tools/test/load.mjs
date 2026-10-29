// Nạp toàn bộ trang (các tệp .js) vào một ngữ cảnh Node giả trình duyệt, không mạng, không Supabase thật. Dùng cho tools/test/run.mjs.
import fs from 'node:fs'; import vm from 'node:vm';
export const root = new URL('../..', import.meta.url).pathname;
export async function load() {
  const el = () => new Proxy({ style: {}, classList: { toggle() {}, add() {}, remove() {} }, dataset: {}, innerHTML: '', hidden: false }, { get: (t, k) => k in t ? t[k] : (k === 'querySelectorAll' ? () => [] : typeof k === 'string' && /^(addEventListener|appendChild|remove|setAttribute|focus|scrollIntoView|querySelector|closest)$/.test(k) ? () => null : undefined) });
  const els = {}, LS = {};
  const ctx = { console, Blob, URL, setTimeout, clearTimeout, setInterval: () => 0, clearInterval: () => {}, Promise, Date, Math, JSON, Set, Map, Array, Object, String, Number, RegExp, URLSearchParams,
    navigator: { userAgent: 'test' }, innerWidth: 390, innerHeight: 844, scrollTo() {}, alert() {}, confirm: () => true, prompt: () => null,
    localStorage: { getItem: k => LS[k] ?? null, setItem: (k, v) => { LS[k] = String(v); }, removeItem: k => { delete LS[k]; } },
    speechSynthesis: { getVoices: () => [], speak() {}, cancel() {} }, Audio: class { play() { return Promise.resolve(); } pause() {} },
    MutationObserver: class { observe() {} }, crypto: { randomUUID: () => 'x' },
    document: { getElementById: id => els[id] || (els[id] = el()), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, createElement: () => el(), body: el() },
    fetch: async u => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(root + u.split('?')[0], 'utf8')) }) };
  ctx.window = ctx; ctx.addEventListener = () => {};
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(new URL('fake-sb.js', import.meta.url), 'utf8'), ctx);
  const files = [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([a-z0-9-]+\.js)\?v=\d+"/g)].map(m => m[1]);
  for (const f of files) vm.runInContext(fs.readFileSync(root + f, 'utf8'), ctx, { filename: f });
  await new Promise(r => setTimeout(r, 400));
  return { ctx, run: code => vm.runInContext(code, ctx) };
}
