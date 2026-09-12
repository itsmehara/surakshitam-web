"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site, type NavItem } from "@/lib/site";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import {
  MenuIcon,
  CloseIcon,
  SearchIcon,
  CartIcon,
  UserIcon,
  ArrowRight,
  PhoneIcon,
  WhatsAppIcon,
  HeartIcon,
  ChevronDown,
} from "@/components/icons";
import { cn } from "@/lib/cn";

const accountMenuItem =
  "block px-4 py-2.5 text-sm text-forest transition-colors hover:bg-parchment";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const { count, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn: authed, user, signOut } = useAuth();
  const accountHref = authed ? "/account" : "/login?next=/account";
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";

  // Signing out lives inside this menu rather than on a visible button, so it
  // takes a deliberate two-step action and can't be hit by accident.
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!accountMenuRef.current?.contains(e.target as Node)) setAccountMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAccountMenuOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountMenuOpen]);

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

  // Close both menus whenever the route changes (a menu link was followed).
  useEffect(() => {
    setAccountMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  function handleSignOut() {
    setAccountMenuOpen(false);
    setOpen(false);
    signOut();
    router.push("/");
  }

  // "Offers" nav item is admin-toggleable (default on) — see AdminOffers.tsx.
  const [offersNavEnabled, setOffersNavEnabled] = useState(true);
  useEffect(() => setOffersNavEnabled(isOffersNavEnabled()), []);
  const nav = offersNavEnabled ? primaryNav : primaryNav.filter((item) => item.href !== "/offers");

  // Which primary-nav item corresponds to the current page.
  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (path === "/shop") {
      // Product pages count as "Shop" (unless a category tab matches).
      if (pathname.startsWith("/product")) return !query;
      if (pathname !== "/shop") return false;
      const hrefCat = query ? new URLSearchParams(query).get("category") : null;
      return hrefCat === activeCategory;
    }
    return pathname === path || pathname.startsWith(path + "/");
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

  const telHref = `tel:${site.phone.replace(/\s+/g, "")}`;
  const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar — also doubles as real, clickable contact channels (not just a mocked
          notification viewer): a customer can call or WhatsApp the founders directly. */}
      <div className="bg-forest text-cream">
        <div className="container flex h-9 items-center justify-between gap-3 text-xs sm:text-[0.8rem]">
          <p className="hidden min-w-0 flex-1 truncate tracking-wide sm:block">
            Homemade &amp; plant-based · Made with natural essential oils · Handcrafted in Hyderabad
          </p>
          <div className="flex flex-1 items-center justify-center gap-4 sm:flex-none">
            <a
              href={telHref}
              className="inline-flex items-center gap-1.5 text-cream/90 transition-colors hover:text-cream"
              aria-label={`Call us at ${site.phone}`}
            >
              <PhoneIcon width={13} height={13} />
              <span className="hidden sm:inline">{site.phone}</span>
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cream/90 transition-colors hover:text-cream"
              aria-label="Chat with us on WhatsApp"
            >
              <WhatsAppIcon width={13} height={13} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

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
                      className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3"
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

          {/* Utility icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5"
            >
              <SearchIcon />
            </Link>
            {authed ? (
              <div className="relative hidden sm:block" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  aria-label={`Account menu — ${firstName || "signed in"}`}
                  className="flex h-10 items-center gap-2 rounded-full px-2.5 text-forest transition-colors hover:bg-forest/5"
                >
                  <UserIcon />
                  {firstName && (
                    <span className="max-w-[8rem] truncate text-sm font-medium">{firstName}</span>
                  )}
                  <ChevronDown
                    width={14}
                    className={cn("transition-transform", accountMenuOpen && "rotate-180")}
                  />
                </button>
                {accountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-lg border border-forest/10 bg-cream shadow-card"
                  >
                    <div className="border-b border-forest/8 px-4 py-3">
                      <p className="text-xs text-forest/50">Signed in as</p>
                      <p className="truncate text-sm font-medium text-forest">
                        {user?.name || user?.mobile}
                      </p>
                    </div>
                    <Link href="/account" role="menuitem" className={accountMenuItem}>
                      My account &amp; orders
                    </Link>
                    <Link href="/wishlist" role="menuitem" className={accountMenuItem}>
                      Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                    </Link>
                    <Link href="/track-order" role="menuitem" className={accountMenuItem}>
                      Track an order
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="block w-full border-t border-forest/8 px-4 py-2.5 text-left text-sm font-medium text-clay transition-colors hover:bg-clay/8"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={accountHref}
                aria-label="Sign in"
                className="hidden h-10 items-center gap-2 rounded-full px-2.5 text-forest transition-colors hover:bg-forest/5 sm:flex"
              >
                <UserIcon />
              </Link>
            )}
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5 sm:flex"
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.6rem] font-semibold text-cream">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5"
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.6rem] font-semibold text-cream">
                  {count}
                </span>
              )}
            </button>
          </div>
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
          <div className="mt-auto flex flex-col gap-3 border-t border-forest/10 px-5 py-5">
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-forest"
            >
              <HeartIcon width={18} /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
            <Link
              href={accountHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-forest"
            >
              <UserIcon width={18} />{" "}
              {authed ? `${firstName ? firstName + " · " : ""}Account & Orders` : "Sign in / Sign up"}
            </Link>
            {authed && (
              <button
                type="button"
                onClick={handleSignOut}
                className="self-start text-xs font-medium text-forest/50 underline underline-offset-2 hover:text-clay"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
