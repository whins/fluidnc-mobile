<template>
  <div class="flex flex-col h-full gap-2">
    <Tabs />
    <router-view />
  </div>
</template>

<script>
import Tabs from "./components/Tabs.vue";
export default {
  components: { Tabs },
  data: () => ({
    newLabel: "",
    stats: [
      { label: "A", value: 100 },
      { label: "B", value: 100 },
      { label: "C", value: 100 },
      { label: "D", value: 100 },
      { label: "E", value: 100 },
      { label: "F", value: 100 },
    ],
  }),
  methods: {
    add(e) {
      e.preventDefault();

      if (!this.newLabel) {
        return;
      }

      this.stats.push({
        label: this.newLabel,
        value: 100,
      });

      this.newLabel = "";
    },
    remove(stat) {
      if (this.stats.length > 3) {
        this.stats.splice(this.stats.indexOf(stat), 1);
      } else {
        alert("Can't delete more!");
      }
    },
  },
};
</script>
