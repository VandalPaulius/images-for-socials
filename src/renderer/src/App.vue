<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import ImportPanel from './components/ImportPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import ControlsPanel from './components/ControlsPanel.vue';
</script>

<template>
  <div class="app">
    <AppHeader />
    <ImportPanel />
    <main class="app__workspace">
      <PreviewPanel />
      <ControlsPanel />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--space-3);
  height: 100%;
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.app__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(340px, 32vw, 440px);
  gap: var(--space-3);
  min-height: 0;
}
</style>
