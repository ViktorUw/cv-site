// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

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
  vite: {
    plugins: [tailwindcss()]
  }
});
