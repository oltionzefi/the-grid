import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

import log from 'electron-log/main';

import { update } from './update';

interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

function getWindowStatePath() {
  return join(app.getPath('userData'), 'window-state.json');
}

function loadWindowState(): WindowState {
  try {
    return JSON.parse(readFileSync(getWindowStatePath(), 'utf8')) as WindowState;
  } catch {
    return { width: 1200, height: 800 };
  }
}

function saveWindowState(state: WindowState): void {
  try {
    writeFileSync(getWindowStatePath(), JSON.stringify(state), 'utf8');
  } catch { /* best-effort */ }
}

log.initialize();

// eslint-disable-next-line no-underscore-dangle
globalThis.__filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
globalThis.__dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

const isDebug = process.env.ENABLE_ELECTRON_DEBUG === 'true';

if (isDebug) {
  import('electron-debug').then((debug) => debug.default());
}

const installExtensions = async () => {
  const { installExtension: installer, REACT_DEVELOPER_TOOLS } = await import('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return installer(REACT_DEVELOPER_TOOLS, { forceDownload });
};

async function createWindow() {
  if (isDebug) {
    console.log('[debug] Loading React DevTools');
    await installExtensions();
  }

  const saved = loadWindowState();

  win = new BrowserWindow({
    title: 'Burger',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: saved.width,
    height: saved.height,
    x: saved.x,
    y: saved.y,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  const persistBounds = () => {
    if (!win) return;
    const { width, height, x, y } = win.getBounds();
    saveWindowState({ width, height, x, y });
  };

  win.on('resize', persistBounds);
  win.on('move', persistBounds);

  if (url) {
    // electron-vite-vue#298
    await win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    await win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
