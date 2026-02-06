<template>
  <div
    ref="zone"
    class="h-40 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 select-none"
    @pointerdown="start"
    @pointermove="move"
    @pointerup="stop"
    @pointerleave="stop"
    @pointercancel="stop"
  >
    <span v-if="!active">Swipe to jog</span>
    <span v-else>{{ info }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { fluidnc } from "@/api/fluidnc";
import { useMachineStore } from "@/stores/machine";

const machine = useMachineStore();
const zone = ref<HTMLElement | null>(null);

const active = ref(false);
const startX = ref(0);
const startY = ref(0);
const dx = ref(0);
const dy = ref(0);

const feed = 2000;
const intervalMs = 120;
let timer: number | null = null;

function canJog() {
  return machine.state === "Idle" || machine.state === "Jog";
}

function start(e: PointerEvent) {
  if (!canJog()) return;

  active.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;

  sendJog();
  timer = window.setInterval(sendJog, intervalMs);
}

function move(e: PointerEvent) {
  if (!active.value) return;
  dx.value = e.clientX - startX.value;
  dy.value = startY.value - e.clientY; // інвертуємо Y
}

function stop() {
  active.value = false;
  dx.value = 0;
  dy.value = 0;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function sendJog() {
  const scale = 0.02; // чутливість
  const x = +(dx.value * scale).toFixed(2);
  const y = +(dy.value * scale).toFixed(2);

  if (x === 0 && y === 0) return;

  fluidnc.send(`$J=G91 X${x} Y${y} F${feed}`);
}

const info = computed(
  () => `X ${dx.value.toFixed(0)}  Y ${dy.value.toFixed(0)}`,
);
</script>
