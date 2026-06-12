import { cooperationFormSchema, clean } from '../../src/utils/validateForm';

export const onRequestPost: PagesFunction = async ({ request }) => {
  const raw = Object.fromEntries(await request.formData());
  const parsed = cooperationFormSchema.safeParse(clean(raw));
  if (!parsed.success) return Response.json({ ok: false, message: '提交信息不完整或格式不正确', errors: parsed.error.flatten() }, { status: 400 });
  return Response.json({ ok: true, message: '合作需求已提交，感谢联系。' });
};
