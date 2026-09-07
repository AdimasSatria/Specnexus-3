"use client";

import Link from "next/link";
import {
  Cpu,
  Monitor,
  Mouse,
  Keyboard,
  MonitorPlay,
  Mic,
  ArrowRight,
  Zap,
  BarChart3,
  Shield,
  Search,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getCategoriesWithCounts } from "@/lib/data/store";
import { CATEGORY_LABELS } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6" />,
  gpu: <Monitor className="w-6 h-6" />,
  mouse: <Mouse className="w-6 h-6" />,
  keyboard: <Keyboard className="w-6 h-6" />,
  monitor: <MonitorPlay className="w-6 h-6" />,
  microphone: <Mic className="w-6 h-6" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  cpu: "from-cyan-500/20 to-cyan-500/5",
  gpu: "from-violet-500/20 to-violet-500/5",
  mouse: "from-emerald-500/20 to-emerald-500/5",
  keyboard: "from-amber-500/20 to-amber-500/5",
  monitor: "from-rose-500/20 to-rose-500/5",
  microphone: "from-blue-500/20 to-blue-500/5",
};

const CATEGORY_ACCENT: Record<string, string> = {
  cpu: "text-cyan-400 group-hover:text-cyan-300",
  gpu: "text-violet-400 group-hover:text-violet-300",
  mouse: "text-emerald-400 group-hover:text-emerald-300",
  keyboard: "text-amber-400 group-hover:text-amber-300",
  monitor: "text-rose-400 group-hover:text-rose-300",
  microphone: "text-blue-400 group-hover:text-blue-300",
};

// Featured comparisons for quick access
const FEATURED_COMPARISONS = [
  {
    title: "9800X3D vs 14900K",
    subtitle: "Gaming CPU Showdown",
    href: "/compare/cpu?items=cpu-ryzen7-9800x3d,cpu-i9-14900k",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "RTX 4090 vs RX 7900 XTX",
    subtitle: "Flagship GPU Battle",
    href: "/compare/gpu?items=gpu-rtx-4090,gpu-rx-7900-xtx",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Viper V3 Pro vs GPX2",
    subtitle: "Ultimate Gaming Mouse",
    href: "/compare/mouse?items=mouse-viper-v3-pro,mouse-gpx2",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Wooting 60HE vs Huntsman V3",
    subtitle: "Hall Effect Keyboards",
    href: "/compare/keyboard?items=kb-wooting-60he,kb-razer-huntsman-v3-pro",
    color: "from-amber-500 to-orange-500",
  },
];

export default function HomePage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-cyan/5 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-border text-sm text-zinc-400 mb-8">
              <Zap className="w-3.5 h-3.5 text-accent-cyan" />
              Parametric Hardware Intelligence
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Compare{" "}
              <span className="text-gradient-brand">Every Spec</span>
              <br />
              That Matters
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Side-by-side parametric comparisons, benchmark visualizations,
              and compatibility tracking for CPUs, GPUs, peripherals, and studio gear.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/browse/gpu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet text-white font-semibold text-sm shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/30 transition-all hover:scale-105"
              >
                Start Comparing <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", metaKey: true })
                    );
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-border text-zinc-300 font-medium text-sm hover:border-zinc-500 transition-all"
              >
                <Search className="w-4 h-4" /> Search Hardware
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Category Grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Browse Categories</h2>
            <p className="text-sm text-zinc-500 mt-1">Select a category to explore and compare</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ category, count }) => (
            <Link key={category} href={`/browse/${category}`} className="group">
              <GlassCard hover padding="lg">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[category] || "from-zinc-500/10 to-zinc-500/5"} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-zinc-800/80 ${CATEGORY_ACCENT[category] || "text-zinc-400"} transition-colors`}>
                    {CATEGORY_ICONS[category] || <Cpu className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {CATEGORY_LABELS[category] || category}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {count} product{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Comparisons ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Popular Comparisons</h2>
          <p className="text-sm text-zinc-500 mt-1">Jump into the most requested head-to-heads</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_COMPARISONS.map((comp) => (
            <Link key={comp.href} href={comp.href} className="group">
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface-secondary p-5 hover:border-zinc-600 transition-all">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${comp.color}`} />
                <h3 className="text-sm font-bold text-zinc-100 mt-1 group-hover:text-white">
                  {comp.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{comp.subtitle}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-zinc-600 group-hover:text-accent-cyan transition-colors">
                  Compare now <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <BarChart3 className="w-5 h-5" />,
              title: "Benchmark Normalization",
              desc: "Unified 0-100 scoring across Cinebench, Geekbench, gaming FPS, and more.",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Compatibility Engine",
              desc: "Real-time socket, clearance, and wattage checks across your selected build.",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Instant Search",
              desc: "⌘K to search across all hardware. Type-ahead across 30+ products.",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 p-5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-accent-cyan/10 text-accent-cyan shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{feature.title}</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
