"use client";

import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import type { CompatibilityWarning } from "@/lib/types/common";
import { cn } from "@/lib/utils";

interface CompatibilityWarningsProps {
  warnings: CompatibilityWarning[];
}

const SEVERITY_STYLES = {
  critical: {
    border: "border-accent-rose/30",
    bg: "bg-accent-rose/5",
    icon: <AlertCircle className="w-5 h-5 text-accent-rose" />,
    badge: "bg-accent-rose/15 text-accent-rose",
    badgeText: "Critical",
  },
  warning: {
    border: "border-accent-amber/30",
    bg: "bg-accent-amber/5",
    icon: <AlertTriangle className="w-5 h-5 text-accent-amber" />,
    badge: "bg-accent-amber/15 text-accent-amber",
    badgeText: "Warning",
  },
  info: {
    border: "border-accent-cyan/30",
    bg: "bg-accent-cyan/5",
    icon: <Info className="w-5 h-5 text-accent-cyan" />,
    badge: "bg-accent-cyan/15 text-accent-cyan",
    badgeText: "Info",
  },
};

export function CompatibilityWarnings({ warnings }: CompatibilityWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-accent-amber" />
        Compatibility Notes
      </h3>
      <div className="space-y-2">
        {warnings.map((warning, idx) => {
          const style = SEVERITY_STYLES[warning.severity];

          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border",
                style.border,
                style.bg
              )}
            >
              {style.icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-zinc-100">{warning.title}</span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", style.badge)}>
                    {style.badgeText}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{warning.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
