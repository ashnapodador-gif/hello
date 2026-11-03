'use client'
import Link from 'next/link';import {useState} from 'react';import type {Product} from '@/lib/supabase'
export default function ProductList({items}:{items:Product[]}){const [q,sq]=useState('');const [c,sc]=useState('All')
const cats=['All',...Array.from(new Set(items.map(i=>i.category)))]
const f=items.filter(i=>(c==='All'||i.category===c)&&(i.name+i.description).toLowerCase().includes(q.toLowerCase()))
return <div><div className="flex flex-wrap gap-3 my-6"><input className="inp max-w-xs" placeholder="Search…" aria-label="Search" value={q} onChange={e=>sq(e.target.value)}/>
<div className="flex flex-wrap gap-2">{cats.map(x=><button key={x} onClick={()=>sc(x)} className={`rounded-full px-4 py-2 text-sm border ${c===x?'bg-sun text-white border-sun':'border-navy/20'}`}>{x}</button>)}</div></div>
<div className="grid md:grid-cols-3 gap-6">{f.map(i=><div key={i.id} className="card flex flex-col"><span className="text-xs text-sun font-semibold">{i.category}</span>
<h3 className="font-bold text-lg">{i.name}</h3><p className="text-sm text-navy/70 flex-1">{i.description}</p>
<p className="mt-3 font-bold">{i.price!=null?`₱${i.price}`:'Ask for price'} <span className={`text-xs ml-2 ${i.available?'text-green-600':'text-red-500'}`}>{i.available?'Available':'Unavailable'}</span></p>
<div className="flex gap-2 mt-3"><Link href={`/products/${i.id}`} className="btn-o !py-2">Details</Link><Link href={`/contact?item=${encodeURIComponent(i.name)}`} className="btn-p !py-2">Inquire</Link></div></div>)}
{!f.length&&<p className="text-navy/60">Nothing found.</p>}</div></div>}
