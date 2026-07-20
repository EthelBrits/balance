import { useState } from 'react';
import { useStore } from '../../../store/useStore';

const REMINDER_TYPES = [
  { key: 'weighDay', label: 'Weegdag' },
  { key: 'training', label: 'Geplande training' },
  { key: 'water', label: 'Water drinken' },
  { key: 'weekReview', label: 'Weekoverzicht' },
  { key: 'waist', label: 'Buikomtrekmeting' },
];

const NOTIFICATIONS_SUPPORTED = typeof window !== 'undefined' && 'Notification' in window;

export function RemindersSection() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [permission, setPermission] = useState(
    NOTIFICATIONS_SUPPORTED ? Notification.permission : 'unsupported',
  );

  async function enable() {
    if (!NOTIFICATIONS_SUPPORTED) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') void updateSettings({ remindersEnabled: true });
  }

  function toggleType(key: string) {
    const has = settings.reminderTypes.includes(key);
    void updateSettings({
      reminderTypes: has
        ? settings.reminderTypes.filter((t) => t !== key)
        : [...settings.reminderTypes, key],
    });
  }

  return (
    <div className="space-y-4">
      {!NOTIFICATIONS_SUPPORTED ? (
        <p className="text-sm text-text-muted">
          Deze browser ondersteunt geen meldingen. U kunt de app openen wanneer het u uitkomt.
        </p>
      ) : (
        <>
          <label className="flex items-center justify-between gap-4">
            <span className="text-text">Herinneringen inschakelen</span>
            <input
              type="checkbox"
              className="h-6 w-6 rounded border-sand text-primary"
              checked={settings.remindersEnabled && permission === 'granted'}
              onChange={(e) => {
                if (e.target.checked) void enable();
                else void updateSettings({ remindersEnabled: false });
              }}
            />
          </label>

          {permission === 'denied' && (
            <p className="text-sm text-warning">
              Meldingen zijn in de browser geblokkeerd. Pas dit aan in de browserinstellingen.
            </p>
          )}

          <p className="rounded-lg bg-sand/50 px-3 py-2 text-sm text-text-muted">
            Herinneringen werken het betrouwbaarst wanneer de app af en toe geopend wordt.
          </p>

          {settings.remindersEnabled && permission === 'granted' && (
            <>
              <label className="block">
                <span className="label-text">Tijdstip</span>
                <input
                  type="time"
                  className="input-field max-w-[10rem]"
                  value={settings.reminderTime}
                  onChange={(e) => void updateSettings({ reminderTime: e.target.value })}
                />
              </label>
              <div>
                <p className="label-text">Waarvoor?</p>
                <div className="flex flex-wrap gap-2">
                  {REMINDER_TYPES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={settings.reminderTypes.includes(t.key)}
                      onClick={() => toggleType(t.key)}
                      className={`chip ${settings.reminderTypes.includes(t.key) ? 'chip-active' : ''}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
