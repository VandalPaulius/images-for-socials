/** IPC channel names shared by the main process and the preload bridge. */
export const IpcChannel = {
  GetAppVersion: 'app:get-version',
} as const;

/** API exposed to the renderer as `window.api` by the preload script. */
export interface RendererApi {
  getAppVersion(): Promise<string>;
}
