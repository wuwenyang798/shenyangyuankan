
import { LeadStore } from "./storage";
import { calcScore } from "./scoring";
import { assignOwner } from "./assign";

export async function createLead(data: any, source: string, url: string) {
  const lead = {
    id: Date.now().toString(),
    ...data,
    source,
    page_url: url,
    status: "new",
    score: 0,
    owner: "",
    created_at: Date.now(),
    updated_at: Date.now()
  };

  lead.score = calcScore(lead);
  lead.owner = assignOwner();

  LeadStore.insert(lead);

  return lead;
}
