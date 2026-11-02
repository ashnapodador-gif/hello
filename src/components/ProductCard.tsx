"use client";
import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="reveal card-hover group overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-navy to-navy-light">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-5xl">🛍️</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white">{p.category}</span>
        {!p.in_stock && <span className="absolute right-4 top-4 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">Out of stock</span>}
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-navy">{p.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-navy/70">{p.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-gold-dark">{p.price || "—"}</span>
          <Link href={`/contact?type=product&subject=${encodeURIComponent(p.name)}`}
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-gold">
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}