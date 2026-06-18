export async function sendFeishu(webhook: string, lead: any) {
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg_type: "text",
      content: {
        text:
          `🚀新线索\n` +
          `姓名: ${lead.name}\n` +
          `公司: ${lead.company}\n` +
          `评分: ${lead.score}\n` +
          `负责人: ${lead.owner}`,
      },
    }),
  });
}
