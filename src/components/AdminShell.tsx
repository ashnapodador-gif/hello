"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🛍️" },
  { href: "/admin/services", label: "Services", icon: "✦" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/announcements", label: "Announcements", icon: "📢" },
  { href: "/admin/content", label: "Site Content", icon: "📝" },
  { href: "/admin/hours", label: "Business Hours", icon: "🕒" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "📥" },
  { href: "/admin/settings", label: "Contact Settings", icon: "⚙️" }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
  };

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-cream pt-20">
      <button onClick={() => setOpen(!open)} aria-label="Toggle admin menu"
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-navy text-2xl text-white shadow-xl lg:hidden">☰</button>

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-navy p-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-orange font-display font-bold">J</span>
          <div>
            <p className="font-display font-bold leading-tight">JSunrise Admin</p>
            <p className="text-[11px] text-white/50">Management Panel</p>
          </div>
        </div>
        <nav className="space-y-1" aria-label="Admin navigation">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${pathname === l.href ? "bg-gradient-to-r from-gold to-orange font-semibold" : "text-white/75 hover:bg-white/10"}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <button onClick={signOut}
          className="mt-8 w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white/80 transition hover:bg-red-500/80 hover:text-white">
          🚪 Sign Out
        </button>
      </aside>

      <div className="w-full lg:pl-64">
        <div className="mx-auto max-w-6xl p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}