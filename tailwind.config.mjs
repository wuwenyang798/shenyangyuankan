export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Microsoft YaHei', 'sans-serif'] },
      colors: {
        night: '#050816', panel: '#111827', line: '#1E293B', muted: '#94A3B8', brand: '#3B82F6', cyan: '#06B6D4'
      }
    }
  },
  plugins: []
};
