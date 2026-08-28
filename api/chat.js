const { isOwner, deny, json, readBody } = require("./_lib/auth");
const { mergeVault } = require("./_lib/keys");
const { byId } = require("./_lib/agents");
const { complete } = require("./_lib/brain");
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
  if (!isOwner(req)) return deny(res);
  const body = await readBody(req);
  const agent = byId(body.agentId || "michael");
  const userMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = [{ role: "system", content: agent.prompt }, ...userMessages.filter((m) => m && m.role && m.content)];
  const result = await complete({ messages, model: body.model || "auto", vault: mergeVault(body.vault), prefer: body.prefer });
  if (!result.ok) return json(res, 502, result);
  return json(res, 200, { ok: true, agent: agent.id, text: result.text, provider: result.provider, model: result.model, attempts: result.attempts });
};
