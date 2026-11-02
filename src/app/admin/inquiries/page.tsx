"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Inquiry } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = { new: "bg-gold/20 text-gold-dark", read: "bg-blue-100 text-blue-700", replied: "bg-green-100 text-green-700" };

export default function AdminInquiries() {
  const supabase = createClient();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => supabase.from("inquiries").select("*").order("created_at", { ascending: false })
    .then(r => setRows(r.data ?? []));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await supabase.from("inquiries").delete().eq("id", id);
    load();
  };

  const visible = rows.filter(r => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-navy">Customer Inquiries</h1>
        <div className="flex gap-2">
          {["all", "new", "read", "replied"].map(s => (
            <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${filter === s ? "bg-navy text-white" : "bg-white text-navy/70 shadow"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {visible.map(r => (
          <article key={r.id} className="rounded-3xl bg-white p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-navy">{r.name} <span className="text-xs text-navy/50">({r.type})</span></p>
                <p className="text-sm text-navy/60">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                <button onClick={() => setOpenId(openId === r.id ? null : r.id)} className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">{openId === r.id ? "Hide" : "View"}</button>
                {r.status === "new" && <button onClick={() => setStatus(r.id, "read")} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Mark Read</button>}
                <button onClick={() => setStatus(r.id, "replied")} className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Replied</button>
                <button onClick={() => remove(r.id)} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Delete</button>
              </div>
            </div>
            {openId === r.id && (
              <div className="mt-4 rounded-2xl bg-cream p-4">
                <p className="text-xs font-bold uppercase text-navy/50">{r.subject}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/85">{r.message}</p>
                <p className="mt-2 text-xs text-navy/40">{new Date(r.created_at).toLocaleString()}</p>
              </div>
            )}
          </article>
        ))}
        {visible.length === 0 && <p className="rounded-3xl bg-white p-10 text-center text-navy/50 shadow">No inquiries yet.</p>}
      </div>
    </div>
  );
}