import {Suspense} from 'react';import Shell from '@/components/Shell';import ContactForm from '@/components/ContactForm';import {getSettings} from '@/lib/supabase'
export const dynamic='force-dynamic';export const metadata={title:'Contact Us'}
export default async function C(){const s=await getSettings()
return <Shell><div className="mx-auto max-w-2xl px-4 py-16"><h1 className="text-4xl font-extrabold">Contact <span className="text-sun">Us</span></h1>
<p className="mt-3 text-sm text-navy/70">Phone: {s.phone||'—'} · Email: {s.email||'—'} · Hours: {s.hours||'—'}</p>
<Suspense><ContactForm/></Suspense></div></Shell>}
