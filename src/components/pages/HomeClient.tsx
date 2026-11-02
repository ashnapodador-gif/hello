"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Service, SiteContent } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ServiceCard from "@/components/ServiceCard";
import { GOOGLE_MAPS_URL, BUSINESS_NAME } from "@/lib/constants";

export default function HomeClient() {
  const supabase = createClient();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("products").select("*").eq("featured", true).order("sort_order").limit(6).then(r => setFeatured(r.data ?? []));
    supabase.from("services").select("*").order("sort_order").limit(4).then(r => setServices(r.data ?? []));
    supabase.from("site_content").select("*").then(r => {
      const map: Record<string, string> = {};
      (r.data ?? []).forEach((row: SiteContent) => (map[row.key] = row.value));
      setContent(map);
    });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero-sky relative flex min-h-[92vh] items-center overflow-hidden pt-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-orange to-gold opacity-25 blur-3xl animate-sun-pulse" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center text-white">
          <p className="animate-fade-up mb-4 inline-block rounded-full glass px-5 py-2 text-sm tracking-widest">✦ {BUSINESS_NAME} ✦</p>
          <h1 className="animate-fade-up font-display text-5xl font-bold leading-tight md:text-7xl" style={{ animationDelay: "0.15s" }}>
            {content.hero_title || "Welcome to"} <span className="text-gradient-gold">JSunrise</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl" style={{ animationDelay: "0.3s" }}>
            {content.hero_subtitle}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.45s" }}>
            <Link href="/products" className="btn-gold">Browse Products</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-white transition hover:bg-white/20">
              📍 Visit Our Store
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="section-title reveal">Rising Every Day, Serving <span className="text-gradient-gold">You</span></h2>
        <p className="reveal mx-auto mt-6 max-w-3xl leading-relaxed text-navy/75" style={{ transitionDelay: "0.1s" }}>
          {content.home_intro}
        </p>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="section-title reveal">Featured <span className="text-gradient-gold">Products</span></h2>
            <p className="reveal mt-3 text-navy/60">Hand-picked highlights from the J-Sunrise Store.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(p => <ProductCard key={p.id} p={p} />)}
            {featured.length === 0 && <p className="col-span-full text-center text-navy/50">Products coming soon — manage them in the Admin Dashboard.</p>}
          </div>
          <div className="mt-12 text-center">
            <Link href="/products" className="btn-outline">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gradient-to-b from-cream to-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="section-title reveal">Our <span className="text-gradient-gold">Services</span></h2>
            <p className="reveal mt-3 text-navy/60">Professional services from JSunrise Marketing Office.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(s => <ServiceCard key={s.id} s={s} />)}
            {services.length === 0 && <p className="col-span-full text-center text-navy/50">Services coming soon — manage them in the Admin Dashboard.</p>}
          </div>
          <div className="mt-12 text-center"><Link href="/services" className="btn-outline">Explore All Services →</Link></div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-sky relative overflow-hidden py-20 text-center text-white">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="reveal font-display text-3xl font-bold md:text-4xl">Visit JSunrise in Pune Today</h2>
          <p className="reveal mt-4 text-white/75">We would love to welcome you. Reach out or drop by the store.</p>
          <div className="reveal mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold">Get in Touch</Link>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">Get Directions</a>
          </div>
        </div>
      </section>
    </div>
  );
}