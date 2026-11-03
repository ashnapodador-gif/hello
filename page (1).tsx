import Shell from '@/components/Shell';import ProductList from '@/components/ProductList';import {getProducts} from '@/lib/supabase'
export const dynamic='force-dynamic';export const metadata={title:'Services'}
export default async function P(){const i=await getProducts('service')
return <Shell><div className="mx-auto max-w-6xl px-4 py-16"><h1 className="text-4xl font-extrabold">Our <span className="text-sun">Services</span></h1><ProductList items={i}/></div></Shell>}
