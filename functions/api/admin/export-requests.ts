type RuntimeEnv = {
  DB?: D1Database;
  ADMIN_PASSWORD?: string;
};

function isAuthorized(request: Request, env: RuntimeEnv) {
  const password = env.ADMIN_PASSWORD;
  if (!password) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${password}`;
}

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export const onRequestGet: PagesFunction<RuntimeEnv> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) {
    return new Response(JSON.stringify({ ok: false, message: '未授权，请输入后台密码。' }), {
      status: 401,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, message: '数据库未绑定。请绑定 D1，变量名为 DB。' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  const result = await env.DB.prepare('SELECT * FROM price_requests ORDER BY id DESC LIMIT 1000').all();
  const rows = result.results ?? [];
  const headers = ['ID', '姓名', '公司', '联系方式', '货物类型', '起运地', '目的地', '重量/体积', '运输方式', '状态', '报价', '备注', '内部备注', '创建时间', '更新时间'];
  const body = rows.map((row: any) => [
    row.id,
    row.name,
    row.company,
    row.contact,
    row.cargo_type,
    row.origin,
    row.destination,
    row.weight_volume,
    row.transport,
    row.status,
    row.quoted_price,
    row.remark,
    row.internal_note,
    row.created_at,
    row.updated_at
  ].map(csvEscape).join(',')).join('\n');

  const csv = `\uFEFF${headers.map(csvEscape).join(',')}\n${body}`;
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="price-requests.csv"'
    }
  });
};
