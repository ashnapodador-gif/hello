"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BusinessHour } from "@/lib/types";
import { DAYS } from "@/lib/constants";

export default function AdminHours() {
  const supabase = createClient();
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("business_hours").select("*").order("day_of_week").then(r => setHours(r.data ?? []));
  }, []);

  const update = (id: string, patch: Partial<BusinessHour>) =>
    setHours(prev => prev.map(h => (h.id === id ? { ...h, ...patch } : h)));

  const save = async () => {
    setMsg("Saving…");
    for (const h of hours) {
      await supabase.from("business_hours").update({ opens_at: h.opens_at, closes_at: h.closes_at, is_closed: h.is_closed }).eq("id", h.id);
    }
    setMsg("Business hours updated.");
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy">Edit Business Hours</h1>
      {msg && <p className="mb-4 rounded-xl bg-white p-3 text-sm font-semibold shadow">{msg}</p>}
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <ul className="divide-y divide-navy/10">
          {hours.map(h => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <span className="w-28 font-semibold text-navy">{DAYS[h.day_of_week]}</span>
              <div className="flex items-center gap-3">
                <input type="time" value={h.opens_at} disabled={h.is_closed}
                  onChange={e => update(h.id, { opens_at: e.target.value })}
                  className="rounded-xl border border-navy/15 px-3 py-2 text-sm disabled:opacity-40" />
                <span className="text-navy/40">–</span>
                <input type="time" value={h.closes_at} disabled={h.is_closed}
                  onChange={e => update(h.id, { closes_at: e.target.value })}
                  className="rounded-xl border border-navy/15 px-3 py-2 text-sm disabled:opacity-40" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={h.is_closed} onChange={e => update(h.id, { is_closed: e.target.checked })}
                    className="h-5 w-5 accent-gold" /> Closed
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={save} className="btn-gold mt-6 !px-8 !py-2.5 text-sm">Save Hours</button>
    </div>
  );
}