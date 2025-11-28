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
      const res = await fetch('/api/roast', { method: 'POST' });
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-5xl font-bold mb-8 text-green-500">Spotify Roaster</h1>

      {!session ? (
        <button
          onClick={() => signIn('spotify')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition"
        >
          Login with Spotify
        </button>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="text-xl">Logged in as {session.user?.name}</p>
          
          <button
            onClick={handleRoast}
            disabled={loading}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition"
          >
            {loading ? "Analyzing bad taste..." : "Roast My Taste"}
          </button>

          {roast && (
            <div className="mt-8 p-6 border border-green-500 rounded-lg max-w-lg bg-gray-900">
              <p className="text-lg italic">"{roast}"</p>
            </div>
          )}

          <button onClick={() => signOut()} className="text-gray-500 underline mt-4">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}