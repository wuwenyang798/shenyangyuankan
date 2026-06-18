export function calcScore(data: any) {
  let score = 0;

  if (data.email) score += 20;
  if (data.company) score += 25;
  if (data.phone) score += 10;
  if (data.budget) score += 20;
  if (data.message?.length > 20) score += 15;

  return Math.min(score, 100);
}
