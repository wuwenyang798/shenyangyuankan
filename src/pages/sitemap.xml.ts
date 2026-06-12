import { getAllArticles, articleUrl, getAllTags } from '../utils/getAllArticles';

const SITE = 'https://shenyang-yuankan.pages.dev';

export async function GET() {
  const articles = await getAllArticles();
  const categories = Array.from(new Set(articles.map((a) => a.data.category)));
  const tags = getAllTags(articles);
  const paths = [
    '/', '/ai/', '/ecommerce/', '/logistics/', '/pricing/', '/cooperation/', '/about/',
    ...articles.map(articleUrl),
    ...categories.map((c) => `/categories/${c}/`),
    ...tags.map((t) => `/tags/${t}/`)
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE}${encodeURI(p)}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
