const { clearOwnerCookie, json } = require("./_lib/auth");
module.exports = async function handler(req, res) {
  clearOwnerCookie(res);
  return json(res, 200, { ok: true });
};
