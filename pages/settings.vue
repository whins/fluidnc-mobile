<template>
  <div class="settings-page">
    <h1 class="page-title">{{ t('settings.title') }}</h1>

    <!-- Connection -->
    <UCard>
      <template #header>
        <div class="card-header">
          <UIcon name="i-heroicons-wifi" />
          {{ t('settings.connection') }}
        </div>
      </template>

      <div class="setting-group">
        <UFormField :label="t('settings.controllerIp')">
          <UInput
            v-model="settings.controllerIp.value"
            :placeholder="t('settings.controllerIpPlaceholder')"
            inputmode="url"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="none"
            leading-icon="i-heroicons-server"
          />
        </UFormField>

        <div class="connection-test">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            :loading="testing"
            icon="i-heroicons-signal"
            @click="testConnection"
          >
            {{ t('settings.testConnection') }}
          </UButton>

          <UBadge
            v-if="testResult !== null"
            :color="testResult ? 'success' : 'error'"
            variant="subtle"
          >
            <UIcon :name="testResult ? 'i-heroicons-check' : 'i-heroicons-x-mark'" />
            {{ testResult ? t('settings.connected') : t('settings.failed') }}
          </UBadge>
        </div>

        <!-- Live connection status -->
        <div class="live-status">
          <span class="dot" :class="connected ? 'dot--online' : 'dot--offline'" />
          <span class="live-label">
            {{ connected ? t('status.connected') : t('status.disconnected') }}
          </span>
          <span v-if="wsError" class="ws-error">{{ wsError }}</span>
        </div>
      </div>
    </UCard>

    <!-- Appearance -->
    <UCard>
      <template #header>
        <div class="card-header">
          <UIcon name="i-heroicons-swatch" />
          {{ t('settings.appearance') }}
        </div>
      </template>

      <div class="setting-group">
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
      </div>
    </UCard>

    <!-- Jog settings -->
    <UCard>
      <template #header>
        <div class="card-header">
          <UIcon name="i-heroicons-arrows-pointing-out" />
          {{ t('settings.jog') }}
        </div>
      </template>

      <div class="setting-group">
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
      </div>
    </UCard>

    <!-- About -->
    <UCard>
      <template #header>
        <div class="card-header">
          <UIcon name="i-heroicons-information-circle" />
          {{ t('settings.about') }}
        </div>
      </template>

      <div class="setting-group">
        <div class="about-row">
          <span class="about-label">{{ t('settings.version') }}</span>
          <span class="about-value">0.1.0</span>
        </div>
        <div class="about-row">
          <span class="about-label">{{ t('settings.source') }}</span>
          <a
            href="https://github.com/whins/fluidnc-mobile"
            target="_blank"
            class="about-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { $fluidnc } = useNuxtApp()
const { connected, wsError, ping } = $fluidnc
const settings = useSettings()

// ── Theme & locale options ────────────────────────────────────────────────────
const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') },
])

const localeOptions = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
]

// ── Connection test ───────────────────────────────────────────────────────────
const testing = ref(false)
const testResult = ref<boolean | null>(null)

async function testConnection() {
  testing.value = true
  testResult.value = null
  try {
    testResult.value = await ping()
  }
  finally {
    testing.value = false
  }
  // Auto-clear after 3s
  setTimeout(() => { testResult.value = null }, 3000)
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

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--online {
  background: var(--ui-color-success-500);
  box-shadow: 0 0 5px var(--ui-color-success-500);
}

.dot--offline {
  background: var(--ui-color-neutral-400);
}

.live-label {
  color: var(--ui-text-muted);
}

.ws-error {
  font-size: 11px;
  color: var(--ui-color-error-500);
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
