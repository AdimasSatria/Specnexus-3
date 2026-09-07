"use client";

import { cn } from "@/lib/utils";

interface CategoryPillProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ label, count, active = false, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "border",
        active
          ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          : "bg-surface-secondary border-border hover:border-zinc-500 text-zinc-400 hover:text-zinc-200"
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            active ? "bg-accent-cyan/20 text-accent-cyan" : "bg-zinc-800 text-zinc-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
