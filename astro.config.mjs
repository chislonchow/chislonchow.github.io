import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { ui } from './src/i18n/ui'

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      // Alternatively, provide multiple themes
      // See note below for using dual light/dark themes
      themes: {
        light: 'poimandres',
        dark: 'catppuccin-latte',
      },
    },
  },    
  i18n: {
    defaultLocale: "en",
    locales: Object.keys(ui)
  },
  site: 'https://chislonchow.com'
})

