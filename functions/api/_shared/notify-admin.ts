type NotifyEnv = {
  FEISHU_WEBHOOK_URL?: string;
  ADMIN_CONSOLE_URL?: string;
};

type PriceRequestPayload = {
  id?: number | string | null;
  name: string;
  company: string;
  contact: string;
  cargoType: string;
  origin: string;
  destination: string;
  weightVolume: string;
  transport: string;
  remark: string;
};

export async function notifyAdminNewPriceRequest(
  env: NotifyEnv,
  payload: PriceRequestPayload
) {
  if (!env.FEISHU_WEBHOOK_URL) {
    return;
  }

  const adminUrl = env.ADMIN_CONSOLE_URL || 'https://www.wwy88.sh.cn/admin';

  const text = [
    '【新询价通知】',
    '',
    `询价单号：#${payload.id ?? '已生成'}`,
    `客户姓名：${payload.name || '-'}`,
    `公司名称：${payload.company || '-'}`,
    `联系方式：${payload.contact || '-'}`,
    `货物类型：${payload.cargoType || '-'}`,
    `起运地：${payload.origin || '-'}`,
    `目的地：${payload.destination || '-'}`,
    `重量/体积：${payload.weightVolume || '-'}`,
    `运输方式：${payload.transport || '-'}`,
    `备注：${payload.remark || '无'}`,
    '',
    `请及时登录后台处理：${adminUrl}`
  ].join('\n');

  try {
    const response = await fetch(env.FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msg_type: 'text',
        content: {
          text
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('飞书通知发送失败:', response.status, errorText);
    }
  } catch (error) {
    console.error('飞书通知异常:', error);
  }
}