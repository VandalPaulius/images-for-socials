<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Real step modules arrive in milestones 3–4; these only outline the panel.
const stepKeys = ['steps.border', 'steps.resize'] as const;
</script>

<template>
  <aside class="panel controls-panel">
    <div class="controls-panel__scroll">
      <section class="controls-panel__section">
        <label class="controls-panel__profile">
          <span class="panel__title">{{ t('profile.label') }}</span>
          <select disabled>
            <option>{{ t('profile.factory') }}</option>
          </select>
        </label>
      </section>

      <section class="controls-panel__section">
        <h2 class="panel__title">{{ t('steps.title') }}</h2>
        <ol class="controls-panel__steps">
          <li v-for="key in stepKeys" :key="key" class="controls-panel__step">
            <svg
              class="controls-panel__step-handle"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M9 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
              />
            </svg>
            <span>{{ t(key) }}</span>
          </li>
        </ol>
      </section>

      <section class="controls-panel__section">
        <h2 class="panel__title">{{ t('output.title') }}</h2>
      </section>
    </div>

    <footer class="controls-panel__footer">
      <button type="button" class="button" disabled>{{ t('actions.resetToProfile') }}</button>
      <div class="controls-panel__export">
        <button type="button" class="button" disabled>{{ t('actions.exportAs') }}</button>
        <button type="button" class="button button--primary" disabled>
          {{ t('actions.export') }}
        </button>
      </div>
    </footer>
  </aside>
</template>

<style scoped>
.controls-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.controls-panel__scroll {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-5);
  min-height: 0;
  padding: var(--space-3) var(--space-4);
  overflow-y: auto;
}

.controls-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.controls-panel__profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.controls-panel__profile select {
  min-height: 32px;
  padding: 0 var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.controls-panel__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.controls-panel__step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  font-weight: 600;
}

.controls-panel__step-handle {
  flex: none;
  color: var(--color-text-muted);
}

.controls-panel__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
}

.controls-panel__export {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}
</style>
