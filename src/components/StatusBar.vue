<template>
  <div class="px-4 py-2 bg-gray-800 flex justify-between items-center">
    <span
      class="font-bold"
      :class="color"
    >
      {{ machine.state }}
    </span>

    <span class="text-sm">
      X {{ machine.wpos[0].toFixed(2) }}
      Y {{ machine.wpos[1].toFixed(2) }}
      Z {{ machine.wpos[2].toFixed(2) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMachineStore } from '@/stores/machine'

const machine = useMachineStore()

const color = computed(() => ({
  Idle: 'text-green-400',
  Run: 'text-blue-400',
  Hold: 'text-yellow-400',
  Alarm: 'text-red-500',
  Door: 'text-red-500',
  Home: 'text-red-500',
  Jog: 'text-red-500',
}[machine.state] ?? 'text-gray-300'))
</script>
