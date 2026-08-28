const OMNI = {
  site: "https://omniroute.online/",
  repo: "https://github.com/diegosouzapw/OmniRoute",
  image: "diegosouzapw/omniroute:latest",
  port: 20128,
  providers: 350,
  freeTier: 90,
  freeForever: 56,
  tokensMonth: "≈1.51B",
};
const FCC = {
  repo: "https://github.com/Alishahryar1/free-claude-code",
  providers: 50,
  tokensMonth: "1.3B+",
  clients: ["Claude Code","Codex","Pi","OpenCode","Cline","Hermes","DeepSeek Harness","Grok Build","Muse Code","Aider"],
};
const PROVIDERS = [
  { id: "omni", name: "Свой шлюз OmniRoute", kind: "gateway", env: "OMNI_GATEWAY_URL", base: null, model: "auto", auth: "optional", free: true, note: "Первый хоп. Docker из deploy/omniroute." },
  { id: "openrouter", name: "OpenRouter", kind: "key", env: "openrouter", base: "https://openrouter.ai/api/v1/chat/completions", model: "openrouter/auto", auth: "bearer", free: true, note: ":free пул + авто" },
  { id: "nvidia", name: "NVIDIA NIM", kind: "key", env: "nvidia", base: "https://integrate.api.nvidia.com/v1/chat/completions", model: "meta/llama-3.1-70b-instruct", auth: "bearer", free: true, note: "FCC default backend" },
  { id: "groq", name: "Groq", kind: "key", env: "groq", base: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile", auth: "bearer", free: true, note: "Самый быстрый free" },
  { id: "huggingface", name: "Hugging Face Router", kind: "key", env: "huggingface", base: "https://router.huggingface.co/v1/chat/completions", model: "meta-llama/Llama-3.1-8B-Instruct", auth: "bearer", free: true, note: "Open-weight" },
  { id: "cerebras", name: "Cerebras", kind: "key", env: "cerebras", base: "https://api.cerebras.ai/v1/chat/completions", model: "llama-3.3-70b", auth: "bearer", free: true, note: "1M tok/day class" },
  { id: "gemini", name: "Google Gemini", kind: "gemini", env: "gemini", base: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.0-flash", auth: "bearer", free: true, note: "AI Studio" },
  { id: "deepseek", name: "DeepSeek", kind: "key", env: "deepseek", base: "https://api.deepseek.com/chat/completions", model: "deepseek-chat", auth: "bearer", free: true, note: "5M welcome tokens" },
  { id: "together", name: "Together", kind: "key", env: "together", base: "https://api.together.xyz/v1/chat/completions", model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", auth: "bearer", free: true, note: "signup credit" },
  { id: "siliconflow", name: "SiliconFlow", kind: "key", env: "siliconflow", base: "https://api.siliconflow.cn/v1/chat/completions", model: "deepseek-ai/DeepSeek-V3", auth: "bearer", free: true, note: "CN OpenAI-compat" },
  { id: "mistral", name: "Mistral", kind: "key", env: "mistral", base: "https://api.mistral.ai/v1/chat/completions", model: "mistral-small-latest", auth: "bearer", free: true, note: "EU" },
  { id: "sambanova", name: "SambaNova", kind: "key", env: "sambanova", base: "https://api.sambanova.ai/v1/chat/completions", model: "Meta-Llama-3.3-70B-Instruct", auth: "bearer", free: true, note: "fast llama" },
  { id: "pollinations", name: "Pollinations", kind: "keyless", env: "pollinations", base: "https://text.pollinations.ai/openai", model: "openai", auth: "optional", free: true, note: "keyless forever" },
  { id: "xai", name: "xAI Grok", kind: "key", env: "xai", base: "https://api.x.ai/v1/chat/completions", model: "grok-3-mini", auth: "bearer", free: false, note: "последний хоп" },
];
const FALLBACK_ORDER = ["omni","openrouter","nvidia","groq","huggingface","cerebras","gemini","deepseek","together","siliconflow","mistral","sambanova","pollinations","xai"];
const MODELS = [
  { id: "auto", owned_by: "ultimatum-gateway" },
  { id: "openrouter/auto", owned_by: "openrouter" },
  { id: "llama-3.3-70b-versatile", owned_by: "groq" },
  { id: "gemini-2.0-flash", owned_by: "google" },
  { id: "deepseek-chat", owned_by: "deepseek" },
  { id: "grok-3-mini", owned_by: "xai" },
];
function publicCatalog() {
  return {
    omni: OMNI,
    fcc: FCC,
    providers: PROVIDERS.map((p) => ({ id: p.id, name: p.name, kind: p.kind, free: p.free, note: p.note, model: p.model })),
    fallback: FALLBACK_ORDER,
    counts: { omniProviders: OMNI.providers, omniFreeTier: OMNI.freeTier, omniFreeForever: OMNI.freeForever, fccProviders: FCC.providers },
  };
}
module.exports = { OMNI, FCC, PROVIDERS, FALLBACK_ORDER, MODELS, publicCatalog };
