<template>
  <div v-if="isRunning" class="job-progress">
    <div class="job-header">
      <UIcon name="i-heroicons-play-circle" class="job-icon" />
      <span class="job-label">{{ t("files.running") }}: {{ currentFile }}</span>
      <span class="job-percent">{{ sdPercent?.toFixed(1) }}%</span>
    </div>

    <UProgress :value="sdPercent ?? 0" :max="100" color="primary" size="sm" />

    <div class="job-meta">
      <span class="state-label">{{ t(`status.state.${state}`) }}</span>
      <div class="job-controls">
        <UButton
          icon="i-heroicons-pause"
          size="xs"
          color="warning"
          variant="ghost"
          @click="feedHold"
        />
        <UButton
          icon="i-heroicons-play"
          size="xs"
          color="success"
          variant="ghost"
          @click="cycleStart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { status, feedHold, cycleStart } = $fluidnc;

const props = defineProps<{ currentFile?: string }>();

const isRunning = computed(
  () => status.state === "Run" && status.sdPercent !== null,
);

const sdPercent = computed(() => status.sdPercent);
const state = computed(() => status.state);
</script>

<style scoped>
.job-progress {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.job-icon {
  width: 18px;
  height: 18px;
  color: var(--ui-color-success-500);
  flex-shrink: 0;
}

.job-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-percent {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ui-color-primary-500);
  min-width: 44px;
  text-align: right;
}

.job-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.state-label {
  font-size: 12px;
  color: var(--ui-text-muted);
}

.job-controls {
  display: flex;
  gap: 4px;
}
</style>
