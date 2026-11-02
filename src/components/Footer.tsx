import Link from "next/link";
import { createServerClientUtil } from "@/lib/supabase/server";
import { NAV_LINKS, BUSINESS_NAME, BUSINESS_CITY, GOOGLE_MAPS_URL, DEFAULT_MAP_EMBED } from "@/lib/constants";
import type { ContactInfo } from "@/lib/types";

export default async function Footer() {
  const supabase = createServerClientUtil();
  const { data } = await supabase.from("contact_info").select("*").eq("id", 1).single<ContactInfo>();
  const c = data ?? null;

  const socials = [
    { label: "Facebook", href: c?.facebook },
    { label: "Instagram", href: c?.instagram },
    { label: "X (Twitter)", href: c?.twitter },
    { label: "LinkedIn", href: c?.linkedin },
    { label: "YouTube", href: c?.youtube }
  ].filter((s): s is { label: string; href: string } => Boolean(s.href && !s.href.startsWith("[EDIT")));

  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold to-orange font-display font-bold">J</span>
            <span className="font-display text-xl font-bold">J<span className="text-gradient-gold">Sunrise</span></span>
          </div>
          <p className="text-sm leading-relaxed text-white/70">{BUSINESS_NAME} — {BUSINESS_CITY}</p>
        </div>
        <div>
          <h3 className="mb-4 font-display font-bold text-gold-light">Quick Navigation</h3>
          <ul className="space-y-2 text-sm text-white/75">
            {NAV_LINKS.map(l => (
              <li key={l.href}><Link href={l.href} className="transition-colors hover:text-gold">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display font-bold text-gold-light">Contact</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li>{c?.phone?.startsWith("[") ? <span className="italic text-white/50">Phone — add via Admin</span> : c?.phone}</li>
            <li>{c?.email?.startsWith("[") ? <span className="italic text-white/50">Email — add via Admin</span> : c?.email}</li>
            <li>{c?.address?.startsWith("[") ? `${BUSINESS_CITY} (full address via Admin)` : c?.address}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display font-bold text-gold-light">Find Us</h3>
          <iframe title="Map — JSunrise location" src={c?.map_embed_url || DEFAULT_MAP_EMBED}
            className="mb-3 h-32 w-full rounded-xl border border-white/10" loading="lazy" />
          <a href={c?.directions_url || GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-orange px-5 py-2 text-sm font-semibold transition-transform hover:scale-105">
            Get Directions
          </a>
          {socials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-xs transition-colors hover:border-gold hover:text-gold">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
