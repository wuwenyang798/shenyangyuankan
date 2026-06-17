
import { createLead } from "../../src/crm/pipeline";

export async function POST({ request }) {
  const body = await request.json();

  const lead = await createLead(
    body,
    "cooperation",
    request.url
  );

  return new Response(JSON.stringify({ success: true, lead }));
}
