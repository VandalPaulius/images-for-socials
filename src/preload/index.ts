import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type RendererApi } from '@shared/ipc';

const api: RendererApi = {
  getAppVersion: () => ipcRenderer.invoke(IpcChannel.GetAppVersion),
};

contextBridge.exposeInMainWorld('api', api);
