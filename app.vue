<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { useSettings } from "./composables/useSettings";
import { useColorMode } from "@vueuse/core";

const settings = useSettings();
const colorMode = useColorMode();
const { locale } = useI18n();

// Sync settings → app
watchEffect(() => {
  colorMode.value = settings.colorMode.value;
  locale.value = settings.locale.value;
});
</script>
