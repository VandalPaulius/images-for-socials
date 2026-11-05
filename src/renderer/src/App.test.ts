// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import type { SupportedLocale } from '@shared/i18n';
import App from './App.vue';
import { createAppI18n } from './i18n';

function mountApp(locale: SupportedLocale) {
  return mount(App, { global: { plugins: [createPinia(), createAppI18n(locale)] } });
}

describe('App', () => {
  beforeEach(() => {
    window.api = { getAppVersion: vi.fn().mockResolvedValue('1.2.3') };
  });

  it('renders the layout outline in English', async () => {
    const wrapper = mountApp('en');
    await flushPromises();

    expect(wrapper.text()).toContain('Drop images or folders here');
    expect(wrapper.text()).toContain('0 images');
    expect(wrapper.text()).toContain('Processing steps');
    expect(wrapper.text()).toContain('Version 1.2.3');
    expect(document.documentElement.lang).toBe('en');
  });

  it('renders in Lithuanian with the correct plural form', async () => {
    const wrapper = mountApp('lt');
    await flushPromises();

    expect(wrapper.text()).toContain('Nutempkite nuotraukas ar aplankus čia');
    expect(wrapper.text()).toContain('0 nuotraukų');
    expect(wrapper.text()).toContain('Versija 1.2.3');
    expect(document.documentElement.lang).toBe('lt');
  });
});
