<template>
  <div class="p-4 space-y-4">
    <!-- Upload -->
    <input
      type="file"
      accept=".gcode,.nc,.txt"
      @change="onUpload"
      class="block w-full text-sm"
    />

    <!-- Files list -->
    <ul class="space-y-2">
      <li
        v-for="file in files"
        :key="file"
        class="flex justify-between items-center bg-gray-800 p-2 rounded"
      >
        <span class="truncate">{{ file }}</span>

        <button
          class="btn bg-green-600"
          @click="run(file)"
          :disabled="machine.state !== 'Idle'"
        >
          ▶ Run
        </button>
      </li>
    </ul>

    <!-- Controls -->
    <div class="flex gap-2">
      <button class="btn bg-yellow-600" @click="pause">
        ⏸ Pause
      </button>
      <button class="btn bg-blue-600" @click="resume">
        ▶ Resume
      </button>
      <button class="btn bg-red-600" @click="stop">
        ⏹ Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fluidnc } from '@/api/fluidnc'
import { useMachineStore } from '@/stores/machine'

const files = ref<string[]>([])
const machine = useMachineStore()

async function loadFiles() {
  files.value = await fluidnc.listFiles()
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  await fluidnc.uploadFile(input.files[0])
  await loadFiles()
}

function run(name: string) {
  fluidnc.runFile(name)
}

function pause() {
  fluidnc.pause()
}

function resume() {
  fluidnc.resume()
}

function stop() {
  fluidnc.stop()
}

onMounted(loadFiles)
</script>

<style scoped>
@reference "tailwindcss";
.btn {
  @apply text-white px-3 py-1 rounded
         active:opacity-80 disabled:opacity-40;
}
</style>
