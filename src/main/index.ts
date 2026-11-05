import { join } from 'node:path';
import { app, BrowserWindow, ipcMain, Menu, nativeTheme, shell } from 'electron';
import { IpcChannel } from '@shared/ipc';

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    // Matches --color-bg in the renderer so there is no white flash on dark themes.
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#18181b' : '#f6f6f7',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  window.once('ready-to-show', () => window.show());

  // Never open new Electron windows; send https links to the default browser instead.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });

  // Block navigation away from the app, e.g. when a file is dropped outside the import area.
  window.webContents.on('will-navigate', (event) => event.preventDefault());

  const devServerUrl = process.env['ELECTRON_RENDERER_URL'];
  if (!app.isPackaged && devServerUrl) {
    void window.loadURL(devServerUrl);
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return window;
}

function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.GetAppVersion, () => app.getVersion());
}

void app.whenReady().then(() => {
  if (app.isPackaged) Menu.setApplicationMenu(null);
  registerIpcHandlers();
  createMainWindow();
});

app.on('window-all-closed', () => app.quit());
