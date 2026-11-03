'use client'
import Link from 'next/link';import {useState} from 'react'
const L=[['/','Home'],['/about','About'],['/products','Products'],['/services','Services'],['/gallery','Gallery'],['/location','Location'],['/contact','Contact']]
export default function Nav(){const [o,s]=useState(false)
return <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-navy/10"><nav aria-label="Main" className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
<Link href="/" className="text-xl font-extrabold">J<span className="text-sun">Sunrise</span> Marketing</Link>
<button className="md:hidden p-2" aria-expanded={o} aria-label="Toggle menu" onClick={()=>s(!o)}>☰</button>
<ul className={`${o?'flex':'hidden'} md:flex absolute md:static top-full left-0 right-0 bg-white md:bg-transparent flex-col md:flex-row gap-1 md:gap-6 p-4 md:p-0 border-b md:border-0`}>
{L.map(([h,t])=><li key={h}><Link href={h} onClick={()=>s(false)} className="block py-2 font-medium hover:text-sun">{t}</Link></li>)}</ul></nav></header>}
