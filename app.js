const AGENTS = [
  { id: "michael", name: "Michael", title: "GOD / оркестратор", desk: "Corner", color: "#d4a017", service: "все 6 услуг + Q1/Q2", status: "working", mission: "Клон владельца. Эскалации: spend, LIVE, OF." },
  { id: "pam", name: "Pam", title: "Brand + Design", desk: "Studio", color: "#c9a0ff", service: "1 Бренд-идентити", status: "working", mission: "Токены и система. Центр Плофф / Атабек." },
  { id: "jim", name: "Jim", title: "$10k sites", desk: "Studio", color: "#7ec8ff", service: "2 Сайты $10k", status: "idle", mission: "PORT-10K, стоматология Алматы." },
  { id: "ryan", name: "Ryan", title: "Apps + Free Apps", desk: "Eng", color: "#2ee6a6", service: "3 Веб/моб + AdSense", status: "working", mission: "Один app = один репо = один чат." },
  { id: "kelly", name: "Kelly", title: "Ads + copy", desk: "Growth", color: "#ff8a6b", service: "4 Реклама (не OF)", status: "idle", mission: "Продуктовые + AI-influencer." },
  { id: "oscar", name: "Oscar", title: "Dashboards", desk: "Ops", color: "#9ad1a0", service: "5 Дашборды", status: "idle", mission: "Метрики агентства." },
  { id: "stanley", name: "Stanley", title: "SaaS research", desk: "Ops", color: "#8ab4ff", service: "6 SaaS $1B", status: "idle", mission: "Q2. Не блокирует Q1." },
  { id: "dwight", name: "Dwight", title: "QA + isolation", desk: "QA", color: "#e8a54b", service: "качество", status: "working", mission: "LIVE=false. Изоляция runtime." },
  { id: "toby", name: "Toby", title: "Legal + briefs", desk: "Legal", color: "#b7a892", service: "Q2 юр", status: "gate", mission: "Брифы под 6 услуг." },
  { id: "phyllis", name: "Phyllis", title: "Research", desk: "Research", color: "#d4b896", service: "research-deep", status: "idle", mission: "Why → What → How." },
  { id: "kevin", name: "Kevin", title: "Data / AdSense", desk: "Ops", color: "#f0c27b", service: "ADS-OS", status: "working", mission: "GSC Success → потом AdSense." },
  { id: "creed", name: "Creed", title: "Security", desk: "QA", color: "#a0a0a0", service: "hardening", status: "idle", mission: "Ключи только на сервере." }
];
const state = { owner: false, token: sessionStorage.getItem("ultimatum_owner") || "", view: "floor", agent: "michael", session: null, threads: {} };
function headers() {
  const h = { "content-type": "application/json" };
  if (state.token) { h["x-ultimatum-owner"] = state.token; h.authorization = "Bearer " + state.token; }
  return h;
}
async function api(path, opts) {
  const res = await fetch(path, { credentials: "include", ...opts, headers: { ...headers(), ...(opts && opts.headers) } });
  let data = {};
  try { data = await res.json(); } catch {}
  return { res, data };
}
function showHQ(on) {
  document.getElementById("gate").classList.toggle("hide", on);
  document.getElementById("hq").classList.toggle("hide", !on);
}
function setView(name) {
  state.view = name;
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.view === name));
  document.getElementById("view").innerHTML = ({ floor, agents, chat, providers, omni, keys }[name] || floor)();
  bindView();
}
function floor() {
  return `<p class="muted" style="letter-spacing:.08em;text-transform:uppercase;font-size:12px">Цифровой штаб агентства</p><h1>Пол</h1><p class="muted">Один репозиторий, один Vercel, один шлюз. OmniRoute/FCC — обязательный контур.</p><div class="grid" style="margin-top:18px">${AGENTS.map(card).join("")}</div>`;
}
function card(a) {
  return `<article class="card" data-open="${a.id}"><div><span class="dot" style="background:${a.color}"></span><strong>${a.name}</strong></div><div style="margin-top:6px">${a.title}</div><div class="meta">${a.service}<br>${a.mission}</div><div class="meta"><span class="pill">${a.status}</span> · ${a.desk}</div></article>`;
}
function agents() {
  return `<h1>Агенты</h1><p class="muted">12 ролей. Чат идёт с серверным промптом роли.</p><div class="grid" style="margin-top:18px">${AGENTS.map(card).join("")}</div>`;
}
function chat() {
  const a = AGENTS.find((x) => x.id === state.agent) || AGENTS[0];
  const hist = state.threads[a.id] || [];
  return `<h1>Чат</h1><div class="chat"><aside class="roster">${AGENTS.map((x) => `<button data-agent="${x.id}" class="${x.id === a.id ? "on" : ""}">${x.name}<div class="meta">${x.title}</div></button>`).join("")}</aside><section class="thread"><div style="padding:12px 14px;border-bottom:1px solid var(--line)"><strong>${a.name}</strong> · ${a.title}<div class="meta">${a.mission}</div></div><div class="msgs" id="msgs">${hist.map(bubble).join("") || `<div class="muted">Пусто. Задача уходит в /api/chat → /v1.</div>`}</div><form class="composer" id="ask"><textarea name="q" placeholder="Задача для ${a.name}" rows="2"></textarea><button class="act inline" type="submit">Отправить</button></form></section></div>`;
}
function bubble(m) {
  return `<div class="bubble ${m.role === "user" ? "me" : "bot"}">${escapeHtml(m.content)}${m.meta ? `<div class="meta">${escapeHtml(m.meta)}</div>` : ""}</div>`;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c]));
}
function providers() {
  const c = state.session && state.session.catalog;
  const rows = (c && c.providers) || [];
  return `<h1>Провайдеры</h1><p class="muted">OmniRoute ${c ? c.counts.omniProviders : "350"} / free ${c ? c.counts.omniFreeTier : "90"} / forever ${c ? c.counts.omniFreeForever : "56"} · FCC ${c ? c.counts.fccProviders : "50"}.</p><table><thead><tr><th>id</th><th>имя</th><th>тип</th><th>модель</th><th>заметка</th></tr></thead><tbody>${rows.map((p) => `<tr><td><code>${p.id}</code></td><td>${p.name}</td><td>${p.kind}${p.free ? " · free" : ""}</td><td>${p.model || ""}</td><td>${p.note || ""}</td></tr>`).join("")}</tbody></table>`;
}
function omni() {
  const o = state.session && state.session.omni;
  const live = location.origin;
  return `<h1>Шлюз</h1><div class="warn">Не опция. Первый хоп — OmniRoute на VPS при OMNI_GATEWAY_URL. Дальше FCC/free цепочка.</div><p style="margin-top:16px">Шлюз Vercel: <code>${live}/v1/chat/completions</code></p><p>OmniRoute VPS: <strong class="${o && o.configured ? "ok" : ""}">${o && o.configured ? "подключён" : "OMNI_GATEWAY_URL ещё не задан"}</strong></p><h2>Поднять OmniRoute из этого репо</h2><pre class="code">cd deploy/omniroute\ndocker compose up -d\n# Vercel env: OMNI_GATEWAY_URL=http://VPS:20128</pre><h2>Клиент</h2><pre class="code">Base URL: ${live}/v1\nAPI Key: сессия владельца или GATEWAY_TOKEN\nModel: auto</pre>`;
}
function keys() {
  const ids = (state.session && state.session.keys) || [];
  return `<h1>Ключи</h1><p class="muted">Бесплатные ключи на сервере через env. Ротация не нужна. Значения в UI не показываем.</p><p>Слоты: ${ids.length ? ids.map((k) => `<span class="pill">${k}</span>`).join(" ") : "нет env"}</p>`;
}
function bindView() {
  document.querySelectorAll("[data-open]").forEach((el) => { el.onclick = () => { state.agent = el.getAttribute("data-open"); setView("chat"); }; });
  document.querySelectorAll("[data-agent]").forEach((el) => { el.onclick = () => { state.agent = el.getAttribute("data-agent"); setView("chat"); }; });
  const form = document.getElementById("ask");
  if (!form) return;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const q = String(new FormData(form).get("q") || "").trim();
    if (!q) return;
    const id = state.agent;
    state.threads[id] = state.threads[id] || [];
    state.threads[id].push({ role: "user", content: q });
    setView("chat");
    const msgs = state.threads[id].filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    const { res, data } = await api("/api/chat", { method: "POST", body: JSON.stringify({ agentId: id, messages: msgs, model: "auto" }) });
    if (!res.ok) state.threads[id].push({ role: "assistant", content: data.error || "шлюз не ответил", meta: JSON.stringify(data.attempts || []) });
    else state.threads[id].push({ role: "assistant", content: data.text, meta: `${data.provider} · ${data.model}` });
    setView("chat");
    const box = document.getElementById("msgs");
    if (box) box.scrollTop = box.scrollHeight;
  };
}
async function boot() {
  const { res, data } = await api("/api/session");
  if (res.ok && data.owner) { state.owner = true; state.session = data; showHQ(true); setView("floor"); return; }
  showHQ(false);
}
document.getElementById("login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = document.getElementById("login-err");
  err.classList.add("hide");
  const { res, data } = await api("/api/login", { method: "POST", body: JSON.stringify({ username: document.getElementById("user").value, password: document.getElementById("pass").value }) });
  if (!res.ok) { err.textContent = data.error || "Отказ"; err.classList.remove("hide"); return; }
  if (data.token) { state.token = data.token; sessionStorage.setItem("ultimatum_owner", data.token); }
  await boot();
});
document.getElementById("nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b && b.dataset.view) setView(b.dataset.view);
});
document.getElementById("out").addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" });
  sessionStorage.removeItem("ultimatum_owner");
  state.token = ""; state.owner = false; showHQ(false);
});
setInterval(() => { const el = document.getElementById("clock"); if (el) el.textContent = new Date().toLocaleString("ru-RU"); }, 1000);
boot();
