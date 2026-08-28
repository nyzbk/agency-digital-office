const { loginOwner, setOwnerCookie, json, readBody } = require("./_lib/auth");
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
  const body = await readBody(req);
  const token = loginOwner(body.username, body.password);
  if (!token) return json(res, 401, { ok: false, error: "Неверный логин или пароль" });
  setOwnerCookie(res, token);
  return json(res, 200, { ok: true, token, user: "nyzza" });
};
