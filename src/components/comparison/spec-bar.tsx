"use client";

import { cn } from "@/lib/utils";

const PRODUCT_COLORS = [
  "bg-accent-cyan",
  "bg-accent-violet",
  "bg-[#f59e0b]",
  "bg-[#f43f5e]",
];

const PRODUCT_TEXT_COLORS = [
  "text-accent-cyan",
  "text-accent-violet",
  "text-[#f59e0b]",
  "text-[#f43f5e]",
];

interface SpecBarProps {
  label: string;
  values: number[];
  productNames: string[];
  max?: number;
  unit?: string;
  higherIsBetter?: boolean;
}

export function SpecBar({
  label,
  values,
  productNames,
  max,
  unit = "",
  higherIsBetter = true,
}: SpecBarProps) {
  const actualMax = max || Math.max(...values) * 1.15;
  const winnerValue = higherIsBetter ? Math.max(...values) : Math.min(...values);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-400 font-medium">{label}</span>
      </div>
      <div className="space-y-2">
        {values.map((value, idx) => {
          const width = (value / actualMax) * 100;
          const isWinner = value === winnerValue && new Set(values).size > 1;

          return (
            <div key={idx} className="flex items-center gap-3">
              <span className={cn("text-xs font-medium w-20 truncate", PRODUCT_TEXT_COLORS[idx])}>
                {productNames[idx]?.split(" ").slice(-1)[0]}
              </span>
              <div className="flex-1 h-6 rounded-md bg-zinc-800/60 overflow-hidden relative">
                <div
                  className={cn(
                    "h-full rounded-md meter-fill transition-all",
                    isWinner ? PRODUCT_COLORS[idx] : `${PRODUCT_COLORS[idx]} opacity-50`
                  )}
                  style={{ "--fill-width": `${width}%`, width: `${width}%` } as React.CSSProperties}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-mono w-16 text-right",
                  isWinner ? "text-zinc-100 font-semibold" : "text-zinc-500"
                )}
              >
                {value.toLocaleString()}{unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
