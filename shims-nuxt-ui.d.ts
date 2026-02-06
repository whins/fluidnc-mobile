declare module '@nuxt/ui/vite' {
  import type { Plugin } from 'vite'
  const _default: () => Plugin | Plugin[]
  export default _default
}

declare module '@nuxt/ui/vue-plugin' {
  import type { App, Plugin } from 'vue'
  const _default: Plugin & { install?: (app: App) => void }
  export default _default
}
