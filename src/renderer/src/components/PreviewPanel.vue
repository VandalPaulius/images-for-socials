<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="panel preview-panel">
    <h2 class="panel__title">{{ t('preview.title') }}</h2>
    <!-- Live preview arrives in milestone 5. -->
    <div class="preview-panel__stage">
      <p class="preview-panel__empty">{{ t('preview.empty') }}</p>
    </div>
  </section>
</template>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 0;
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.preview-panel__stage {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  border-radius: var(--radius-md);
  /* Checkerboard so white borders stay visible against the stage. */
  background: repeating-conic-gradient(var(--color-surface-muted) 0% 25%, transparent 0% 50%) 50% /
    24px 24px;
}

.preview-panel__empty {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
}
</style>
