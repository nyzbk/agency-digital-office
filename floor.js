const AGENTS = [
  { id:"michael", name:"Michael", role:"GOD / оркестратор", svc:"все 6 услуг + Q1/Q2", status:"working", room:"ceo", color:"#d4a017", say:"Матрица Эйзенхауэра. Q1 живой." },
  { id:"pam", name:"Pam", role:"Brand + Design", svc:"1 Бренд-идентити", status:"working", room:"studio", color:"#c9a0ff", say:"токены, не макет ради макета" },
  { id:"jim", name:"Jim", role:"$10k sites", svc:"2 Сайты $10k", status:"idle", room:"studio", color:"#7ec8ff", say:"PORT-10K / стоматология Алматы" },
  { id:"ryan", name:"Ryan", role:"Apps + Free Apps", svc:"3 Веб/моб + AdSense", status:"working", room:"eng", color:"#2ee6a6", say:"один app = один репо = один чат" },
  { id:"kelly", name:"Kelly", role:"Ads + copy", svc:"4 Реклама (не OF)", status:"idle", room:"growth", color:"#ff8a6b", say:"продуктовые + AI-influencer" },
  { id:"oscar", name:"Oscar", role:"Dashboards", svc:"5 Дашборды", status:"idle", room:"ops", color:"#9ad1a0", say:"метрики агентства" },
  { id:"stanley", name:"Stanley", role:"SaaS research", svc:"6 SaaS $1B", status:"idle", room:"ops", color:"#8ab4ff", say:"Q2. Не блокирует Q1." },
  { id:"dwight", name:"Dwight", role:"QA + isolation", svc:"качество", status:"working", room:"qa", color:"#e8a54b", say:"LIVE=false" },
  { id:"toby", name:"Toby", role:"Legal + briefs", svc:"Q2", status:"gate", room:"legal", color:"#b7a892", say:"юр. пакет" },
  { id:"phyllis", name:"Phyllis", role:"Research", svc:"research-deep", status:"idle", room:"research", color:"#d4b896", say:"Why → What → How" },
  { id:"kevin", name:"Kevin", role:"Data / AdSense", svc:"ADS-OS", status:"working", room:"ops", color:"#f0c27b", say:"pub-7636435144500691" },
  { id:"creed", name:"Creed", role:"Security", svc:"hardening", status:"idle", room:"qa", color:"#a0a0a0", say:"секреты не в git" }
];
const ROOMS = [
  { id:"ceo", title:"Corner / GOD", x:8, y:8, w:180, h:140 },
  { id:"studio", title:"Brand + $10k", x:200, y:8, w:280, h:160 },
  { id:"eng", title:"Apps / Free Apps", x:490, y:8, w:220, h:160 },
  { id:"growth", title:"Ads / Traffic", x:8, y:168, w:200, h:150 },
  { id:"ops", title:"Dash / SaaS / Ads OS", x:220, y:180, w:300, h:170 },
  { id:"qa", title:"QA + Security", x:530, y:180, w:180, h:170 },
  { id:"legal", title:"Legal / Briefs", x:8, y:330, w:200, h:120 },
  { id:"research", title:"Research", x:220, y:360, w:220, h:90 }
];
const TASKS = [
  { id:"T-Q1-01", owner:"ryan", title:"Free Apps → Site Ready", q:"Q1", status:"in-flight", gate:"GSC Success before AdSense" },
  { id:"T-Q1-02", owner:"jim", title:"PORT-10K E Brand Pack x15", q:"Q1", status:"queued", gate:"no demo until pack x3 + pick 3" },
  { id:"T-Q1-03", owner:"pam", title:"Бренд Атабек / Центр Плофф", q:"Q1", status:"queued", gate:"owner picks direction" },
  { id:"T-Q2-01", owner:"toby", title:"Юр + брифы 6 услуг", q:"Q2", status:"blocked", gate:"human" }
];
const GATES = [
  { level:"STOP", text:"Spend / новые подписки — только владелец." },
  { level:"STOP", text:"Destructive ops — HITL." },
  { level:"STOP", text:"AdSense LIVE=true до Site Ready + GSC Success запрещен." },
  { level:"STOP", text:"OnlyFans запрет." },
  { level:"STOP", text:"Два Free App в одном workspace запрещен." },
  { level:"ASK", text:"Смена scope / цены / обещания." },
  { level:"AUTO", text:"Standup, inbox, черновики." }
];
function renderFloor(){
  const el=document.getElementById("floor");
  el.innerHTML=ROOMS.map(r=>`<div class="room" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"><h3>${r.title}</h3><div id="r-${r.id}"></div></div>`).join("");
  AGENTS.forEach(a=>{
    const box=document.getElementById("r-"+a.room); if(!box) return;
    const d=document.createElement("div"); d.className="agent "+a.status;
    d.innerHTML=`<div class="av" style="background:${a.color}">${a.name.slice(0,1)}</div><div class="nm">${a.name}</div><div class="st">${a.status}</div>`;
    d.onclick=()=>selectAgent(a.id); box.appendChild(d);
  });
}
let selected="michael";
function selectAgent(id){ selected=id; showTab("god", AGENTS.find(x=>x.id===id)); }
const panes={
  god(a){ a=a||AGENTS.find(x=>x.id===selected);
    return `<h2>${a.name} · ${a.role}</h2><div class="warnbox">Командная поверхность. CLI-работники живут в Munder Difflin на машине владельца. Vercel не запускает node-pty.</div><div class="card ok"><b>Услуга:</b> ${a.svc}<br><b>Сейчас:</b> ${a.say}</div><h3>Очередь GOD</h3><textarea id="msg" rows="4"></textarea><p><button class="act" onclick="queueMsg()">В очередь</button></p><div class="log" id="godlog">Standing by. Founder-gated items stay blocked.</div>`; },
  roster(){ return `<h2>Roster</h2>`+AGENTS.map(a=>`<div class="card"><b>${a.name}</b> — ${a.role}<div class="row"><span>${a.svc}</span><span>${a.status}</span></div></div>`).join(""); },
  tasks(){ return `<h2>Доска</h2>`+TASKS.map(t=>`<div class="card ${t.status==="blocked"?"gate":"ok"}"><b>${t.id}</b> ${t.title}<div class="row"><span>${t.q} · ${t.owner}</span><span>${t.status}</span></div><div>Gate: ${t.gate}</div></div>`).join(""); },
  hive(){ return `<h2>Hive</h2><pre>hive/PROTOCOL.md\nhive/registry.json\nhive/board.md\nhive/tasks.json\nhive/agents/<id>/inbox|outbox</pre><div class="card">Один коммитер. Агенты пишут файлы.</div>`; },
  gates(){ return `<h2>Gates</h2>`+GATES.map(g=>`<div class="card ${g.level==="STOP"?"bad":g.level==="ASK"?"gate":"ok"}"><b>${g.level}</b> — ${g.text}</div>`).join(""); },
  install(){ return `<h2>Install</h2><div class="card"><pre>git clone https://github.com/chaitanyagiri/munder-difflin.git\ncd munder-difflin\nnpm install\nnpm run dev</pre>Импорт hire JSON из /hires</div>`; }
};
function showTab(name, agent){
  document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("on", b.dataset.tab===name));
  document.getElementById("pane").innerHTML=panes[name](agent);
}
document.getElementById("tabs").onclick=e=>{ const b=e.target.closest("button"); if(b) showTab(b.dataset.tab); };
function queueMsg(){
  const t=(document.getElementById("msg").value||"").trim()||"(пусто)";
  document.getElementById("godlog").textContent="QUEUED → michael outbox\n"+t+"\n\nНа Vercel это демо. Боевая очередь — hive на диске harness.";
}
function tick(){ document.getElementById("clock").textContent="FLOOR LIVE · "+new Date().toLocaleTimeString("ru-RU"); }
renderFloor(); showTab("god"); tick(); setInterval(tick,1000);
