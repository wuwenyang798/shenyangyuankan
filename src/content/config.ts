import { defineCollection, z } from 'astro:content';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  category: z.enum(['AI', '跨境电商', '跨境物流']),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
  draft: z.boolean().default(false)
});

export const collections = {
  ai: defineCollection({ type: 'content', schema: articleSchema }),
  ecommerce: defineCollection({ type: 'content', schema: articleSchema }),
  logistics: defineCollection({ type: 'content', schema: articleSchema })
};
