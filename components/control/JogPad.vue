<template>
  <div class="jog-pad">
    <div class="step-selector">
      <span class="section-label">{{ t("control.step") }}</span>
      <div class="step-buttons">
        <UButton
          v-for="s in steps"
          :key="s"
          :variant="selectedStep === s ? 'solid' : 'outline'"
          :color="selectedStep === s ? 'primary' : 'neutral'"
          size="sm"
          @click="selectedStep = s"
        >
          {{ s }}
        </UButton>
      </div>
    </div>

    <div class="dpad-wrapper">
      <div class="dpad">
        <!-- Y+ (up) -->
        <button
          class="dpad-btn dpad-up"
          @click="jog('Y', selectedStep)"
          :disabled="!connected"
        >
          <UIcon name="i-heroicons-chevron-up" />
        </button>

        <!-- X- (left) -->
        <button
          class="dpad-btn dpad-left"
          @click="jog('X', -selectedStep)"
          :disabled="!connected"
        >
          <UIcon name="i-heroicons-chevron-left" />
        </button>

        <!-- Center: Home XY -->
        <button
          class="dpad-btn dpad-center"
          @click="homeAll"
          :disabled="!connected"
        >
          <UIcon name="i-heroicons-home" />
        </button>

        <!-- X+ (right) -->
        <button
          class="dpad-btn dpad-right"
          @click="jog('X', selectedStep)"
          :disabled="!connected"
        >
          <UIcon name="i-heroicons-chevron-right" />
        </button>

        <!-- Y- (down) -->
        <button
          class="dpad-btn dpad-down"
          @click="jog('Y', -selectedStep)"
          :disabled="!connected"
        >
          <UIcon name="i-heroicons-chevron-down" />
        </button>
      </div>
    </div>

    <!-- Axis labels -->
    <div class="axis-hint">
      <span>← X →</span>
      <span>↕ Y</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { jog, homeAll, connected } = $fluidnc;
const settings = useSettings();

const steps = [0.1, 1, 10, 100] as const;
const selectedStep = ref<number>(1);
</script>

<style scoped>
.jog-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.step-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.section-label {
  font-size: 12px;
  color: var(--ui-text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.step-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dpad-wrapper {
  display: flex;
  justify-content: center;
}

.dpad {
  display: grid;
  grid-template-columns: repeat(3, 72px);
  grid-template-rows: repeat(3, 72px);
  gap: 4px;
}

.dpad-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  color: var(--ui-text);
  cursor: pointer;
  transition:
    background 0.1s,
    transform 0.1s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  font-size: 0;
}

.dpad-btn:active:not(:disabled) {
  background: var(--ui-color-primary-500 / 0.15);
  transform: scale(0.93);
}

.dpad-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dpad-btn .icon {
  width: 28px;
  height: 28px;
}

.dpad-up {
  grid-column: 2;
  grid-row: 1;
}
.dpad-left {
  grid-column: 1;
  grid-row: 2;
}
.dpad-center {
  grid-column: 2;
  grid-row: 2;
  background: var(--ui-bg-accented);
}
.dpad-right {
  grid-column: 3;
  grid-row: 2;
}
.dpad-down {
  grid-column: 2;
  grid-row: 3;
}

.axis-hint {
  display: flex;
  gap: 24px;
  font-size: 11px;
  color: var(--ui-text-dimmed);
}
</style>
