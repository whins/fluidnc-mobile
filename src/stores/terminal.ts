import { defineStore } from 'pinia'

export const useTerminalStore = defineStore('terminal', {
  state: () => ({
    lines: [] as string[],
    max: 300,
  }),

  actions: {
    push(line: string) {
      this.lines.push(line)
      if (this.lines.length > this.max) {
        this.lines.shift()
      }
    },
    clear() {
      this.lines = []
    },
  },
})
