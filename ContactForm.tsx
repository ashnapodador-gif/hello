'use client'
import {useState} from 'react';import {useSearchParams} from 'next/navigation';import {supabase} from '@/lib/supabase'
export default function ContactForm(){const sp=useSearchParams();const item=sp.get('item');const [st,ss]=useState<'idle'|'ok'|'err'>('idle');const [busy,sb]=useState(false)
async function go(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);sb(true)
const {error}=await supabase.from('inquiries').insert({name:String(f.get('name')).trim(),email:String(f.get('email')).trim(),phone:String(f.get('phone')||''),message:String(f.get('message')).trim()})
sb(false);ss(error?'err':'ok');if(!error)e.currentTarget.reset()}
return <form onSubmit={go} className="space-y-4 mt-6">
<input name="name" required maxLength={100} className="inp" placeholder="Your name" aria-label="Name"/>
<input name="email" type="email" required className="inp" placeholder="Email address" aria-label="Email"/>
<input name="phone" type="tel" className="inp" placeholder="Phone number" aria-label="Phone"/>
<textarea name="message" required maxLength={2000} rows={5} defaultValue={item?`I'm interested in: ${item}`:''} className="inp" placeholder="Your inquiry" aria-label="Message"/>
<button disabled={busy} className="btn-p">{busy?'Sending…':'Submit Inquiry'}</button>
<p role="status" className={st==='ok'?'text-green-600':'text-red-600'}>{st==='ok'?'Thank you! Your inquiry was sent.':st==='err'?'Something went wrong. Please try again.':''}</p></form>}
