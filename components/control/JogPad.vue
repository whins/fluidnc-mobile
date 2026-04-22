<template>
  <div class="jog-pad">
    <div class="step-selector">
      <UFieldGroup orientation="vertical">
        <!-- <span class="section-label">{{ t("control.step") }}</span> -->
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          :label="t(`control.step`)"
        />
        <UButton
          v-for="s in steps"
          :key="s"
          :variant="selectedStep === s ? 'solid' : 'outline'"
          :color="selectedStep === s ? 'primary' : 'neutral'"
          size="xl"
          @click="selectedStep = s"
        >
          {{ s }}
        </UButton>
      </UFieldGroup>
    </div>

    <div class="round-pad-wrapper">
      <div class="round-pad">
        <div class="sector-btn-wrapper-up">
          <button
            class="sector-btn"
            @click="jog('Y', selectedStep)"
            :disabled="!connected"
          >
            <UIcon name="i-heroicons-chevron-right" />
          </button>
        </div>
        <div class="sector-btn-wrapper-right">
          <button
            class="sector-btn"
            @click="jog('X', selectedStep)"
            :disabled="!connected"
          >
            <UIcon name="i-heroicons-chevron-right" />
          </button>
        </div>
        <div class="sector-btn-wrapper-left">
          <button
            class="sector-btn"
            @click="jog('X', -selectedStep)"
            :disabled="!connected"
          >
            <UIcon name="i-heroicons-chevron-right" />
          </button>
        </div>
        <div class="sector-btn-wrapper-down">
          <button
            class="sector-btn"
            @click="jog('Y', -selectedStep)"
            :disabled="!connected"
          >
            <UIcon name="i-heroicons-chevron-right" />
          </button>
        </div>
        <div class="center-btn-wrapper">
          <button class="center-btn" @click="homeAll" :disabled="!connected">
            <span>0.00</span>
          </button>
        </div>
      </div>
    </div>

    <div class="home-btns-wrapper">
      <UButton
        v-if="!settings.moreHomeBtns.value"
        icon="i-heroicons-home"
        color="primary"
        variant="soft"
        size="xl"
        :disabled="!connected"
        @click="homeAll"
        class="home-btn-main"
      >
      </UButton>

      <UFieldGroup v-if="settings.moreHomeBtns.value" orientation="vertical">
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          :label="t(`control.home`)"
        />
        <UButton
          icon="i-heroicons-home"
          color="primary"
          variant="outline"
          size="xl"
          :disabled="!connected"
          @click="homeAll"
          class="home-btn-main"
        >
        </UButton>
        <UButton
          color="primary"
          variant="outline"
          size="xl"
          :disabled="!connected"
          @click="homeAxis('X')"
        >
          X
        </UButton>
        <UButton
          color="primary"
          variant="outline"
          size="xl"
          :disabled="!connected"
          @click="homeAxis('Y')"
        >
          Y
        </UButton>
      </UFieldGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { jog, homeAll, connected, homeAxis } = $fluidnc;
// const { jog, homeAll } = $fluidnc;

// const connected = true;
const settings = useSettings();

const steps = [0.1, 1, 10, 100] as const;
const selectedStep = ref<number>(1);
</script>

<style scoped>
.jog-pad {
  display: grid;
  grid-template-columns: 75px 1fr auto;
  grid-template-rows: 1fr auto;
  gap: 4px;
}

.step-selector {
  grid-column: 1;
  grid-row: 1;
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

.round-pad-wrapper {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
}

.home-btns-wrapper {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: start;
}

.round-pad {
  display: inline-grid;
  grid-template-columns: repeat(2, 120px);
  grid-template-rows: repeat(2, 120px);
  gap: 4px;
  transform: rotate(45deg);
}

.sector-btn {
  width: 120px;
  height: 120px;
  background-color: bisque;
  border-radius: 100px 10px 10px 10px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  font-size: 20pt;
  color: var(--ui-text);
  cursor: pointer;
  transition:
    background 0.1s,
    transform 0.1s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.sector-btn-wrapper-up {
  grid-column: 1;
  grid-row: 1;
  transform: rotate(0deg);
}
.sector-btn-wrapper-left {
  grid-column: 1;
  grid-row: 2;
  transform: rotate(-90deg);
}
.sector-btn-wrapper-right {
  grid-column: 2;
  grid-row: 1;
  transform: rotate(90deg);
}
.sector-btn-wrapper-down {
  grid-column: 2;
  grid-row: 2;
  transform: rotate(180deg);
}

.center-btn-wrapper {
  grid-area: 1 / 1 / span 2 / span 2;
  align-self: center;
  justify-self: center;
  z-index: 1;
  /* transform: rotate(90deg); */
}
.center-btn {
  background-color: azure;
  border-radius: 50px;
  width: 110px;
  height: 110px;
  background: var(--ui-bg-accented);
  box-shadow: 0 0 10px 10px var(--ui-bg-elevated);
  font-size: 20pt;
  font-weight: 500;
}

.sector-btn > span {
  transform: rotate(-135deg);
}

.center-btn > span {
  display: inline-block;
  transform: rotate(-45deg);
}

.sector-btn:active:not(:disabled),
.center-btn:active:not(:disabled) {
  background: var(--ui-color-primary-500 / 0.15);
  transform: scale(0.93);
}

.sector-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.center-btn:disabled {
  opacity: 0.95;
  cursor: not-allowed;
}
</style>
