import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://shenyang-yuankan.pages.dev',
  integrations: [mdx(), tailwind({ applyBaseStyles: false })],
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
