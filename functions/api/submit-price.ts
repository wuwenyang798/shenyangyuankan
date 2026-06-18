import { priceFormSchema, clean } from '../../src/utils/validateForm';
import { notifyAdminNewPriceRequest } from './_shared/notify-admin';

type RuntimeEnv = {
  DB?: D1Database;

  FEISHU_WEBHOOK_URL?: string;
  ADMIN_CONSOLE_URL?: string;

  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_NOTIFY_EMAILS?: string;
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    ...init
  });
}

function normalizeValue(
  value: FormDataEntryValue | string | undefined
) {
  return String(value ?? '').trim();
}

export const onRequestPost: PagesFunction<RuntimeEnv> = async ({
  request,
  env
}) => {
  try {
    // 检查数据库绑定
    if (!env.DB) {
      return json(
        {
          ok: false,
          message:
            '数据库未绑定，请检查 Cloudflare D1 配置。'
        },
        { status: 500 }
      );
    }

    // 获取表单数据
    const raw = Object.fromEntries(
      await request.formData()
    );

    // 参数验证
    const parsed = priceFormSchema.safeParse(
      clean(raw)
    );

    if (!parsed.success) {
      return json(
        {
          ok: false,
          message: '提交信息不完整或格式不正确',
          errors: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 保存询价记录
    const result = await env.DB.prepare(`
      INSERT INTO price_requests
      (
        name,
        company,
        contact,
        cargo_type,
        origin,
        destination,
        weight_volume,
        transport,
        remark,
        status,
        created_at,
        updated_at
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        '新询价',
        datetime('now'),
        datetime('now')
      )
    `)
      .bind(
        normalizeValue(data.name),
        normalizeValue(data.company),
        normalizeValue(data.contact),
        normalizeValue(data.cargoType),
        normalizeValue(data.origin),
        normalizeValue(data.destination),
        Number(data.weightVolume),
        normalizeValue(data.transport),
        normalizeValue(data.remark)
      )
      .run();

    const requestId =
      result.meta?.last_row_id ?? null;

    // 发送通知
    try {
      await notifyAdminNewPriceRequest(env, {
        id: requestId,
        name: normalizeValue(data.name),
        company: normalizeValue(data.company),
        contact: normalizeValue(data.contact),
        cargoType: normalizeValue(data.cargoType),
        origin: normalizeValue(data.origin),
        destination: normalizeValue(data.destination),
        weightVolume: String(
          data.weightVolume
        ),
        transport: normalizeValue(
          data.transport
        ),
        remark: normalizeValue(data.remark)
      });
    } catch (notifyError) {
      console.error(
        '询价通知发送失败:',
        notifyError
      );
    }

    // 返回成功
    return json({
      ok: true,
      id: requestId,
      message: `询价需求已提交，单号 #${
        requestId ?? '已生成'
      }。我们会尽快处理。`
    });
  } catch (error) {
    console.error(
      '询价提交异常:',
      error
    );

    return json(
      {
        ok: false,
        message: '系统繁忙，请稍后重试。'
      },
      {
        status: 500
      }
    );
  }
};