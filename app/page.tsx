'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRoastExpanded, setIsRoastExpanded] = useState(false);

  // Valorant State
  const [valoRoast, setValoRoast] = useState<string | null>(null);
  const [valoLoading, setValoLoading] = useState(false);
  const [valoError, setValoError] = useState<string | null>(null);
  const [valoName, setValoName] = useState("");
  const [valoTag, setValoTag] = useState("");
  const [valoRegion, setValoRegion] = useState("na");

  // Steam State
  const [steamRoast, setSteamRoast] = useState<string | null>(null);
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamError, setSteamError] = useState<string | null>(null);
  const [steamInput, setSteamInput] = useState("");

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

  const handleSteamRoast = async () => {
    setSteamError(null);
    setSteamRoast(null);
    setSteamLoading(true);

    if (!steamInput) {
      setSteamError("Enter your Steam ID or URL first.");
      setSteamLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-steam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamInput }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setSteamRoast(data.roast);
      } else {
        setSteamError(data.error || "Could not fetch Steam data. Check your ID/URL.");
      }
    } catch (err) {
      setSteamError("Steam servers are offline (classic). Try again.");
    }

    setSteamLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-emerald-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 -top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-[110px]" />
        <div className="absolute right-6 top-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-[95px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:px-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.7)]" />
              Roast Lab
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white sm:text-5xl">Roasts for your playlists and your lobbies</h1>
              <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
                Pick your poison: let us clown your Spotify history, flame your Valorant stats, or mock your Steam library.
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

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-10">
          {/* Spotify Section */}
          <section className="flex h-full min-h-[540px] flex-col space-y-6 rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur">
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

          {/* Valorant Section */}
          <section className="flex h-full min-h-[540px] flex-col space-y-6 rounded-2xl border border-rose-200/20 bg-gradient-to-br from-[#1b0d12] via-black/60 to-[#0f0b14] p-8 shadow-2xl backdrop-blur">
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

          {/* Steam Section */}
          <section className="flex h-full min-h-[540px] flex-col space-y-7 rounded-2xl border border-blue-200/20 bg-gradient-to-br from-[#0b1016] via-black/60 to-[#0e141b] p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Steam roast</p>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-blue-200">
                <span className={`h-2 w-2 rounded-full ${steamLoading ? "bg-blue-400" : "bg-emerald-400"} shadow-[0_0_10px_rgba(96,165,250,.8)]`} />
                {steamLoading ? "Analyzing" : steamRoast ? "Updated" : "Ready"}
              </span>
            </div>

            <div className="space-y-4 rounded-xl border border-blue-500/20 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-blue-100">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.8)]" />
                  Quick scan
                </span>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-cyan-100 ring-1 ring-white/10">
                  Public profile works best
                </span>
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.25em] text-blue-200">Steam ID or URL</label>
                <input
                  value={steamInput}
                  onChange={(e) => setSteamInput(e.target.value)}
                  placeholder="e.g. 76561198000000000 or https://steamcommunity.com/id/..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-blue-400/30 transition focus:border-blue-400 focus:ring-2"
                />
                <button
                  onClick={handleSteamRoast}
                  disabled={steamLoading}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <span className="absolute inset-0 -z-10 bg-white/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
                  {steamLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
                  {steamLoading ? "Scanning..." : "Roast my Steam"}
                </button>
                <p className="text-xs text-blue-100/70">Paste a profile link or 64-bit ID. We will pull your hours, shame pile, and deliver the verdict.</p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-blue-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
              <div className="flex items-center justify-between text-sm text-blue-100">
                <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.9)]" />
                  Library verdict
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-blue-100/80 ring-1 ring-white/10">{steamLoading ? "Cooking..." : steamRoast ? "Served hot" : "Awaiting order"}</span>
              </div>

              <div className="mt-4 space-y-4 rounded-xl border border-white/10 bg-black/60 p-5">
                {steamLoading && (
                  <div className="space-y-3 text-sm text-blue-100">
                    <div className="h-3 w-5/6 rounded-full bg-blue-400/30 animate-pulse" />
                    <div className="h-3 w-3/4 rounded-full bg-blue-400/20 animate-pulse" />
                    <div className="h-3 w-2/3 rounded-full bg-blue-400/10 animate-pulse" />
                  </div>
                )}
                {!steamLoading && steamError && (
                  <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(59,130,246,.8)]" />
                    <p>{steamError}</p>
                  </div>
                )}
                {!steamLoading && steamRoast && (
                  <div className="space-y-3">
                    <p className="text-base font-semibold leading-relaxed text-blue-50">
                      "{steamRoast}"
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setSteamRoast(null)}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 underline underline-offset-4 hover:text-blue-100"
                      >
                        Clear
                      </button>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-blue-100 ring-1 ring-white/10">Fresh</span>
                    </div>
                  </div>
                )}
                {!steamLoading && !steamRoast && !steamError && (
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Paste your Steam profile link or ID to find out what your pile of shame says about you.</p>
                    <p className="text-blue-100/80">Tip: Set game details to public so we can roast your hours properly.</p>
                  </div>
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
                Brutally honest one-liners for your Spotify history, Valorant matches, and Steam library.
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
            <p className="mt-3 text-gray-300">Queue your most-played playlist before hitting Spotify roast. For Valorant, include the correct tag. For Steam, make sure your game details are public.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
