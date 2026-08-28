const { PROVIDERS, FALLBACK_ORDER } = require("./catalog");
const breaker = new Map();
const sticky = { id: null, at: 0 };
const STICKY_MS = 10 * 60_000;
function tripped(id) { const t = breaker.get(id); return t && t > Date.now(); }
function trip(id, retryAfterSec) {
  const ms = Math.max(15, Number(retryAfterSec) || 90) * 1000;
  breaker.set(id, Date.now() + Math.min(ms, 5 * 60_000));
}
function order(prefer) {
  const list = [];
  if (prefer && FALLBACK_ORDER.includes(prefer)) list.push(prefer);
  if (sticky.id && Date.now() - sticky.at < STICKY_MS) list.push(sticky.id);
  for (const id of FALLBACK_ORDER) if (!list.includes(id)) list.push(id);
  return list;
}
function extractText(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  const c = data.choices && data.choices[0];
  if (c && c.message && c.message.content) return String(c.message.content);
  if (c && c.text) return String(c.text);
  if (data.output_text) return String(data.output_text);
  if (data.text) return String(data.text);
  return "";
}
async function callOpenAI(url, key, body) {
  const headers = { "content-type": "application/json" };
  if (key) headers.authorization = `Bearer ${key}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 55_000);
  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal });
    const raw = await res.text();
    let json = null;
    try { json = raw ? JSON.parse(raw) : null; } catch { json = { raw }; }
    return { ok: res.ok, status: res.status, json, raw, retryAfter: res.headers.get("retry-after") };
  } finally { clearTimeout(t); }
}
function omniUrl() {
  const u = (process.env.OMNI_GATEWAY_URL || "").replace(/\/$/, "");
  if (!u) return "";
  if (u.endsWith("/v1/chat/completions")) return u;
  if (u.endsWith("/v1")) return `${u}/chat/completions`;
  return `${u}/v1/chat/completions`;
}
async function tryProvider(id, messages, model, vault) {
  if (id === "omni") {
    const url = omniUrl();
    if (!url) return { skip: true, reason: "OMNI_GATEWAY_URL не задан" };
    const key = process.env.OMNI_GATEWAY_KEY || vault.omni || "";
    const r = await callOpenAI(url, key, { model: model && model !== "auto" ? model : "auto", messages, temperature: 0.4 });
    return { ...r, id, url };
  }
  const spec = PROVIDERS.find((p) => p.id === id);
  if (!spec || spec.id === "omni") return { skip: true, reason: "unknown" };
  const key = vault[spec.env] || vault[id] || "";
  if (spec.kind !== "keyless" && spec.auth === "bearer" && !key) return { skip: true, reason: "нет ключа" };
  const r = await callOpenAI(spec.base, key, { model: model && model !== "auto" ? model : spec.model, messages, temperature: 0.4 });
  return { ...r, id, url: spec.base };
}
async function complete({ messages, model, vault, prefer }) {
  const attempts = [];
  for (const id of order(prefer)) {
    if (tripped(id)) { attempts.push({ id, status: "breaker" }); continue; }
    let r;
    try { r = await tryProvider(id, messages, model, vault); }
    catch (err) { attempts.push({ id, status: 0, error: String(err.message || err) }); trip(id, 45); continue; }
    if (r.skip) { attempts.push({ id, status: "skip", reason: r.reason }); continue; }
    attempts.push({ id, status: r.status });
    if (r.ok) {
      const text = extractText(r.json);
      if (text) { sticky.id = id; sticky.at = Date.now(); return { ok: true, text, provider: id, model: (r.json && r.json.model) || model || "auto", raw: r.json, attempts }; }
    }
    if (r.status === 429 || r.status >= 500) trip(id, Number(r.retryAfter) || 90);
    if (r.status === 401 || r.status === 403) trip(id, 180);
  }
  return { ok: false, error: "Все хопы шлюза отказали", attempts };
}
module.exports = { complete, omniUrl, FALLBACK_ORDER };
