# Mijn Balans

**Kleine keuzes. Zichtbare vooruitgang.**
Ontwikkeld door huisarts Dr. Ethel Brits.

Mijn Balans is een rustige leefstijlapp. Geen calorieënteller, geen dieetapp — wel
een hulpmiddel om regelmatig te bewegen, kracht op te bouwen, gewicht en buikomtrek op
te volgen, voldoende te drinken, groenten en fruit te eten, slaap en energie te volgen
en haalbare gewoontes vol te houden. Kleine, haalbare stappen. Gewone taal. Geen
schuldgevoel, geen prestatiedruk.

Alle gegevens blijven **lokaal op uw toestel**. Er is geen account, geen server en er
worden geen gezondheidsgegevens verstuurd.

## Installatie

```bash
npm install
npm run dev
```

De app draait daarna op de door Vite getoonde lokale URL.

## Scripts

| Script | Doel |
|---|---|
| `npm run dev` | Start de ontwikkelserver |
| `npm run build` | Typecheck + productiebuild |
| `npm run preview` | Bekijk de productiebuild lokaal |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit- en componenttests) |

### Tests

De unit- en componenttests dekken onder meer de balansscore (inclusief
uitgeschakelde modules en een categorie op nul), weekgemiddelden,
meetfrequentielogica, de lokale opslag met schemaversie, importvalidatie en de
inzicht-drempels. Draai ze met `npm run test`.

Een Playwright end-to-end-test is bewust **optioneel** en niet meegeleverd: die
stap vergt een browserinstallatie en een draaiende dev-server en is daarmee het
meest breekbaar. De hoofdflow (onboarding → dagregistratie → training voltooien →
meting toevoegen → grafiek bekijken → export maken) is wel volledig met de hand
te doorlopen.

## Techniek

React · TypeScript (strict) · Vite · Tailwind CSS · Recharts · Lucide React ·
React Router · Zustand · date-fns · vite-plugin-pwa · Vitest + React Testing Library.

Opslag: `localStorage` voor profiel, logs, trainingen en metingen; **IndexedDB** voor
lichaamsfoto's. Alles achter een `StorageProvider`-interface, zodat een online opslag
(bijvoorbeeld Firestore) later inplugbaar is.

## Mappenstructuur

```
src/
  app/            App-shell, routing, navigatie
  components/     Gedeelde UI-componenten
  features/       onboarding, dashboard, workouts, progress, insights, settings
  data/           oefeningen, trainingen, weetjes, teksten (copy)
  hooks/          herbruikbare hooks
  lib/            algemene bouwstenen
  services/storage/  opslaglaag (StorageProvider)
  store/          Zustand-state
  types/          typedefinities
  utils/          hulpfuncties
  styles/         globale stijlen en design tokens
```

## Privacy

Gegevens blijven in deze versie lokaal op het toestel. Bij het wissen van
browsergegevens kunnen lokale gegevens verloren gaan; regelmatig exporteren wordt
aanbevolen.
