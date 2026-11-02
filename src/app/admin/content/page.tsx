"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const KEYS: { key: string; label: string; long?: boolean }[] = [
  { key: "hero_title", label: "Hero Title" },
  { key: "hero_subtitle", label: "Hero Subtitle", long: true },
  { key: "home_intro", label: "Home — Business Introduction", long: true },
  { key: "about_background", label: "About — Company Background", long: true },
  { key: "about_company_info", label: "About — Company Information", long: true },
  { key: "mission", label: "Mission Statement", long: true },
  { key: "vision", label: "Vision Statement", long: true }
];

export default function AdminContent() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("*").then(r => {
      const m: Record<string, string> = {};
      (r.data ?? []).forEach((row: { key: string; value: string }) => (m[row.key] = row.value));
      setValues(m);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    for (const { key } of KEYS) {
      await supabase.from("site_content").upsert({ key, value: values[key] ?? "" });
    }
    setBusy(false); setMsg("Website content updated.");
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy">Edit Website Content</h1>
      {msg && <p className="mb-4 rounded-xl bg-white p-3 text-sm font-semibold shadow">{msg}</p>}
      <form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="grid gap-5 md:grid-cols-2">
          {KEYS.map(k => (
            <div key={k.key} className={k.long ? "md:col-span-2" : ""}>
              <label htmlFor={k.key} className="mb-1 block text-sm font-semibold text-navy">{k.label}</label>
              {k.long ? (
                <textarea id={k.key} rows={3} value={values[k.key] ?? ""}
                  onChange={e => setValues({ ...values, [k.key]: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 px-4 py-3 outline-none focus:border-gold" />
              ) : (
                <input id={k.key} value={values[k.key] ?? ""}
                  onChange={e => setValues({ ...values, [k.key]: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 px-4 py-3 outline-none focus:border-gold" />
              )}
            </div>
          ))}
        </div>
        <button type="submit" disabled={busy} className="btn-gold mt-6 !px-8 !py-2.5 text-sm disabled:opacity-60">
          {busy ? "Saving…" : "Save All Content"}
        </button>
      </form>
    </div>
  );
}