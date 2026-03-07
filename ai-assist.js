const PASSWORD = "iamamazing";
const KEY = "planner_state_v3";
export async function onRequestGet(context) {
  const password = context.request.headers.get("x-planner-password") || "";
  if (password !== PASSWORD) return json({ error: "Unauthorized." }, 401);
  if (!context.env.PLANNER_KV) return json({ error: "Missing PLANNER_KV binding in Cloudflare Pages." }, 500);
  const raw = await context.env.PLANNER_KV.get(KEY);
  if (!raw) return json({ state: null });
  try { return json({ state: JSON.parse(raw) }); } catch { return json({ state: null }); }
}
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }); }
