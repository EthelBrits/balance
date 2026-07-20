import { CalendarCheck, Dumbbell, LineChart, Lightbulb, User, type LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

/** Hoofdnavigatie — labels én iconen, zowel mobiel als desktop. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Vandaag', icon: CalendarCheck },
  { to: '/training', label: 'Training', icon: Dumbbell },
  { to: '/voortgang', label: 'Voortgang', icon: LineChart },
  { to: '/inzichten', label: 'Inzichten', icon: Lightbulb },
  { to: '/profiel', label: 'Profiel', icon: User },
];
