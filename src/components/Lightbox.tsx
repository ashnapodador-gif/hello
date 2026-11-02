"use client";
import { useEffect } from "react";

export default function Lightbox({
  images, index, onClose, onNav
}: { images: { image_url: string; title: string }[]; index: number; onClose: () => void; onNav: (i: number) => void; }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNav]);

  const img = images[index];
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy-dark/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label={img.title || "Gallery image"}>
      <button onClick={onClose} aria-label="Close" className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-gold">✕</button>
      <button onClick={() => onNav((index - 1 + images.length) % images.length)} aria-label="Previous" className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-gold">‹</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.image_url} alt={img.title} className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-2xl" />
      <button onClick={() => onNav((index + 1) % images.length)} aria-label="Next" className="absolute right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-gold">›</button>
      <p className="absolute bottom-6 text-sm text-white/80">{img.title} ({index + 1}/{images.length})</p>
    </div>
  );
}