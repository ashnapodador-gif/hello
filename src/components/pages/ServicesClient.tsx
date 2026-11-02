"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/types";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesClient() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(r => setServices(r.data ?? []));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return services.filter(s => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [services, query]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (form.phone && !/^[+\d][\d\s-]{6,14}$/.test(form.phone)) errs.phone = "Please enter a valid phone number.";
    if (form.message.trim().length < 10) errs.message = "Please describe your requirement (min 10 characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
      type: "service", subject: form.subject || "Service inquiry",
      message: form.message.trim()
    });
    setSending(false);
    if (error) { setErrors({ form: "Could not send. Please try again." }); return; }
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const field = (name: keyof typeof form, label: string, type = "text", required = false) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-navy">{label}{required && " *"}</label>
      <input id={name} type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
        aria-invalid={!!errors[name]} className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="pt-24">
      <section className="hero-sky py-16 text-center text-white">
        <h1 className="animate-fade-up font-display text-4xl font-bold md:text-5xl">Our <span className="text-gradient-gold">Services</span></h1>
        <p className="animate-fade-up mt-3 text-white/75" style={{ animationDelay: "0.15s" }}>Professional services from the JSunrise Marketing Office.</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <input type="search" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="🔍 Search services…" aria-label="Search services"
          className="reveal mx-auto mb-10 block w-full max-w-xl rounded-full border border-navy/15 bg-white px-5 py-3 outline-none focus:border-gold" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => <ServiceCard key={s.id} s={s} />)}
          {filtered.length === 0 && <p className="col-span-full py-12 text-center text-navy/50">No services match your search. Manage services from the Admin Dashboard.</p>}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="reveal glass-light mx-auto max-w-3xl rounded-3xl p-8 md:p-10">
          <h2 className="section-title mb-2 text-center">Service <span className="text-gradient-gold">Inquiry</span></h2>
          <p className="mb-8 text-center text-navy/60">Tell us what you need — we will get back to you.</p>
          {sent && <p className="mb-6 rounded-xl bg-green-100 p-4 text-center text-sm font-semibold text-green-800">✅ Thank you! Your inquiry has been sent. We will contact you soon.</p>}
          {errors.form && <p className="mb-6 rounded-xl bg-red-100 p-4 text-center text-sm font-semibold text-red-700">{errors.form}</p>}
          <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-2">
            {field("name", "Your Name", "text", true)}
            {field("email", "Email", "email", true)}
            {field("phone", "Phone (optional)", "tel")}
            {field("subject", "Service of Interest", "text")}
            <div className="md:col-span-2">
              <label htmlFor="message" className="mb-1 block text-sm font-semibold text-navy">Message *</label>
              <textarea id="message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                aria-invalid={!!errors.message}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-gold" />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>
            <div className="md:col-span-2 text-center">
              <button type="submit" disabled={sending} className="btn-gold disabled:opacity-60">
                {sending ? "Sending…" : "Send Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}