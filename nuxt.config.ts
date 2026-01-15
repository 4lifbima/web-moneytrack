// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'Dompetin - Money Tracker',
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Dompetin - Aplikasi pencatat keuangan pribadi yang simpel dan mudah digunakan. Catat pemasukan, pengeluaran, dan pantau statistik keuanganmu.' },
        { name: 'theme-color', content: '#f59105' },
        { name: 'author', content: 'Alif Bima Pradana' },
        { name: 'keywords', content: 'money tracker, pencatat keuangan, aplikasi keuangan, dompetin, budget tracker, expense tracker' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Dompetin - Money Tracker' },
        { property: 'og:description', content: 'Aplikasi pencatat keuangan pribadi yang simpel dan mudah digunakan. Catat pemasukan, pengeluaran, dan pantau statistik keuanganmu.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'Dompetin' },
        { property: 'og:locale', content: 'id_ID' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Dompetin - Money Tracker' },
        { name: 'twitter:description', content: 'Aplikasi pencatat keuangan pribadi yang simpel dan mudah digunakan.' },
        { name: 'twitter:image', content: '/og-image.png' },

        // Apple
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Dompetin' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/png', href: '/Dompetin.png' },
        { rel: 'apple-touch-icon', href: '/Dompetin.png' },
        // Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
})
