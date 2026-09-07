"use client";

import { cn } from "@/lib/utils";

interface LatencyMeterProps {
  value: number; // ms
  max?: number;
  label?: string;
  className?: string;
}

/** Returns color based on latency value — lower is better */
function getLatencyColor(value: number): string {
  if (value <= 0.3) return "text-accent-emerald";
  if (value <= 0.6) return "text-accent-cyan";
  if (value <= 1.0) return "text-accent-amber";
  return "text-accent-rose";
}

function getLatencyBarColor(value: number): string {
  if (value <= 0.3) return "bg-accent-emerald";
  if (value <= 0.6) return "bg-accent-cyan";
  if (value <= 1.0) return "bg-[#f59e0b]";
  return "bg-accent-rose";
}

function getLatencyLabel(value: number): string {
  if (value <= 0.3) return "Excellent";
  if (value <= 0.6) return "Great";
  if (value <= 1.0) return "Good";
  return "Average";
}

export function LatencyMeter({
  value,
  max = 5,
  label = "Latency",
  className,
}: LatencyMeterProps) {
  const width = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm font-mono font-bold", getLatencyColor(value))}>
            {value}ms
          </span>
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-800", getLatencyColor(value))}>
            {getLatencyLabel(value)}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={cn("h-full rounded-full meter-fill transition-all", getLatencyBarColor(value))}
          style={{ "--fill-width": `${width}%`, width: `${width}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
