import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'shadcn-nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // lazily imported after first paint; pre-bundle so dev never re-optimises mid-session
      include: ['lenis', 'gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'gsap/DrawSVGPlugin', 'gsap/MotionPathPlugin', 'reka-ui', '@internationalized/date', 'zod'],
    },
  },

  app: {
    head: {
      titleTemplate: '%s · Al Fayzeen',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0B0B0C' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    public: {
      // Team-only: show slot id + search keyword on pending image skeletons. Never true in client demos.
      showAssetLabels: false,
    },
  },

  fonts: {
    defaults: {
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Cormorant', provider: 'google', global: true, weights: [400, 500, 600], styles: ['normal', 'italic'] },
      { name: 'Manrope', provider: 'google', global: true, weights: [400, 500, 600, 700] },
      { name: 'Reem Kufi', provider: 'google', global: true, weights: [400, 600], subsets: ['arabic', 'latin'] },
      { name: 'IBM Plex Sans Arabic', provider: 'google', global: true, weights: [400, 500], subsets: ['arabic'] },
      { name: 'Aref Ruqaa', provider: 'google', global: true, weights: [400, 700], subsets: ['arabic'] },
    ],
  },

  icon: {
    serverBundle: { collections: ['ph'] },
    clientBundle: { scan: true, sizeLimitKb: 256 },
  },

  image: {
    quality: 78,
    format: ['avif', 'webp'],
    screens: { xs: 390, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1440, '2xl': 1600 },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-GB', name: 'EN', dir: 'ltr', file: 'en.json' },
      { code: 'ar', language: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' },
    ],
    detectBrowserLanguage: false,
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  shadcn: {
    prefix: 'Ui',
    componentDir: '~/components/ui',
  },

  components: [
    // ui/ is registered by shadcn-nuxt (prefix "Ui")
    { path: '~/components', pathPrefix: false, ignore: ['ui/**'] },
  ],

  hooks: {
    // the component kit is a development tool only: never shipped
    'pages:extend'(pages) {
      if (process.env.NODE_ENV === 'production') {
        const i = pages.findIndex(p => p.path === '/_kit')
        if (i !== -1) pages.splice(i, 1)
      }
    },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
  },
})
