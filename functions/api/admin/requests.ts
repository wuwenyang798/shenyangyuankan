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

export const onRequestGet: PagesFunction<RuntimeEnv> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) return json({ ok: false, message: '未授权，请输入后台密码。' }, { status: 401 });
  if (!env.DB) return json({ ok: false, message: '数据库未绑定。请绑定 D1，变量名为 DB。' }, { status: 500 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status') || '';
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(Number(url.searchParams.get('limit') || 200), 500);

  let sql = `SELECT * FROM price_requests`;
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (status && status !== '全部') {
    conditions.push('status = ?');
    params.push(status);
  }

  if (q) {
    conditions.push(`(
      name LIKE ? OR company LIKE ? OR contact LIKE ? OR origin LIKE ? OR destination LIKE ? OR cargo_type LIKE ? OR transport LIKE ? OR remark LIKE ? OR quoted_price LIKE ?
    )`);
    const kw = `%${q}%`;
    params.push(kw, kw, kw, kw, kw, kw, kw, kw, kw);
  }

  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;
  sql += ` ORDER BY id DESC LIMIT ?`;
  params.push(limit);

  const result = await env.DB.prepare(sql).bind(...params).all();
  return json({ ok: true, data: result.results ?? [] });
};
