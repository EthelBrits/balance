import { describe, it, expect } from 'vitest';
import { parseImport, dailyLogsToCsv } from './exportImport';
import type { StorageSnapshot } from '../../services/storage';
import { STORAGE_SCHEMA_VERSION } from '../../services/storage';

function validSnapshot(): StorageSnapshot {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    exportedAt: '2026-07-20T10:00:00.000Z',
    profile: null,
    dailyLogs: [
      { id: 'l1', date: '2026-07-19', waterGlasses: 6, createdAt: '', updatedAt: '' },
    ],
    measurements: [],
    workouts: [],
    strengthTests: [],
    settings: null,
  };
}

describe('parseImport', () => {
  it('leest een geldige snapshot in', () => {
    const result = parseImport(JSON.stringify(validSnapshot()));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.snapshot.dailyLogs).toHaveLength(1);
    }
  });

  it('weigert ongeldige JSON met een begrijpelijke melding', () => {
    const result = parseImport('{ dit is geen json');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/geldige JSON/);
  });

  it('weigert een bestand zonder schemaversie', () => {
    const result = parseImport(JSON.stringify({ dailyLogs: [] }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/schemaversie/);
  });

  it('weigert een nieuwere schemaversie', () => {
    const result = parseImport(
      JSON.stringify({ ...validSnapshot(), schemaVersion: STORAGE_SCHEMA_VERSION + 1 }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/nieuwere versie/);
  });

  it('weigert een verkeerd gevormd veld', () => {
    const result = parseImport(
      JSON.stringify({ schemaVersion: STORAGE_SCHEMA_VERSION, dailyLogs: 'geen array' }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/dailyLogs/);
  });

  it('vult ontbrekende lijsten aan met lege arrays', () => {
    const result = parseImport(JSON.stringify({ schemaVersion: STORAGE_SCHEMA_VERSION }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.snapshot.measurements).toEqual([]);
      expect(result.snapshot.workouts).toEqual([]);
    }
  });
});

describe('dailyLogsToCsv', () => {
  it('maakt een CSV met kop en rijen', () => {
    const csv = dailyLogsToCsv(validSnapshot());
    const lines = csv.split('\n');
    expect(lines[0]).toContain('date');
    expect(lines[1]).toContain('2026-07-19');
  });
});
