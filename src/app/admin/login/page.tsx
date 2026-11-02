"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setError("Invalid email or password."); return; }
    router.push("/admin");
  };

  return (
    <div className="hero-sky grid min-h-screen place-items-center px-4">
      <form onSubmit={signIn} className="glass w-full max-w-md rounded-3xl p-8 text-white">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold to-orange font-display text-2xl font-bold">J</span>
          <h1 className="font-display text-2xl font-bold">JSunrise Admin</h1>
          <p className="text-sm text-white/60">Sign in to manage your website</p>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-500/20 p-3 text-center text-sm font-semibold">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 outline-none focus:border-gold" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 outline-none focus:border-gold" />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn-gold mt-6 w-full justify-center disabled:opacity-60">
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}