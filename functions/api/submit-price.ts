import { priceFormSchema, clean } from '../../src/utils/validateForm';
import { notifyAdminNewPriceRequest } from './api/_shared/notify-admin';

type RuntimeEnv = {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_NOTIFY_EMAILS?: string;
  ADMIN_CONSOLE_URL?: string;
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

  const requestId = result.meta?.last_row_id;

  await notifyAdminNewPriceRequest(env, {
    id: requestId,
    name: normalizeValue(data.name),
    company: normalizeValue(data.company),
    contact: normalizeValue(data.contact),
    cargoType: normalizeValue(data.cargoType),
    origin: normalizeValue(data.origin),
    destination: normalizeValue(data.destination),
    weightVolume: String(data.weightVolume),
    transport: normalizeValue(data.transport),
    remark: normalizeValue(data.remark)
  });

  return json({
    ok: true,
    id: requestId,
    message: `询价需求已提交，单号 #${requestId ?? '已生成'}。我们会尽快处理。`
  });
};