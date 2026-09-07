"use client";

import { cn } from "@/lib/utils";

interface BenchmarkBadgeProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
}

function getScoreColor(normalized: number): string {
  if (normalized >= 85) return "bg-accent-emerald/15 text-accent-emerald border-accent-emerald/25";
  if (normalized >= 70) return "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25";
  if (normalized >= 50) return "bg-accent-amber/15 text-[#f59e0b] border-accent-amber/25";
  return "bg-accent-rose/15 text-accent-rose border-accent-rose/25";
}

export function BenchmarkBadge({
  label,
  score,
  maxScore = 100,
  className,
}: BenchmarkBadgeProps) {
  const normalized = Math.round((score / maxScore) * 100);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
        getScoreColor(normalized),
        className
      )}
    >
      <span className="text-xs opacity-70">{label}</span>
      <span className="font-mono font-bold">{score}</span>
    </div>
  );
}
