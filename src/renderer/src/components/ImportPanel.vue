<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// Import and the image grid arrive in milestone 2.
const imageCount = 0;
</script>

<template>
  <section class="panel import-panel">
    <header class="import-panel__header">
      <h2 class="panel__title">{{ t('import.title') }}</h2>
      <span class="import-panel__count">{{ t('import.count', imageCount) }}</span>
      <div class="import-panel__actions">
        <button type="button" class="button" disabled>{{ t('import.clearAll') }}</button>
        <button type="button" class="button button--primary" disabled>
          {{ t('import.addImages') }}
        </button>
      </div>
    </header>
    <div class="import-panel__dropzone">
      <p class="import-panel__hint">{{ t('import.dropHint') }}</p>
      <p class="import-panel__empty">{{ t('import.empty') }}</p>
    </div>
  </section>
</template>

<style scoped>
.import-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.import-panel__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.import-panel__count {
  color: var(--color-text-muted);
}

.import-panel__actions {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}

.import-panel__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: 120px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
}

.import-panel__hint {
  margin: 0;
  font-weight: 600;
}

.import-panel__empty {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
