import { cn } from "@/lib/cn";

/**
 * Ingredients drifting down on a breeze.
 *
 * Four rules make this read as real rather than as decoration:
 *
 * 1. **True relative size.** A hibiscus flower is roughly 10cm across, a neem
 *    sprig 7cm, a lemon half 4cm, an amla 3cm and a reetha barely 2cm. Each is
 *    drawn at its own size in that proportion and `scale` varies only ±15% for
 *    depth, so a soapnut can never render bigger than a flower.
 * 2. **Nothing fades.** Full-strength colour throughout. The layer sits behind
 *    page content, so solid colour costs nothing in legibility.
 * 3. **Weight decides speed.** Flower ~25s, neem sprig ~22s, lemon ~9s, reetha
 *    ~9s, amla ~7.5s. The heavy pieces also land: accelerate in, bounce three
 *    times (high, then lower), roll away spinning.
 * 4. **They grow the way they grow.** Neem and tulsi fall as sprigs of leaflets
 *    on a stem. Soapnuts come down on a branched panicle and amla on a short
 *    branchlet — the stalk is what stops a group of three reading as three
 *    unrelated circles that happen to be near each other.
 *
 * The heavy pieces — reetha, amla and the lemon half — are no longer here.
 * They are driven by a real solver in `FallingFruitPhysics.tsx` so they can
 * collide with each other and pile up, which keyframes cannot do. Their artwork
 * still lives in this file and is exported for that layer to use.
 *
 * Still CSS-only — no library, no canvas, no per-frame JavaScript, and no
 * client component, so it ships zero JS. Values are hand-picked rather than
 * random so the server and browser renders match. `aria-hidden`,
 * `pointer-events-none`, and stopped entirely by the global
 * prefers-reduced-motion rule in globals.css.
 */

export type Kind = "neem" | "tulsi" | "hibiscus" | "reetha" | "amla" | "lemon";

type Piece = {
  kind: Kind;
  left: number;
  /** seconds for one cycle — governed by weight, not by variety */
  dur: number;
  sway: number;
  delay: number;
  amp: number;
  /** depth only — ±15%, so real-world proportions between kinds hold */
  scale: number;
  /** heavy pieces: how far it rolls after landing, and how much it spins */
  roll?: string;
  spin?: string;
  /** heavy pieces: how many fruit hang on the one stalk */
  count?: number;
  /** lemon only: seconds for one full tumble */
  flip?: number;
};

const PIECES: Piece[] = [
  { kind: "neem",     left: 3,  dur: 21,  sway: 6.5, delay: -2,  amp: 30, scale: 1.05 },
  { kind: "hibiscus", left: 11, dur: 25,  sway: 8,   delay: -13, amp: 36, scale: 0.9  },
  { kind: "tulsi",    left: 27, dur: 19,  sway: 7,   delay: -17, amp: 32, scale: 1.05 },
  { kind: "neem",     left: 39, dur: 23,  sway: 9,   delay: -9,  amp: 38, scale: 0.86 },
  { kind: "hibiscus", left: 53, dur: 26,  sway: 6.8, delay: -21, amp: 28, scale: 1.12 },
  { kind: "tulsi",    left: 60, dur: 20,  sway: 9.5, delay: -5,  amp: 40, scale: 0.88 },
  { kind: "neem",     left: 74, dur: 22,  sway: 6.2, delay: -15, amp: 26, scale: 1.0  },
  { kind: "hibiscus", left: 88, dur: 24,  sway: 7.6, delay: -3,  amp: 34, scale: 0.95 },
  { kind: "tulsi",    left: 97, dur: 18,  sway: 6,   delay: -19, amp: 24, scale: 1.1  },
];

/** Landing line and the three bounce heights, as % of the section. */
const GROUND = "76%";
const BOUNCES = ["50%", "63%", "71%"];

const GREEN = { neem: "#3F6136", neemDark: "#2C4726", tulsi: "#6E9B57", tulsiDark: "#4C7038" };
const STEM = "#6B5A2E";

/* ------------------------------ fruit parts ------------------------------ */

const Nut = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#B9803C" />
    <path
      d={`M${x - r * 0.5} ${y - r * 0.6}c${r * 0.27} ${r * 0.35} ${r * 0.27} ${r * 0.96} 0 ${r * 1.31}M${x + r * 0.5} ${y - r * 0.6}c${-r * 0.27} ${r * 0.35} ${-r * 0.27} ${r * 0.96} 0 ${r * 1.31}`}
      stroke="#9A6529" strokeWidth={r * 0.13} fill="none" strokeLinecap="round"
    />
    <ellipse cx={x - r * 0.36} cy={y - r * 0.42} rx={r * 0.3} ry={r * 0.21} fill="#DCA96A" />
  </g>
);

