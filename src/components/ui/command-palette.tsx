"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Cpu, Monitor, Mouse, Keyboard, Mic, MonitorPlay, ArrowRight } from "lucide-react";
import { searchProducts } from "@/lib/data/store";
import type { SearchResult } from "@/lib/types/common";
import { cn, CATEGORY_LABELS, formatPrice } from "@/lib/utils";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-4 h-4" />,
  gpu: <Monitor className="w-4 h-4" />,
  mouse: <Mouse className="w-4 h-4" />,
  keyboard: <Keyboard className="w-4 h-4" />,
  monitor: <MonitorPlay className="w-4 h-4" />,
  microphone: <Mic className="w-4 h-4" />,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchProducts(query, 10);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      router.push(`/browse/${result.category}?highlight=${result.id}`);
    },
    [router]
  );

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    },
    [results, selectedIndex, handleSelect]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 glass-strong rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Search hardware & peripherals..."
            className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3 text-left transition-colors",
                  index === selectedIndex
                    ? "bg-accent-cyan/10 text-zinc-100"
                    : "text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <span className="text-zinc-500">
                  {CATEGORY_ICON_MAP[result.category] || <Search className="w-4 h-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{result.name}</div>
                  <div className="text-xs text-zinc-500">
                    {result.brand} · {CATEGORY_LABELS[result.category]}
                  </div>
                </div>
                <span className="text-sm font-mono text-zinc-400">
                  {formatPrice(result.msrp)}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {query.length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center text-zinc-500 text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Hint */}
        {query.length < 2 && (
          <div className="px-5 py-6 text-center text-zinc-600 text-sm">
            Type at least 2 characters to search across all hardware
          </div>
        )}
      </div>
    </div>
  );
}
