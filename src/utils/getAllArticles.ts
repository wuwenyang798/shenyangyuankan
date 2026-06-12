import { getCollection } from 'astro:content';

export const sectionMap = {
  ai: { label: 'AI', path: '/ai/' },
  ecommerce: { label: '跨境电商', path: '/ecommerce/' },
  logistics: { label: '跨境物流', path: '/logistics/' }
} as const;

export type SectionKey = keyof typeof sectionMap;

export async function getAllArticles() {
  const groups = await Promise.all([
    getCollection('ai'),
    getCollection('ecommerce'),
    getCollection('logistics')
  ]);
  return groups.flat().filter((item) => !item.data.draft).sort((a, b) => +b.data.date - +a.data.date);
}

export function articleUrl(article: { collection: string; slug: string }) {
  return `/${article.collection}/${article.slug}/`;
}

export function getAllTags(articles: Awaited<ReturnType<typeof getAllArticles>>) {
  return Array.from(new Set(articles.flatMap((article) => article.data.tags))).sort();
}

export function categorySlug(category: string) {
  return encodeURIComponent(category);
}
