import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageProvider } from './LocalStorageProvider';
import { STORAGE_SCHEMA_VERSION } from './StorageProvider';
import { createDefaultProfile, createDefaultSettings } from '../../utils/defaults';
import type { BodyMeasurement, DailyLog } from '../../types';

/** Eenvoudige in-memory Storage voor tests. */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.map.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}

function makeLog(date: string): DailyLog {
  const now = new Date().toISOString();
  return { id: `log-${date}`, date, createdAt: now, updatedAt: now };
}

describe('LocalStorageProvider', () => {
  let mem: MemoryStorage;
  let provider: LocalStorageProvider;

  beforeEach(() => {
    mem = new MemoryStorage();
    provider = new LocalStorageProvider(mem);
  });

  it('zet het schemaversienummer bij initialisatie', async () => {
    expect(await provider.getSchemaVersion()).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('bewaart en leest het profiel', async () => {
    const profile = createDefaultProfile();
    profile.name = 'Anke';
    await provider.saveProfile(profile);
    const loaded = await provider.getProfile();
    expect(loaded?.name).toBe('Anke');
  });

  it('geeft null terug wanneer er geen profiel is', async () => {
    expect(await provider.getProfile()).toBeNull();
  });

  it('werkt een bestaand daglog bij in plaats van te dupliceren', async () => {
    const log = makeLog('2026-07-20');
    await provider.saveDailyLog(log);
    await provider.saveDailyLog({ ...log, waterGlasses: 5 });
    const logs = await provider.getDailyLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].waterGlasses).toBe(5);
  });

  it('verwijdert een meting', async () => {
    const m: BodyMeasurement = { id: 'm1', date: '2026-07-20', weightKg: 70 };
    await provider.saveMeasurement(m);
    await provider.deleteMeasurement('m1');
    expect(await provider.getMeasurements()).toHaveLength(0);
  });

  it('exporteert en importeert een volledige snapshot', async () => {
    const profile = createDefaultProfile();
    profile.name = 'Test';
    await provider.saveProfile(profile);
    await provider.saveDailyLog(makeLog('2026-07-19'));
    await provider.saveSettings(createDefaultSettings());

    const snapshot = await provider.exportAll();
    expect(snapshot.schemaVersion).toBe(STORAGE_SCHEMA_VERSION);

    const fresh = new LocalStorageProvider(new MemoryStorage());
    await fresh.importAll(snapshot);
    expect((await fresh.getProfile())?.name).toBe('Test');
    expect(await fresh.getDailyLogs()).toHaveLength(1);
  });

  it('wist alle gegevens maar behoudt de schemaversie', async () => {
    await provider.saveProfile(createDefaultProfile());
    await provider.saveDailyLog(makeLog('2026-07-20'));
    await provider.clearAll();
    expect(await provider.getProfile()).toBeNull();
    expect(await provider.getDailyLogs()).toHaveLength(0);
    expect(await provider.getSchemaVersion()).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('overleeft beschadigde JSON zonder te crashen', async () => {
    mem.setItem('mb.profile', '{ niet geldig json');
    expect(await provider.getProfile()).toBeNull();
  });
});
