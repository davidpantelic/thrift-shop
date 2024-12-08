// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: { port: 4000 },
  supabase: {
    redirect: false,
    // redirectOptions: {
    //   login: '/login',
    //   callback: '/confirm',
    //   include: undefined,
    //   exclude: [],
    //   cookieRedirect: false,
    // }
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://davidpantelic.github.io/base-css/css/style.css' },
      ],
    },
  },
  css: ['~/assets/scss/specific.scss'],
  modules: ['@nuxtjs/supabase', '@nuxt/icon'],
})