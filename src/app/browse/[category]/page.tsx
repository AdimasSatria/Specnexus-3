"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/data/store";
import { ProductCard } from "@/components/product/product-card";
import { CategoryPill } from "@/components/ui/category-pill";
import { CATEGORY_LABELS } from "@/lib/utils";
import type { HardwareCategory, Product } from "@/lib/types/common";
import { ArrowRight, GitCompareArrows, LayoutGrid } from "lucide-react";

const ALL_CATEGORIES: HardwareCategory[] = [
  "cpu", "gpu", "mouse", "keyboard", "monitor", "microphone",
];

export default function BrowsePage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as HardwareCategory;
  const products = useMemo(() => getProductsByCategory(category), [category]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev
    );
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      router.push(`/compare/${category}?items=${selectedIds.join(",")}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">{CATEGORY_LABELS[category] || category}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                <LayoutGrid className="w-7 h-7 text-accent-cyan" />
                {CATEGORY_LABELS[category] || category}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {products.length} product{products.length !== 1 ? "s" : ""} · Select 2-4 to compare
              </p>
            </div>

            {selectedIds.length >= 2 && (
              <button
                onClick={handleCompare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet text-white font-semibold text-sm shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/30 transition-all hover:scale-105"
              >
                <GitCompareArrows className="w-4 h-4" />
                Compare ({selectedIds.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {ALL_CATEGORIES.map((cat) => (
              <Link key={cat} href={`/browse/${cat}`}>
                <CategoryPill
                  label={CATEGORY_LABELS[cat]}
                  active={cat === category}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No products found in this category yet.</p>
            <Link href="/" className="text-accent-cyan text-sm mt-2 inline-block hover:underline">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                compareMode
                selected={selectedIds.includes(product.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
