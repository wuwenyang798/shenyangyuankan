import { priceFormSchema, clean } from '../../src/utils/validateForm';

type RuntimeEnv = {
  DB?: D1Database;
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init
  });
}

function normalizeValue(value: FormDataEntryValue | string | undefined) {
  return String(value ?? '').trim();
}

export const onRequestPost: PagesFunction<RuntimeEnv> = async ({ request, env }) => {
  if (!env.DB) {
    return json({ ok: false, message: '数据库未绑定。请在 Cloudflare Pages 中绑定 D1，变量名必须是 DB。' }, { status: 500 });
  }

  const raw = Object.fromEntries(await request.formData());
  const parsed = priceFormSchema.safeParse(clean(raw));

  if (!parsed.success) {
    return json({ ok: false, message: '提交信息不完整或格式不正确', errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const result = await env.DB.prepare(`
    INSERT INTO price_requests
      (name, company, contact, cargo_type, origin, destination, weight_volume, transport, remark, status, created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, '新询价', datetime('now'), datetime('now'))
  `).bind(
    normalizeValue(data.name),
    normalizeValue(data.company),
    normalizeValue(data.contact),
    normalizeValue(data.cargoType),
    normalizeValue(data.origin),
    normalizeValue(data.destination),
    Number(data.weightVolume),
    normalizeValue(data.transport),
    normalizeValue(data.remark)
  ).run();

  return json({
    ok: true,
    id: result.meta?.last_row_id,
    message: `询价需求已提交，单号 #${result.meta?.last_row_id ?? '已生成'}。我们会尽快处理。`
  });
};
