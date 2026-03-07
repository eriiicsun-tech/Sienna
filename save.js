const PASSWORDS = new Set(["iamazing", "iamamazing"]);

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const password = String(body?.password || "");
    if (!PASSWORDS.has(password)) {
      return json({ error: "Wrong password." }, 401);
    }
    return json({ ok: true });
  } catch {
    return json({ error: "Login failed." }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}
