import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-cream hover:bg-ink shadow-soft",
  secondary:
    "bg-clay text-cream hover:bg-clayDark shadow-soft",
  outline:
    "border border-forest/25 text-forest hover:border-forest hover:bg-forest/5",
  ghost: "text-forest hover:bg-forest/5",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 ease-smooth focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(baseClass, variants[variant], sizes[size], className);
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<"button">;

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

export function LinkButton({ href, variant = "primary", size = "md", className, children, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
