"use client";

import { useEffect, useRef } from "react";

/**
 * The heavy ingredients — reetha, amla and half a lemon — falling under a real
 * solver so they collide with each other and pile up at the bottom. Keyframes
 * got us accelerate-bounce-roll, but they cannot do "these two hit each other
 * and stack", which is the one thing an engine buys.
 *
 * Deliberately hand-written rather than pulling in matter.js (~30KB gzipped):
 * this needs gravity, a floor, circle-circle collision and resting bodies, and
 * none of the constraints, joints, polygons or broadphase a real engine carries.
 * It comes to a couple of hundred lines and runs on 8 bodies.
 *
 * Guards, because this is decoration and must never cost a customer anything:
 *   - runs ONLY while the section is on screen (IntersectionObserver) and the
 *     tab is visible — no CPU burned behind another tab or below the fold
 *   - hard cap of 8 bodies
 *   - fixed timestep, clamped, so a stalled tab can't trigger a catch-up spiral
 *   - does nothing at all when the visitor asks for reduced motion
 *   - `pointer-events: none`, `aria-hidden` — never in the way of a button
 *
 * Leaves stay on CSS in `FallingBotanicals.tsx`: they don't collide with
 * anything, so paying for JavaScript to move them would buy nothing.
 *
 * Sprites (16 Sep): photo cut-outs in `public/physics/*.webp` (masters in
 * surakshitam-docs/source-assets/physics/), exported at 160px on the long side
 * = 2.5× the largest render size. They replaced hand-drawn SVGs, which is why
 * this file no longer imports anything from FallingBotanicals.
 */

/** Sprite file → its trimmed aspect (w/h), so w derives from h and nothing squashes. */
const SPRITES = {
  "reetha-cluster": 1.068,
  "reetha-pair": 1.14,
  "reetha-single": 1.001,
  amla: 1.029,
  "lemon-half": 1.035,
} as const;
type Sprite = keyof typeof SPRITES;

type Spec = { sprite: Sprite; r: number; w: number; h: number };

/** One body: sprite + rendered height; width follows the image, radius fits the round part. */
function spec(sprite: Sprite, h: number, rScale = 0.5): Spec {
  const w = Math.round(h * SPRITES[sprite]);
  return { sprite, r: Math.round(Math.min(w, h) * rScale), w, h };
}

/**
 * 8 bodies. Fewer than the cap the solver can handle, and it reads better —
 * a handful of fruit coming down, not a downpour. Kept varied: one big bunch,
 * one small bunch, singles, and a couple of lemon halves.
 */
const SPECS: Spec[] = [
  spec("reetha-cluster", 64, 0.46), // three nuts on a stalk — the biggest piece
  spec("reetha-pair", 54, 0.46),
  spec("reetha-single", 30),
  spec("amla", 46),
  spec("amla", 36),
  spec("lemon-half", 44),
  spec("lemon-half", 38),
  spec("reetha-single", 24),
];

const GRAVITY = 1400;      // px/s² — tuned by eye, not by physics texts
const RESTITUTION = 0.42;  // how much bounce survives an impact
const FLOOR_FRICTION = 0.86;
const AIR = 0.999;
// The pile forms on the section's bottom edge — the same line the CSS leaves
// and drop-pieces reach — so nothing looks like it stopped in mid-air.
const GROUND_FRACTION = 1;
const REST_SPEED = 26;     // below this, a body on the floor is considered settled
const RESPAWN_AFTER = 2.6; // seconds a body rests before it falls again
const STEP = 1 / 60;

type Body = {
  spec: Spec;
  x: number; y: number;
  vx: number; vy: number;
  angle: number; spin: number;
  restFor: number;
  el?: HTMLSpanElement | null;
};

function seedBody(b: Body, width: number, i: number) {
  // spread the drop points, and stagger the first fall so they don't arrive together
  b.x = ((i + 0.5) / SPECS.length) * width + (i % 3) * 14 - 14;
  b.y = -b.spec.r - 40 - ((i * 137) % 520);
  b.vx = ((i % 5) - 2) * 9;
  b.vy = 0;
  b.spin = ((i % 7) - 3) * 0.9;
  b.restFor = 0;
}

