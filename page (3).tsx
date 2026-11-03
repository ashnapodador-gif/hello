import Shell from '@/components/Shell';import {MAP_Q,MAPS_URL} from '@/lib/supabase'
export const metadata={title:'Location'}
export default function L(){const q=encodeURIComponent(MAP_Q)
return <Shell><div className="mx-auto max-w-5xl px-4 py-16"><h1 className="text-4xl font-extrabold">Our <span className="text-sun">Location</span></h1>
<iframe title="Map" className="w-full h-[28rem] rounded-2xl mt-6 border-0" loading="lazy" src={`https://www.google.com/maps?q=${q}&output=embed`}/>
<div className="flex gap-3 mt-6"><a className="btn-p" target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}>Get Directions</a><a className="btn-o" target="_blank" href={MAPS_URL}>Open in Google Maps</a></div></div></Shell>}
