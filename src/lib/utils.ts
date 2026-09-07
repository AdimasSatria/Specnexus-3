// ─── Utility Functions ───────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with locale-appropriate separators */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format price with currency */
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Normalize a value to 0-100 scale */
export function normalize(
  value: number,
  min: number,
  max: number,
  higherIsBetter = true
): number {
  if (max === min) return 50;
  const normalized = ((value - min) / (max - min)) * 100;
  return higherIsBetter ? clamp(normalized, 0, 100) : clamp(100 - normalized, 0, 100);
}

/** Calculate percentage difference between two values */
export function percentDiff(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round(((a - b) / b) * 100);
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Category display labels */
export const CATEGORY_LABELS: Record<string, string> = {
  cpu: "CPUs",
  gpu: "GPUs",
  motherboard: "Motherboards",
  ram: "RAM",
  storage: "Storage",
  psu: "Power Supplies",
  cooling: "Cooling",
  case: "Cases",
  mouse: "Mice",
  keyboard: "Keyboards",
  monitor: "Monitors",
  microphone: "Microphones",
  headset: "Headsets",
  webcam: "Webcams",
};

/** Category icon mapping (Lucide icon names) */
export const CATEGORY_ICONS: Record<string, string> = {
  cpu: "Cpu",
  gpu: "Monitor",
  motherboard: "CircuitBoard",
  ram: "MemoryStick",
  storage: "HardDrive",
  psu: "Zap",
  cooling: "Fan",
  case: "Box",
  mouse: "Mouse",
  keyboard: "Keyboard",
  monitor: "MonitorPlay",
  microphone: "Mic",
  headset: "Headphones",
  webcam: "Camera",
};
