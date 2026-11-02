"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    if (q?.trim()) router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass-dark py-2" : "bg-transparent py-4"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="JSunrise home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-orange font-display text-xl font-bold text-white shadow-lg animate-sun-pulse">
            J
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-white">
            J<span className="text-gradient-gold">Sunrise</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === l.href ? "bg-white/15 text-gold-light" : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}>
              {l.label}
            </Link>
          ))}
          <form onSubmit={search} className="ml-3" role="search">
            <input name="q" type="search" placeholder="Search products…"
              aria-label="Search products"
              className="w-44 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 outline-none backdrop-blur focus:border-gold" />
          </form>
        </nav>

        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu"
          className="rounded-lg border border-white/25 p-2 text-white lg:hidden">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="glass-dark mx-4 mt-3 rounded-2xl p-4 lg:hidden">
          <form onSubmit={search} className="mb-3" role="search">
            <input name="q" type="search" placeholder="Search products…" aria-label="Search products"
              className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-gold" />
          </form>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`block rounded-xl px-4 py-3 font-medium ${pathname === l.href ? "bg-white/10 text-gold-light" : "text-white/90 hover:bg-white/10"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}