import { useEffect } from 'react';
import type { AppSettings } from '../types';
import { todayISO } from '../utils/date';

const LAST_FIRED_KEY = 'mb.reminderLastFired';

const REMINDER_MESSAGES: Record<string, string> = {
  training: 'Vandaag staat een korte training gepland.',
  water: 'Een klein moment om iets te drinken.',
  weekReview: 'Uw weekoverzicht staat klaar om even te bekijken.',
  weighDay: 'Vandaag is uw weegdag, wanneer het u uitkomt.',
  waist: 'Deze week kunt u uw buikomtrek weer meten.',
};

/**
 * Herinneringen die werken zolang de app open of recent actief is. Bewust géén
 * systeem dat stilzwijgend faalt: er wordt alleen een melding getoond wanneer de
 * browser dat ondersteunt en de gebruiker toestemming gaf.
 */
export function useReminders(settings: AppSettings) {
  useEffect(() => {
    if (!settings.remindersEnabled) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    let timer: number | undefined;

    function scheduleCheck() {
      const [hh, mm] = settings.reminderTime.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, 0, 0);

      const alreadyFired = localStorage.getItem(LAST_FIRED_KEY) === todayISO();
      if (!alreadyFired && now >= target) {
        fire();
      } else if (!alreadyFired) {
        const delay = target.getTime() - now.getTime();
        timer = window.setTimeout(fire, Math.min(delay, 2 ** 31 - 1));
      }
    }

    function fire() {
      localStorage.setItem(LAST_FIRED_KEY, todayISO());
      const types = settings.reminderTypes.length > 0 ? settings.reminderTypes : ['training'];
      const body = types
        .map((t) => REMINDER_MESSAGES[t])
        .filter(Boolean)
        .join(' ');
      try {
        new Notification('Mijn Balans', { body: body || REMINDER_MESSAGES.training });
      } catch {
        // Stil falen wanneer meldingen toch niet beschikbaar zijn.
      }
    }

    scheduleCheck();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [settings.remindersEnabled, settings.reminderTime, settings.reminderTypes]);
}
