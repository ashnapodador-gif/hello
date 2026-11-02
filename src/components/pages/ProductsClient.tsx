"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

function ProductsInner() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient().from("products").select("*").order("sort_order")
      .then(r => { setProducts(r.data ?? []); setLoading(false); });
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter(p =>
      (category === "All" || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
  }, [products, query, category]);

  return (
    <div className="pt-24">
      <section className="hero-sky py-16 text-center text-white">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">Our <span className="text-gradient-gold">Products</span></h1>
        <p className="animate-fade-up mt-3 text-white/75" style={{ animationDelay: "0.15s" }}>The J-Sunrise Store catalogue.</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="reveal glass-light mb-10 flex flex-col items-center gap-4 rounded-3xl p-6 md:flex-row md:justify-between">
          <input type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="🔍 Search products…" aria-label="Search products"
            className="w-full rounded-full border border-navy/15 bg-white px-5 py-3 outline-none transition focus:border-gold md:max-w-sm" />
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Category filter">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === cat ? "bg-gradient-to-r from-gold to-orange text-white shadow" : "bg-navy/5 text-navy/70 hover:bg-navy/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-navy/5" />)}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
            {filtered.length === 0 && <p className="col-span-full py-16 text-center text-navy/50">No products match your search.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ProductsClient() {
  return <Suspense fallback={<div className="pt-40 text-center text-navy/50">Loading products…</div>}><ProductsInner /></Suspense>;
}