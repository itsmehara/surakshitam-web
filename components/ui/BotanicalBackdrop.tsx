import { cn } from "@/lib/cn";

/**
 * Soft botanical wash inspired by the Surakshitam Naturals business card:
 * a pale green-cream field with a repeating leaf / sprig / lemon-slice motif,
 * plus a few scattered lemons for warmth. Purely decorative and restrained.
 */
export function BotanicalBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* soft colour washes */}
      <div className="absolute -left-32 -top-24 h-[32rem] w-[32rem] rounded-full bg-sage/15 blur-3xl" />
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#E7C34A]/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-moss/5 blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="botanical-tile"
            width="230"
            height="230"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            <g fill="none" stroke="#55694F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* leaf */}
              <g transform="translate(24 30) rotate(-20)" fill="#55694F" stroke="none">
                <path d="M0 26C0 8 16-8 46-8 46 20 30 34 0 34Z" opacity="0.9" />
              </g>
              <path d="M28 52C34 40 46 32 60 27" />
              {/* lemon slice (outline) */}
              <g transform="translate(160 44)">
                <circle cx="0" cy="0" r="16" />
                <circle cx="0" cy="0" r="10" />
                <path d="M0 0L0-10M0 0L8.7-5M0 0L8.7 5M0 0L0 10M0 0L-8.7 5M0 0L-8.7-5" strokeWidth="1.4" />
              </g>
              {/* sprig */}
              <g transform="translate(56 150)">
                <path d="M0 40C6 24 6 8 2-6" />
                <path d="M3 30C-6 26-12 18-12 8" />
                <path d="M3 20C12 16 18 8 18-2" />
                <path d="M2 10C-4 6-8 0-8-8" />
              </g>
              {/* small leaf */}
              <g transform="translate(176 168) rotate(35)" fill="#55694F" stroke="none">
                <path d="M0 18C0 4 12-8 34-8 34 12 22 24 0 24Z" opacity="0.9" />
              </g>
              {/* dots */}
              <g fill="#55694F" stroke="none">
                <circle cx="120" cy="120" r="2.4" />
                <circle cx="200" cy="150" r="2" />
                <circle cx="96" cy="196" r="2" />
              </g>
            </g>
          </pattern>
        </defs>

        {/* repeating motif */}
        <rect width="100%" height="100%" fill="url(#botanical-tile)" opacity="0.07" />

        {/* scattered lemons (warm accent, like the flyer) */}
        <g opacity="0.12">
          <Lemon x={90} y={90} r={26} rot={-18} />
          <Lemon x={1050} y={70} r={30} rot={22} />
          <Lemon x={1180} y={430} r={22} rot={-30} />
          <Lemon x={180} y={520} r={24} rot={14} />
        </g>
      </svg>
    </div>
  );
}

function Lemon({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {/* body */}
      <ellipse cx="0" cy="0" rx={r} ry={r * 0.74} fill="#E7C34A" />
      <ellipse cx="0" cy="0" rx={r} ry={r * 0.74} fill="none" stroke="#C9A233" strokeWidth="2" />
      {/* tiny nib + leaf */}
      <path d={`M${r} 0 l7 0`} stroke="#C9A233" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d={`M${-r + 2} ${-2} c-8 -10 -22 -12 -30 -6 8 8 22 10 30 6Z`}
        fill="#7C8F6E"
      />
    </g>
  );
}
