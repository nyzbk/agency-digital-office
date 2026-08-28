const { isOwner, deny, json } = require("./_lib/auth");
const { publicCatalog } = require("./_lib/catalog");
const { AGENTS } = require("./_lib/agents");
module.exports = async function handler(req, res) {
  if (!isOwner(req)) return deny(res);
  return json(res, 200, { ok: true, ...publicCatalog(), agents: AGENTS });
};
