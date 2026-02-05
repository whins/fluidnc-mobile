<template>
  <div class="flex flex-col h-full">
    <!-- Log -->
    <div
      ref="logEl"
      class="flex-1 bg-black text-green-400 font-mono text-xs
             p-2 overflow-y-auto"
    >
      <div v-for="(line, i) in terminal.lines" :key="i">
        {{ line }}
      </div>
    </div>

    <!-- Input -->
    <div class="flex gap-2 p-2 bg-gray-800">
      <input
        v-model="cmd"
        @keydown.enter="send"
        placeholder="Enter G-code or $ command"
        class="flex-1 bg-gray-900 text-white px-2 py-1 rounded"
      />

      <button class="btn bg-blue-600" @click="send">
        Send
      </button>

      <button class="btn bg-gray-600" @click="terminal.clear">
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { fluidnc } from '@/api/fluidnc'
import { useTerminalStore } from '@/stores/terminal'

const terminal = useTerminalStore()
const cmd = ref('')
const logEl = ref<HTMLDivElement | null>(null)

function send() {
  if (!cmd.value.trim()) return

  fluidnc.send(cmd.value)
  terminal.push(`> ${cmd.value}`)
  cmd.value = ''
}

watch(
  () => terminal.lines.length,
  async () => {
    await nextTick()
    logEl.value?.scrollTo(0, logEl.value.scrollHeight)
  }
)
</script>

<style scoped>
@reference "tailwindcss";
.btn {
  @apply text-white px-3 py-1 rounded active:opacity-80;
}
</style>
