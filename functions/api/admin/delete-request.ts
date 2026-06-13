type RuntimeEnv = {
  DB?: D1Database;
  ADMIN_PASSWORD?: string;
};

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

export const onRequestPost: PagesFunction<RuntimeEnv> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) return json({ ok: false, message: '未授权，请输入后台密码。' }, { status: 401 });
  if (!env.DB) return json({ ok: false, message: '数据库未绑定。请绑定 D1，变量名为 DB。' }, { status: 500 });

  const body = await request.json().catch(() => null) as any;
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id <= 0) return json({ ok: false, message: '订单 ID 不正确。' }, { status: 400 });

  await env.DB.prepare('DELETE FROM price_requests WHERE id = ?').bind(id).run();
  return json({ ok: true, message: '订单已删除。' });
};
