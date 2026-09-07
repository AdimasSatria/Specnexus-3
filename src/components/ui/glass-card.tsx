"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "violet" | null;
  padding?: "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = null,
  padding = "md",
}: GlassCardProps) {
  const paddings = {
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={cn(
        "glass rounded-xl",
        paddings[padding],
        hover &&
          "transition-all duration-300 hover:scale-[1.02] hover:border-zinc-600 cursor-pointer",
        glow === "cyan" && "glow-cyan",
        glow === "violet" && "glow-violet",
        className
      )}
    >
      {children}
    </div>
  );
}
