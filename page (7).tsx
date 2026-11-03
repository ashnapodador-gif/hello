import Link from 'next/link';import {notFound} from 'next/navigation';import Shell from '@/components/Shell';import {supabase,Product} from '@/lib/supabase'
export const dynamic='force-dynamic'
export default async function D({params}:{params:{id:string}}){
const {data}=await supabase.from('products').select('*').eq('id',params.id).maybeSingle();const p=data as Product|null;if(!p)notFound()
return <Shell><div className="mx-auto max-w-3xl px-4 py-16"><Link href="/products" className="text-sun">← Back</Link>
<p className="mt-6 text-sun font-semibold">{p.category}</p><h1 className="text-4xl font-extrabold">{p.name}</h1><p className="mt-4 whitespace-pre-line">{p.description}</p>
<p className="mt-6 text-2xl font-bold">{p.price!=null?`₱${p.price}`:'Ask for price'}</p><p>{p.available?'Available':'Currently unavailable'}</p>
<Link href={`/contact?item=${encodeURIComponent(p.name)}`} className="btn-p mt-6">Send Inquiry</Link></div></Shell>}
