import { useEffect, useRef } from 'react';

type WakeLockSentinelLike = { release: () => Promise<void> };

/**
 * Houdt het scherm actief tijdens een training, waar de Wake Lock API wordt
 * ondersteund. Faalt stil (en veilig) wanneer dat niet zo is.
 */
export function useWakeLock(active: boolean) {
  const sentinel = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
    };

    async function request() {
      if (!active || !nav.wakeLock) return;
      try {
        const lock = await nav.wakeLock.request('screen');
        if (cancelled) {
          void lock.release();
        } else {
          sentinel.current = lock;
        }
      } catch {
        // Stil falen: geen wake lock beschikbaar of geweigerd.
      }
    }

    void request();

    return () => {
      cancelled = true;
      if (sentinel.current) {
        void sentinel.current.release();
        sentinel.current = null;
      }
    };
  }, [active]);
}
