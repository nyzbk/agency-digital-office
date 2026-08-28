const { isOwner, json } = require("./_lib/auth");
const { mergeVault, presentIds } = require("./_lib/keys");
const { publicCatalog } = require("./_lib/catalog");
const { omniUrl } = require("./_lib/brain");
module.exports = async function handler(req, res) {
  if (!isOwner(req)) return json(res, 401, { ok: false, owner: false });
  return json(res, 200, { ok: true, owner: true, user: "nyzza", keys: presentIds(mergeVault({})), omni: { configured: Boolean(omniUrl()), url: omniUrl() || null }, catalog: publicCatalog() });
};
