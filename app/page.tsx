'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    setLoading(true);
    setRoast(null); // Reset previous roast

    try {
      const res = await fetch("/api/roast", { method: "POST" });
      const data = await res.json();
      
      if (data.roast) {
        setRoast(data.roast);
      } else {
        setRoast("You are too boring to roast. (Error fetching data)");
      }
    } catch (e) {
      setRoast("Something went wrong. Maybe your taste broke the internet.");
    }
    
    setLoading(false);
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-emerald-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 -top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-[110px]" />
        <div className="absolute right-6 top-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-[95px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14 lg:px-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.7)]" />
              Roast Lab
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white sm:text-5xl">Let the AI roast your Spotify taste</h1>
              <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
                Sign in, hit roast, and brace for impact. We turn your listening history into a brutally honest headline.
              </p>
            </div>
          </div>
          {session && (
            <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm text-emerald-100 ring-1 ring-white/10">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.8)]" />
              Signed in as {session.user?.name}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Roast console</p>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.9)]" />
                {loading ? "Analyzing" : roast ? "Updated" : "Armed"}
              </span>
            </div>

            {!session ? (
              <div className="space-y-6 text-gray-200">
                <p className="text-lg font-semibold text-white">Step inside the arena.</p>
                <p className="text-sm text-gray-300">
                  Connect Spotify so we can scan your listening and craft a roast that hits where it hurts (in a fun way).
                </p>
                <button
                  onClick={() => signIn("spotify")}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-500 px-5 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] hover:bg-emerald-400"
                >
                  <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                  Login with Spotify
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleRoast}
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-400 px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                  {loading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />}
                  {loading ? "Roasting your taste..." : "Roast My Taste"}
                </button>

                <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black/60 to-black/70 p-6 shadow-[0_10px_50px_rgba(0,0,0,.35)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Latest verdict</p>
                  <div className="mt-3 min-h-[140px] rounded-lg border border-white/5 bg-black/40 p-4">
                    {loading && (
                      <div className="space-y-3">
                        <div className="h-3 w-24 rounded-full bg-emerald-400/30 animate-pulse" />
                        <div className="h-3 w-11/12 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-3 w-4/5 rounded-full bg-white/10 animate-pulse" />
                      </div>
                    )}
                    {!loading && roast && (
                      <p className="text-lg leading-relaxed text-gray-100">{roast}</p>
                    )}
                    {!loading && !roast && (
                      <p className="text-sm text-gray-400">
                        No roast yet. Hit the button and we will deliver a fresh insult tailored to your playlists.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Secure OAuth with Spotify
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-300 underline decoration-emerald-400/70 underline-offset-4 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
            <p className="text-base font-semibold text-white">What you are getting</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                Brutally honest one-liners generated live from your listening habits.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                A clean, cinematic layout that highlights each roast when it lands.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                Quick sign-in / sign-out controls without leaving the roast flow.
              </li>
            </ul>
            <div className="rounded-xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Pro tip</p>
              <p className="mt-2 text-gray-300">Queue your most-played playlist before hitting roast for maximum accuracy.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
