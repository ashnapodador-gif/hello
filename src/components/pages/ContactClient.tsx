"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContactInfo, BusinessHour } from "@/lib/types";
import { BUSINESS_NAME, DEFAULT_MAP_EMBED, DAYS } from "@/lib/constants";

function ContactInner() {
  const params = useSearchParams();
  const supabase = createClient();
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: params.get("type") ?? "contact", subject: params.get("subject") ?? "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("contact_info").select("*").eq("id", 1).single().then(r => setInfo(r.data));
    supabase.from("business_hours").select("*").order("day_of_week").then(r => setHours(r.data ?? []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (form.phone && !/^[+\d][\d\s-]{6,14}$/.test(form.phone)) errs.phone = "Please enter a valid phone number.";
    if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
      type: form.type, subject: form.subject || "Website contact",
      message: form.message.trim()
    });
    setSending(false);
    if (error) { setErrors({ form: "Could not send. Please try again." }); return; }
    setSent(true);
    setForm({ ...form, name: "", email: "", phone: "", subject: "", message: "" });
  };

  const placeholder = (v?: string) => !v || v.startsWith("[EDIT");
  const today = new Date().getDay();

  const socials = info ? [
    { label: "Facebook", href: info.facebook }, { label: "Instagram", href: info.instagram },
    { label: "X / Twitter", href: info.twitter }, { label: "LinkedIn", href: info.linkedin }, { label: "YouTube", href: info.youtube }
  ].filter(s => s.href && !s.href.startsWith("[")) : [];

  return (
    <div className="pt-24">
      <section className="hero-sky py-16 text-center text-white">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">Contact <span className="text-gradient-gold">Us</span></h1>
        <p className="animate-fade-up mt-3 text-white/75" style={{ animationDelay: "0.15s" }}>We would love to hear from you.</p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-5">
        {/* INFO COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          <div className="reveal glass-light rounded-3xl p-7">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">Business Information</h2>
            <ul className="space-y-3 text-sm text-navy/80">
              <li><strong className="text-navy">Business:</strong> {BUSINESS_NAME}</li>
              <li><strong className="text-navy">Phone:</strong> {placeholder(info?.phone) ? <em className="text-navy/50">Add via Admin → Settings</em> : <a href={`tel:${info!.phone}`} className="text-gold-dark hover:underline">{info!.phone}</a>}</li>
              <li><strong className="text-navy">Email:</strong> {placeholder(info?.email) ? <em className="text-navy/50">Add via Admin → Settings</em> : <a href={`mailto:${info!.email}`} className="text-gold-dark hover:underline">{info!.email}</a>}</li>
              <li><strong className="text-navy">Address:</strong> {placeholder(info?.address) ? <em className="text-navy/50">Pune, Maharashtra (full address via Admin)</em> : info!.address}</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={info?.directions_url || "https://www.google.com/maps/place/JSunrise+Marketing+Office+and+J-Sunrise+Store/"} target="_blank" rel="noopener noreferrer" className="btn-gold !px-5 !py-2 text-sm">📍 Get Directions</a>
              {info?.whatsapp && !info.whatsapp.startsWith("[") && (
                <a href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-outline !px-5 !py-2 text-sm">💬 WhatsApp</a>
              )}
            </div>
          </div>

          <div className="reveal glass-light rounded-3xl p-7">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">Opening Hours</h2>
            <ul className="space-y-2 text-sm">
              {hours.map(h => (
                <li key={h.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${h.day_of_week === today ? "bg-gold/15 font-semibold" : ""}`}>
                  <span className="text-navy/80">{DAYS[h.day_of_week]}</span>
                  <span className={h.is_closed ? "text-red-600" : "text-navy"}>{h.is_closed ? "Closed" : `${h.opens_at} – ${h.closes_at}`}</span>
                </li>
              ))}
              {hours.length === 0 && <li className="text-navy/50">Hours will be published soon.</li>}
            </ul>
          </div>

          {socials.length > 0 && (
            <div className="reveal glass-light rounded-3xl p-7">
              <h2 className="mb-4 font-display text-xl font-bold text-navy">Follow Us</h2>
              <div className="flex flex-wrap gap-3">
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-gold">{s.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FORM + MAP */}
        <div className="space-y-6 lg:col-span-3">
          <div className="reveal glass-light rounded-3xl p-7 md:p-9">
            <h2 className="mb-6 font-display text-xl font-bold text-navy">Send Us a Message</h2>
            {sent && <p className="mb-6 rounded-xl bg-green-100 p-4 text-center text-sm font-semibold text-green-800">✅ Thank you! Your message has been sent. We will get back to you shortly.</p>}
            {errors.form && <p className="mb-6 rounded-xl bg-red-100 p-4 text-center text-sm font-semibold text-red-700">{errors.form}</p>}
            <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1 block text-sm font-semibold text-navy">Name *</label>
                <input id="c-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1 block text-sm font-semibold text-navy">Email *</label>
                <input id="c-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1 block text-sm font-semibold text-navy">Phone (optional)</label>
                <input id="c-phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="c-type" className="mb-1 block text-sm font-semibold text-navy">Inquiry Type</label>
                <select id="c-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold">
                  <option value="contact">General Contact</option>
                  <option value="product">Product Inquiry</option>
                  <option value="service">Service Inquiry</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="c-subject" className="mb-1 block text-sm font-semibold text-navy">Subject</label>
                <input id="c-subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="c-message" className="mb-1 block text-sm font-semibold text-navy">Message *</label>
                <textarea id="c-message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={sending} className="btn-gold w-full justify-center disabled:opacity-60">
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          <div className="reveal overflow-hidden rounded-3xl shadow-xl">
            <iframe title="Map — JSunrise Marketing Office and J-Sunrise Store"
              src={info?.map_embed_url || DEFAULT_MAP_EMBED}
              className="h-96 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactClient() {
  return <Suspense fallback={<div className="pt-40 text-center text-navy/50">Loading…</div>}><ContactInner /></Suspense>;
}