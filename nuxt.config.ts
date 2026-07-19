// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      defaultIp: process.env.NUXT_PUBLIC_DEFAULT_IP || "192.168.1.152",
    },
  },

  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@vueuse/nuxt", "@vite-pwa/nuxt"],

  css: ["~/assets/css/main.css"],

  // Nuxt UI handles color-mode automatically
  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },

  // components: true,
  components: [
    {
      path: "~/components",
      pathPrefix: false, // Це дозволить використовувати <AppTabs /> замість <LayoutAppTabs />
    },
  ],

  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "uk", name: "Українська", file: "uk.json" },
    ],
    defaultLocale: "en",
    langDir: "./",
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
  experimental: {
    appManifest: false,
  },

  vite: {
    server: {
      proxy: {
        "/api": {
          target: `http://${process.env.NUXT_PUBLIC_DEFAULT_IP || "192.168.1.152"}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
  ssr: false, // SPA mode for Vercel static deploy
});
