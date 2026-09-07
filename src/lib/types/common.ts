// ─── Common Types ────────────────────────────────────────────────────────────
// Shared types for comparison engine, search, and UI

import type { HardwareProduct } from "./hardware";
import type { PeripheralProduct } from "./peripherals";

// Union of all product types
export type Product = HardwareProduct | PeripheralProduct;

// All categories
export type HardwareCategory =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "cooling"
  | "case"
  | "mouse"
  | "keyboard"
  | "monitor"
  | "microphone"
  | "headset"
  | "webcam";

export interface CategoryMeta {
  id: HardwareCategory;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Tailwind color class
}

// ─── Comparison Types ────────────────────────────────────────────────────────

export interface DiffField {
  fieldName: string;
  label: string;
  values: (string | number | boolean | null)[];
  productNames: string[];
  winner: number | null; // index of the winner, null if equal
  percentageDiff: number | null;
  higherIsBetter: boolean;
  unit: string;
  isDifferent: boolean;
}

export interface ComparisonResult {
  category: HardwareCategory;
  products: Product[];
  fields: DiffField[];
  radarData: RadarDataPoint[];
  overallScores: number[];
  compatibilityWarnings: CompatibilityWarning[];
}

export interface RadarDataPoint {
  axis: string;
  values: number[]; // one per product, normalized 0-100
  productNames: string[];
}

// ─── Compatibility Types ─────────────────────────────────────────────────────

export type WarningSeverity = "critical" | "warning" | "info";

export interface CompatibilityWarning {
  severity: WarningSeverity;
  title: string;
  description: string;
  affectedProducts: string[];
  icon: string;
}

// ─── Price Types ─────────────────────────────────────────────────────────────

export interface PriceInfo {
  retailer: string;
  price: number;
  currency: string;
  inStock: boolean;
  url: string;
  lastUpdated: string;
}

// ─── Search Types ────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  name: string;
  brand: string;
  category: HardwareCategory;
  msrp: number;
  matchScore: number;
}

// ─── Benchmark Score Types ───────────────────────────────────────────────────

export interface BenchmarkScore {
  name: string;
  rawScore: number;
  normalizedScore: number; // 0-100
  unit: string;
  higherIsBetter: boolean;
}

export interface CompositeIndex {
  name: string;
  score: number; // 0-100
  components: BenchmarkScore[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}
