"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { DiffField } from "@/lib/types/common";
import type { Product } from "@/lib/types/common";
import { useState } from "react";
import { Eye, EyeOff, Trophy } from "lucide-react";

interface ComparisonMatrixProps {
  products: Product[];
  fields: DiffField[];
  overallScores: number[];
}

export function ComparisonMatrix({ products, fields, overallScores }: ComparisonMatrixProps) {
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const displayFields = showDiffOnly ? fields.filter((f) => f.isDifferent) : fields;

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Specifications</h3>
        <button
          onClick={() => setShowDiffOnly(!showDiffOnly)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            showDiffOnly
              ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200"
          )}
        >
          {showDiffOnly ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showDiffOnly ? "Showing differences only" : "Show differences only"}
        </button>
      </div>

      {/* Matrix Table */}
      <div className="comparison-scroll rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          {/* Header — Product names */}
          <thead>
            <tr className="bg-surface-secondary">
              <th className="sticky left-0 z-10 bg-surface-secondary px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider min-w-[180px]">
                Spec
              </th>
              {products.map((product, i) => (
                <th key={product.id} className="px-5 py-4 text-center min-w-[200px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold text-zinc-100">{product.name}</span>
                    <span className="text-xs text-zinc-500">{product.brand}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-mono font-bold text-accent-cyan">
                        {overallScores[i]}/100
                      </span>
                      {overallScores[i] === Math.max(...overallScores) && (
                        <Trophy className="w-3.5 h-3.5 text-accent-amber" />
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body — Spec rows */}
          <tbody>
            {displayFields.map((field, rowIdx) => (
              <tr
                key={field.fieldName}
                className={cn(
                  "border-t border-border/50 transition-colors",
                  rowIdx % 2 === 0 ? "bg-surface-primary" : "bg-surface-secondary/30"
                )}
              >
                {/* Label */}
                <td className="sticky left-0 z-10 px-5 py-3 text-zinc-400 font-medium bg-inherit">
                  <div className="flex items-center gap-2">
                    {field.label}
                    {field.unit && (
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {field.unit}
                      </span>
                    )}
                  </div>
                </td>

                {/* Values */}
                {field.values.map((value, colIdx) => {
                  const isWinner = field.winner === colIdx;
                  const displayVal = formatValue(value, field);

                  return (
                    <td
                      key={colIdx}
                      className={cn(
                        "px-5 py-3 text-center font-mono text-sm",
                        isWinner ? "winner-cell" : "",
                        isWinner ? "text-accent-emerald font-semibold" : "text-zinc-300"
                      )}
                    >
                      {displayVal}
                      {isWinner && field.percentageDiff !== null && field.percentageDiff !== 0 && colIdx === 0 && (
                        <span className="ml-1.5 text-[10px] text-accent-emerald/70">
                          +{Math.abs(field.percentageDiff)}%
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Price Row */}
          <tfoot>
            <tr className="border-t-2 border-border bg-surface-secondary">
              <td className="sticky left-0 z-10 bg-surface-secondary px-5 py-4 text-zinc-300 font-semibold">
                Price
              </td>
              {products.map((product) => (
                <td key={product.id} className="px-5 py-4 text-center">
                  <span className="text-lg font-bold font-mono text-zinc-100">
                    {formatPrice(product.msrp)}
                  </span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function formatValue(value: string | number | boolean | null, field: DiffField): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  if (typeof value === "number") {
    if (field.unit === "$") return formatPrice(value);
    return value.toLocaleString("en-US");
  }
  return String(value);
}