const Fruit = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#B7CE55" />
    <path
      d={`M${x} ${y - r} v${r * 2}M${x - r * 0.66} ${y - r * 0.72}c${r * 0.21} ${r * 0.42} ${r * 0.21} ${r * 1.01} 0 ${r * 1.43}M${x + r * 0.66} ${y - r * 0.72}c${-r * 0.21} ${r * 0.42} ${-r * 0.21} ${r * 1.01} 0 ${r * 1.43}`}
      stroke="#94AC3C" strokeWidth={r * 0.11} fill="none" strokeLinecap="round"
    />
    <ellipse cx={x - r * 0.38} cy={y - r * 0.43} rx={r * 0.27} ry={r * 0.19} fill="#D2E38A" />
    <circle cx={x} cy={y - r * 0.97} r={r * 0.19} fill="#5F6B33" />
  </g>
);

export function ReethaCluster({ count }: { count: number }) {
  if (count <= 1)
    return (
      <svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true">
        <path d="M12 1v8" stroke={STEM} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <Nut x={12} y={19} r={9.5} />
      </svg>
    );
  if (count <= 3)
    return (
      <svg width="62" height="58" viewBox="0 0 62 58" aria-hidden="true">
        <g stroke={STEM} strokeWidth="1.7" fill="none" strokeLinecap="round">
          <path d="M31 1v15" />
          <path d="M31 16C25 20 19 24 16 29" />
          <path d="M31 16c1 8 1 12 0 16" />
          <path d="M31 16c6 4 11 7 14 12" />
        </g>
        <Nut x={15} y={38} r={9} />
        <Nut x={31} y={44} r={9.5} />
        <Nut x={46} y={39} r={8.5} />
      </svg>
    );
  return (
    <svg width="78" height="74" viewBox="0 0 78 74" aria-hidden="true">
      <g stroke={STEM} strokeWidth="1.7" fill="none" strokeLinecap="round">
        <path d="M39 1v13" />
        <path d="M39 14C31 18 22 22 17 28" />
        <path d="M39 14c7 4 15 8 20 13" />
        <path d="M39 14c0 8 0 14-1 20" />
        <path d="M24 34c1 8 2 14 3 18" />
        <path d="M53 35c-1 8-3 13-5 17" />
      </g>
      <Nut x={16} y={34} r={8.5} />
      <Nut x={38} y={40} r={9} />
      <Nut x={60} y={35} r={8} />
      <Nut x={28} y={58} r={8.5} />
      <Nut x={49} y={57} r={8} />
    </svg>
  );
}

export function AmlaCluster({ count }: { count: number }) {
  if (count <= 1)
    return (
      <svg width="36" height="46" viewBox="0 0 36 46" aria-hidden="true">
        <path d="M18 1v10" stroke={STEM} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <Fruit x={18} y={28} r={15} />
      </svg>
    );
  return (
    <svg width="60" height="52" viewBox="0 0 60 52" aria-hidden="true">
      <g stroke={STEM} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M30 1v11" />
        <path d="M30 12c-6 3-10 6-12 10" />
        <path d="M30 12c6 3 10 5 12 9" />
      </g>
      <ellipse cx="45" cy="9" rx="6" ry="3.4" fill={GREEN.tulsi} transform="rotate(-24 45 9)" />
      <Fruit x={17} y={33} r={14} />
      <Fruit x={43} y={31} r={12.5} />
    </svg>
  );
}

export const LemonFace = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
    <circle cx="21" cy="21" r="20" fill="#E8B93A" />
    <circle cx="21" cy="21" r="17.5" fill="#FBF3D4" />
    <circle cx="21" cy="21" r="15.5" fill="#F6DC72" />
    <g stroke="#FBF3D4" strokeWidth="1.7" strokeLinecap="round">
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8;
        return (
          <line
            key={i}
            x1={21 + Math.cos(a) * 2.4} y1={21 + Math.sin(a) * 2.4}
            x2={21 + Math.cos(a) * 15} y2={21 + Math.sin(a) * 15}
          />
        );
      })}
    </g>
    <circle cx="21" cy="21" r="2.8" fill="#FBF3D4" />
  </svg>
);

/**
 * The rind seen edge-on. Without this the half is two infinitely-thin faces, so
 * at 90° through its turn it vanishes to a line — which is exactly what reads
 * as "not a solid object". Two of these sit at the sides of a 3D box and come
 * into view precisely when the flat faces go edge-on.
 */
