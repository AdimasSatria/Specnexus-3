// ─── Diff Calculator ─────────────────────────────────────────────────────────
// Computes field-by-field differences between 2-4 products of the same category

import type { Product, DiffField, HardwareCategory } from "../types/common";

// Field definitions per category: which fields to compare, labels, units, and direction
interface FieldDef {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  nested?: string; // dot-notation for nested fields
  format?: (v: unknown) => string;
}

const CPU_FIELDS: FieldDef[] = [
  { key: "cores", label: "Cores", unit: "", higherIsBetter: true },
  { key: "threads", label: "Threads", unit: "", higherIsBetter: true },
  { key: "baseClock", label: "Base Clock", unit: "GHz", higherIsBetter: true },
  { key: "boostClock", label: "Boost Clock", unit: "GHz", higherIsBetter: true },
  { key: "tdp", label: "TDP", unit: "W", higherIsBetter: false },
  { key: "l3Cache", label: "L3 Cache", unit: "MB", higherIsBetter: true },
  { key: "ipc", label: "IPC Score", unit: "", higherIsBetter: true },
  { key: "process", label: "Process", unit: "", higherIsBetter: false },
  { key: "socket", label: "Socket", unit: "", higherIsBetter: false },
  { key: "pcieLanes", label: "PCIe Lanes", unit: "", higherIsBetter: true },
  { key: "benchmarks.cinebenchSingleCore", label: "Cinebench R23 (1T)", unit: "pts", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.cinebenchMultiCore", label: "Cinebench R23 (nT)", unit: "pts", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.geekbenchSingle", label: "Geekbench 6 (1T)", unit: "pts", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.geekbenchMulti", label: "Geekbench 6 (nT)", unit: "pts", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.gaming1080pAvgFPS", label: "Gaming 1080p Avg", unit: "FPS", higherIsBetter: true, nested: "benchmarks" },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const GPU_FIELDS: FieldDef[] = [
  { key: "vram", label: "VRAM", unit: "GB", higherIsBetter: true },
  { key: "vramType", label: "VRAM Type", unit: "", higherIsBetter: false },
  { key: "memoryBus", label: "Memory Bus", unit: "-bit", higherIsBetter: true },
  { key: "boostClock", label: "Boost Clock", unit: "MHz", higherIsBetter: true },
  { key: "tflops", label: "TFLOPs", unit: "", higherIsBetter: true },
  { key: "tdp", label: "TDP", unit: "W", higherIsBetter: false },
  { key: "rtCores", label: "RT Cores", unit: "", higherIsBetter: true },
  { key: "length", label: "Length", unit: "mm", higherIsBetter: false },
  { key: "benchmarks.rasterization1080p", label: "Raster 1080p", unit: "FPS", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.rasterization1440p", label: "Raster 1440p", unit: "FPS", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.rasterization4k", label: "Raster 4K", unit: "FPS", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.rayTracing1440p", label: "Ray Tracing 1440p", unit: "FPS", higherIsBetter: true, nested: "benchmarks" },
  { key: "benchmarks.powerDraw", label: "Power Draw", unit: "W", higherIsBetter: false, nested: "benchmarks" },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const MOUSE_FIELDS: FieldDef[] = [
  { key: "sensor", label: "Sensor", unit: "", higherIsBetter: false },
  { key: "maxDPI", label: "Max DPI", unit: "", higherIsBetter: true },
  { key: "pollingRate", label: "Polling Rate", unit: "Hz", higherIsBetter: true },
  { key: "clickLatency", label: "Click Latency", unit: "ms", higherIsBetter: false },
  { key: "weight", label: "Weight", unit: "g", higherIsBetter: false },
  { key: "switchType", label: "Switch Type", unit: "", higherIsBetter: false },
  { key: "shape", label: "Shape", unit: "", higherIsBetter: false },
  { key: "wireless", label: "Wireless", unit: "", higherIsBetter: false },
  { key: "batteryLife", label: "Battery Life", unit: "hrs", higherIsBetter: true },
  { key: "length", label: "Length", unit: "mm", higherIsBetter: false },
  { key: "width", label: "Width", unit: "mm", higherIsBetter: false },
  { key: "height", label: "Height", unit: "mm", higherIsBetter: false },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const KEYBOARD_FIELDS: FieldDef[] = [
  { key: "layout", label: "Layout", unit: "", higherIsBetter: false },
  { key: "switchType", label: "Switch Type", unit: "", higherIsBetter: false },
  { key: "switchModel", label: "Switch Model", unit: "", higherIsBetter: false },
  { key: "actuationPoint", label: "Actuation Point", unit: "mm", higherIsBetter: false },
  { key: "rapidTrigger", label: "Rapid Trigger", unit: "", higherIsBetter: false },
  { key: "pollingRate", label: "Polling Rate", unit: "Hz", higherIsBetter: true },
  { key: "latency", label: "Latency", unit: "ms", higherIsBetter: false },
  { key: "hotSwappable", label: "Hot-Swappable", unit: "", higherIsBetter: false },
  { key: "gasketMount", label: "Gasket Mount", unit: "", higherIsBetter: false },
  { key: "keycapMaterial", label: "Keycap Material", unit: "", higherIsBetter: false },
  { key: "wireless", label: "Wireless", unit: "", higherIsBetter: false },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const MONITOR_FIELDS: FieldDef[] = [
  { key: "panelType", label: "Panel Type", unit: "", higherIsBetter: false },
  { key: "screenSize", label: "Screen Size", unit: "\"", higherIsBetter: true },
  { key: "resolutionShort", label: "Resolution", unit: "", higherIsBetter: false },
  { key: "refreshRate", label: "Refresh Rate", unit: "Hz", higherIsBetter: true },
  { key: "responseGTG", label: "Response (GTG)", unit: "ms", higherIsBetter: false },
  { key: "colorGamut.dciP3", label: "DCI-P3 Coverage", unit: "%", higherIsBetter: true, nested: "colorGamut" },
  { key: "hdrPeakBrightness", label: "HDR Peak Brightness", unit: "nits", higherIsBetter: true },
  { key: "sdBrightness", label: "SDR Brightness", unit: "nits", higherIsBetter: true },
  { key: "adaptiveSync", label: "Adaptive Sync", unit: "", higherIsBetter: false },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const MICROPHONE_FIELDS: FieldDef[] = [
  { key: "transducerType", label: "Transducer Type", unit: "", higherIsBetter: false },
  { key: "selfNoise", label: "Self-Noise", unit: "dBA", higherIsBetter: false },
  { key: "maxSPL", label: "Max SPL", unit: "dB", higherIsBetter: true },
  { key: "sensitivity", label: "Sensitivity", unit: "dBV", higherIsBetter: false },
  { key: "impedance", label: "Impedance", unit: "Ω", higherIsBetter: false },
  { key: "connectionType", label: "Connection", unit: "", higherIsBetter: false },
  { key: "sampleRate", label: "Sample Rate", unit: "kHz", higherIsBetter: true },
  { key: "bitDepth", label: "Bit Depth", unit: "-bit", higherIsBetter: true },
  { key: "msrp", label: "MSRP", unit: "$", higherIsBetter: false },
];

const FIELD_MAP: Partial<Record<HardwareCategory, FieldDef[]>> = {
  cpu: CPU_FIELDS,
  gpu: GPU_FIELDS,
  mouse: MOUSE_FIELDS,
  keyboard: KEYBOARD_FIELDS,
  monitor: MONITOR_FIELDS,
  microphone: MICROPHONE_FIELDS,
};

/** Get a nested value from an object using dot-notation key */
function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Determine the winner index among numeric values */
function findWinner(
  values: (string | number | boolean | null)[],
  higherIsBetter: boolean
): number | null {
  const numericValues = values.map((v) =>
    typeof v === "number" ? v : null
  );

  const validValues = numericValues.filter((v): v is number => v !== null);
  if (validValues.length < 2) return null;

  // Check if all values are equal
  if (new Set(validValues).size === 1) return null;

  const target = higherIsBetter
    ? Math.max(...validValues)
    : Math.min(...validValues);

  return numericValues.indexOf(target);
}

/** Calculate comparison diff fields for a set of products */
export function calculateDiffs(
  products: Product[],
  category: HardwareCategory
): DiffField[] {
  const fields = FIELD_MAP[category];
  if (!fields) return [];

  return fields.map((fieldDef) => {
    const values = products.map((p) => {
      const val = getNestedValue(
        p as unknown as Record<string, unknown>,
        fieldDef.key
      );
      if (val === undefined || val === null) return null;
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return val;
      return String(val);
    });

    const winner = findWinner(values, fieldDef.higherIsBetter);

    // Calculate percentage difference (for numeric values between first two)
    let pctDiff: number | null = null;
    if (values.length >= 2 && typeof values[0] === "number" && typeof values[1] === "number") {
      const v0 = values[0] as number;
      const v1 = values[1] as number;
      if (v1 !== 0) {
        pctDiff = Math.round(((v0 - v1) / v1) * 100);
      }
    }

    // Check if values differ
    const stringified = values.map((v) => String(v));
    const isDifferent = new Set(stringified).size > 1;

    return {
      fieldName: fieldDef.key,
      label: fieldDef.label,
      values,
      productNames: products.map((p) => p.name),
      winner,
      percentageDiff: pctDiff,
      higherIsBetter: fieldDef.higherIsBetter,
      unit: fieldDef.unit,
      isDifferent,
    };
  });
}

/** Get field definitions for a category */
export function getFieldDefs(category: HardwareCategory): FieldDef[] {
  return FIELD_MAP[category] || [];
}
