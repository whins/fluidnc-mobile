import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    host: localStorage.getItem('fluidnc_host') || 'fluidnc.local',
    port: localStorage.getItem('fluidnc_port') || '80',
  }),

  getters: {
    baseUrl: (s) =>
      s.port && s.port !== '80'
        ? `http://${s.host}:${s.port}`
        : `http://${s.host}`,

    wsUrl: (s) =>
      s.port && s.port !== '80'
        ? `ws://${s.host}:${s.port}/ws`
        : `ws://${s.host}/ws`,
  },

  actions: {
    save() {
      localStorage.setItem('fluidnc_host', this.host)
      localStorage.setItem('fluidnc_port', this.port)
    },
  },
})
