/**
 * Returns true when the app is running inside an Electron renderer process.
 * Use this to guard any Electron-specific code so the web build stays clean.
 *
 * Detection relies on `window.ipcRenderer` which is injected by the preload
 * script via contextBridge — it is always undefined in the browser.
 */
export const isElectron = (): boolean =>
  typeof window !== 'undefined' && typeof window.ipcRenderer !== 'undefined';