export function FallingFruitPhysics({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bodies: Body[] = SPECS.map((spec) => ({
      spec, x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, restFor: 0,
    }));
    bodiesRef.current = bodies;

    let width = host.clientWidth;
    let height = host.clientHeight;
    bodies.forEach((b, i) => {
      b.el = host.children[i] as HTMLSpanElement;
      seedBody(b, width, i);
    });

    let raf = 0;
    let last = 0;
    let acc = 0;
    let onScreen = false;

    const step = () => {
      const ground = height * GROUND_FRACTION;

      for (const b of bodies) {
        b.vy += GRAVITY * STEP;
        b.vx *= AIR;
        b.x += b.vx * STEP;
        b.y += b.vy * STEP;
        b.angle += b.spin * STEP;

        // walls
        if (b.x < b.spec.r) { b.x = b.spec.r; b.vx = Math.abs(b.vx) * 0.5; }
        if (b.x > width - b.spec.r) { b.x = width - b.spec.r; b.vx = -Math.abs(b.vx) * 0.5; }

        // floor — rest the *drawn* bottom on the line, not the collision circle
        // (some sprites are taller than their circle, e.g. an amla cluster)
        const foot = Math.max(b.spec.r, b.spec.h / 2);
        if (b.y > ground - foot) {
          b.y = ground - foot;
          if (b.vy > 0) {
            b.vy = -b.vy * RESTITUTION;
            b.vx *= FLOOR_FRICTION;
            b.spin = b.vx * 0.05;          // rolls in the direction it slides
            if (Math.abs(b.vy) < REST_SPEED) b.vy = 0;
          }
        }
      }

      // body-on-body: equal-mass circle collision, resolved positionally then by impulse.
      // Two passes is enough to settle a small pile without the jitter one pass leaves.
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], c = bodies[j];
            const dx = c.x - a.x, dy = c.y - a.y;
            const min = a.spec.r + c.spec.r;
            const d2 = dx * dx + dy * dy;
            if (d2 >= min * min || d2 === 0) continue;
            const d = Math.sqrt(d2);
            const nx = dx / d, ny = dy / d;
            const overlap = (min - d) / 2;
            a.x -= nx * overlap; a.y -= ny * overlap;
            c.x += nx * overlap; c.y += ny * overlap;
            const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
            if (rel > 0) continue;
            const imp = -(1 + RESTITUTION) * rel / 2;
            a.vx -= imp * nx; a.vy -= imp * ny;
            c.vx += imp * nx; c.vy += imp * ny;
            a.spin -= imp * 0.02; c.spin += imp * 0.02;
          }
        }
      }

      // settle, then drop again so the pile never just accumulates forever
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const settled =
          b.y > ground - Math.max(b.spec.r, b.spec.h / 2) - 2 && Math.abs(b.vy) < REST_SPEED && Math.abs(b.vx) < 12;
        if (settled) {
          b.restFor += STEP;
          b.vx *= 0.9; b.spin *= 0.9;
          if (b.restFor > RESPAWN_AFTER) seedBody(b, width, i);
        } else if (b.y < ground) {
          b.restFor = 0;
        }
      }
    };

    const draw = () => {
      for (const b of bodies) {
        if (!b.el) continue;
        b.el.style.transform =
          `translate3d(${(b.x - b.spec.w / 2).toFixed(1)}px, ${(b.y - b.spec.h / 2).toFixed(1)}px, 0) rotate(${b.angle.toFixed(2)}rad)`;
      }
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = t;
      // clamp: a backgrounded tab must not queue up a hundred steps to catch up
      acc = Math.min(acc + (t - last) / 1000, 0.1);
      last = t;
      while (acc >= STEP) { step(); acc -= STEP; }
      draw();
    };

    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const sync = () => (onScreen && !document.hidden ? start() : stop());

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0 });
    io.observe(host);
    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(() => {
      width = host.clientWidth;
      height = host.clientHeight;
    });
    ro.observe(host);

    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")}
    >
      {SPECS.map((sp, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 block will-change-transform"
          // starts above the top edge, so the server-rendered markup matches and
          // nothing flashes into view before the solver takes over
          style={{ transform: `translate3d(0, -400px, 0)` }}
        >
          {/* plain <img>, not next/image: fixed size, already optimised, must never lazy-load */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/physics/${sp.sprite}.webp`}
            alt=""
            width={sp.w}
            height={sp.h}
            draggable={false}
            className="block select-none"
            // a hint of contact shadow so a photo cut-out sits on the page instead of floating on it
            style={{ filter: "drop-shadow(0 2px 2px rgba(20, 30, 15, 0.22))" }}
          />
        </span>
      ))}
    </div>
  );
}
