import { watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import {
  DEFAULT_LOCALE,
  messages,
  pluralRules,
  resolveLocale,
  type MessageSchema,
  type SupportedLocale,
} from '@shared/i18n';

export function createAppI18n(locale: SupportedLocale = resolveLocale(navigator.languages)) {
  const i18n = createI18n<[MessageSchema], SupportedLocale, false>({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
    pluralRules,
  });

  // Keep <html lang> and the window title in sync when the language changes.
  watchEffect(() => {
    document.documentElement.lang = i18n.global.locale.value;
    document.title = i18n.global.t('app.title');
  });

  return i18n;
}
