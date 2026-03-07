export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.OPENAI_API_KEY) return json({ error: "Missing OPENAI_API_KEY in Cloudflare Pages environment variables." }, 500);
    const body = await request.json();
    const system = String(body?.system || "").trim();
    const input = String(body?.input || "").trim();
    if (!input) return json({ error: "Missing input." }, 400);
    const model = env.OPENAI_MODEL || "gpt-4.1-mini";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: [{ type: "input_text", text: system || "You are a helpful assistant." }] },
          { role: "user", content: [{ type: "input_text", text: input }] }
        ]
      })
    });
    const raw = await response.text();
    let data = {};
    try { data = JSON.parse(raw); } catch { data = { raw }; }
    if (!response.ok) return json({ error: data?.error?.message || data?.message || "OpenAI request failed.", model, details: data }, response.status);
    const outputText = data.output_text || (Array.isArray(data.output) ? data.output.flatMap((item) => item.content || []).filter((c) => c.type === "output_text").map((c) => c.text).join("\n").trim() : "");
    return json({ output_text: outputText || "No output returned.", model });
  } catch (error) {
    return json({ error: error?.message || "Unexpected server error." }, 500);
  }
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
