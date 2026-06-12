import { priceFormSchema, clean } from '../../src/utils/validateForm';

export const onRequestPost: PagesFunction = async ({ request }) => {
  const raw = Object.fromEntries(await request.formData());
  const parsed = priceFormSchema.safeParse(clean(raw));
  if (!parsed.success) return Response.json({ ok: false, message: '提交信息不完整或格式不正确', errors: parsed.error.flatten() }, { status: 400 });
  return Response.json({ ok: true, message: '询价需求已提交，我们会尽快处理。' });
};
