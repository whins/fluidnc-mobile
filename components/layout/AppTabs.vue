<template>
  <nav class="app-tabs">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab-item"
      active-class="tab-item--active"
    >
      <UIcon :name="tab.icon" class="tab-icon" />
      <span class="tab-label">{{ t(tab.label) }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n();

const tabs = [
  {
    to: "/control",
    icon: "i-heroicons-arrows-pointing-out",
    label: "nav.control",
  },
  { to: "/files", icon: "i-heroicons-folder", label: "nav.files" },
  { to: "/settings", icon: "i-heroicons-cog-6-tooth", label: "nav.settings" },
];
</script>

<style scoped>
.app-tabs {
  display: flex;
  border-top: 1px solid var(--ui-border);
  background: var(--ui-bg);
  flex-shrink: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  color: var(--ui-text-muted);
  text-decoration: none;
  transition: color 0.15s;
  min-height: 56px;
}

.tab-item--active {
  color: var(--ui-color-primary-500);
}

.tab-icon {
  width: 24px;
  height: 24px;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
