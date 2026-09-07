"use client";

import { cn } from "@/lib/utils";

interface WeightGaugeProps {
  value: number; // grams
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

function getWeightColor(value: number): string {
  if (value <= 50) return "text-accent-emerald";
  if (value <= 60) return "text-accent-cyan";
  if (value <= 75) return "text-accent-amber";
  return "text-accent-rose";
}

function getWeightBarColor(value: number): string {
  if (value <= 50) return "bg-accent-emerald";
  if (value <= 60) return "bg-accent-cyan";
  if (value <= 75) return "bg-[#f59e0b]";
  return "bg-accent-rose";
}

function getWeightLabel(value: number): string {
  if (value <= 50) return "Ultralight";
  if (value <= 60) return "Light";
  if (value <= 75) return "Medium";
  return "Heavy";
}

export function WeightGauge({
  value,
  min = 30,
  max = 120,
  label = "Weight",
  className,
}: WeightGaugeProps) {
  const width = Math.min(((value - min) / (max - min)) * 100, 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm font-mono font-bold", getWeightColor(value))}>
            {value}g
          </span>
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-800", getWeightColor(value))}>
            {getWeightLabel(value)}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden relative">
        <div
          className={cn("h-full rounded-full meter-fill transition-all", getWeightBarColor(value))}
          style={{ "--fill-width": `${width}%`, width: `${width}%` } as React.CSSProperties}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-zinc-700"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
        <span>{min}g</span>
        <span>{max}g</span>
      </div>
    </div>
  );
}
