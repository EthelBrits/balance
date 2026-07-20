import { useRef, useState } from 'react';
import { Download, Upload, Printer, Trash2, Sparkles } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { generateDemoData } from '../../../utils/demoData';
import {
  downloadFile,
  snapshotToJson,
  dailyLogsToCsv,
  parseImport,
} from '../exportImport';
import { todayISO } from '../../../utils/date';

const IS_DEV = import.meta.env.DEV;

export function DataSection() {
  const exportAll = useStore((s) => s.exportAll);
  const importAll = useStore((s) => s.importAll);
  const clearAll = useStore((s) => s.clearAll);
  const profile = useStore((s) => s.profile);
  const replaceDemoData = useStore((s) => s.replaceDemoData);

  const fileInput = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  async function onExportJson() {
    const snapshot = await exportAll();
    downloadFile(`mijn-balans-${todayISO()}.json`, snapshotToJson(snapshot), 'application/json');
  }

  async function onExportCsv() {
    const snapshot = await exportAll();
    downloadFile(`mijn-balans-dagboek-${todayISO()}.csv`, dailyLogsToCsv(snapshot), 'text/csv');
  }

  async function onImportFile(file: File) {
    const raw = await file.text();
    const result = parseImport(raw);
    if (!result.ok) {
      setImportMessage({ ok: false, text: result.error });
      return;
    }
    await importAll(result.snapshot);
    setImportMessage({ ok: true, text: 'Gegevens ingelezen en toegepast.' });
  }

  async function onClear() {
    await clearAll();
    setConfirmClear(false);
    window.location.href = '/onboarding';
  }

  async function onDemo() {
    const data = generateDemoData(profile);
    await replaceDemoData(data);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 font-heading font-medium text-text">Exporteren</h3>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={onExportJson}>
            <Download className="h-4 w-4" aria-hidden="true" /> JSON
          </button>
          <button className="btn-secondary" onClick={onExportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" /> CSV
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" /> Afdrukken / PDF
          </button>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          Foto's worden niet meegeëxporteerd; die blijven lokaal op dit toestel.
        </p>
      </div>

      <div>
        <h3 className="mb-2 font-heading font-medium text-text">Importeren</h3>
        <button className="btn-secondary" onClick={() => fileInput.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden="true" /> JSON-bestand kiezen
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onImportFile(file);
            e.target.value = '';
          }}
        />
        {importMessage && (
          <p className={`mt-2 text-sm ${importMessage.ok ? 'text-success' : 'text-warning'}`}>
            {importMessage.text}
          </p>
        )}
      </div>

      {IS_DEV && (
        <div className="rounded-xl border border-dashed border-accent/50 p-4">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="font-heading font-medium text-text">Ontwikkelaarsmodus</span>
          </div>
          <p className="mb-3 text-sm text-text-muted">
            Vult twaalf weken gemarkeerde demogegevens in. Alleen zichtbaar tijdens ontwikkeling.
          </p>
          <button className="btn-secondary" onClick={onDemo}>
            Vul demogegevens in
          </button>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-heading font-medium text-text">Alle gegevens verwijderen</h3>
        {!confirmClear ? (
          <button className="btn-secondary text-accent" onClick={() => setConfirmClear(true)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Alle gegevens verwijderen
          </button>
        ) : (
          <div className="rounded-xl bg-warning/10 p-4">
            <p className="text-sm text-text">
              Dit verwijdert alle lokaal opgeslagen gegevens. Deze actie kan niet ongedaan worden
              gemaakt.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary" onClick={onClear}>
                Ja, verwijderen
              </button>
              <button className="btn-ghost" onClick={() => setConfirmClear(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
