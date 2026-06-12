import { z } from 'zod';

const contact = z.string().trim().regex(/(^1[3-9]\d{9}$)|(^[^\s@]+@[^\s@]+\.[^\s@]+$)/, '请输入手机号或邮箱');

export const priceFormSchema = z.object({
  name: z.string().trim().min(2).max(20),
  company: z.string().trim().max(50).optional().or(z.literal('')),
  contact,
  cargoType: z.string().trim().min(1),
  origin: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  weightVolume: z.coerce.number().positive(),
  transport: z.enum(['海运', '空运', '快递', '其他']),
  remark: z.string().trim().max(500).optional().or(z.literal(''))
});

export const cooperationFormSchema = z.object({
  name: z.string().trim().min(2).max(20),
  company: z.string().trim().max(50).optional().or(z.literal('')),
  cooperationType: z.string().trim().min(1),
  contact,
  message: z.string().trim().min(5).max(500)
});

export function clean(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, String(v ?? '').replace(/[<>]/g, '')]));
}
