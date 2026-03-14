// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  devtools: { enabled: false }
})
