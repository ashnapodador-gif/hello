import {createClient} from '@supabase/supabase-js'
export const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'http://localhost',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'anon')
export const MAP_Q='JSunrise Marketing Office and J-Sunrise Store'
export const MAPS_URL='https://www.google.com/maps/place/JSunrise+Marketing+Office+and+J-Sunrise+Store/'
export type Product={id:string;kind:string;name:string;category:string;description:string;price:number|null;available:boolean}
export async function getSettings():Promise<Record<string,string>>{
 try{const {data}=await supabase.from('settings').select('*');return Object.fromEntries((data||[]).map((r:any)=>[r.key,r.value]))}catch{return {}}}
export async function getProducts(kind?:string):Promise<Product[]>{
 try{let q=supabase.from('products').select('*').order('created_at',{ascending:false});if(kind)q=q.eq('kind',kind);const {data}=await q;return (data as Product[])||[]}catch{return []}}
