type NotifyEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_NOTIFY_EMAILS?: string;
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

function escapeHtml(value: string) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildEmailHtml(payload: PriceRequestPayload, adminUrl: string) {
  const rows = [
    ['询价单号', `#${payload.id ?? '已生成'}`],
    ['客户姓名', payload.name],
    ['公司名称', payload.company],
    ['联系方式', payload.contact],
    ['货物类型', payload.cargoType],
    ['起运地', payload.origin],
    ['目的地', payload.destination],
    ['重量/体积', payload.weightVolume],
    ['运输方式', payload.transport],
    ['备注', payload.remark || '无']
  ];

  return `
    <div style="font-family:Arial,'Microsoft YaHei',sans-serif;line-height:1.7;color:#111827;">
      <h2>收到新的询价需求</h2>
      <p>系统收到一条新的客户询价，请管理员尽快登录后台处理。</p>

      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #e5e7eb;padding:8px;background:#f9fafb;width:120px;">
              ${escapeHtml(label)}
            </td>
            <td style="border:1px solid #e5e7eb;padding:8px;">
              ${escapeHtml(value)}
            </td>
          </tr>
        `).join('')}
      </table>

      <p style="margin-top:20px;">
        <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;">
          前往后台处理
        </a>
      </p>
    </div>
  `;
}

export async function notifyAdminNewPriceRequest(
  env: NotifyEnv,
  payload: PriceRequestPayload
) {
  console.log('开始执行询价邮件通知');
  console.log('RESEND_API_KEY是否存在:', Boolean(env.RESEND_API_KEY));
  console.log('RESEND_FROM_EMAIL:', env.RESEND_FROM_EMAIL);
  console.log('ADMIN_NOTIFY_EMAILS:', env.ADMIN_NOTIFY_EMAILS);

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.ADMIN_NOTIFY_EMAILS) {
    console.warn('询价邮件通知未发送：缺少 RESEND_API_KEY、RESEND_FROM_EMAIL 或 ADMIN_NOTIFY_EMAILS');
    return;
  }

  const adminUrl = env.ADMIN_CONSOLE_URL || '/admin';

  const recipients = env.ADMIN_NOTIFY_EMAILS
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn('询价邮件通知未发送：ADMIN_NOTIFY_EMAILS 为空');
    return;
  }

  const subject = `【新询价通知】询价单 #${payload.id ?? '已生成'}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: recipients,
        subject,
        html: buildEmailHtml(payload, adminUrl)
      })
    });

    console.log('Resend状态:', response.status);

    const text = await response.text();
    console.log('Resend返回:', text);

    if (!response.ok) {
      console.error('询价邮件通知发送失败:', response.status, text);
    }
  } catch (error) {
    console.error('询价邮件通知异常:', error);
  }
}