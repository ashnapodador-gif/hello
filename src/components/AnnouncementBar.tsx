"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Announcement } from "@/lib/types";

export default function AnnouncementBar() {
  const [item, setItem] = useState<Announcement | null>(null);
  useEffect(() => {
    createClient()
      .from("announcements").select("*").eq("active", true)
      .order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => setItem(data?.[0] ?? null));
  }, []);
  if (!item) return null;
  return (
    <div className="animate-fade-up bg-gradient-to-r from-gold via-orange to-gold px-4 py-2 text-center text-sm font-semibold text-white">
      {item.title}{item.body ? ` — ${item.body}` : ""}
    </div>
  );
}