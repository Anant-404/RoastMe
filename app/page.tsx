'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

type ModuleKey = "spotify" | "valorant" | "steam" | "chess" | "csgo" | "genshin" | "leetcode" | "github";

export default function Home() {
  const { data: session } = useSession();
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRoastExpanded, setIsRoastExpanded] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);

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

  // Chess State
  const [chessRoast, setChessRoast] = useState<string | null>(null);
  const [chessLoading, setChessLoading] = useState(false);
  const [chessError, setChessError] = useState<string | null>(null);
  const [chessUser, setChessUser] = useState("");

  // CSGO State
  const [csgoRoast, setCsgoRoast] = useState<string | null>(null);
  const [csgoLoading, setCsgoLoading] = useState(false);
  const [csgoError, setCsgoError] = useState<string | null>(null);
  const [csgoSteamId, setCsgoSteamId] = useState("");

  // Genshin State
  const [genshinRoast, setGenshinRoast] = useState<string | null>(null);
  const [genshinLoading, setGenshinLoading] = useState(false);
  const [genshinError, setGenshinError] = useState<string | null>(null);
  const [genshinUid, setGenshinUid] = useState("");

  // LeetCode State
  const [leetRoast, setLeetRoast] = useState<string | null>(null);
  const [leetLoading, setLeetLoading] = useState(false);
  const [leetError, setLeetError] = useState<string | null>(null);
  const [leetUser, setLeetUser] = useState("");

  // GitHub State
  const [githubRoast, setGithubRoast] = useState<string | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState("");

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

  const handleChessRoast = async () => {
    setChessError(null);
    setChessRoast(null);
    setChessLoading(true);

    if (!chessUser) {
      setChessError("Enter a Chess.com username first.");
      setChessLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-chess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: chessUser }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setChessRoast(data.roast);
      } else {
        setChessError(data.error || "Could not fetch Chess data.");
      }
    } catch (err) {
      setChessError("Chess.com took a nap. Try again.");
    }

    setChessLoading(false);
  };

  const handleCsgoRoast = async () => {
    setCsgoError(null);
    setCsgoRoast(null);
    setCsgoLoading(true);

    if (!csgoSteamId) {
      setCsgoError("Enter a Steam ID first.");
      setCsgoLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-csgo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId: csgoSteamId }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setCsgoRoast(data.roast);
      } else {
        setCsgoError(data.error || "Could not fetch CS stats.");
      }
    } catch (err) {
      setCsgoError("CS servers lagged. Try again.");
    }

    setCsgoLoading(false);
  };

  const handleGenshinRoast = async () => {
    setGenshinError(null);
    setGenshinRoast(null);
    setGenshinLoading(true);

    if (!genshinUid) {
      setGenshinError("Enter your UID first.");
      setGenshinLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-genshin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: genshinUid }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setGenshinRoast(data.roast);
      } else {
        setGenshinError(data.error || "Could not fetch Genshin data.");
      }
    } catch (err) {
      setGenshinError("Genshin servers are sleepy. Try again.");
    }

    setGenshinLoading(false);
  };

  const handleLeetRoast = async () => {
    setLeetError(null);
    setLeetRoast(null);
    setLeetLoading(true);

    if (!leetUser) {
      setLeetError("Enter a LeetCode username first.");
      setLeetLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetUser }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setLeetRoast(data.roast);
      } else {
        setLeetError(data.error || "Could not fetch LeetCode stats.");
      }
    } catch (err) {
      setLeetError("LeetCode endpoint failed. Try again.");
    }

    setLeetLoading(false);
  };

  const handleGithubRoast = async () => {
    setGithubError(null);
    setGithubRoast(null);
    setGithubLoading(true);

    if (!githubUser) {
      setGithubError("Enter a GitHub username first.");
      setGithubLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/roast-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: githubUser }),
      });
      const data = await res.json();

      if (res.ok && data.roast) {
        setGithubRoast(data.roast);
      } else {
        setGithubError(data.error || "Could not fetch GitHub profile.");
      }
    } catch (err) {
      setGithubError("GitHub rate limited us. Try again.");
    }

    setGithubLoading(false);
  };

  const moduleCards = [
    {
      key: "spotify" as const,
      title: "Spotify taste roast",
      logo: "/spotify-logo.png",
      gradient: "from-emerald-500/25 via-emerald-500/10 to-teal-500/15",
      border: "border-emerald-400/30",
      status: !session ? "Sign in to unlock" : loading ? "Cooking..." : roast ? "Served hot" : "Armed",
      blurb: "Point us at your playlists and we will clap back with taste-shaming poetry.",
      preview: roast ? `"${roast.slice(0, 76)}${roast.length > 76 ? "..." : ""}"` : "Playlist confession booth",
    },
    {
      key: "valorant" as const,
      title: "Valorant stat roast",
      logo: "/valorant.png",
      gradient: "from-rose-500/25 via-rose-500/10 to-orange-400/15",
      border: "border-rose-400/30",
      status: valoLoading ? "Analyzing..." : valoRoast ? "Served hot" : "Ready",
      blurb: "Drop your Riot ID for a lobby-ready insult about your utility and whiffs.",
      preview: valoRoast ? `"${valoRoast.slice(0, 76)}${valoRoast.length > 76 ? "..." : ""}"` : "Aim training not included",
    },
    {
      key: "steam" as const,
      title: "Steam library roast",
      logo: "/steam.png",
      gradient: "from-blue-500/25 via-blue-500/10 to-cyan-400/15",
      border: "border-blue-400/30",
      status: steamLoading ? "Analyzing..." : steamRoast ? "Served hot" : "Ready",
      blurb: "We will judge your backlog, your hours, and the friends you ignore.",
      preview: steamRoast ? `"${steamRoast.slice(0, 76)}${steamRoast.length > 76 ? "..." : ""}"` : "Backlog therapy session",
    },
    {
      key: "chess" as const,
      title: "Chess.com roast",
      logo: "/chess.png",
      gradient: "from-amber-500/25 via-amber-500/10 to-yellow-500/15",
      border: "border-amber-400/30",
      status: chessLoading ? "Analyzing..." : chessRoast ? "Served hot" : "Ready",
      blurb: "Send your Chess.com name and we will roast every blunder.",
      preview: chessRoast ? `"${chessRoast.slice(0, 76)}${chessRoast.length > 76 ? "..." : ""}"` : "Blunder review pending",
    },
    {
      key: "csgo" as const,
      title: "CSGO stats roast",
      logo: "/csgo.png",
      gradient: "from-yellow-500/25 via-orange-500/10 to-amber-500/15",
      border: "border-yellow-400/30",
      status: csgoLoading ? "Analyzing..." : csgoRoast ? "Served hot" : "Ready",
      blurb: "Drop a Steam ID and we will roast your K/D and time wasted.",
      preview: csgoRoast ? `"${csgoRoast.slice(0, 76)}${csgoRoast.length > 76 ? "..." : ""}"` : "Utility dump incoming",
    },
    {
      key: "genshin" as const,
      title: "Genshin roast",
      logo: "/genshin.png",
      gradient: "from-purple-500/25 via-purple-500/10 to-indigo-500/15",
      border: "border-purple-400/30",
      status: genshinLoading ? "Analyzing..." : genshinRoast ? "Served hot" : "Ready",
      blurb: "Paste your UID so we can flame your abyss clears and crit ratios.",
      preview: genshinRoast ? `"${genshinRoast.slice(0, 76)}${genshinRoast.length > 76 ? "..." : ""}"` : "Co-op roast waiting",
    },
    {
      key: "leetcode" as const,
      title: "LeetCode roast",
      logo: "/code.png",
      gradient: "from-green-500/25 via-emerald-500/10 to-lime-500/15",
      border: "border-green-400/30",
      status: leetLoading ? "Analyzing..." : leetRoast ? "Served hot" : "Ready",
      blurb: "Share your LeetCode username to get flamed for easy-mode farming.",
      preview: leetRoast ? `"${leetRoast.slice(0, 76)}${leetRoast.length > 76 ? "..." : ""}"` : "DSA anxiety check",
    },
    {
      key: "github" as const,
      title: "GitHub roast",
      logo: "/github.png",
      gradient: "from-slate-500/25 via-slate-500/10 to-cyan-500/15",
      border: "border-slate-400/30",
      status: githubLoading ? "Analyzing..." : githubRoast ? "Served hot" : "Ready",
      blurb: "Public profile roast: stars, bio, readme, and your language choices.",
      preview: githubRoast ? `"${githubRoast.slice(0, 76)}${githubRoast.length > 76 ? "..." : ""}"` : "Open source roast queue",
    },
  ];

  const handleCardClick = (key: ModuleKey) => {
    setActiveModule(key);
    setIsRoastExpanded(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-emerald-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 -top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-[110px]" />
        <div className="absolute right-6 top-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-[95px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.7)]" />
              Roast Lab
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white sm:text-5xl">Roast deck, pick your burn</h1>
              <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
                Cards keep things clean. Tap one to expand a full control room for that roast. Nothing else crowds the stage.
              </p>
            </div>
          </div>
          {session && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-emerald-100 ring-1 ring-white/10">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.8)]" />
              Signed in as {session.user?.name}
            </div>
          )}
        </header>

        <section className="rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Roast playlist</p>
              <h2 className="text-2xl font-bold text-white">Choose a card to open its lab</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.8)]" />
                Only one module open at a time
              </span>
              <span className="hidden rounded-full bg-white/5 px-3 py-2 text-[0.7rem] uppercase tracking-[0.25em] text-gray-200 ring-1 ring-white/10 md:inline-flex">
                Tap to expand
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleCards.map((card) => {
              const isActive = activeModule === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => handleCardClick(card.key)}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} p-5 text-left shadow-xl transition hover:translate-y-[-2px] hover:shadow-2xl ${isActive ? "ring-2 ring-emerald-300/70" : "ring-1 ring-white/10"}`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm ring-1 ring-white/20">
                        <img src={card.logo} alt={card.title} className="h-full w-full object-contain drop-shadow-md" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">Roast card</p>
                        <p className="text-lg font-semibold text-white">{card.title}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white">
                      {card.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/80">{card.blurb}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 ring-1 ring-white/10">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      {card.preview}
                    </span>
                    <span className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${isActive ? "text-emerald-200" : "text-white/60"}`}>
                      {isActive ? "Open" : "Tap to open"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="roast-workbench" className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0f14] via-black/70 to-[#051c1a] p-8 shadow-[0_25px_80px_rgba(0,0,0,.55)] backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Roast workbench</p>
              <h3 className="text-2xl font-bold text-white">Everything you need to roast, only when opened</h3>
            </div>
            {activeModule && (
              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-200 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Close module
              </button>
            )}
          </div>

          {!activeModule && (
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-black/40 p-6 text-gray-200">
              <p className="text-lg font-semibold text-white">Pick a card above to start roasting.</p>
              <p className="text-sm text-gray-300">No more clutter - each roast opens in its own focused panel with all the inputs, context, and verdicts.</p>
            </div>
          )}

          {activeModule === "spotify" && (
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5 rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-black/70 to-black/80 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Spotify module</p>
                    <p className="text-lg font-semibold text-white">Roast your listening</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-emerald-100">
                    {loading ? "Cooking..." : roast ? "Updated" : "Armed"}
                  </span>
                </div>

                {!session ? (
                  <div className="space-y-4 rounded-xl border border-emerald-400/30 bg-black/50 p-5">
                    <p className="text-lg font-semibold text-white">Step inside the arena.</p>
                    <p className="text-sm text-gray-200">
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
                  <div className="space-y-4">
                    <button
                      onClick={handleRoast}
                      disabled={loading}
                      className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-400 px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                      {loading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />}
                      {loading ? "Roasting your taste..." : "Roast My Taste"}
                    </button>

                    <div className="rounded-xl border border-emerald-500/30 bg-black/60 p-5 shadow-[0_10px_40px_rgba(0,0,0,.35)]">
                      <div className="flex items-center justify-between text-sm text-emerald-100">
                        <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.9)]" />
                          Roast verdict
                        </div>
                        <span className="text-emerald-200/80">{loading ? "Cooking..." : roast ? "Served hot" : "Awaiting order"}</span>
                      </div>

                      <div className="mt-3 rounded-lg border border-white/5 bg-black/40 p-4">
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">How this card works</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    One-click CTA opens the roast slot without other modules in your face.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    Expand long roasts only when they get spicy; keeps the card neat.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    Status chip shows when the insults are cooking or ready.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "valorant" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-rose-400/30 bg-gradient-to-br from-[#1b0d12] via-black/70 to-[#0f0b14] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Valorant module</p>
                    <p className="text-lg font-semibold text-white">Lobby-friendly burns</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-rose-100">
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">Valorant card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,.7)]" />
                    Stacks inputs in a tighter column; only opens when the Valorant card is active.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,.7)]" />
                    Keeps verdict and errors close to the CTA for quick retries.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,.7)]" />
                    Gradient glass shell separates it from other modules visually.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "steam" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#0b1016] via-black/70 to-[#0e141b] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Steam module</p>
                    <p className="text-lg font-semibold text-white">Mock your backlog</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-blue-100">
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">Steam card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.7)]" />
                    Swaps the old three-column sprawl for a single focused workspace.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.7)]" />
                    Status and CTA sit together so you know when to retry instantly.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.7)]" />
                    Blur glass treatment separates the content from the card deck above.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "chess" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-black/70 to-black/80 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Chess module</p>
                    <p className="text-lg font-semibold text-white">Blunder clinic roast</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-amber-100">
                    {chessLoading ? "Analyzing" : chessRoast ? "Updated" : "Ready"}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.25em] text-amber-200">Chess.com username</label>
                  <input
                    value={chessUser}
                    onChange={(e) => setChessUser(e.target.value)}
                    placeholder="e.g. hikaru"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-amber-400/30 focus:border-amber-400 focus:ring-2"
                  />
                  <button
                    onClick={handleChessRoast}
                    disabled={chessLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                    {chessLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />}
                    {chessLoading ? "Reviewing blunders..." : "Roast my Chess"}
                  </button>
                  <p className="text-xs text-amber-100/80">Public Chess.com profiles work best. Rapid and puzzle ratings get roasted.</p>
                </div>

                <div className="rounded-2xl border border-amber-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="flex items-center justify-between text-sm text-amber-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,.9)]" />
                      Match verdict
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-amber-100/80 ring-1 ring-white/10">{chessLoading ? "Cooking..." : chessRoast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/60 p-4">
                    {chessLoading && (
                      <div className="space-y-3 text-sm text-amber-100">
                        <div className="h-3 w-5/6 rounded-full bg-amber-400/30 animate-pulse" />
                        <div className="h-3 w-3/4 rounded-full bg-amber-400/20 animate-pulse" />
                      </div>
                    )}
                    {!chessLoading && chessError && (
                      <p className="text-sm text-amber-200">{chessError}</p>
                    )}
                    {!chessLoading && chessRoast && (
                      <div className="space-y-2">
                        <p className="text-base font-semibold leading-relaxed text-amber-50">"{chessRoast}"</p>
                        <button
                          onClick={() => setChessRoast(null)}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 underline underline-offset-4 hover:text-amber-100"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {!chessLoading && !chessRoast && !chessError && (
                      <p className="text-sm text-gray-300">Paste a Chess.com username and let us flame your Elo and blunders.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">Chess card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.7)]" />
                    Form stays tight, verdict rides under the CTA for fast retries.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.7)]" />
                    Clear error surfacing for private or missing profiles.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.7)]" />
                    Fits the same shell so the card grid stays consistent.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "csgo" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 via-black/70 to-[#191004] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">CSGO module</p>
                    <p className="text-lg font-semibold text-white">Queue toxicity roast</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-yellow-100">
                    {csgoLoading ? "Analyzing" : csgoRoast ? "Updated" : "Ready"}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.25em] text-yellow-200">Steam ID</label>
                  <input
                    value={csgoSteamId}
                    onChange={(e) => setCsgoSteamId(e.target.value)}
                    placeholder="e.g. 7656119..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-yellow-400/30 focus:border-yellow-400 focus:ring-2"
                  />
                  <button
                    onClick={handleCsgoRoast}
                    disabled={csgoLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-400 px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                    {csgoLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />}
                    {csgoLoading ? "Checking K/D..." : "Roast my CSGO"}
                  </button>
                  <p className="text-xs text-yellow-100/80">Use a 64-bit Steam ID. Public stats required or we cannot flame you.</p>
                </div>

                <div className="rounded-2xl border border-yellow-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="flex items-center justify-between text-sm text-yellow-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,.9)]" />
                      Match verdict
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-yellow-100/80 ring-1 ring-white/10">{csgoLoading ? "Cooking..." : csgoRoast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/60 p-4">
                    {csgoLoading && (
                      <div className="space-y-3 text-sm text-yellow-100">
                        <div className="h-3 w-5/6 rounded-full bg-yellow-400/30 animate-pulse" />
                        <div className="h-3 w-3/4 rounded-full bg-yellow-400/20 animate-pulse" />
                      </div>
                    )}
                    {!csgoLoading && csgoError && (
                      <p className="text-sm text-yellow-200">{csgoError}</p>
                    )}
                    {!csgoLoading && csgoRoast && (
                      <div className="space-y-2">
                        <p className="text-base font-semibold leading-relaxed text-yellow-50">"{csgoRoast}"</p>
                        <button
                          onClick={() => setCsgoRoast(null)}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200 underline underline-offset-4 hover:text-yellow-100"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {!csgoLoading && !csgoRoast && !csgoError && (
                      <p className="text-sm text-gray-300">Paste a Steam ID to let us judge your K/D, hours, and aim.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">CSGO card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,.7)]" />
                    Tight CTA with status chip for quick rerolls.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,.7)]" />
                    Shows private-profile error immediately.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,.7)]" />
                    Keeps verdict within the same glass card for readability.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "genshin" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 via-black/70 to-[#150b1f] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-200">Genshin module</p>
                    <p className="text-lg font-semibold text-white">Abyss shame roast</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-purple-100">
                    {genshinLoading ? "Analyzing" : genshinRoast ? "Updated" : "Ready"}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.25em] text-purple-200">UID</label>
                  <input
                    value={genshinUid}
                    onChange={(e) => setGenshinUid(e.target.value)}
                    placeholder="e.g. 800000000"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-purple-400/30 focus:border-purple-400 focus:ring-2"
                  />
                  <button
                    onClick={handleGenshinRoast}
                    disabled={genshinLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-fuchsia-400 px-6 py-4 text-lg font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                    {genshinLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
                    {genshinLoading ? "Reading artifacts..." : "Roast my Genshin"}
                  </button>
                  <p className="text-xs text-purple-100/80">Make sure the showcase is public so we can judge your crit ratios.</p>
                </div>

                <div className="rounded-2xl border border-purple-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="flex items-center justify-between text-sm text-purple-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,.9)]" />
                      Abyss verdict
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-purple-100/80 ring-1 ring-white/10">{genshinLoading ? "Cooking..." : genshinRoast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/60 p-4">
                    {genshinLoading && (
                      <div className="space-y-3 text-sm text-purple-100">
                        <div className="h-3 w-5/6 rounded-full bg-purple-400/30 animate-pulse" />
                        <div className="h-3 w-3/4 rounded-full bg-purple-400/20 animate-pulse" />
                      </div>
                    )}
                    {!genshinLoading && genshinError && (
                      <p className="text-sm text-purple-200">{genshinError}</p>
                    )}
                    {!genshinLoading && genshinRoast && (
                      <div className="space-y-2">
                        <p className="text-base font-semibold leading-relaxed text-purple-50">"{genshinRoast}"</p>
                        <button
                          onClick={() => setGenshinRoast(null)}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200 underline underline-offset-4 hover:text-purple-100"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {!genshinLoading && !genshinRoast && !genshinError && (
                      <p className="text-sm text-gray-300">Paste your UID to get an abyss-grade insult about your builds.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">Genshin card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,.7)]" />
                    Inputs and verdict stay close for quick retries.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,.7)]" />
                    Gradient shell matches the card above for cohesion.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,.7)]" />
                    Error text uses the accent so it is obvious when UID is bad.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "leetcode" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-green-400/30 bg-gradient-to-br from-green-500/10 via-black/70 to-[#0c160c] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-green-200">LeetCode module</p>
                    <p className="text-lg font-semibold text-white">DSA humility roast</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-green-100">
                    {leetLoading ? "Analyzing" : leetRoast ? "Updated" : "Ready"}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.25em] text-green-200">LeetCode username</label>
                  <input
                    value={leetUser}
                    onChange={(e) => setLeetUser(e.target.value)}
                    placeholder="e.g. neetcode"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-green-400/30 focus:border-green-400 focus:ring-2"
                  />
                  <button
                    onClick={handleLeetRoast}
                    disabled={leetLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-green-500 via-emerald-400 to-lime-400 px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                    {leetLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />}
                    {leetLoading ? "Counting easies..." : "Roast my LeetCode"}
                  </button>
                  <p className="text-xs text-green-100/80">Public LeetCode stats only. We will shame your acceptance rate and solve mix.</p>
                </div>

                <div className="rounded-2xl border border-green-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="flex items-center justify-between text-sm text-green-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,.9)]" />
                      Grind verdict
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-green-100/80 ring-1 ring-white/10">{leetLoading ? "Cooking..." : leetRoast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/60 p-4">
                    {leetLoading && (
                      <div className="space-y-3 text-sm text-green-100">
                        <div className="h-3 w-5/6 rounded-full bg-green-400/30 animate-pulse" />
                        <div className="h-3 w-3/4 rounded-full bg-green-400/20 animate-pulse" />
                      </div>
                    )}
                    {!leetLoading && leetError && (
                      <p className="text-sm text-green-200">{leetError}</p>
                    )}
                    {!leetLoading && leetRoast && (
                      <div className="space-y-2">
                        <p className="text-base font-semibold leading-relaxed text-green-50">"{leetRoast}"</p>
                        <button
                          onClick={() => setLeetRoast(null)}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200 underline underline-offset-4 hover:text-green-100"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {!leetLoading && !leetRoast && !leetError && (
                      <p className="text-sm text-gray-300">Paste your handle to get roasted on your grind pace and acceptance.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">LeetCode card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    Clean single input and immediate verdict space.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    Shares grid layout with other modules for consistency.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
                    CTA shows loading while we fetch and roast.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeModule === "github" && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5 rounded-2xl border border-slate-400/30 bg-gradient-to-br from-slate-600/15 via-black/70 to-[#0b141b] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-200">GitHub module</p>
                    <p className="text-lg font-semibold text-white">Profile roast</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-slate-100">
                    {githubLoading ? "Analyzing" : githubRoast ? "Updated" : "Ready"}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.25em] text-slate-200">GitHub username</label>
                  <input
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="e.g. torvalds"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-slate-400/40 focus:border-slate-400 focus:ring-2"
                  />
                  <button
                    onClick={handleGithubRoast}
                    disabled={githubLoading}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-slate-500 via-slate-400 to-cyan-400 px-6 py-4 text-lg font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -z-10 bg-white/30 opacity-0 blur-2xl transition group-hover:opacity-100" />
                    {githubLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
                    {githubLoading ? "Reading repos..." : "Roast my GitHub"}
                  </button>
                  <p className="text-xs text-slate-100/80">Public profile only. We will mock your stars, bio, and favorite language.</p>
                </div>

                <div className="rounded-2xl border border-slate-400/30 bg-black/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="flex items-center justify-between text-sm text-slate-100">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 shadow-[0_0_12px_rgba(148,163,184,.9)]" />
                      Repo verdict
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-100/80 ring-1 ring-white/10">{githubLoading ? "Cooking..." : githubRoast ? "Served hot" : "Awaiting order"}</span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/60 p-4">
                    {githubLoading && (
                      <div className="space-y-3 text-sm text-slate-100">
                        <div className="h-3 w-5/6 rounded-full bg-slate-400/30 animate-pulse" />
                        <div className="h-3 w-3/4 rounded-full bg-slate-400/20 animate-pulse" />
                      </div>
                    )}
                    {!githubLoading && githubError && (
                      <p className="text-sm text-slate-200">{githubError}</p>
                    )}
                    {!githubLoading && githubRoast && (
                      <div className="space-y-2">
                        <p className="text-base font-semibold leading-relaxed text-slate-50">"{githubRoast}"</p>
                        <button
                          onClick={() => setGithubRoast(null)}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 underline underline-offset-4 hover:text-slate-100"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {!githubLoading && !githubRoast && !githubError && (
                      <p className="text-sm text-gray-300">Drop a username to let us roast your repos, stars, and readme.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-xl backdrop-blur">
                <p className="text-base font-semibold text-white">GitHub card vibe</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300 shadow-[0_0_10px_rgba(148,163,184,.7)]" />
                    Minimal single input mirrors other cards for muscle memory.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300 shadow-[0_0_10px_rgba(148,163,184,.7)]" />
                    Error and verdict blocks stay in one shell to reduce scroll.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300 shadow-[0_0_10px_rgba(148,163,184,.7)]" />
                    Matches the card deck accents so the flow feels unified.
                  </li>
                </ul>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
