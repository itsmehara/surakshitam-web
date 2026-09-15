"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site, type NavItem } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import {
  MenuIcon,
  CloseIcon,
  ArrowRight,
  WhatsAppIcon,
  ChevronDown,
} from "@/components/icons";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Which primary-nav dropdown is open (by label), if any.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Close the open dropdown whenever the route changes (a menu link was followed).
  useEffect(() => setOpenMenu(null), [pathname]);

  const nav = primaryNav;

  // Query params that distinguish sibling menu items (Shop ?category=, Contact ?type=).
  const NAV_PARAMS = ["category", "type"];

  // Which primary-nav item corresponds to the current page. Items with a query
  // string match only when that param is set; the bare parent ("All Products",
  // plain "Contact") matches when none of the nav params is set.
  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    // Product pages count as "Shop" (the parent, not a category tab).
    if (path === "/shop" && pathname.startsWith("/product")) return !query;
    const pathMatch = pathname === path || pathname === path + "/";
    if (!pathMatch) return false;
    if (!query) return NAV_PARAMS.every((k) => !searchParams.get(k));
    return [...new URLSearchParams(query).entries()].every(([k, v]) => searchParams.get(k) === v);
  };

  /** A parent is active when it, or anything inside it, matches. */
  const isBranchActive = (item: NavItem) =>
    isActive(item.href) || !!item.children?.some((c) => isActive(c.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-forest/10 bg-cream/90 backdrop-blur-md" : "border-transparent bg-cream",
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          {/* Mobile: menu button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5 lg:hidden"
          >
            <MenuIcon />
          </button>

          <Logo className="lg:mr-4" />

          {/* Desktop nav — `whitespace-nowrap` so a label can never break
              mid-word if the list grows again. */}
          <nav
            ref={navRef}
            className="hidden items-center gap-x-4 lg:flex xl:gap-x-6"
            aria-label="Primary"
          >
            {nav.map((item) => {
              const active = isBranchActive(item);

              if (!item.children?.length) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative whitespace-nowrap text-sm transition-colors",
                      active ? "font-semibold text-forest" : "text-forest/70 hover:text-forest",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-moss transition-transform duration-300 ease-smooth",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                );
              }

              const open = openMenu === item.label;
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    className={cn(
                      "group relative inline-flex items-center gap-1 whitespace-nowrap py-1 text-sm transition-colors",
                      active ? "font-semibold text-forest" : "text-forest/70 hover:text-forest",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      width={13}
                      className={cn("transition-transform duration-200", open && "rotate-180")}
                    />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-moss transition-transform duration-300 ease-smooth",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </button>

                  {open && (
                    <div
                      role="menu"
                      aria-label={item.label}
                      className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-lg border border-forest/10 bg-cream shadow-card">
                        {item.children.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              role="menuitem"
                              onClick={() => setOpenMenu(null)}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                "block border-b border-forest/6 px-4 py-2.5 transition-colors last:border-b-0",
                                childActive ? "bg-parchment" : "hover:bg-parchment",
                              )}
                            >
                              <span
                                className={cn(
                                  "block text-sm",
                                  childActive
                                    ? "font-semibold text-moss"
                                    : "font-medium text-forest",
                                )}
                              >
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="mt-0.5 block text-xs text-forest/55">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side: the one action a listing site needs — start a WhatsApp chat.
              Icon-only on phones so it never crowds the wordmark. */}
          <WhatsAppLink
            cta="header-button"
            aria-label="Chat on WhatsApp"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-white shadow-soft transition-transform duration-200 hover:scale-[1.03] sm:w-auto sm:px-4"
          >
            <WhatsAppIcon width={18} height={18} />
            <span className="hidden sm:inline">Chat on WhatsApp</span>
          </WhatsAppLink>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-forest/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-cream shadow-xl transition-transform duration-300 ease-smooth",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5"
            >
              <CloseIcon />
            </button>
          </div>
          {/* The drawer has vertical room, so nested items are listed inline
              rather than hidden behind another tap. */}
          <nav className="flex flex-col overflow-y-auto px-3 py-4" aria-label="Mobile">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3.5 font-serif text-lg transition-colors",
                      active
                        ? "bg-parchment font-semibold text-moss"
                        : "text-forest hover:bg-parchment",
                    )}
                  >
                    {item.label}
                    <ArrowRight width={18} className={cn(active ? "text-moss" : "text-moss/60")} />
                  </Link>

                  {item.children?.length ? (
                    <div className="mb-1 ml-4 border-l border-forest/10 pl-3">
                      {item.children
                        // "All Products" is what the parent link already does.
                        .filter((child) => child.href !== item.href)
                        .map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                                childActive
                                  ? "font-semibold text-moss"
                                  : "text-forest/75 hover:bg-parchment hover:text-forest",
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-forest/10 px-5 py-4">
            <WhatsAppLink
              cta="mobile-drawer"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white"
            >
              <WhatsAppIcon width={18} /> Chat on WhatsApp
            </WhatsAppLink>
            <p className="mt-2 text-center text-xs text-forest/50">Mon–Sat, {site.hours}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
