import { LocalStorageProvider } from './LocalStorageProvider';
import type { StorageProvider } from './StorageProvider';

export * from './StorageProvider';
export * from './photoStore';

/**
 * Eén gedeelde opslaginstantie. De store consumeert uitsluitend deze provider,
 * nooit localStorage rechtstreeks. Wil je later Firestore? Vervang enkel deze regel.
 */
export const storage: StorageProvider = new LocalStorageProvider();
