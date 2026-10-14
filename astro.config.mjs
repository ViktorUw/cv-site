// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Used for canonical and hreflang links.
  // TODO (stage 7): replace with the real address after deploying to Vercel
  site: 'https://viktor-vasylyshyn.vercel.app',

  i18n: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
    // English lives at /, Polish at /pl/
    routing: { prefixDefaultLocale: false },
  },

  // The CSS is small (~6 KB gzipped), so it goes straight into the HTML
  // instead of being a separate, render-blocking request.
  build: { inlineStylesheets: 'always' },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    // Marks / and /pl/ as translations of each other
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', pl: 'pl' } } }),
  ]
});