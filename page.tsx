'use client'
import {useEffect,useState} from 'react';import {supabase,Product} from '@/lib/supabase'
const KEYS=['welcome','intro','background','mission','vision','goals','values','phone','email','facebook','whatsapp','hours']
export default function Admin(){const [ok,sok]=useState(false);const [msg,sm]=useState('');const [tab,st]=useState('products')
const [pr,spr]=useState<Product[]>([]);const [inq,si]=useState<any[]>([]);const [set,sset]=useState<Record<string,string>>({})
const blank={kind:'product',name:'',category:'General',description:'',price:'',available:true};const [f,sf]=useState<any>(blank)
async function load(){const a=await supabase.from('products').select('*').order('created_at',{ascending:false});spr((a.data as Product[])||[])
const b=await supabase.from('inquiries').select('*').order('created_at',{ascending:false});si(b.data||[])
const c=await supabase.from('settings').select('*');sset(Object.fromEntries((c.data||[]).map((r:any)=>[r.key,r.value])))}
useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session){sok(true);load()}})},[])
async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget)
const {error}=await supabase.auth.signInWithPassword({email:String(d.get('e')),password:String(d.get('p'))});if(error)return sm(error.message);sok(true);sm('');load()}
async function save(e:React.FormEvent){e.preventDefault();const row={...f,price:f.price===''?null:Number(f.price)};delete row.created_at
const {error}=f.id?await supabase.from('products').update(row).eq('id',f.id):await supabase.from('products').insert(row);sm(error?error.message:'Saved');sf(blank);load()}
async function del(id:string){if(confirm('Delete?')){await supabase.from('products').delete().eq('id',id);load()}}
async function saveSet(){const {error}=await supabase.from('settings').upsert(Object.entries(set).map(([key,value])=>({key,value})));sm(error?error.message:'Settings saved')}
async function hero(e:React.ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file)return;const path=`hero-${Date.now()}-${file.name.replace(/[^\w.]/g,'_')}`
const u=await supabase.storage.from('site').upload(path,file,{contentType:file.type});if(u.error)return sm(u.error.message)
const url=supabase.storage.from('site').getPublicUrl(path).data.publicUrl;sset({...set,hero_image_url:url});await supabase.from('settings').upsert({key:'hero_image_url',value:url});sm('Hero photo uploaded unchanged')}
if(!ok)return <div className="min-h-screen grid place-items-center"><form onSubmit={login} className="card w-80 space-y-3"><h1 className="font-bold text-xl">Admin Login</h1><input name="e" type="email" className="inp" placeholder="Email" required/><input name="p" type="password" className="inp" placeholder="Password" required/><button className="btn-p w-full">Sign in</button><p className="text-red-600 text-sm">{msg}</p></form></div>
return <div className="mx-auto max-w-6xl p-4"><div className="flex justify-between items-center"><h1 className="text-2xl font-extrabold">Dashboard</h1><button className="btn-o !py-2" onClick={async()=>{await supabase.auth.signOut();sok(false)}}>Sign out</button></div>
<div className="grid grid-cols-3 gap-4 my-4 text-center">{[['Products',pr.filter(p=>p.kind==='product').length],['Services',pr.filter(p=>p.kind==='service').length],['Inquiries',inq.length]].map(([t,n])=><div key={t as string} className="card"><p className="text-3xl font-bold text-sun">{n}</p>{t}</div>)}</div>
<div className="flex gap-2 mb-4">{['products','inquiries','settings'].map(t=><button key={t} onClick={()=>st(t)} className={`rounded-full px-4 py-2 border ${tab===t?'bg-sun text-white':''}`}>{t}</button>)}</div><p className="text-sm text-green-700">{msg}</p>
{tab==='products'&&<><form onSubmit={save} className="card grid md:grid-cols-2 gap-3"><select className="inp" value={f.kind} onChange={e=>sf({...f,kind:e.target.value})}><option>product</option><option>service</option></select>
<input className="inp" placeholder="Name" required value={f.name} onChange={e=>sf({...f,name:e.target.value})}/><input className="inp" placeholder="Category" value={f.category} onChange={e=>sf({...f,category:e.target.value})}/>
<input className="inp" placeholder="Price (blank = ask)" type="number" step="0.01" value={f.price??''} onChange={e=>sf({...f,price:e.target.value})}/>
<textarea className="inp md:col-span-2" placeholder="Description" value={f.description} onChange={e=>sf({...f,description:e.target.value})}/>
<label><input type="checkbox" checked={f.available} onChange={e=>sf({...f,available:e.target.checked})}/> Available</label><button className="btn-p">{f.id?'Update':'Add'}</button></form>
<ul className="mt-4 divide-y">{pr.map(p=><li key={p.id} className="py-2 flex justify-between"><span>{p.name} <small className="text-navy/50">({p.kind}, {p.category})</small></span><span className="space-x-3"><button onClick={()=>sf({...p,price:p.price??''})} className="text-sun">Edit</button><button onClick={()=>del(p.id)} className="text-red-600">Delete</button></span></li>)}</ul></>}
{tab==='inquiries'&&<ul className="space-y-3">{inq.map(i=><li key={i.id} className="card"><b>{i.name}</b> · {i.email} · {i.phone}<p className="text-sm mt-1">{i.message}</p><small>{new Date(i.created_at).toLocaleString()}</small>
<button className="text-red-600 ml-4" onClick={async()=>{await supabase.from('inquiries').delete().eq('id',i.id);load()}}>Delete</button></li>)}</ul>}
{tab==='settings'&&<div className="card space-y-3"><label className="block font-semibold">Hero photo (original, unedited)<input type="file" accept="image/*" onChange={hero} className="block mt-1"/></label>
{KEYS.map(k=><label key={k} className="block text-sm font-semibold">{k}<textarea rows={2} className="inp font-normal" value={set[k]||''} onChange={e=>sset({...set,[k]:e.target.value})}/></label>)}<button onClick={saveSet} className="btn-p">Save settings</button></div>}</div>}
