"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCartStore, useLocaleStore, useWishlistStore } from "@/store";
import { t } from "@/lib/i18n";
import { cn, CONTACT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/shop", key: "shop" as const },
  { href: "/offers", key: "offers" as const },
  { href: "/latest-phones", key: "latestPhones" as const },
  { href: "/accessories", key: "accessories" as const },
  { href: "/maintenance", key: "maintenance" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Top bar */}
      <div className="hidden bg-gray-900 text-white lg:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1 hover:text-brand-400">
              <Phone className="h-3 w-3" />
              {CONTACT.phone}
            </a>
            <span className="text-gray-600">|</span>
            <span>{t(locale, "freeShipping")}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="flex items-center gap-1 hover:text-brand-400"
            >
              <Globe className="h-3 w-3" />
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl dark:bg-gray-950/80"
            : "bg-white dark:bg-gray-950"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Mobile menu */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-black text-white">
                CP
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                  CLICK PHONE
                </span>
                <span className="block text-[10px] font-medium text-brand-600">
                  {locale === "ar" ? "كليك فون" : "Smart Electronics"}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
                      : "text-gray-600 hover:text-brand-600 dark:text-gray-400"
                  )}
                >
                  {t(locale, link.key)}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 sm:flex"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link href="/account" className="hidden sm:block">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t dark:border-gray-800"
            >
              <div className="container mx-auto px-4 py-3">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t lg:hidden dark:border-gray-800"
            >
              <nav className="container mx-auto space-y-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium",
                      pathname === link.href
                        ? "bg-brand-50 text-brand-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {t(locale, link.key)}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; name: string; slug: string; price: number; image?: string }>>([]);
  const { locale } = useLocaleStore();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(locale, "search")}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 ps-12 pe-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
        autoFocus
      />
      {results.length > 0 && (
        <div className="absolute start-0 end-0 top-full z-50 mt-2 max-h-80 overflow-auto rounded-xl border bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="text-sm font-medium">{product.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
