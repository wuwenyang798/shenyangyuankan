import { KV } from "./kv";

export async function createLead(env: any, data: any, source: string, url: string) {
  const leads = await KV.getAll(env);

  const lead = {
    id: Date.now().toString(),

    ...data,

    source,
    page_url: url,

    status: "new",
    score: calcScore(data),
    owner: assignOwner(),

    created_at: Date.now(),
    updated_at: Date.now(),
  };

  leads.push(lead);

  await KV.saveAll(env, leads);

  return lead;
}
