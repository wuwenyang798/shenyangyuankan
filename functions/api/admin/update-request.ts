type RuntimeEnv = {
  DB?: D1Database;
  ADMIN_PASSWORD?: string;
};

const ALLOWED_STATUS = ['新询价', '处理中', '已报价', '已成交', '已关闭'];

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init
  });
}

function isAuthorized(request: Request, env: RuntimeEnv) {
  const password = env.ADMIN_PASSWORD;
  if (!password) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${password}`;
}

function cleanText(value: unknown, max = 500) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}

export const onRequestPost: PagesFunction<RuntimeEnv> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) return json({ ok: false, message: '未授权，请输入后台密码。' }, { status: 401 });
  if (!env.DB) return json({ ok: false, message: '数据库未绑定。请绑定 D1，变量名为 DB。' }, { status: 500 });

  const body = await request.json().catch(() => null) as any;
  const id = Number(body?.id);
  const status = cleanText(body?.status, 20) || '新询价';
  const quotedPrice = cleanText(body?.quotedPrice, 100);
  const internalNote = cleanText(body?.internalNote, 1000);

  if (!Number.isInteger(id) || id <= 0) return json({ ok: false, message: '订单 ID 不正确。' }, { status: 400 });
  if (!ALLOWED_STATUS.includes(status)) return json({ ok: false, message: '状态值不正确。' }, { status: 400 });

  await env.DB.prepare(`
    UPDATE price_requests
    SET status = ?, quoted_price = ?, internal_note = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(status, quotedPrice, internalNote, id).run();

  return json({ ok: true, message: '订单已更新。' });
};
