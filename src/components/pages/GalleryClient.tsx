"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/lib/types";
import Lightbox from "@/components/Lightbox";

export default function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient().from("gallery_images").select("*").order("sort_order")
      .then(r => { setImages(r.data ?? []); setLoading(false); });
  }, []);

  const categories = ["All", ...Array.from(new Set(images.map(i => i.category)))];
  const filtered = images.filter(i => category === "All" || i.category === category);

  return (
    <div className="pt-24">
      <section className="hero-sky py-16 text-center text-white">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">Our <span className="text-gradient-gold">Gallery</span></h1>
        <p className="animate-fade-up mt-3 text-white/75" style={{ animationDelay: "0.15s" }}>Inside and around JSunrise.</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} aria-pressed={category === cat}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${category === cat ? "bg-gradient-to-r from-gold to-orange text-white shadow" : "bg-navy/5 text-navy/70 hover:bg-navy/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-navy/5" />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((img, i) => (
              <button key={img.id} onClick={() => setActive(i)}
                className="reveal card-hover group relative h-64 overflow-hidden rounded-3xl shadow-lg" aria-label={`View ${img.title || "image"}`}>
                {img.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.image_url} alt={img.title} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <span className="grid h-full place-items-center bg-gradient-to-br from-navy to-navy-light text-4xl">🖼️</span>
                )}
                <span className="glass-dark absolute inset-x-0 bottom-0 p-4 text-left text-sm font-semibold text-white">{img.title}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="col-span-full py-16 text-center text-navy/50">No photos yet — upload store photos from the Admin Dashboard.</p>}
          </div>
        )}
      </section>

      {active !== null && filtered[active] && (
        <Lightbox images={filtered} index={active} onClose={() => setActive(null)} onNav={setActive} />
      )}
    </div>
  );
}