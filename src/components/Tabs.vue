<template>
  <UTabs v-model="active" :content="false" :items="items" class="w-full" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { TabsItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();

const items: TabsItem[] = [
  { value: "/", label: "", icon: "i-lucide-home" },
  { value: "/files", label: "", icon: "i-lucide-file" },
  {
    value: "/terminal",
    label: "",
    icon: "i-lucide-square-terminal",
  },
  {
    value: "/settings",
    label: "",
    icon: "i-lucide-settings",
  },
];

const active = computed({
  get() {
    return items.find((d) => d.value === route.path)?.value || "/";
  },
  set(tab) {
    router.push({
      path: tab,
    });
  },
});
</script>
