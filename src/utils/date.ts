import { format, parseISO, startOfWeek, addDays, differenceInCalendarDays } from 'date-fns';
import { nl } from 'date-fns/locale';

/** yyyy-MM-dd voor een Date (standaard vandaag). */
export function toISODate(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Leesbare datum, bv. "zondag 20 juli". */
export function formatHuman(iso: string): string {
  return format(parseISO(iso), 'EEEE d MMMM', { locale: nl });
}

export function formatShort(iso: string): string {
  return format(parseISO(iso), 'd MMM', { locale: nl });
}

/** Reeks van 7 ISO-datums voor de week rond een datum (maandag als start). */
export function weekDates(reference: Date = new Date()): string[] {
  const monday = startOfWeek(reference, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(monday, i)));
}

export function daysBetween(a: string, b: string): number {
  return Math.abs(differenceInCalendarDays(parseISO(a), parseISO(b)));
}

/** Weekdag van een ISO-datum (0 = zondag). */
export function weekdayOf(iso: string): number {
  return parseISO(iso).getDay();
}

export function ageFromBirthDate(birthDate: string): number {
  const birth = parseISO(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}
