<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const settings = useSettings();
const colorMode = useColorMode();
const { locale } = useI18n();

// Sync settings → app
watchEffect(() => {
  colorMode.preference = settings.colorMode.value;
  locale.value = settings.locale.value;
});
</script>
