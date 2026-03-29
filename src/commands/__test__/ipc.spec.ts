import { test, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

test('ipc.ts does not throw when window.ipcRenderer is undefined', async () => {
  (window as any).ipcRenderer = undefined;
  await expect(import('../ipc')).resolves.toBeDefined();
});

test('ipc.ts calls ipcRenderer.on and callback logs message', async () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  let registeredCallback: ((_event: any, ...args: any[]) => void) | null = null;
  const onMock = vi.fn((_, cb) => {
    registeredCallback = cb;
  });
  (window as any).ipcRenderer = { on: onMock };

  await import('../ipc');

  expect(onMock).toHaveBeenCalledWith('main-process-message', expect.any(Function));
  // Invoke the callback to cover lines 2-3
  registeredCallback!({}, 'test-arg');
  expect(consoleSpy).toHaveBeenCalledWith('[Receive Main-process message]:', 'test-arg');

  consoleSpy.mockRestore();
  (window as any).ipcRenderer = undefined;
});
