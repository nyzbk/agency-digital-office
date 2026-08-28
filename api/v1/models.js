const { isOwner, deny, json } = require("../_lib/auth");
const { MODELS } = require("../_lib/catalog");
module.exports = async function handler(req, res) {
  if (!isOwner(req)) return deny(res);
  return json(res, 200, { object: "list", data: MODELS.map((m) => ({ id: m.id, object: "model", created: 0, owned_by: m.owned_by })) });
};
