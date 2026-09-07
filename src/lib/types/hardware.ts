// ─── Universal Hardware Interfaces ───────────────────────────────────────────
// Comprehensive data models for all PC component categories

export interface CPUBenchmarks {
  cinebenchSingleCore: number;
  cinebenchMultiCore: number;
  geekbenchSingle: number;
  geekbenchMulti: number;
  gaming1pLowFPS: number;
  gaming1080pAvgFPS: number;
}

export interface CPU {
  id: string;
  category: "cpu";
  name: string;
  brand: string;
  imageUrl?: string;
  cores: number;
  threads: number;
  baseClock: number; // GHz
  boostClock: number; // GHz
  tdp: number; // Watts
  socket: string;
  process: string; // e.g., "5nm TSMC"
  l3Cache: number; // MB
  ipc: number; // Relative IPC score (normalized 0-100)
  integratedGraphics: string | null;
  memorySupport: string[];
  pcieLanes: number;
  pcieVersion: string;
  benchmarks: CPUBenchmarks;
  releaseDate: string;
  msrp: number;
}

export interface GPUBenchmarks {
  rasterization1080p: number; // FPS
  rasterization1440p: number;
  rasterization4k: number;
  rayTracing1080p: number;
  rayTracing1440p: number;
  rayTracing4k: number;
  powerDraw: number; // Watts
  thermalThrottleTemp: number; // °C
}

export interface GPU {
  id: string;
  category: "gpu";
  name: string;
  brand: string;
  imageUrl?: string;
  chipset: string;
  vram: number; // GB
  vramType: string; // GDDR6X, GDDR6, HBM3
  memoryBus: number; // bits
  baseClock: number; // MHz
  boostClock: number; // MHz
  tflops: number;
  rtCores: number | null;
  tensorCores: number | null;
  tdp: number; // Watts
  powerConnectors: string;
  length: number; // mm
  slots: number;
  outputs: string[];
  benchmarks: GPUBenchmarks;
  releaseDate: string;
  msrp: number;
}

export interface Motherboard {
  id: string;
  category: "motherboard";
  name: string;
  brand: string;
  imageUrl?: string;
  chipset: string;
  socket: string;
  formFactor: "ATX" | "Micro-ATX" | "Mini-ITX" | "E-ATX";
  vrmPhases: number;
  memorySlots: number;
  maxMemory: number; // GB
  memoryType: string[];
  pcieLanes: number;
  pcieSlots: { type: string; version: string }[];
  m2Slots: number;
  sataConnectors: number;
  usbPorts: { type: string; count: number }[];
  wifi: string | null;
  bluetooth: string | null;
  audioCodec: string;
  io: string[];
  releaseDate: string;
  msrp: number;
}

export interface RAM {
  id: string;
  category: "ram";
  name: string;
  brand: string;
  imageUrl?: string;
  type: "DDR4" | "DDR5";
  modules: string; // e.g., "2x16GB"
  totalCapacity: number; // GB
  speed: number; // MHz
  cl: number; // CAS Latency
  voltage: number;
  dieType: string;
  xmpExpo: boolean;
  xmpExpoSpeed: number | null;
  height: number; // mm (for cooler clearance)
  heatSpreader: boolean;
  rgb: boolean;
  releaseDate: string;
  msrp: number;
}

export interface Storage {
  id: string;
  category: "storage";
  name: string;
  brand: string;
  imageUrl?: string;
  type: "NVMe" | "SATA SSD" | "HDD";
  formFactor: string; // M.2 2280, 2.5", 3.5"
  interface: string; // PCIe 3.0 x4, PCIe 4.0 x4, PCIe 5.0 x4
  pcieGen: number | null;
  capacity: number; // GB
  seqRead: number; // MB/s
  seqWrite: number; // MB/s
  randomRead: number; // IOPS (in thousands)
  randomWrite: number; // IOPS (in thousands)
  tbw: number; // Terabytes Written
  dramCache: boolean;
  dramCacheSize: number | null; // MB
  nandType: string; // TLC, QLC, MLC
  controller: string;
  releaseDate: string;
  msrp: number;
}

export interface PSU {
  id: string;
  category: "psu";
  name: string;
  brand: string;
  imageUrl?: string;
  wattage: number;
  efficiency: string; // 80+ Gold, Platinum, Titanium
  cybeeneticsEfficiency: string | null;
  cybeeneticsNoise: string | null;
  modular: "Full" | "Semi" | "Non";
  atx3: boolean;
  pcie5_12vhpwr: boolean;
  fanSize: number; // mm
  fanMode: string; // Zero RPM, Always On
  protections: string[];
  length: number; // mm
  releaseDate: string;
  msrp: number;
}

export interface Cooling {
  id: string;
  category: "cooling";
  name: string;
  brand: string;
  imageUrl?: string;
  type: "Air" | "AIO 120mm" | "AIO 240mm" | "AIO 280mm" | "AIO 360mm" | "AIO 420mm";
  radiatorSize: number | null; // mm (for AIO)
  height: number; // mm (total cooler height for case clearance)
  fanCount: number;
  fanSize: number; // mm
  noise: number; // dBA
  cfm: number; // Airflow
  rpm: string; // RPM range
  tdpSupport: number; // Max TDP supported
  socketSupport: string[];
  rgb: boolean;
  releaseDate: string;
  msrp: number;
}

export interface Case {
  id: string;
  category: "case";
  name: string;
  brand: string;
  imageUrl?: string;
  formFactor: string[];
  maxGpuLength: number; // mm
  maxCoolerHeight: number; // mm
  maxPsuLength: number; // mm
  radiatorSupport: string[];
  driveBays25: number;
  driveBays35: number;
  frontIO: string[];
  includedFans: number;
  maxFans: number;
  dimensions: { width: number; height: number; depth: number }; // mm
  weight: number; // kg
  airflowDesign: "Mesh" | "Tempered Glass" | "Solid" | "Hybrid";
  rgb: boolean;
  releaseDate: string;
  msrp: number;
}

export type HardwareProduct = CPU | GPU | Motherboard | RAM | Storage | PSU | Cooling | Case;
