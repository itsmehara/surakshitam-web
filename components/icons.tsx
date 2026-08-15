import type { SVGProps } from "react";

/**
 * Lightweight inline icon set (1.75 stroke, currentColor).
 * Keeps the bundle free of an icon dependency for the prototype.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 8H6" />
    <circle cx="9" cy="21" r="1" />
    <circle cx="18" cy="21" r="1" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
  </svg>
);

export const StarOutline = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-9 16-9-1 9-5 12.5-9 13z" />
    <path d="M8 17c2-4 5-6 9-7" />
  </svg>
);

export const BeakerIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
    <path d="M7.5 14h9" />
  </svg>
);

export const SproutIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21v-8" />
    <path d="M12 13c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5z" />
    <path d="M12 13c0-2.5-2-4.5-5-4.5 0 3 2 4.5 5 4.5z" />
  </svg>
);

export const RecycleIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M7 19H5a2 2 0 0 1-1.7-3l1.6-2.7" />
    <path d="M8.5 5.5l1.2-2a2 2 0 0 1 3.4 0l1.6 2.7" />
    <path d="M17 8l1.9 3.2A2 2 0 0 1 17.2 14H14" />
    <path d="M9 22l-2-3 3.5-1" />
    <path d="M14 2l1.5 3.3" />
    <path d="M20 14l-1 3.5-3.3-.9" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.4-9.2-8.2A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 9.2 5.8C19 15.6 12 20 12 20z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const TruckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.4-4A7.5 7.5 0 1 1 9 19.6z" />
    <path d="M9 9.5c.2 2 2.5 4.3 4.5 4.5.7 0 1.3-.6 1.5-1.2l-1.8-1-1 .8c-.8-.4-1.4-1-1.8-1.8l.8-1-1-1.8c-.6.2-1.2.8-1.2 1.5z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8z" />
  </svg>
);
