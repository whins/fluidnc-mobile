<template>
  <div class="overrides">
    <!-- Feedrate override -->
    <div class="override-row">
      <div class="override-header">
        <UIcon name="i-heroicons-bolt" class="override-icon" />
        <span class="override-label">{{ t("control.feedrate") }}</span>
        <span class="override-value">{{ feedratePercent }}%</span>
      </div>
      <div class="slider-with-buttons">
        <UButton
          icon="i-heroicons-minus"
          size="xs"
          color="neutral"
          variant="outline"
          :disabled="!connected || feedratePercent <= 10"
          @click="adjustFeedrate(-10)"
        />
        <input
          type="range"
          min="10"
          max="200"
          step="1"
          v-model.number="feedratePercent"
          class="slider"
          :disabled="!connected"
          @change="applyFeedrate"
        />
        <UButton
          icon="i-heroicons-plus"
          size="xs"
          color="neutral"
          variant="outline"
          :disabled="!connected || feedratePercent >= 200"
          @click="adjustFeedrate(10)"
        />
      </div>
      <div class="preset-buttons">
        <UButton
          v-for="p in feedratePresets"
          :key="p"
          size="xs"
          :variant="feedratePercent === p ? 'solid' : 'ghost'"
          :color="feedratePercent === p ? 'primary' : 'neutral'"
          @click="setFeedrate(p)"
          :disabled="!connected"
        >
          {{ p }}%
        </UButton>
      </div>
    </div>

    <USeparator />

    <!-- Laser power override -->
    <div class="override-row">
      <div class="override-header">
        <UIcon
          name="i-heroicons-fire"
          class="override-icon override-icon--laser"
        />
        <span class="override-label">{{ t("control.laserPower") }}</span>
        <span class="override-value">{{ laserPercent }}%</span>
      </div>
      <div class="slider-with-buttons">
        <UButton
          icon="i-heroicons-minus"
          size="xs"
          color="neutral"
          variant="outline"
          :disabled="!connected || laserPercent <= 0"
          @click="adjustLaser(-10)"
        />
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          v-model.number="laserPercent"
          class="slider slider--laser"
          :disabled="!connected"
          @change="applyLaser"
        />
        <UButton
          icon="i-heroicons-plus"
          size="xs"
          color="neutral"
          variant="outline"
          :disabled="!connected || laserPercent >= 100"
          @click="adjustLaser(10)"
        />
      </div>
      <div class="preset-buttons">
        <UButton
          v-for="p in laserPresets"
          :key="p"
          size="xs"
          :variant="laserPercent === p ? 'solid' : 'ghost'"
          :color="laserPercent === p ? 'warning' : 'neutral'"
          @click="setLaser(p)"
          :disabled="!connected"
        >
          {{ p }}%
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { setFeedrateOverride, setLaserOverride, connected } = $fluidnc;

const feedratePercent = ref(100);
const laserPercent = ref(100);

const feedratePresets = [50, 75, 100, 125];
const laserPresets = [25, 50, 75, 100];

async function applyFeedrate() {
  await setFeedrateOverride(feedratePercent.value);
}

async function applyLaser() {
  await setLaserOverride(laserPercent.value);
}

async function adjustFeedrate(delta: number) {
  feedratePercent.value = Math.max(
    10,
    Math.min(200, feedratePercent.value + delta),
  );
  await applyFeedrate();
}

async function adjustLaser(delta: number) {
  laserPercent.value = Math.max(0, Math.min(100, laserPercent.value + delta));
  await applyLaser();
}

async function setFeedrate(val: number) {
  feedratePercent.value = val;
  await applyFeedrate();
}

async function setLaser(val: number) {
  laserPercent.value = val;
  await applyLaser();
}
</script>

<style scoped>
.overrides {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.override-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.override-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.override-icon {
  width: 18px;
  height: 18px;
  color: var(--ui-color-primary-500);
}

.override-icon--laser {
  color: var(--ui-color-warning-500);
}

.override-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.override-value {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 44px;
  text-align: right;
  color: var(--ui-color-primary-500);
}

.slider-with-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: var(--ui-border);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ui-color-primary-500);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.slider--laser::-webkit-slider-thumb {
  background: var(--ui-color-warning-500);
}

.slider:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.preset-buttons {
  display: flex;
  gap: 6px;
}
</style>
