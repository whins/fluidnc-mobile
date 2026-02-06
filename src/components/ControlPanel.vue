<template>
  <div class="grid grid-cols-3 gap-3 p-4">
    <button
      class="btn bg-blue-600"
      @click="home"
      :disabled="!canHome"
    >
      🏠 Home
    </button>

    <button
      class="btn bg-yellow-600"
      @click="unlock"
      :disabled="!canUnlock"
    >
      🔓 Unlock
    </button>

    <button
      class="btn bg-red-600"
      @click="reset"
    >
      🔄 Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { fluidnc } from '@/api/fluidnc'
import { useMachineStore } from '@/stores/machine'

const machine = useMachineStore()

const canHome = computed(() =>
  machine.state === 'Idle' || machine.state === 'Alarm' || true
)

const canUnlock = computed(() =>
  machine.state === 'Alarm' || true
)

function home() {
  if (!canHome.value) return
  fluidnc.send('$H')
}

function unlock() {
  if (!canUnlock.value) return
  fluidnc.send('$X')
}

function reset() {
  // Reset дозволений завжди
  fluidnc.reset()
}
</script>

<style scoped>
.btn {
  /* @apply text-white text-lg font-semibold py-3 rounded-lg
         active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed; */
}
</style>
