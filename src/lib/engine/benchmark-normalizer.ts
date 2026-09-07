// ─── Benchmark Normalizer ────────────────────────────────────────────────────
// Normalizes raw benchmark scores to unified 0-100 scale and computes composite indices

import type { Product, HardwareCategory, RadarDataPoint } from "../types/common";
import { normalize } from "../utils";

// ─── Radar Axis Definitions ──────────────────────────────────────────────────

interface RadarAxis {
  axis: string;
  key: string;
  higherIsBetter: boolean;
}

const CPU_RADAR_AXES: RadarAxis[] = [
  { axis: "Single-Core", key: "benchmarks.cinebenchSingleCore", higherIsBetter: true },
  { axis: "Multi-Core", key: "benchmarks.cinebenchMultiCore", higherIsBetter: true },
  { axis: "Gaming", key: "benchmarks.gaming1080pAvgFPS", higherIsBetter: true },
  { axis: "Efficiency", key: "tdp", higherIsBetter: false },
  { axis: "Value", key: "msrp", higherIsBetter: false },
  { axis: "Core Count", key: "cores", higherIsBetter: true },
];

const GPU_RADAR_AXES: RadarAxis[] = [
  { axis: "1080p", key: "benchmarks.rasterization1080p", higherIsBetter: true },
  { axis: "1440p", key: "benchmarks.rasterization1440p", higherIsBetter: true },
  { axis: "4K", key: "benchmarks.rasterization4k", higherIsBetter: true },
  { axis: "Ray Tracing", key: "benchmarks.rayTracing1440p", higherIsBetter: true },
  { axis: "Efficiency", key: "benchmarks.powerDraw", higherIsBetter: false },
  { axis: "Value", key: "msrp", higherIsBetter: false },
];

const MOUSE_RADAR_AXES: RadarAxis[] = [
  { axis: "Polling Rate", key: "pollingRate", higherIsBetter: true },
  { axis: "Latency", key: "clickLatency", higherIsBetter: false },
  { axis: "Weight", key: "weight", higherIsBetter: false },
  { axis: "DPI", key: "maxDPI", higherIsBetter: true },
  { axis: "Value", key: "msrp", higherIsBetter: false },
];

const KEYBOARD_RADAR_AXES: RadarAxis[] = [
  { axis: "Polling Rate", key: "pollingRate", higherIsBetter: true },
  { axis: "Latency", key: "latency", higherIsBetter: false },
  { axis: "Actuation", key: "actuationPoint", higherIsBetter: false },
  { axis: "Value", key: "msrp", higherIsBetter: false },
];

const MONITOR_RADAR_AXES: RadarAxis[] = [
  { axis: "Refresh Rate", key: "refreshRate", higherIsBetter: true },
  { axis: "Response Time", key: "responseGTG", higherIsBetter: false },
  { axis: "HDR Brightness", key: "hdrPeakBrightness", higherIsBetter: true },
  { axis: "Color (DCI-P3)", key: "colorGamut.dciP3", higherIsBetter: true },
  { axis: "Screen Size", key: "screenSize", higherIsBetter: true },
  { axis: "Value", key: "msrp", higherIsBetter: false },
];

const MICROPHONE_RADAR_AXES: RadarAxis[] = [
  { axis: "Self-Noise", key: "selfNoise", higherIsBetter: false },
  { axis: "Max SPL", key: "maxSPL", higherIsBetter: true },
  { axis: "Sample Rate", key: "sampleRate", higherIsBetter: true },
  { axis: "Bit Depth", key: "bitDepth", higherIsBetter: true },
  { axis: "Value", key: "msrp", higherIsBetter: false },
];

const RADAR_MAP: Partial<Record<HardwareCategory, RadarAxis[]>> = {
  cpu: CPU_RADAR_AXES,
  gpu: GPU_RADAR_AXES,
  mouse: MOUSE_RADAR_AXES,
  keyboard: KEYBOARD_RADAR_AXES,
  monitor: MONITOR_RADAR_AXES,
  microphone: MICROPHONE_RADAR_AXES,
};

/** Get nested value from an object via dot-notation */
function getVal(obj: Record<string, unknown>, path: string): number | null {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "number" ? current : null;
}

/** Generate radar chart data for a set of products */
export function generateRadarData(
  products: Product[],
  category: HardwareCategory
): RadarDataPoint[] {
  const axes = RADAR_MAP[category];
  if (!axes) return [];

  return axes.map((axisDef) => {
    const rawValues = products.map((p) =>
      getVal(p as unknown as Record<string, unknown>, axisDef.key)
    );

    // Find min/max across all products for normalization
    const validValues = rawValues.filter((v): v is number => v !== null);
    const min = Math.min(...validValues);
    const max = Math.max(...validValues);

    const normalizedValues = rawValues.map((v) => {
      if (v === null) return 0;
      return Math.round(normalize(v, min * 0.7, max * 1.3, axisDef.higherIsBetter));
    });

    return {
      axis: axisDef.axis,
      values: normalizedValues,
      productNames: products.map((p) => p.name),
    };
  });
}

/** Compute overall scores for each product based on radar data */
export function computeOverallScores(radarData: RadarDataPoint[]): number[] {
  if (radarData.length === 0) return [];

  const productCount = radarData[0].values.length;
  const scores: number[] = [];

  for (let i = 0; i < productCount; i++) {
    const sum = radarData.reduce((acc, point) => acc + point.values[i], 0);
    scores.push(Math.round(sum / radarData.length));
  }

  return scores;
}

/** Compute performance-per-dollar ratio */
export function perfPerDollar(performanceScore: number, price: number): number {
  if (price === 0) return 0;
  return Math.round((performanceScore / price) * 100);
}
