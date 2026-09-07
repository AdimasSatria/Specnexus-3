"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPrice, CATEGORY_LABELS } from "@/lib/utils";
import type { Product } from "@/lib/types/common";
import { ArrowRight, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onSelect?: (id: string) => void;
  compareMode?: boolean;
}

export function ProductCard({ product, selected, onSelect, compareMode }: ProductCardProps) {
  const keySpecs = getKeySpecs(product);

  return (
    <GlassCard
      hover
      className={
        selected
          ? "ring-2 ring-accent-cyan/50 border-accent-cyan/30"
          : ""
      }
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              {product.brand}
            </p>
            <h3 className="text-base font-semibold text-zinc-100 mt-0.5 leading-tight">
              {product.name}
            </h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
            {CATEGORY_LABELS[product.category]}
          </span>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {keySpecs.map((spec) => (
            <div
              key={spec.label}
              className="bg-zinc-900/50 rounded-lg px-3 py-2"
            >
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{spec.label}</p>
              <p className="text-sm font-mono font-medium text-zinc-200 mt-0.5">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xl font-bold font-mono text-zinc-100">
            {formatPrice(product.msrp)}
          </span>

          {compareMode ? (
            <button
              onClick={() => onSelect?.(product.id)}
              className={
                selected
                  ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-cyan text-zinc-900"
                  : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors"
              }
            >
              <Star className="w-3.5 h-3.5" />
              {selected ? "Selected" : "Compare"}
            </button>
          ) : (
            <Link
              href={`/browse/${product.category}?highlight=${product.id}`}
              className="flex items-center gap-1 text-sm text-zinc-500 hover:text-accent-cyan transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

/** Extract the 4 most important specs for a product type */
function getKeySpecs(product: Product): { label: string; value: string }[] {
  switch (product.category) {
    case "cpu":
      return [
        { label: "Cores", value: `${product.cores}C/${product.threads}T` },
        { label: "Boost", value: `${product.boostClock} GHz` },
        { label: "TDP", value: `${product.tdp}W` },
        { label: "Cache", value: `${product.l3Cache} MB` },
      ];
    case "gpu":
      return [
        { label: "VRAM", value: `${product.vram} GB ${product.vramType}` },
        { label: "TFLOPs", value: `${product.tflops}` },
        { label: "TDP", value: `${product.tdp}W` },
        { label: "Bus", value: `${product.memoryBus}-bit` },
      ];
    case "mouse":
      return [
        { label: "Weight", value: `${product.weight}g` },
        { label: "Sensor", value: product.sensor },
        { label: "Polling", value: `${product.pollingRate} Hz` },
        { label: "Latency", value: `${product.clickLatency} ms` },
      ];
    case "keyboard":
      return [
        { label: "Layout", value: product.layout },
        { label: "Switch", value: product.switchType },
        { label: "Polling", value: `${product.pollingRate} Hz` },
        { label: "Latency", value: `${product.latency} ms` },
      ];
    case "monitor":
      return [
        { label: "Panel", value: product.panelType },
        { label: "Refresh", value: `${product.refreshRate} Hz` },
        { label: "Res", value: product.resolutionShort },
        { label: "GTG", value: `${product.responseGTG} ms` },
      ];
    case "microphone":
      return [
        { label: "Type", value: product.transducerType },
        { label: "Noise", value: `${product.selfNoise} dBA` },
        { label: "SPL", value: `${product.maxSPL} dB` },
        { label: "Conn", value: product.connectionType },
      ];
    default:
      return [
        { label: "Brand", value: product.brand },
        { label: "Price", value: formatPrice(product.msrp) },
      ];
  }
}
