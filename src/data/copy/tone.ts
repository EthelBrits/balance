import type { ToneType } from '../../types';

/**
 * Centraal tekstenbestand voor alle dynamische feedback.
 * Componenten halen hun feedbackteksten HIER op — nooit hardcoded.
 * Drie stijlen: warm en nuchter, zakelijk, droge (Belgische) humor.
 *
 * Taalregels: altijd "u", nooit "je/jij/jouw/ge/gij". Geen absolute medische
 * claims. Nooit schuldinducerend of overdreven enthousiast.
 */

type ToneMap = Record<ToneType, string>;

function pick(map: ToneMap, tone: ToneType): string {
  return map[tone];
}

/** Regels die willekeurig gekozen worden binnen één toon. */
type ToneListMap = Record<ToneType, string[]>;

function pickFrom(map: ToneListMap, tone: ToneType, seed: number): string {
  const list = map[tone];
  return list[Math.abs(seed) % list.length];
}

/** Begroeting op basis van tijdstip (zonder toonverschil in het dagdeel zelf). */
export function greeting(hour: number, name: string): string {
  const part = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
  return name ? `${part}, ${name}` : part;
}

/** Eén korte aanmoedigende regel op het dashboard, afhankelijk van de score. */
export function dailyNudge(tone: ToneType, scorePercentage: number | null, seed: number): string {
  if (scorePercentage === null) {
    return pick(
      {
        warm: 'Vul gerust in wat vandaag gelukt is. Elk klein ding telt.',
        business: 'Nog geen gegevens voor vandaag ingevuld.',
        dryHumor: 'De dag is nog een onbeschreven blad. Geen druk.',
      },
      tone,
    );
  }
  if (scorePercentage >= 80) {
    return pickFrom(
      {
        warm: [
          'Mooi in balans vandaag. Rust er gerust even van.',
          'Een sterke dag. U mag tevreden zijn.',
        ],
        business: ['Uw dagdoelen zijn grotendeels bereikt.', 'Sterke balansdag geregistreerd.'],
        dryHumor: [
          'Vandaag draaide u op volle toeren. Morgen mag de zetel weer meedoen.',
          'Uw drinkfles en uw elastieken hebben vandaag niets te klagen.',
        ],
      },
      tone,
      seed,
    );
  }
  if (scorePercentage >= 60) {
    return pickFrom(
      {
        warm: [
          'Behoorlijk in balans. Nog één kleine stap als u zin heeft.',
          'Goed bezig. Nog één kleine stap voor vandaag.',
        ],
        business: ['U bent op weg. Nog enkele doelen staan open.', 'Enkele doelen resteren.'],
        dryHumor: [
          'Netjes onderweg. De elastieken kijken hoopvol uw richting uit.',
          'Bijna daar. Nog even en de dag is rond.',
        ],
      },
      tone,
      seed,
    );
  }
  if (scorePercentage >= 40) {
    return pickFrom(
      {
        warm: [
          'Enkele goede keuzes vandaag. Tien minuten telt ook.',
          'Geen perfecte dag. Wel een dag waarop iets gelukt is.',
        ],
        business: ['Een deel van uw doelen is behaald.', 'Vandaag staan nog enkele doelen open.'],
        dryHumor: [
          'Uw drinkfles begint zich wat genegeerd te voelen.',
          'De elastieken hebben vandaag nog niets te doen gehad.',
        ],
      },
      tone,
      seed,
    );
  }
  return pickFrom(
    {
      warm: [
        'Een rustige dag mag ook. Morgen is er weer een.',
        'U hoeft vandaag nog maar één kleine stap te zetten.',
      ],
      business: ['Nog geen doelen behaald vandaag.', 'Vandaag staan de meeste doelen nog open.'],
      dryHumor: [
        'Geen paniek. Eén minder actieve dag is nog geen staatsramp.',
        'De zetel heeft vandaag al voldoende training gekregen.',
      ],
    },
    tone,
    seed,
  );
}

/** Korte kwalificatie van een balansscore. Nooit een "mislukt"-status. */
export function balanceLabel(percentage: number): string {
  if (percentage >= 80) return 'sterke balansdag';
  if (percentage >= 60) return 'behoorlijk in balans';
  if (percentage >= 40) return 'enkele goede keuzes';
  return 'vandaag was lastig';
}

/** Feitelijke terugkoppeling over alcoholvrije dagen. Nooit moraliserend. */
export function alcoholFeedback(tone: ToneType, thisWeek: number, lastWeek: number): string {
  const trend =
    thisWeek > lastWeek
      ? 'meer dan vorige week'
      : thisWeek < lastWeek
        ? 'minder dan vorige week'
        : 'evenveel als vorige week';
  return pick(
    {
      warm: `U had deze week ${thisWeek} alcoholvrije ${dagen(thisWeek)}. Vorige week waren dat er ${lastWeek}.`,
      business: `Alcoholvrije dagen deze week: ${thisWeek} (${trend}).`,
      dryHumor: `${thisWeek} alcoholvrije ${dagen(thisWeek)} deze week — ${trend}. De lever leest mee.`,
    },
    tone,
  );
}

function dagen(n: number): string {
  return n === 1 ? 'dag' : 'dagen';
}

/** Weekoverzicht-samenvatting. */
export function weekSummary(tone: ToneType, balancedDays: number, totalDays: number): string {
  return pick(
    {
      warm: `Deze week was op ${balancedDays} van de ${totalDays} dagen behoorlijk in balans.`,
      business: `Behoorlijk in balans op ${balancedDays}/${totalDays} dagen deze week.`,
      dryHumor: `${balancedDays} van de ${totalDays} dagen in balans. Geen perfecte week — wel een echte.`,
    },
    tone,
  );
}

/** Terugkoppeling voor de trainingsspeler bij afronden. */
export function workoutDone(tone: ToneType): string {
  return pick(
    {
      warm: 'Afgerond. Goed dat u even bewogen hebt.',
      business: 'Training voltooid en opgeslagen.',
      dryHumor: 'Klaar. De zetel zal u straks graag terugzien.',
    },
    tone,
  );
}

/** Zin voor de "geen zin"-training. */
export function lowMotivationLine(tone: ToneType): string {
  return pick(
    {
      warm: 'Tien minuten telt ook. Zelfs vijf is meer dan niets.',
      business: 'Een korte sessie is voldoende voor vandaag.',
      dryHumor: 'Voor dagen waarop zelfs tien minuten ambitieus klinkt.',
    },
    tone,
  );
}

/** Melding bij vaker wegen dan het ingestelde ritme. */
export function extraWeighNotice(): string {
  return 'U weegt vaker dan uw ingestelde ritme. Dat mag; de trendlijn blijft het meest betrouwbare beeld.';
}
