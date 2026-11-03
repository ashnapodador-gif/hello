import Nav from './Nav';import Footer from './Footer';import {getSettings} from '@/lib/supabase'
export default async function Shell({children}:{children:React.ReactNode}){const s=await getSettings()
return <><Nav/><main id="main">{children}</main><Footer s={s}/></>}
