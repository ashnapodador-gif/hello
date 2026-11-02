"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactInfo } from "@/lib/types";
import { DEFAULT_MAP_EMBED, GOOGLE_MAPS_URL } from "@/lib/constants";

const FIELDS: { name: keyof ContactInfo; label: string; long?: boolean }[] = [
  { name: "phone", label: "Phone Number" },
  { name: "whatsapp", label: "WhatsApp Number (digits with country code)" },
  { name: "email", label: "Email Address" },
  { name: "address", label: "Full Street Address", long: true },
  { name: "map_embed_url", label: "Google Maps Embed URL", long: true },
  { name: "directions_url", label: "Google Maps Directions URL", long: true },
  { name: "facebook", label: "Facebook URL" },
  { name: "instagram", label: "Instagram URL" },
  { name: "twitter", label: "X / Twitter URL" },
  { name: "linkedin", label: "LinkedIn URL" },
  { name: "youtube", label: "YouTube URL" }
];

export default function AdminSettings() {
  const supabase = createClient();
  const [info, setInfo] = useState<Partial<ContactInfo>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("contact_info").select("*").eq("id", 1).single().then(r => setInfo(r.data ?? {}));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    const { id, updated_at, ...values } = info;
    const { error } = await supabase.from("contact_info").upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
    setBusy(false);
    setMsg(error ? `Error: ${error.message}` : "Contact details updated.");
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-navy">Contact Details & Social Media</h1>
      <p className="mb-6 text-sm text-navy/60">Anything you leave blank or starting with [EDIT shows as a placeholder on the website.</p>
      {msg && <p className="mb-4 rounded-xl bg-white p-3 text-sm font-semibold shadow">{msg}</p>}
      <form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="grid gap-5 md:grid-cols-2">
          {FIELDS.map(f => (
            <div key={String(f.name)} className={f.long ? "md:col-span-2" : ""}>
              <label htmlFor={String(f.name)} className="mb-1 block text-sm font-semibold text-navy">{f.label}</label>
              <input id={String(f.name)} value={String(info[f.name] ?? "")}
                onChange={e => setInfo({ ...info, [f.name]: e.target.value })}
                className="w-full rounded-xl border border-navy/15 px-4 py-3 outline-none focus:border-gold" />
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-cream p-4 text-xs text-navy/60">
          <p><strong>Default map embed:</strong> {DEFAULT_MAP_EMBED}</p>
          <p className="mt-1"><strong>Default directions URL:</strong> {GOOGLE_MAPS_URL}</p>
        </div>
        <button type="submit" disabled={busy} className="btn-gold mt-6 !px-8 !py-2.5 text-sm disabled:opacity-60">
          {busy ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}