<template>
  <div class="app-shell">
    <!-- Screen-edge inner border shadow/glow indicating state -->
    <div class="status-glow" :class="statusClass" />

    <!-- Floating coordinates & state (only when connected) -->
    <div v-if="connected" class="floating-status">
      <UBadge
        :color="stateColor"
        variant="subtle"
        size="sm"
        class="state-badge"
      >
        {{ t(`status.state.${status.state}`) }}
      </UBadge>
      <div class="coords">
        <span class="coord"
          ><span class="coord-axis">X</span>{{ status.wpos.x.toFixed(2) }}</span
        >
        <span class="coord"
          ><span class="coord-axis">Y</span>{{ status.wpos.y.toFixed(2) }}</span
        >
      </div>
    </div>

    <!-- Page content -->
    <main class="page-content">
      <slot />
    </main>

    <!-- Bottom navigation -->
    <AppTabs />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";

const { $fluidnc } = useNuxtApp();
const { status, connected } = $fluidnc;
const { t } = useI18n();

const router = useRouter();
const route = useRoute();

// Short delay on initial mount to allow WS connection to establish
let initTimeout: any = null;
onMounted(() => {
  initTimeout = setTimeout(() => {
    if (!connected.value && route.path !== "/settings") {
      router.replace("/settings");
    }
  }, 1500); // 1.5 seconds grace period for initial connection
});

onUnmounted(() => {
  if (initTimeout) clearTimeout(initTimeout);
});

// Watch for subsequent connection status changes
watch(connected, (isConn) => {
  if (!isConn && route.path !== "/settings") {
    router.replace("/settings");
  }
});

const statusClass = computed(() => {
  if (!connected.value) return "status-glow--disconnected";
  if (status.state === "Alarm") return "status-glow--alarm";
  if (["Run", "Jog", "Home"].includes(status.state))
    return "status-glow--working";
  return "status-glow--idle";
});

const stateColor = computed(() => {
  switch (status.state) {
    case "Run":
      return "success";
    case "Jog":
      return "info";
    case "Hold":
      return "warning";
    case "Alarm":
      return "error";
    case "Home":
      return "info";
    default:
      return "neutral";
  }
});
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  position: relative;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Screen status glow overlay */
.status-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  box-shadow: inset 0 0 0 0 transparent;
}

/* Disconnected: Grey shadow */
.status-glow--disconnected {
  box-shadow: inset 0 0 26px rgba(100, 116, 139, 0.45);
  border: 2px solid rgba(100, 116, 139, 0.25);
}

/* Alarm: Red pulsing shadow */
.status-glow--alarm {
  box-shadow: inset 0 0 12px rgba(239, 68, 68, 0.4);
  border: 2px solid rgba(239, 68, 68, 0.4);
  animation: pulse-alarm 1.5s infinite alternate;
}

/* Working: Blue breathing shadow */
.status-glow--working {
  border: 2px solid rgba(59, 130, 246, 0.4);
  animation: breathe-working 2s infinite alternate;
}

/* Idle: Very subtle green/neutral glow or no shadow */
.status-glow--idle {
  box-shadow: inset 0 0 12px rgba(34, 197, 94, 0.12);
  border: 2px solid rgba(34, 197, 94, 0.08);
}

@keyframes pulse-alarm {
  0% {
    box-shadow: inset 0 0 12px rgba(239, 68, 68, 0.25);
  }
  100% {
    box-shadow: inset 0 0 24px rgba(239, 68, 68, 0.65);
  }
}

@keyframes breathe-working {
  0% {
    box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.25);
  }
  100% {
    box-shadow: inset 0 0 22px rgba(59, 130, 246, 0.6);
  }
}

/* Floating badge for coordinates & state */
.floating-status {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

/* Dark mode compatibility */
@media (prefers-color-scheme: dark) {
  .floating-status {
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
}

.state-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.coords {
  display: flex;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text);
}

.coord {
  display: flex;
  align-items: center;
}

.coord-axis {
  color: var(--ui-text-muted);
  font-size: 11px;
  margin-right: 3px;
}
</style>
