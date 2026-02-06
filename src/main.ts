import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { fluidnc } from '@/api/fluidnc'
import { useMachineStore } from '@/stores/machine'
import { router } from './router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

import { useTerminalStore } from '@/stores/terminal'
import { useSettingsStore } from '@/stores/settings'






const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(ui)

app.use(pinia)
const settings = useSettingsStore()
fluidnc.setUrl(settings.wsUrl)
app.mount('#app')

const store = useMachineStore()
const terminal = useTerminalStore()

fluidnc.onLog((line) => {
    terminal.push(line)
})

fluidnc.onStatus((status) => {
    store.update(status)
})



fluidnc.connect()
