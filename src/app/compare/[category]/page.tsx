"use client";

import { useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductsByIds } from "@/lib/data/store";
import { calculateDiffs } from "@/lib/engine/diff-calculator";
import { generateRadarData, computeOverallScores } from "@/lib/engine/benchmark-normalizer";
import { checkCompatibility } from "@/lib/engine/compatibility-checker";
import { ComparisonMatrix } from "@/components/comparison/comparison-matrix";
import { RadarChart } from "@/components/comparison/radar-chart";
import { SpecBar } from "@/components/comparison/spec-bar";
import { CompatibilityWarnings } from "@/components/comparison/compatibility-warnings";
import { LatencyMeter } from "@/components/product/latency-meter";
import { WeightGauge } from "@/components/product/weight-gauge";
import { BenchmarkBadge } from "@/components/product/benchmark-badge";
import { CATEGORY_LABELS, formatPrice } from "@/lib/utils";
import type { HardwareCategory } from "@/lib/types/common";
import type { Mouse } from "@/lib/types/peripherals";
import type { CPU } from "@/lib/types/hardware";
import { GitCompareArrows, ArrowLeft, Trophy } from "lucide-react";

function CompareContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as HardwareCategory;
  const itemsParam = searchParams.get("items") || "";
  const ids = itemsParam.split(",").filter(Boolean);

  const products = useMemo(() => getProductsByIds(ids), [ids]);
  const fields = useMemo(() => calculateDiffs(products, category), [products, category]);
  const radarData = useMemo(() => generateRadarData(products, category), [products, category]);
  const overallScores = useMemo(() => computeOverallScores(radarData), [radarData]);
  const warnings = useMemo(() => checkCompatibility(products), [products]);

  if (products.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-lg mb-4">Select at least 2 products to compare.</p>
          <Link
            href={`/browse/${category}`}
            className="inline-flex items-center gap-2 text-accent-cyan hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Browse {CATEGORY_LABELS[category]}
          </Link>
        </div>
      </div>
    );
  }

  // Extract numeric fields for spec bars (pick top visual fields)
  const numericFields = fields.filter(
    (f) => typeof f.values[0] === "number" && f.isDifferent
  );
  const topSpecBars = numericFields.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/browse/${category}`} className="hover:text-zinc-300 transition-colors">
              {CATEGORY_LABELS[category]}
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Compare</span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <GitCompareArrows className="w-7 h-7 text-accent-cyan" />
            {products.map((p) => p.name).join(" vs ")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {CATEGORY_LABELS[category]} · {products.length} products
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Product Summary Cards ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {products.map((product, idx) => {
            const isTop = overallScores[idx] === Math.max(...overallScores);
            return (
              <div
                key={product.id}
                className={`relative rounded-xl border p-5 ${
                  isTop
                    ? "border-accent-cyan/30 bg-accent-cyan/5"
                    : "border-border bg-surface-secondary"
                }`}
              >
                {isTop && (
                  <div className="absolute -top-3 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-cyan text-zinc-900 text-[10px] font-bold">
                    <Trophy className="w-3 h-3" /> WINNER
                  </div>
                )}
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{product.brand}</p>
                <h3 className="text-base font-semibold text-zinc-100 mt-0.5">{product.name}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <BenchmarkBadge label="Score" score={overallScores[idx]} />
                  <span className="text-lg font-bold font-mono text-zinc-300">
                    {formatPrice(product.msrp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Radar Chart ────────────────────────────────────── */}
        <div className="mb-10">
          <RadarChart data={radarData} productNames={products.map((p) => p.name)} />
        </div>

        {/* ─── Visual Spec Bars ───────────────────────────────── */}
        {topSpecBars.length > 0 && (
          <div className="mb-10 glass rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Key Metrics</h3>
            <div className="divide-y divide-border/30">
              {topSpecBars.map((field) => (
                <SpecBar
                  key={field.fieldName}
                  label={`${field.label}${field.unit ? ` (${field.unit})` : ""}`}
                  values={field.values.map((v) => (typeof v === "number" ? v : 0))}
                  productNames={field.productNames}
                  higherIsBetter={field.higherIsBetter}
                  unit={field.unit}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Category-Specific Widgets ──────────────────────── */}
        {category === "mouse" && (
          <div className="mb-10 glass rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Mouse Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const mouse = product as Mouse;
                return (
                  <div key={mouse.id} className="space-y-4">
                    <p className="text-sm font-semibold text-zinc-300">{mouse.name}</p>
                    <LatencyMeter value={mouse.clickLatency} label="Click Latency" />
                    <WeightGauge value={mouse.weight} label="Weight" />
                    <LatencyMeter
                      value={1000 / mouse.pollingRate}
                      max={2}
                      label="Polling Interval"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {category === "keyboard" && (
          <div className="mb-10 glass rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Keyboard Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const kb = product as import("@/lib/types/peripherals").Keyboard;
                return (
                  <div key={kb.id} className="space-y-4">
                    <p className="text-sm font-semibold text-zinc-300">{kb.name}</p>
                    <LatencyMeter value={kb.latency} label="Input Latency" />
                    <LatencyMeter
                      value={kb.actuationPoint}
                      max={4}
                      label="Actuation Point"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {kb.rapidTrigger && (
                        <BenchmarkBadge label="Rapid Trigger" score={100} />
                      )}
                      {kb.gasketMount && (
                        <BenchmarkBadge label="Gasket Mount" score={90} />
                      )}
                      {kb.hotSwappable && (
                        <BenchmarkBadge label="Hot-Swap" score={85} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {category === "cpu" && (
          <div className="mb-10 glass rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">CPU Benchmarks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const cpu = product as CPU;
                return (
                  <div key={cpu.id} className="space-y-3">
                    <p className="text-sm font-semibold text-zinc-300">{cpu.name}</p>
                    <div className="flex flex-wrap gap-2">
                      <BenchmarkBadge
                        label="CB R23 1T"
                        score={cpu.benchmarks.cinebenchSingleCore}
                        maxScore={2500}
                      />
                      <BenchmarkBadge
                        label="CB R23 nT"
                        score={cpu.benchmarks.cinebenchMultiCore}
                        maxScore={45000}
                      />
                      <BenchmarkBadge
                        label="GB6 1T"
                        score={cpu.benchmarks.geekbenchSingle}
                        maxScore={3500}
                      />
                      <BenchmarkBadge
                        label="Gaming Avg"
                        score={cpu.benchmarks.gaming1080pAvgFPS}
                        maxScore={350}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Compatibility Warnings ─────────────────────────── */}
        {warnings.length > 0 && (
          <div className="mb-10">
            <CompatibilityWarnings warnings={warnings} />
          </div>
        )}

        {/* ─── Full Spec Matrix ───────────────────────────────── */}
        <div className="mb-10">
          <ComparisonMatrix
            products={products}
            fields={fields}
            overallScores={overallScores}
          />
        </div>

        {/* ─── Back Link ──────────────────────────────────────── */}
        <div className="text-center py-8">
          <Link
            href={`/browse/${category}`}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {CATEGORY_LABELS[category]}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-zinc-500 text-lg">Loading comparison...</div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
