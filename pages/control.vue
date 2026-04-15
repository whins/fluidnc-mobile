<template>
  <div class="control-page">
    <!-- Machine action buttons -->
    <div class="action-bar">
      <UButton
        icon="i-heroicons-pause"
        color="warning"
        variant="soft"
        size="sm"
        :disabled="!connected"
        @click="feedHold"
      >
        {{ t("control.feedHold") }}
      </UButton>
      <UButton
        icon="i-heroicons-play"
        color="success"
        variant="soft"
        size="sm"
        :disabled="!connected"
        @click="cycleStart"
      >
        {{ t("control.resume") }}
      </UButton>
      <UButton
        icon="i-heroicons-x-circle"
        color="error"
        variant="soft"
        size="sm"
        :disabled="!connected"
        @click="confirmReset"
      >
        {{ t("control.reset") }}
      </UButton>
    </div>

    <UDivider />

    <!-- Jog section -->
    <section class="section">
      <h2 class="section-title">{{ t("control.jog") }}</h2>
      <JogPad />
    </section>

    <UDivider />

    <!-- Home buttons -->
    <section class="section">
      <h2 class="section-title">{{ t("control.home") }}</h2>
      <div class="home-buttons">
        <UButton
          icon="i-heroicons-home"
          color="primary"
          variant="soft"
          :disabled="!connected"
          @click="homeAll"
          class="home-btn-main"
        >
          {{ t("control.homeAll") }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="!connected"
          @click="homeAxis('X')"
        >
          {{ t("control.homeX") }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="!connected"
          @click="homeAxis('Y')"
        >
          {{ t("control.homeY") }}
        </UButton>
      </div>
    </section>

    <UDivider />

    <!-- Overrides -->
    <section class="section">
      <OverrideSliders />
    </section>

    <!-- Reset confirmation modal -->
    <UModal v-model:open="showResetModal">
      <template #content>
        <div class="modal-content">
          <UIcon name="i-heroicons-exclamation-triangle" class="modal-icon" />
          <p>{{ t("control.reset") }}?</p>
          <div class="modal-actions">
            <UButton
              color="neutral"
              variant="outline"
              @click="showResetModal = false"
            >
              {{ t("files.cancel") }}
            </UButton>
            <UButton color="error" @click="doReset">
              {{ t("files.confirm") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { feedHold, cycleStart, softReset, homeAll, homeAxis, connected } =
  $fluidnc;

const showResetModal = ref(false);

function confirmReset() {
  showResetModal.value = true;
}

async function doReset() {
  showResetModal.value = false;
  await softReset();
}
</script>

<style scoped>
.control-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.action-bar {
  display: flex;
  gap: 8px;
  justify-content: stretch;
}

.action-bar > * {
  flex: 1;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.home-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.home-btn-main {
  flex: 1;
}

.modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.modal-icon {
  width: 40px;
  height: 40px;
  color: var(--ui-color-error-500);
}

.modal-actions {
  display: flex;
  gap: 12px;
}
</style>
