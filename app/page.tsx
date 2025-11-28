'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRoastExpanded, setIsRoastExpanded] = useState(false);
  const [valoRoast, setValoRoast] = useState<string | null>(null);
  const [valoLoading, setValoLoading] = useState(false);
  const [valoError, setValoError] = useState<string | null>(null);
  const [valoName, setValoName] = useState("");
  const [valoTag, setValoTag] = useState("");
  const [valoRegion, setValoRegion] = useState("na");

  const handleRoast = async () => {
    setLoading(true);
    setRoast(null);
    setIsRoastExpanded(false);

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

  const handleValorantRoast = async () => {
    setValoError(null);
    setValoRoast(null);
    setValoLoading(true);

    if (!valoName || !valoTag) {
      setValoError("Add your in-game name and tag first.");
      setValoLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-val", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: valoName, tag: valoTag, region: valoRegion }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setValoRoast(data.roast);
      } else {
        setValoError(data.error || "Could not fetch Valorant stats. Try again.");
      }
    } catch (err) {
      setValoError("Valorant servers are dodging. Try once more.");
    }

    setValoLoading(false);
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
              <h1 className="text-4xl font-black text-white sm:text-5xl">Roasts for your playlists and your Valorant lobbies</h1>
              <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
                Pick your poison: let us clown your Spotify history or flame your match stats. Everything is tuned for mobile so you can get roasted on the go.
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-black/50 p-7 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Spotify roast</p>
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

                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black/60 to-black/70 p-6 shadow-[0_10px_50px_rgba(0,0,0,.35)]">
                  <div className="flex items-center justify-between text-sm text-emerald-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.9)]" />
                      Roast verdict
                    </div>
                    <span className="text-emerald-200/80">{loading ? "Cooking..." : roast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-5">
                    {loading && (
                      <div className="flex items-center justify-between gap-3 text-sm text-gray-300">
                        <span className="flex-1 text-left">Sharpening insults...</span>
                        <span className="h-1 w-24 rounded-full bg-emerald-400/30">
                          <span className="block h-1 w-16 animate-pulse rounded-full bg-emerald-400" />
                        </span>
                      </div>
                    )}
                    {!loading && roast && (
                      <div className="space-y-3">
                        <p
                          className={`text-xl font-semibold leading-relaxed text-gray-50 sm:text-2xl ${isRoastExpanded ? "" : "max-h-32 overflow-hidden text-ellipsis"} break-words`}
                        >
                          "{roast}"
                        </p>
                        {roast.length > 140 && (
                          <button
                            onClick={() => setIsRoastExpanded((prev) => !prev)}
                            className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 underline underline-offset-4 hover:text-emerald-100"
                          >
                            {isRoastExpanded ? "Show less" : "Show full roast"}
                          </button>
                        )}
                      </div>
                    )}
                    {!loading && !roast && (
                      <p className="text-base text-gray-300">Hit the button above to get your personalized roast delivered here.</p>
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

          <section className="space-y-6 rounded-2xl border border-rose-200/20 bg-gradient-to-br from-[#1b0d12] via-black/60 to-[#0f0b14] p-7 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Valorant roast</p>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rose-200">
                <span className={`h-2 w-2 rounded-full ${valoLoading ? "bg-rose-400" : "bg-emerald-400"} shadow-[0_0_10px_rgba(244,63,94,.8)]`} />
                {valoLoading ? "Analyzing" : valoRoast ? "Updated" : "Ready"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-rose-200">Riot ID</label>
                <input
                  value={valoName}
                  onChange={(e) => setValoName(e.target.value)}
                  placeholder="e.g. TenZ"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-rose-400/30 focus:border-rose-400 focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.25em] text-rose-200">Tag</label>
                <input
                  value={valoTag}
                  onChange={(e) => setValoTag(e.target.value)}
                  placeholder="e.g. 001"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-rose-400/30 focus:border-rose-400 focus:ring-2"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs uppercase tracking-[0.25em] text-rose-200">Region</label>
                <select
                  value={valoRegion}
                  onChange={(e) => setValoRegion(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none ring-rose-400/30 focus:border-rose-400 focus:ring-2"
                >
                  <option value="na">NA</option>
                  <option value="eu">EU</option>
                  <option value="ap">AP</option>
                  <option value="kr">KR</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleValorantRoast}
              disabled={valoLoading}
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-rose-400 to-orange-400 px-6 py-4 text-lg font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
            >
              <span className="absolute inset-0 -z-10 bg-white/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
              {valoLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
              {valoLoading ? "Flaming your stats..." : "Roast my Valorant"}
            </button>

            <div className="rounded-2xl border border-rose-400/30 bg-black/40 p-6">
            <div className="flex items-center justify-between text-sm text-rose-100">
              <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,.9)]" />
                Match verdict
              </div>
              <span className="text-rose-100/80">{valoLoading ? "Cooking..." : valoRoast ? "Served hot" : "Awaiting order"}</span>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-4">
              {valoLoading && (
                <div className="space-y-3 text-sm text-rose-100">
                  <div className="h-3 w-5/6 rounded-full bg-rose-400/30 animate-pulse" />
                  <div className="h-3 w-3/4 rounded-full bg-rose-400/20 animate-pulse" />
                </div>
              )}
              {!valoLoading && valoError && (
                <p className="text-sm text-rose-200">{valoError}</p>
              )}
              {!valoLoading && valoRoast && (
                <div className="space-y-2">
                  <p className="text-base font-semibold leading-relaxed text-rose-50">
                    "{valoRoast}"
                  </p>
                  <button
                    onClick={() => setValoRoast(null)}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 underline underline-offset-4 hover:text-rose-100"
                  >
                    Clear
                  </button>
                </div>
              )}
              {!valoLoading && !valoRoast && !valoError && (
                <p className="text-sm text-gray-300">Drop your Riot ID and tag to get a lobby-ready roast without endless scrolling.</p>
              )}
            </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-gray-200 shadow-xl backdrop-blur">
            <p className="text-base font-semibold text-white">What you are getting</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                Brutally honest one-liners for your Spotify history and Valorant matches.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                Responsive cards that keep roasts tight on mobile with expand toggles only when needed.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                Clear status chips so you know when a roast is cooking or ready.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/50 p-5 text-sm text-gray-200 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Pro tips</p>
            <p className="mt-3 text-gray-300">Queue your most-played playlist before hitting Spotify roast. For Valorant, include the correct tag and region to avoid missing stats.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
