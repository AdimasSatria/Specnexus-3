// ─── Peripheral Interfaces ───────────────────────────────────────────────────
// Comprehensive data models for gaming peripherals and studio gear

export interface Mouse {
  id: string;
  category: "mouse";
  name: string;
  brand: string;
  imageUrl?: string;
  sensor: string;
  maxDPI: number;
  pollingRate: number; // Hz
  clickLatency: number; // ms
  weight: number; // grams
  switchType: string; // Optical, Mechanical
  switchModel: string;
  switchLifespan: number; // million clicks
  shape: "Symmetrical" | "Ergonomic Right" | "Ergonomic Left";
  grip: string[]; // Claw, Palm, Fingertip
  wireless: boolean;
  wirelessTech: string | null;
  batteryLife: number | null; // hours
  cableType: string;
  length: number; // mm
  width: number; // mm
  height: number; // mm
  sideButtons: number;
  scrollWheel: string;
  feet: string; // PTFE, Ceramic
  rgb: boolean;
  software: string;
  releaseDate: string;
  msrp: number;
}

export interface Keyboard {
  id: string;
  category: "keyboard";
  name: string;
  brand: string;
  imageUrl?: string;
  layout: "60%" | "65%" | "75%" | "TKL" | "96%" | "Full";
  switchType: "Mechanical" | "Optical" | "Hall Effect" | "Membrane";
  switchModel: string;
  actuationForce: number; // grams
  actuationPoint: number; // mm
  totalTravel: number; // mm
  rapidTrigger: boolean;
  rapidTriggerDistance: number | null; // mm
  pollingRate: number; // Hz
  latency: number; // ms
  nkro: boolean;
  hotSwappable: boolean;
  gasketMount: boolean;
  soundDampening: string[];
  keycapMaterial: string; // PBT, ABS
  wireless: boolean;
  batteryLife: number | null;
  rgb: boolean;
  software: string;
  dimensions: { width: number; height: number; depth: number };
  weight: number; // grams
  releaseDate: string;
  msrp: number;
}

export interface Monitor {
  id: string;
  category: "monitor";
  name: string;
  brand: string;
  imageUrl?: string;
  panelType: "OLED" | "QD-OLED" | "Fast IPS" | "IPS" | "VA" | "Mini-LED IPS" | "TN";
  screenSize: number; // inches
  resolution: string; // "3840x2160"
  resolutionShort: string; // "4K", "1440p"
  refreshRate: number; // Hz
  responseGTG: number; // ms
  responseMPRT: number | null; // ms
  colorGamut: {
    sRGB: number;
    dciP3: number;
    adobeRGB: number;
  };
  hdrSupport: string; // HDR10, HDR400, HDR600, HDR1000
  hdrPeakBrightness: number; // nits
  sdBrightness: number; // nits
  contrast: string; // "1000000:1"
  adaptiveSync: string; // G-Sync, FreeSync Premium Pro
  inputs: string[];
  usbHub: boolean;
  speakers: boolean;
  curvature: string | null; // "1000R"
  vesa: string;
  heightAdjustable: boolean;
  pivot: boolean;
  releaseDate: string;
  msrp: number;
}

export interface Microphone {
  id: string;
  category: "microphone";
  name: string;
  brand: string;
  imageUrl?: string;
  transducerType: "Dynamic" | "Condenser" | "Ribbon";
  polarPattern: string[];
  frequencyResponse: { low: number; high: number }; // Hz
  sampleRate: number; // kHz (for USB mics)
  bitDepth: number; // (for USB mics)
  selfNoise: number; // dBA
  maxSPL: number; // dB
  sensitivity: number; // dBV or mV/Pa
  impedance: number; // Ohms
  connectionType: "XLR" | "USB" | "USB/XLR";
  phantomPower: boolean;
  headphoneOut: boolean;
  gainControl: boolean;
  muteButton: boolean;
  shockMount: boolean;
  popFilter: boolean;
  weight: number; // grams
  releaseDate: string;
  msrp: number;
}

export interface Headset {
  id: string;
  category: "headset";
  name: string;
  brand: string;
  imageUrl?: string;
  driverType: "Dynamic" | "Planar Magnetic" | "Electrostatic" | "Balanced Armature";
  driverSize: number; // mm
  soundSignature: "Neutral" | "Warm" | "Bright" | "V-Shaped" | "Bass Heavy";
  frequencyRange: { low: number; high: number }; // Hz
  impedance: number; // Ohms
  sensitivity: number; // dB/mW
  type: "Over-Ear" | "On-Ear" | "In-Ear" | "IEM";
  openBack: boolean;
  wireless: boolean;
  wirelessTech: string | null;
  batteryLife: number | null; // hours
  anc: boolean;
  microphone: boolean;
  detachableCable: boolean;
  cableLength: number | null; // m
  weight: number; // grams
  releaseDate: string;
  msrp: number;
}

export interface Webcam {
  id: string;
  category: "webcam";
  name: string;
  brand: string;
  imageUrl?: string;
  sensorSize: string;
  maxResolution: string;
  maxFPS: number;
  fov: number; // degrees
  aperture: string; // f/2.0
  autofocus: boolean;
  hdr: boolean;
  lowLight: boolean;
  microphone: boolean;
  connectionType: string;
  privacy: boolean; // physical shutter
  mounting: string[];
  software: string;
  weight: number; // grams
  releaseDate: string;
  msrp: number;
}

export type PeripheralProduct = Mouse | Keyboard | Monitor | Microphone | Headset | Webcam;
