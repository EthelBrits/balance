import { useEffect, useState } from 'react';
import { Camera, Trash2, Lock } from 'lucide-react';
import { getAllPhotos, savePhoto, deletePhoto, type ProgressPhoto } from '../../services/storage';
import { createId } from '../../utils/id';
import { todayISO, formatShort } from '../../utils/date';

/**
 * Lichaamsfoto's: standaard uit, uitsluitend lokaal in IndexedDB, nooit onderdeel
 * van de automatische export. Duidelijk gemarkeerd als lokaal bewaard.
 */
export function PhotoSection() {
  const [enabled, setEnabled] = useState(false);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (enabled) void refresh();
  }, [enabled]);

  async function refresh() {
    setPhotos(await getAllPhotos());
  }

  async function onFile(file: File) {
    setBusy(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      await savePhoto({ id: createId(), date: todayISO(), dataUrl });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deletePhoto(id);
    await refresh();
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="font-heading font-semibold text-text">Lichaamsfoto's</h3>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-sand text-primary"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Inschakelen
        </label>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        Lokaal bewaard op dit toestel. Foto's staan standaard uit en zitten nooit in een export.
      </p>

      {enabled && (
        <div className="mt-4 space-y-4">
          <label className="btn-secondary w-full cursor-pointer">
            <Camera className="h-4 w-4" aria-hidden="true" />
            {busy ? 'Bezig…' : 'Foto toevoegen'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
                e.target.value = '';
              }}
            />
          </label>

          {photos.length === 0 ? (
            <p className="text-sm text-text-muted">Nog geen foto's toegevoegd.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo) => (
                <li key={photo.id} className="overflow-hidden rounded-xl border border-sand">
                  <img src={photo.dataUrl} alt={`Voortgangsfoto van ${formatShort(photo.date)}`} className="aspect-square w-full object-cover" />
                  <div className="flex items-center justify-between p-2 text-xs text-text-muted">
                    <span>{formatShort(photo.date)}</span>
                    <button
                      className="tap-target text-text-muted hover:text-accent"
                      onClick={() => remove(photo.id)}
                      aria-label="Foto verwijderen"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
