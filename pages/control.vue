<template>
  <div class="control-page">
    <!-- Machine action buttons -->
    <div v-if="settings.jobControls.value" class="action-bar">
      <UButton
        icon="i-heroicons-pause"
        color="warning"
        variant="soft"
        size="xl"
        :disabled="!connected"
        @click="feedHold"
      >
        {{ t("control.feedHold") }}
      </UButton>
      <UButton
        icon="i-heroicons-play"
        color="success"
        variant="soft"
        size="xl"
        :disabled="!connected"
        @click="cycleStart"
      >
        {{ t("control.resume") }}
      </UButton>
      <UButton
        icon="i-heroicons-x-circle"
        color="error"
        variant="soft"
        size="xl"
        :disabled="!connected"
        @click="confirmReset"
      >
        {{ t("control.reset") }}
      </UButton>
    </div>

    <USeparator :label="t('control.jog')" />
    
    <!-- Jog section -->
    <section class="section">
      <JogPad />
    </section>

    <USeparator label="Overrides" />

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
import { ref } from "vue";

definePageMeta({ layout: "default" });

const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { feedHold, cycleStart, softReset, connected } = $fluidnc;

const settings = useSettings();

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
