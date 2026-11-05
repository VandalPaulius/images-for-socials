<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const version = ref('');

onMounted(async () => {
  version.value = await window.api.getAppVersion();
});
</script>

<template>
  <header class="app-header">
    <h1 class="app-header__title">{{ t('app.title') }}</h1>
    <span v-if="version" class="app-header__version">{{ t('app.version', { version }) }}</span>
    <!-- Settings screen arrives in milestone 8. -->
    <button
      type="button"
      class="button button--icon app-header__settings"
      :aria-label="t('header.settings')"
      :title="t('header.settings')"
      disabled
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.14 12.94a7.5 7.5 0 0 0 .05-.94 7.5 7.5 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.3 7.3 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.65 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.5 7.5 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.38 1.05.7 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.3 7.3 0 0 0 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
        />
      </svg>
    </button>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.app-header__title {
  font-size: 18px;
}

.app-header__version {
  color: var(--color-text-muted);
  font-size: 12px;
}

.app-header__settings {
  margin-left: auto;
  align-self: center;
}
</style>
