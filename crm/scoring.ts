
export function calcScore(lead: any): number {
  let score = 0;
  if (lead.email) score += 20;
  if (lead.company) score += 25;
  if (lead.phone) score += 10;
  if (lead.budget) score += 20;
  if (lead.message && lead.message.length > 20) score += 15;
  return Math.min(score, 100);
}
