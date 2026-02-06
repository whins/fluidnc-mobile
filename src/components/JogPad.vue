<template>
  <div class="grid grid-cols-3 gap-3 p-4 select-none">
    <!-- Y+ -->
    <button
      class="btn col-start-2"
      @pointerdown="startJog(0, step)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      ↑
    </button>

    <!-- X- -->
    <button
      class="btn"
      @pointerdown="startJog(-step, 0)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      ←
    </button>

    <div class="flex items-center justify-center text-sm text-gray-400">
      {{ step }} mm
    </div>

    <!-- X+ -->
    <button
      class="btn"
      @pointerdown="startJog(step, 0)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      →
    </button>

    <!-- Y- -->
    <button
      class="btn col-start-2"
      @pointerdown="startJog(0, -step)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      ↓
    </button>

    <!-- Z -->
    <button
      class="btn col-start-1"
      @pointerdown="startJogZ(step)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      Z+
    </button>

    <button
      class="btn col-start-3"
      @pointerdown="startJogZ(-step)"
      @pointerup="stopJog"
      @pointerleave="stopJog"
      @pointercancel="stopJog"
    >
      Z-
    </button>

    <!-- Step selector -->
    <div class="col-span-3 flex justify-center gap-2 mt-2">
      <button
        v-for="s in steps"
        :key="s"
        @click="step = s"
        class="px-3 py-1 rounded"
        :class="step === s ? 'bg-blue-600' : 'bg-gray-700'"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fluidnc } from '@/api/fluidnc'
import { useMachineStore } from '@/stores/machine'

const machine = useMachineStore()

const steps = [0.1, 1, 10]
const step = ref(1)
const feed = 2000
const intervalMs = 120

let jogTimer: number | null = null
let jogCmd = ''

function canJog() {
  return machine.state === 'Idle' || machine.state === 'Jog'
}

function startJog(x: number, y: number) {
  if (!canJog()) return

  jogCmd = `$J=G91 X${x} Y${y} F${feed}`
  sendJog()

  jogTimer = window.setInterval(sendJog, intervalMs)
}

function startJogZ(z: number) {
  if (!canJog()) return

  jogCmd = `$J=G91 Z${z} F${feed}`
  sendJog()

  jogTimer = window.setInterval(sendJog, intervalMs)
}

function sendJog() {
  fluidnc.send(jogCmd)
}

function stopJog() {
  if (jogTimer) {
    clearInterval(jogTimer)
    jogTimer = null
  }
}
</script>

<style scoped>
@reference "tailwindcss";
.btn {
  @apply bg-gray-700 active:bg-gray-600 text-white text-2xl
         rounded-lg h-16 flex items-center justify-center;
}
</style>
