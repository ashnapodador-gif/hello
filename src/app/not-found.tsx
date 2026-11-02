import Link from "next/link";
export default function NotFound() {
  return (
    <div className="hero-sky grid min-h-screen place-items-center px-6 text-center text-white">
      <div>
        <p className="font-display text-8xl font-bold text-gradient-gold">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">The sun hasn’t risen on this page.</h1>
        <p className="mt-3 text-white/70">The page you are looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-gold">← Back to Home</Link>
          <Link href="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