export const LemonEdge = () => (
  <svg width="11" height="42" viewBox="0 0 11 42" aria-hidden="true">
    <rect x="0" y="0" width="11" height="42" rx="5.5" fill="#E8B93A" />
    <rect x="3.2" y="1.5" width="4.6" height="39" rx="2.3" fill="#FBF3D4" opacity="0.85" />
  </svg>
);

export const LemonBack = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
    <circle cx="21" cy="21" r="20" fill="#D9A72C" />
    <path d="M8 13c6-4 15-5 22-2" stroke="#EBC65C" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="15" cy="15" rx="5.4" ry="3.6" fill="#EED07A" opacity="0.75" transform="rotate(-28 15 15)" />
  </svg>
);

/* -------------------------------- leaves -------------------------------- */

function Leaf({ kind }: { kind: Kind }) {
  if (kind === "hibiscus")
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <g fill="#C84A6E">
          <ellipse cx="26" cy="12" rx="10.5" ry="11.5" />
          <ellipse cx="39" cy="22" rx="10.5" ry="11.5" transform="rotate(72 39 22)" />
          <ellipse cx="34" cy="37" rx="10.5" ry="11.5" transform="rotate(144 34 37)" />
          <ellipse cx="18" cy="37" rx="10.5" ry="11.5" transform="rotate(216 18 37)" />
          <ellipse cx="13" cy="22" rx="10.5" ry="11.5" transform="rotate(288 13 22)" />
        </g>
        <circle cx="26" cy="26" r="7" fill="#9E2E50" />
        <path d="M26 26 L36 41" stroke="#F2C14E" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36.8" cy="42" r="3.4" fill="#F2C14E" />
      </svg>
    );

  if (kind === "tulsi")
    return (
      <svg width="40" height="46" viewBox="0 0 40 46" aria-hidden="true">
        <path d="M20 44V16" stroke={GREEN.tulsiDark} strokeWidth="2" strokeLinecap="round" fill="none" />
        <g fill={GREEN.tulsi}>
          <ellipse cx="11" cy="26" rx="7" ry="9.5" transform="rotate(-32 11 26)" />
          <ellipse cx="29" cy="26" rx="7" ry="9.5" transform="rotate(32 29 26)" />
          <ellipse cx="20" cy="11" rx="7.5" ry="10" />
        </g>
        <g stroke={GREEN.tulsiDark} strokeWidth="1.1" strokeLinecap="round">
          <path d="M20 3.5v15" />
          <path d="M15.5 21.5 6.5 30.5" />
          <path d="M24.5 21.5 33.5 30.5" />
        </g>
      </svg>
    );

  // neem — a sprig of seven leaflets, which is how neem actually grows
  return (
    <svg width="40" height="64" viewBox="0 0 40 64" aria-hidden="true">
      <path d="M20 62V6" stroke={GREEN.neemDark} strokeWidth="2" strokeLinecap="round" fill="none" />
      <g fill={GREEN.neem}>
        <ellipse cx="11" cy="17" rx="4.4" ry="9.5" transform="rotate(-38 11 17)" />
        <ellipse cx="29" cy="17" rx="4.4" ry="9.5" transform="rotate(38 29 17)" />
        <ellipse cx="10" cy="32" rx="4.6" ry="10" transform="rotate(-38 10 32)" />
        <ellipse cx="30" cy="32" rx="4.6" ry="10" transform="rotate(38 30 32)" />
        <ellipse cx="11.5" cy="47" rx="4.2" ry="9" transform="rotate(-38 11.5 47)" />
        <ellipse cx="28.5" cy="47" rx="4.2" ry="9" transform="rotate(38 28.5 47)" />
        <ellipse cx="20" cy="9" rx="4" ry="8.5" />
      </g>
    </svg>
  );
}

/* -------------------------------- layer --------------------------------- */

export function FallingBotanicals({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="sn-gust absolute inset-0">
        {PIECES.map((p, i) => {
          // The animated wrapper is the full height of the section, so a
          // percentage translation is a percentage of the section — not of the
          // little leaf itself.
          const common = {
            left: `${p.left}%`,
            "--sn-dur": `${p.dur}s`,
            "--sn-delay": `${p.delay}s`,
          } as React.CSSProperties;

          return (
            <span key={i} className="sn-fall absolute top-0 h-full will-change-transform" style={common}>
              <span
                className="sn-sway block will-change-transform"
                style={
                  {
                    transform: `scale(${p.scale})`,
                    "--sn-sway": `${p.amp}px`,
                    "--sn-swaydur": `${p.sway}s`,
                    "--sn-delay": `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                <Leaf kind={p.kind} />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
