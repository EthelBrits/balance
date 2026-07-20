import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FACTS, type Fact } from './facts';

const EPOCH = '2026-01-01';

/**
 * Kiest een weetje voor een dag. De index rouleert lineair door de vaste lijst,
 * zodat er binnen één volledige cyclus (lengte van de lijst) geen herhaling is.
 * Met `offset` kan de gebruiker bewust doorklikken naar een volgend weetje.
 */
export function factForDate(iso: string, offset = 0): Fact {
  const dayNumber = differenceInCalendarDays(parseISO(iso), parseISO(EPOCH));
  const index = (((dayNumber + offset) % FACTS.length) + FACTS.length) % FACTS.length;
  return FACTS[index];
}
