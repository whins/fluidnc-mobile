<template>
  <div class="p-4 space-y-4">
    <h2 class="text-lg font-bold">Connection settings</h2>

    <div>
      <label class="block text-sm mb-1">Host (IP or mDNS)</label>
      <input
        v-model="settings.host"
        placeholder="fluidnc.local"
        class="input"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">Port</label>
      <input
        v-model="settings.port"
        placeholder="80"
        class="input"
      />
    </div>

    <button class="btn bg-blue-600" @click="apply">
      💾 Save & Reconnect
    </button>

    <p class="text-sm text-gray-400">
      Examples: <br />
      • fluidnc.local<br />
      • 192.168.1.50
    </p>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { fluidnc } from '@/api/fluidnc'

const settings = useSettingsStore()

function apply() {
  settings.save()
  fluidnc.setUrl(settings.wsUrl)
}
</script>

<style scoped>
@reference "tailwindcss";
.input {
  @apply w-full bg-gray-900 text-white px-3 py-2 rounded;
}
.btn {
  @apply text-white px-4 py-2 rounded active:opacity-80;
}
</style>
