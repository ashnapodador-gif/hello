"use client";
import Link from "next/link";
import type { Service } from "@/lib/types";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="reveal card-hover glass-light rounded-3xl p-6 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold to-orange text-2xl text-white shadow-lg">✦</div>
      <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy/70">{s.category}</span>
      <h3 className="mt-3 font-display text-lg font-bold text-navy">{s.name}</h3>
      <p className="mt-2 text-sm text-navy/70">{s.description}</p>
      <Link href={`/contact?type=service&subject=${encodeURIComponent(s.name)}`}
        className="mt-4 inline-block text-sm font-semibold text-gold-dark underline-offset-4 hover:underline">
        Enquire about this service →
      </Link>
    </article>
  );
}