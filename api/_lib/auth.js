const { createHmac, scryptSync, timingSafeEqual } = require("node:crypto");
const USER = process.env.OWNER_USER || "nyzza";
const PASS = process.env.OWNER_PASS || "1$@NnyzzaN@$1";
const COOKIE = "ultimatum_owner";
const MAX_AGE = 60 * 60 * 24 * 30;
const SECRET = scryptSync(`${USER}:${PASS}`, "ultimatum-floor-owner-v1", 32);
function sign(exp) {
  const payload = `${USER}.${exp}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
function parseCookie(header, name) {
  if (!header) return "";
  for (const part of String(header).split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}
function verifyOwnerToken(raw) {
  if (!raw) return false;
  const parts = String(raw).split(".");
  if (parts.length !== 3) return false;
  const [user, expStr] = parts;
  const exp = Number(expStr);
  if (user !== USER || !Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(raw, sign(exp));
}
function tokenFromReq(req) {
  const cookie = parseCookie(req.headers.cookie, COOKIE);
  const hdr = req.headers["x-ultimatum-owner"] || req.headers["x-owner-token"] || "";
  const auth = String(req.headers.authorization || "");
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  return cookie || hdr || bearer;
}
function isOwner(req) {
  const raw = tokenFromReq(req);
  if (verifyOwnerToken(raw)) return true;
  const gate = process.env.GATEWAY_TOKEN;
  if (gate && raw && safeEqual(raw, gate)) return true;
  return false;
}
function loginOwner(username, password) {
  if (!safeEqual(String(username || "").trim(), USER)) return null;
  if (!safeEqual(String(password || ""), PASS)) return null;
  return sign(Date.now() + MAX_AGE * 1000);
}
function setOwnerCookie(res, token) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`);
}
function clearOwnerCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
function deny(res) {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "Нет сессии владельца" }));
}
function json(res, code, body) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
module.exports = { USER, COOKIE, isOwner, loginOwner, setOwnerCookie, clearOwnerCookie, deny, json, readBody, verifyOwnerToken };
