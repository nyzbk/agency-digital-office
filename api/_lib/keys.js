function env(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : "";
}
function mergeVault(client) {
  const out = {
    nvidia: env("NVIDIA_NIM_API_KEY"),
    openrouter: env("OPENROUTER_API_KEY"),
    groq: env("GROQ_API_KEY"),
    gemini: env("GEMINI_API_KEY"),
    huggingface: env("HUGGINGFACE_API_KEY"),
    cerebras: env("CEREBRAS_API_KEY"),
    sambanova: env("SAMBANOVA_API_KEY"),
    xai: env("XAI_API_KEY"),
    deepseek: env("DEEPSEEK_API_KEY"),
    siliconflow: env("SILICONFLOW_API_KEY"),
    wafer: env("WAFER_API_KEY"),
    pollinations: env("POLLINATIONS_API_KEY"),
    together: env("TOGETHER_API_KEY"),
    mistral: env("MISTRAL_API_KEY"),
    omni: env("OMNI_GATEWAY_KEY"),
  };
  if (client && typeof client === "object") {
    for (const [k, v] of Object.entries(client)) if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}
function presentIds(vault) {
  return Object.entries(vault).filter(([, v]) => typeof v === "string" && v.length > 8).map(([k]) => k);
}
module.exports = { mergeVault, presentIds };
