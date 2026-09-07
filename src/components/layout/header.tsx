"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/browse/cpu", label: "CPUs" },
  { href: "/browse/gpu", label: "GPUs" },
  { href: "/browse/mouse", label: "Mice" },
  { href: "/browse/keyboard", label: "Keyboards" },
  { href: "/browse/monitor", label: "Monitors" },
  { href: "/browse/microphone", label: "Mics" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Spec<span className="text-gradient-cyan">Nexus</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname?.startsWith(link.href)
                    ? "text-accent-cyan bg-accent-cyan/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-500 bg-zinc-900 border border-border hover:border-zinc-500 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded border border-zinc-700">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
