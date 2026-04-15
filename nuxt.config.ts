// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@vueuse/nuxt", "@vite-pwa/nuxt"],

  css: ["~/assets/css/main.css"],

  // Nuxt UI handles color-mode automatically
  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },

  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "uk", name: "Українська", file: "uk.json" },
    ],
    defaultLocale: "en",
    langDir: "i18n/",
    strategy: "no_prefix",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "FluidNC Mobile",
      short_name: "FluidNC",
      description: "Mobile controller for FluidNC laser machines",
      theme_color: "#0f172a",
      background_color: "#0f172a",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: false,
    },
  },

  ssr: false, // SPA mode for Vercel static deploy
});
