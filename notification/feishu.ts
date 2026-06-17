
export async function sendFeishu(msg: any) {
  const webhook = process.env.FEISHU_WEBHOOK;
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });
}
