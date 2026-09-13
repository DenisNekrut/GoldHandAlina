import { registerSW } from 'virtual:pwa-register';

export function initPWA() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log('[PWA] New version detected, updating cache...');
          updateSW(true);
        },
        onOfflineReady() {
          console.log('[PWA] App is ready for offline operation.');
        },
        onRegisterError(error: unknown) {
          console.warn('[PWA] Service worker registration error:', error);
        },
      });
    } catch (err) {
      console.warn('[PWA] Service worker init error:', err);
    }
  }
}
