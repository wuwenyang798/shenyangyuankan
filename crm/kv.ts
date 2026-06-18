export async function getLeads(env: any) {
  const data = await env.CRM_KV.get("leads");
  return data ? JSON.parse(data) : [];
}

export async function saveLeads(env: any, leads: any[]) {
  await env.CRM_KV.put("leads", JSON.stringify(leads));
}
