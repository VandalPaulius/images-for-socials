import type { RendererApi } from '@shared/ipc';
import type { MessageSchema } from '@shared/i18n';

declare global {
  interface Window {
    api: RendererApi;
  }
}

declare module 'vue-i18n' {
  // Types `t()` keys against the English message file.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
