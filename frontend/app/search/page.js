"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("query") || "";
    const payload = {
      query: q
    };
  
    if (q) {
      setQuery(q);
  
      const fetchResults = async () => {
        try {
          const res = await fetch("http://localhost:8001/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Search failed:", errorText);
            return;
          }
  
          const data = await res.json();
          setResults(data.results || []);
          console.log("DATA:", data);
          console.log("available_tags:", data.available_tags);

        } catch (err) {
          console.error("Fetch error:", err);
        }
      };
  
      fetchResults();
    }
  }, [searchParams]);
  

  const onSearch = (e) => {
    e.preventDefault();
    const newQuery = e.target.search.value;
    router.push(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen bg-amber-950 text-amber-300 p-4">
      <form onSubmit={onSearch} className="mb-6 w-full max-w-md mx-auto flex">
        <input
          name="search"
          defaultValue={query}
          className="w-full p-3 rounded-l-md bg-amber-800 border border-amber-700 focus:outline-none"
          placeholder="Search recipes..."
        />
        <button
          type="submit"
          className="px-4 p-3 bg-amber-600 rounded-r-md hover:bg-amber-500 transition"
        >
          Search
        </button>
      </form>

      <p className="text-sm mb-4 text-amber-400">
        Showing results for: <span className="italic text-amber-200">{query}</span>
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-center text-amber-500">loading...</p>
      ) : (
        <ul className="space-y-4">
          {results.map((r) => (
            <li
              key={r.id}
              className="p-4 bg-amber-800 rounded hover:bg-amber-700 transition"
            >
              <Link href={`/recipe/${r.id}`}>
                <h3 className="text-xl font-semibold hover:underline">{r.title}</h3>
                <p className="text-sm text-amber-300">{r.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
