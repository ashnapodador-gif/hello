"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ products: 0, services: 0, gallery: 0, newInquiries: 0, announcements: 0 });

  useEffect(() => {
    (async () => {
      const p = await supabase.from("products").select("id", { count: "exact", head: true });
      const s = await supabase.from("services").select("id", { count: "exact", head: true });
      const g = await supabase.from("gallery_images").select("id", { count: "exact", head: true });
      const i = await supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new");
      const a = await supabase.from("announcements").select("id", { count: "exact", head: true }).eq("active", true);
      setStats({ products: p.count ?? 0, services: s.count ?? 0, gallery: g.count ?? 0, newInquiries: i.count ?? 0, announcements: a.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, href: "/admin/products", icon: "🛍️" },
    { label: "Services", value: stats.services, href: "/admin/services", icon: "✦" },
    { label: "Gallery Photos", value: stats.gallery, href: "/admin/gallery", icon: "🖼️" },
    { label: "New Inquiries", value: stats.newInquiries, href: "/admin/inquiries", icon: "📥" },
    { label: "Active Announcements", value: stats.announcements, href: "/admin/announcements", icon: "📢" }
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-navy">Welcome back 👋</h1>
      <p className="mb-8 text-navy/60">Manage every part of the JSunrise website from here.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <Link key={c.label} href={c.href}
            className="card-hover rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-3 text-3xl">{c.icon}</div>
            <p className="font-display text-3xl font-bold text-navy">{c.value}</p>
            <p className="text-sm text-navy/60">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}