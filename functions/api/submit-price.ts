import { createLead } from "../../src/crm/pipeline";

export async function POST({ request, env }) {
  const body = await request.json();

  const lead = await createLead(
    env,
    body,
    "price",
    request.url
  );

  return new Response(JSON.stringify({ success: true, lead }), {
    headers: { "Content-Type": "application/json" },
  });
}
