<template>
  <header class="status-bar">
    <!-- Connection indicator -->
    <div class="connection">
      <span class="dot" :class="connected ? 'dot--online' : 'dot--offline'" />
      <span class="connection-label">
        {{ connected ? t("status.connected") : t("status.disconnected") }}
      </span>
    </div>

    <!-- Machine state badge -->
    <UBadge :color="stateColor" variant="subtle" size="sm" class="state-badge">
      {{ t(`status.state.${status.state}`) }}
    </UBadge>

    <!-- Position -->
    <div class="position" v-if="connected">
      <span class="pos-axis"
        >X<span class="pos-val">{{ status.wpos.x.toFixed(2) }}</span></span
      >
      <span class="pos-axis"
        >Y<span class="pos-val">{{ status.wpos.y.toFixed(2) }}</span></span
      >
    </div>
  </header>
</template>

<script setup lang="ts">
const { $fluidnc } = useNuxtApp();
const { status, connected } = $fluidnc;
const { t } = useI18n();

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
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
  flex-shrink: 0;
  min-height: 44px;
}

.connection {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--online {
  background: var(--ui-color-success-500);
  box-shadow: 0 0 6px var(--ui-color-success-500);
}

.dot--offline {
  background: var(--ui-color-neutral-400);
}

.connection-label {
  font-size: 12px;
  color: var(--ui-text-muted);
}

.state-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.position {
  margin-left: auto;
  display: flex;
  gap: 10px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.pos-axis {
  color: var(--ui-text-muted);
}

.pos-val {
  color: var(--ui-text);
  margin-left: 3px;
  font-weight: 500;
}
</style>
