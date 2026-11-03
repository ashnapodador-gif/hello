import Shell from '@/components/Shell';import {getSettings} from '@/lib/supabase'
export const dynamic='force-dynamic';export const metadata={title:'About Us'}
export default async function A(){const s=await getSettings()
const B=[['Background','background'],['Mission','mission'],['Vision','vision'],['Goals','goals'],['Values','values']]
return <Shell><div className="mx-auto max-w-4xl px-4 py-16"><h1 className="text-4xl font-extrabold">About <span className="text-sun">JSunrise</span></h1>
<p className="mt-4 text-navy/70">{s.intro||'Company introduction is editable in the admin dashboard.'}</p>
<div className="grid md:grid-cols-2 gap-6 mt-10">{B.map(([t,k])=><div key={k} className="card"><h2 className="font-bold text-sun">{t}</h2><p className="mt-2 text-sm whitespace-pre-line">{s[k]||'To be provided by the business owner.'}</p></div>)}</div></div></Shell>}
