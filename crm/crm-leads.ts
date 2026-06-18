import { KV } from "../../src/crm/kv";

export async function GET({}, env) {
  const leads = await KV.getAll(env);

  return new Response(JSON.stringify(leads));
}
