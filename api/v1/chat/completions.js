const { isOwner, deny, json, readBody } = require("../../_lib/auth");
const { mergeVault } = require("../../_lib/keys");
const { complete } = require("../../_lib/brain");
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Ultimatum-Owner");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  if (req.method !== "POST") return json(res, 405, { error: { message: "POST only" } });
  if (!isOwner(req)) return deny(res);
  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) return json(res, 400, { error: { message: "messages required" } });
  const result = await complete({ messages, model: body.model || "auto", vault: mergeVault(body.vault), prefer: body.prefer });
  if (!result.ok) return json(res, 502, { error: { message: result.error, attempts: result.attempts } });
  return json(res, 200, {
    id: "ult-" + Date.now(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: result.model,
    provider: result.provider,
    attempts: result.attempts,
    choices: [{ index: 0, message: { role: "assistant", content: result.text }, finish_reason: "stop" }],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  });
};
