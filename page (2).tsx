import Link from 'next/link';import Shell from '@/components/Shell';import {getSettings,getProducts,MAPS_URL,MAP_Q} from '@/lib/supabase'
export const dynamic='force-dynamic'
export default async function Home(){const s=await getSettings();const p=(await getProducts()).slice(0,3)
const why=[['✦','Quality','Products and service you can rely on.'],['☎','Responsive','Reach us any time through the inquiry form.'],['⌖','Visit us','Find the office and store on the map.']]
return <Shell>
<section className="bg-gradient-to-b from-orange-50 to-white"><div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center px-4 py-16">
<div className="fade"><p className="text-sun font-semibold tracking-widest text-sm">JSUNRISE MARKETING</p>
<h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-3">{s.welcome||'Welcome to JSunrise Marketing — Your Trusted Destination for Quality and Service.'}</h1>
{s.intro&&<p className="mt-4 text-navy/70">{s.intro}</p>}
<div className="mt-8 flex flex-wrap gap-3"><Link href="/about" className="btn-p">Explore Our Business</Link><Link href="/products" className="btn-o">View Products</Link><Link href="/contact" className="btn-o">Contact Us</Link><Link href="/location" className="btn-o">Find Our Location</Link></div></div>
<div className="fade">{s.hero_image_url
?/* eslint-disable-next-line @next/next/no-img-element */<img src={s.hero_image_url} alt="JSunrise Marketing Office and J-Sunrise Store" className="w-full rounded-3xl shadow-2xl" fetchPriority="high"/>
:<div className="aspect-[4/3] rounded-3xl border-2 border-dashed border-sun/50 grid place-items-center text-center p-6 text-navy/60">Hero photo placeholder.<br/>Admin → Settings → upload the original store photo.</div>}</div></div></section>
<section className="mx-auto max-w-6xl px-4 mt-16 grid md:grid-cols-3 gap-6">{why.map(([i,t,d])=><div key={t} className="card"><div className="text-3xl text-sun">{i}</div><h3 className="font-bold mt-2">{t}</h3><p className="text-sm text-navy/70">{d}</p></div>)}</section>
<section className="mx-auto max-w-6xl px-4 mt-16"><h2 className="text-3xl font-bold">Featured</h2><div className="grid md:grid-cols-3 gap-6 mt-6">
{p.length?p.map(x=><Link key={x.id} href={`/products/${x.id}`} className="card"><span className="text-xs text-sun font-semibold">{x.category}</span><h3 className="font-bold text-lg">{x.name}</h3><p className="text-sm text-navy/70 line-clamp-2">{x.description}</p></Link>):<p className="text-navy/60">Offerings will appear here once added in the admin dashboard.</p>}</div></section>
<section className="mx-auto max-w-6xl px-4 mt-16"><h2 className="text-3xl font-bold">Find Us</h2>
<iframe title="Map" className="w-full h-80 rounded-2xl mt-6 border-0" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_Q)}&output=embed`}/>
<a href={MAPS_URL} className="btn-p mt-4" target="_blank">Open in Google Maps</a></section></Shell>}
