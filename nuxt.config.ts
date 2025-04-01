// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      baseUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt'
  ],

  css: [
    '@/assets/css/theme.css',
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'RGS Raya 2025',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Ready for a Raya photo shoot that\'s fun and effortless? Choose your theme, pick your ideal date and time, and share your details.' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'RGS Raya 2025',
      short_name: 'RGS Raya 2025',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: process.env.NODE_ENV === 'production',
      suppressWarnings: true,
      type: 'module'
    }
  },

  pages: true,
  
  compatibilityDate: '2025-01-06',

  nitro: {
    routeRules: {
      '/api/**': { 
        cache: false,
        swr: false
      }
    },
    externals: {
      inline: ['dayjs/plugin/utc.js', 'dayjs/plugin/timezone.js', 'dayjs/plugin/isSameOrAfter.js', 'dayjs/plugin/isSameOrBefore.js']
    },  
    plugins: ['~/server/middleware/cron.ts']
  }
})