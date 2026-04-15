<template>
  <div class="app-shell">
    <!-- Top status bar -->
    <StatusBar />

    <!-- Page content -->
    <main class="page-content">
      <slot />
    </main>

    <!-- Bottom navigation -->
    <AppTabs />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
