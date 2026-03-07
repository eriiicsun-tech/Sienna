const PASSWORDS = new Set(["iamazing", "iamamazing"]);
const KEY = "planner_state_v3";

export async function onRequestPost(context) {
  const password = context.request.headers.get("x-planner-password") || "";
  if (!PASSWORDS.has(password)) {
    return json({ error: "Unauthorized." }, 401);
  }
  if (!context.env.PLANNER_KV) {
    return json({ error: "Missing PLANNER_KV binding in Cloudflare Pages." }, 500);
  }

  try {
    const body = await context.request.json();
    const state = body?.state;
    if (!state) return json({ error: "Missing state." }, 400);
    await context.env.PLANNER_KV.put(KEY, JSON.stringify(state));
    return json({ ok: true });
  } catch {
    return json({ error: "Save failed." }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}
