/**
 * Camera moves for the hero banners — "drone" style: each slide glides from
 * one framing to another over its whole time on screen, and every slide has
 * its own direction so neighbours never feel the same.
 *
 * Amplitude budget: the v2 banners keep products inside the central ~70%, so
 * ~13–15% on every side is background. Worst case here is zoom 1.18 (crops
 * 7.6% per side) + 5% travel = 12.6% — inside the margin. Mobile shows the
 * whole image in a band, so it gets the same moves at ~60% amplitude,
 * anchored at the top.
 *
 * Applied via one keyframe (`sn-move` in globals.css) that reads
 * `--mv-from` / `--mv-to`; `moveStyle()` builds those for a slide index.
 */

export type CameraMove = {
  /** short label, for the code reader only */
  name: string;
  from: { s: number; x: number; y: number };
  to: { s: number; x: number; y: number };
};

/** Six moves; a slide uses `MOVES[i % MOVES.length]`. x/y are % of the image. */
export const MOVES: CameraMove[] = [
  { name: "pan right→left", from: { s: 1.14, x: 5, y: 0 }, to: { s: 1.16, x: -5, y: 0 } },
  { name: "push in", from: { s: 1.04, x: 0, y: 1 }, to: { s: 1.18, x: -2, y: -1 } },
  { name: "pan left→right, pull back", from: { s: 1.18, x: -4, y: 1 }, to: { s: 1.1, x: 4, y: 0 } },
  { name: "corner reveal (top-left → centre)", from: { s: 1.2, x: 6, y: 5 }, to: { s: 1.08, x: 0, y: 0 } },
  { name: "rise", from: { s: 1.08, x: 1, y: 4 }, to: { s: 1.16, x: -1, y: -3 } },
  { name: "diagonal glide (bottom-right → centre-left)", from: { s: 1.15, x: -5, y: -4 }, to: { s: 1.1, x: 2, y: 1 } },
];

const tf = (p: { s: number; x: number; y: number }, amp: number, base = 1) =>
  `scale(${(base + (p.s - 1) * amp).toFixed(3)}) translate3d(${(p.x * amp).toFixed(2)}%, ${(p.y * amp).toFixed(2)}%, 0)`;

/** CSS custom properties for the move — desktop at full amplitude, mobile at 60%. */
export function moveStyle(i: number, amp = 1): React.CSSProperties {
  const m = MOVES[i % MOVES.length];
  return { "--mv-from": tf(m.from, amp), "--mv-to": tf(m.to, amp) } as React.CSSProperties;
}
