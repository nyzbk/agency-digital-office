const { omniUrl } = require("./_lib/brain");
module.exports = async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: true, service: "ultimatum-floor", gateway: "/v1/chat/completions", omniConfigured: Boolean(omniUrl()) }));
};
