"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteContent } from "@/lib/types";
import { BUSINESS_NAME, BUSINESS_CITY, GOOGLE_MAPS_URL } from "@/lib/constants";

const VALUES = [
  { icon: "🤝", title: "Trust & Integrity", text: "We deal honestly and transparently with every customer." },
  { icon: "⭐", title: "Quality First", text: "Only products and services we believe in reach our shelves." },
  { icon: "🌅", title: "Community Focus", text: "JSunrise exists to serve our local community, every single day." },
  { icon: "🚀", title: "Continuous Improvement", text: "We keep learning, improving, and growing with our customers." }
];

export default function AboutClient() {
  const [c, setC] = useState<Record<string, string>>({});
  useEffect(() => {
    createClient().from("site_content").select("*").then(r => {
      const m: Record<string, string> = {};
      (r.data ?? []).forEach((row: SiteContent) => (m[row.key] = row.value));
      setC(m);
    });
  }, []);
  const isPlaceholder = (v?: string) => !v || v.startsWith("[EDIT");

  return (
    <div className="pt-24">
      <section className="hero-sky py-20 text-center text-white">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">About <span className="text-gradient-gold">JSunrise</span></h1>
        <p className="animate-fade-up mt-4 text-white/75" style={{ animationDelay: "0.15s" }}>{BUSINESS_NAME} — {BUSINESS_CITY}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="reveal glass-light rounded-3xl p-8">
            <h2 className="section-title mb-4">Our Background</h2>
            <p className="leading-relaxed text-navy/75">{isPlaceholder(c.about_background) ? "Our full company story is being prepared — the JSunrise team will publish the verified company background here shortly." : c.about_background}</p>
          </div>
          <div className="reveal glass-light rounded-3xl p-8" style={{ transitionDelay: "0.1s" }}>
            <h2 className="section-title mb-4">Company Information</h2>
            <p className="leading-relaxed text-navy/75">{isPlaceholder(c.about_company_info) ? "Registered business details, founding year and other official information will be published here once verified." : c.about_company_info}</p>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-semibold text-gold-dark hover:underline">View us on Google Maps →</a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="reveal rounded-3xl bg-gradient-to-br from-navy to-navy-light p-8 text-white shadow-xl">
            <h3 className="mb-3 font-display text-2xl font-bold text-gold-light">🎯 Our Mission</h3>
            <p className="text-white/80">{isPlaceholder(c.mission) ? "Our mission statement is being finalized — please check back soon." : c.mission}</p>
          </div>
          <div className="reveal rounded-3xl bg-gradient-to-br from-gold to-orange p-8 text-white shadow-xl" style={{ transitionDelay: "0.1s" }}>
            <h3 className="mb-3 font-display text-2xl font-bold">🔭 Our Vision</h3>
            <p className="text-white/90">{isPlaceholder(c.vision) ? "Our vision statement is being finalized — please check back soon." : c.vision}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(v => (
            <div key={v.title} className="reveal card-hover glass-light rounded-3xl p-6 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold to-orange text-2xl shadow-lg">{v.icon}</div>
              <h4 className="font-display font-bold text-navy">{v.title}</h4>
              <p className="mt-2 text-sm text-navy/70">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}