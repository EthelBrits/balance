/**
 * Eén gedeeld figuur-component voor alle oefeningen.
 *
 * Vaste stijlregels (bewust strikt om een consistente look te houden):
 *  - 64 x 64 viewBox, stroke-width 2, stroke: currentColor, geen fill
 *  - geabstraheerd silhouet, geen gezicht, geen detail
 *  - maximaal ±12 paden per tekening
 *
 * Alleen kernbewegingen worden getekend; varianten hergebruiken dezelfde pose
 * met een aangepast label.
 */

export type FigurePose =
  | 'squat'
  | 'hinge'
  | 'row'
  | 'press'
  | 'pushup'
  | 'bridge'
  | 'lunge'
  | 'deadbug'
  | 'birddog'
  | 'calfRaise'
  | 'marching'
  | 'breathing';

type Props = {
  pose: FigurePose;
  className?: string;
};

export function ExerciseFigure({ pose, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={POSE_LABELS[pose]}
    >
      {/* subtiele grondlijn */}
      <line x1="8" y1="58" x2="56" y2="58" opacity={0.25} />
      {POSES[pose]}
    </svg>
  );
}

const POSE_LABELS: Record<FigurePose, string> = {
  squat: 'Figuur dat een squat uitvoert',
  hinge: 'Figuur dat vanuit de heup voorover buigt',
  row: 'Figuur dat een roeibeweging maakt',
  press: 'Figuur dat boven het hoofd duwt',
  pushup: 'Figuur in push-uphouding',
  bridge: 'Figuur in brughouding',
  lunge: 'Figuur in uitvalspas',
  deadbug: 'Figuur in dead bug-houding',
  birddog: 'Figuur in bird dog-houding',
  calfRaise: 'Figuur dat op de tenen staat',
  marching: 'Figuur dat ter plaatse marcheert',
  breathing: 'Figuur dat rustig ademt',
};

const POSES: Record<FigurePose, JSX.Element> = {
  squat: (
    <>
      <circle cx="32" cy="12" r="5" />
      <path d="M32 17 V32" />
      <path d="M32 21 L24 26 M32 21 L40 26" />
      <path d="M32 32 L24 40 L24 52 M32 32 L40 40 L40 52" />
    </>
  ),
  hinge: (
    <>
      <circle cx="16" cy="20" r="5" />
      <path d="M20 22 L40 30" />
      <path d="M24 24 L26 36 M28 26 L30 36" />
      <path d="M40 30 L40 44 M40 30 L46 44" />
    </>
  ),
  row: (
    <>
      <circle cx="18" cy="22" r="5" />
      <path d="M22 24 L42 32" />
      <path d="M30 27 L34 20 M34 29 L40 24" />
      <path d="M42 32 L42 46 M42 32 L48 46" />
    </>
  ),
  press: (
    <>
      <circle cx="32" cy="16" r="5" />
      <path d="M32 21 V40" />
      <path d="M32 24 L26 12 M32 24 L38 12" />
      <path d="M32 40 L26 54 M32 40 L38 54" />
    </>
  ),
  pushup: (
    <>
      <circle cx="14" cy="30" r="5" />
      <path d="M19 31 L46 38" />
      <path d="M22 32 L22 46 M28 33 L28 46" />
      <path d="M46 38 L52 46" />
    </>
  ),
  bridge: (
    <>
      <circle cx="14" cy="40" r="5" />
      <path d="M19 40 L34 30" />
      <path d="M34 30 L44 40 L44 50" />
      <path d="M19 40 L19 50 M46 50 L40 50" />
    </>
  ),
  lunge: (
    <>
      <circle cx="30" cy="14" r="5" />
      <path d="M30 19 V34" />
      <path d="M30 23 L24 30 M30 23 L36 30" />
      <path d="M30 34 L20 42 L20 52 M30 34 L42 44 L46 52" />
    </>
  ),
  deadbug: (
    <>
      <circle cx="14" cy="40" r="5" />
      <path d="M19 40 L44 40" />
      <path d="M26 40 L24 28 M34 40 L36 30" />
      <path d="M44 40 L50 32 M44 40 L50 46" />
    </>
  ),
  birddog: (
    <>
      <circle cx="14" cy="28" r="5" />
      <path d="M19 30 L40 34" />
      <path d="M40 34 L52 26" />
      <path d="M22 32 L22 46 M40 34 L48 48" />
    </>
  ),
  calfRaise: (
    <>
      <circle cx="32" cy="14" r="5" />
      <path d="M32 19 V38" />
      <path d="M32 23 L26 32 M32 23 L38 32" />
      <path d="M32 38 L28 50 M32 38 L36 50" />
      <path d="M24 52 L30 50 M34 50 L40 52" />
    </>
  ),
  marching: (
    <>
      <circle cx="32" cy="12" r="5" />
      <path d="M32 17 V34" />
      <path d="M32 21 L26 28 M32 21 L38 30" />
      <path d="M32 34 L26 40 L28 50 M32 34 L38 42 L38 52" />
    </>
  ),
  breathing: (
    <>
      <circle cx="32" cy="14" r="5" />
      <path d="M32 19 V38" />
      <path d="M32 26 L24 30 L27 34 M32 26 L40 30 L37 34" />
      <path d="M32 38 L27 52 M32 38 L37 52" />
    </>
  ),
};
