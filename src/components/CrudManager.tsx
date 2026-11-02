"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "image";
export interface Field {
  name: string; label: string; type: FieldType;
  required?: boolean; default?: string | number | boolean;
}

interface Row { id?: string; [k: string]: unknown }

export default function CrudManager({
  table, label, fields,
  orderBy = { column: "sort_order", ascending: true }
}: { table: string; label: string; fields: Field[]; orderBy?: { column: string; ascending?: boolean } }) {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from(table).select("*").order(orderBy.column, { ascending: orderBy.ascending ?? true });
    setRows((data as Row[]) ?? []);
  }, [table, orderBy.column, orderBy.ascending]);

  useEffect(() => { load(); }, [load]);

  const emptyForm = useCallback(() => {
    const f: Row = {};
    fields.forEach(fd => (f[fd.name] = fd.default ?? (fd.type === "checkbox" ? false : "")));
    return f;
  }, [fields]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true); setMsg("");
    const { id, ...values } = editing;
    const res = id
      ? await supabase.from(table).update(values).eq("id", id)
      : await supabase.from(table).insert(values);
    setBusy(false);
    if (res.error) { setMsg(`Error: ${res.error.message}`); return; }
    setEditing(null); await load(); setMsg("Saved successfully.");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await supabase.from(table).delete().eq("id", id);
    await load(); setMsg("Deleted.");
  };

  const uploadImage = async (fieldName: string, file: File) => {
    setBusy(true); setMsg("Uploading image…");
    const path = `${table}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error) { setBusy(false); setMsg(`Upload failed: ${error.message}`); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setEditing(prev => (prev ? { ...prev, [fieldName]: data.publicUrl } : prev));
    setBusy(false); setMsg("Image uploaded.");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-navy">Manage {label}</h1>
        <button onClick={() => setEditing(emptyForm())} className="btn-gold !px-5 !py-2 text-sm">+ Add {label.replace(/s$/, "")}</button>
      </div>
      {msg && <p className="mb-4 rounded-xl bg-white p-3 text-sm font-semibold shadow">{msg}</p>}

      {editing && (
        <form onSubmit={save} className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">{editing.id ? "Edit" : "New"} {label.replace(/s$/, "")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(f => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label htmlFor={`f-${f.name}`} className="mb-1 block text-sm font-semibold text-navy">
                  {f.label}{f.required && " *"}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={`f-${f.name}`} rows={3} required={f.required}
                    value={String(editing[f.name] ?? "")}
                    onChange={e => setEditing({ ...editing, [f.name]: e.target.value })}
                    className="w-full rounded-xl border border-navy/15 px-4 py-3 outline-none focus:border-gold" />
                ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm">
                    <input id={`f-${f.name}`} type="checkbox" checked={Boolean(editing[f.name])}
                      onChange={e => setEditing({ ...editing, [f.name]: e.target.checked })}
                      className="h-5 w-5 accent-gold" /> Enabled
                  </label>
                ) : (
                  <input id={`f-${f.name}`} type={f.type === "number" ? "number" : "text"} required={f.required}
                    value={String(editing[f.name] ?? "")}
                    onChange={e => setEditing({ ...editing, [f.name]: e.target.value })}
                    className="w-full rounded-xl border border-navy/15 px-4 py-3 outline-none focus:border-gold" />
                )}
                {f.type === "image" && (
                  <div className="mt-2 flex items-center gap-3">
                    <input type="file" accept="image/*" aria-label={`Upload image for ${f.label}`}
                      onChange={e => e.target.files?.[0] && uploadImage(f.name, e.target.files[0])}
                      className="text-sm" />
                    {editing[f.name] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(editing[f.name])} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={busy} className="btn-gold !px-6 !py-2 text-sm disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-navy/20 px-6 py-2 text-sm font-semibold text-navy hover:bg-navy/5">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-navy/50">Nothing here yet — click Add to create your first entry.</p>
        ) : (
          <ul className="divide-y divide-navy/10">
            {rows.map(r => (
              <li key={String(r.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{String(r[fields[0].name] ?? "Untitled")}</p>
                  <p className="truncate text-sm text-navy/60">
                    {fields.slice(1, 3).map(f => r[f.name] !== undefined && r[f.name] !== false ? String(r[f.name]) : "").filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ ...r })} className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-gold">Edit</button>
                  <button onClick={() => remove(String(r.id))} className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}