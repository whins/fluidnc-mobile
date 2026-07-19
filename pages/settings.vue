<template>
  <div class="settings-page">
    <!-- Connection -->
    <UCard>
      <template #header>
        <div class="card-header">
          <UIcon name="i-heroicons-wifi" />
          {{ t("settings.title") }}
        </div>
      </template>

      <div class="setting-group">
        <UFormField :label="t('settings.controllerIp')">
          <UFieldGroup>
            <UInput
              v-model="settings.controllerIp.value"
              :placeholder="t('settings.controllerIpPlaceholder')"
              inputmode="url"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="none"
              leading-icon="i-heroicons-server"
            />

            <UButton
              size="sm"
              color="neutral"
              variant="outline"
              :loading="testing"
              icon="i-heroicons-signal"
              @click="testConnection"
            >
            </UButton>
          </UFieldGroup>
        </UFormField>

        <div class="connection-test">
          <UBadge
            v-if="testResult !== null"
            :color="testResult ? 'success' : 'error'"
            variant="subtle"
          >
            <UIcon
              :name="testResult ? 'i-heroicons-check' : 'i-heroicons-x-mark'"
            />
            {{ testResult ? t("settings.connected") : t("settings.failed") }}
          </UBadge>
        </div>

        <UFormField :label="t('settings.theme')">
          <USelectMenu
            v-model="settings.colorMode.value"
            :items="themeOptions"
            value-key="value"
            label-key="label"
          />
        </UFormField>

        <UFormField :label="t('settings.language')">
          <USelectMenu
            v-model="settings.locale.value"
            :items="localeOptions"
            value-key="value"
            label-key="label"
          />
        </UFormField>

        <UFormField :label="t('settings.jogFeedrate')">
          <UInput
            v-model.number="settings.jogFeedrate.value"
            type="number"
            inputmode="numeric"
            :min="100"
            :max="10000"
            :step="100"
          />
        </UFormField>

        <USwitch
          v-model="settings.jobControls.value"
          :label="t('settings.jobControls')"
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          size="xl"
        />
        <USwitch
          v-model="settings.moreHomeBtns.value"
          :label="t('settings.moreHomeBtns')"
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          size="xl"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({ layout: "default" });

const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const { connected, wsError, ping } = $fluidnc;
const settings = useSettings();
const toast = useToast();

// ── Theme & locale options ────────────────────────────────────────────────────
const themeOptions = computed(() => [
  { value: "system", label: t("settings.themeSystem") },
  { value: "light", label: t("settings.themeLight") },
  { value: "dark", label: t("settings.themeDark") },
]);

const localeOptions = [
  { value: "en", label: "English" },
  { value: "uk", label: "Українська" },
];

// ── Connection test ───────────────────────────────────────────────────────────
const testing = ref(false);
const testResult = ref<boolean | null>(null);

async function testConnection() {
  testing.value = true;
  testResult.value = null;
  try {
    testResult.value = await ping();

    if (testResult.value !== null) {
      toast.add({
        id: "test-connection",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        icon: "i-lucide-wifi",
        color: testResult.value ? "success" : "error",
        duration: 0,
        close: {
          color: "primary",
          variant: "outline",
          class: "rounded-full",
        },
      });
    }
  } finally {
    testing.value = false;
  }
  // Auto-clear after 3s
  setTimeout(() => {
    testResult.value = null;
  }, 3000);
}
</script>

<style scoped>
.settings-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.connection-test {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.about-label {
  color: var(--ui-text-muted);
}

.about-value {
  font-weight: 500;
}

.about-link {
  color: var(--ui-color-primary-500);
  text-decoration: none;
}
</style>
