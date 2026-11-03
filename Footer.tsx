'use client'
import Link from 'next/link'
export default function Footer({s}:{s:Record<string,string>}){
const wa=(s.whatsapp||'').replace(/\D/g,'')
return <><footer className="bg-navy text-white mt-24"><div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3 p-8">
<div><b className="text-xl">JSunrise Marketing</b><p className="text-white/70 mt-2 text-sm">Office and J-Sunrise Store</p></div>
<div className="text-sm space-y-1"><p>Phone: {s.phone||'—'}</p><p>Email: {s.email||'—'}</p><p>Hours: {s.hours||'—'}</p>{s.facebook&&<a className="underline" href={s.facebook}>Facebook</a>}</div>
<div className="text-sm space-y-1 flex flex-col"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/admin">Admin</Link></div></div>
<p className="text-center text-xs text-white/50 pb-6">© {new Date().getFullYear()} JSunrise Marketing</p></footer>
<div className="fixed right-4 bottom-4 flex flex-col gap-2 z-40">
<button aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="h-11 w-11 rounded-full bg-navy text-white shadow-lg">↑</button>
{wa&&<a aria-label="WhatsApp" href={`https://wa.me/${wa}`} className="h-11 w-11 grid place-items-center rounded-full bg-green-500 text-white shadow-lg">💬</a>}
<Link href="/contact" className="btn-p !px-4 !py-3 shadow-xl">Inquire</Link></div></>}
