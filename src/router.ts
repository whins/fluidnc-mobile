import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import FilesView from './views/FilesView.vue'
import TerminalView from './views/TerminalView.vue'
import SettingsView from './views/SettingsView.vue'



export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/files', component: FilesView },
        {
            path: '/terminal',
            component: TerminalView,
        },
        {
            path: '/settings',
            component: SettingsView,
        }

    ],
})
