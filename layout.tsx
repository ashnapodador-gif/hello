import './globals.css';import type {Metadata} from 'next'
export const metadata:Metadata={title:{default:'JSunrise Marketing Office and J-Sunrise Store',template:'%s | JSunrise Marketing'},description:'Official website of JSunrise Marketing Office and J-Sunrise Store.',openGraph:{title:'JSunrise Marketing',type:'website'}}
export default function R({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>{children}</body></html>}
