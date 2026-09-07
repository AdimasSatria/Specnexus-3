// ─── Compatibility Checker ───────────────────────────────────────────────────
// Checks hardware compatibility across selected components

import type { Product, CompatibilityWarning } from "../types/common";
import type { CPU, GPU, Motherboard, Cooling, Case, PSU, RAM } from "../types/hardware";

/** Check all compatibility issues for a set of products */
export function checkCompatibility(products: Product[]): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];

  const cpus = products.filter((p): p is CPU => p.category === "cpu");
  const gpus = products.filter((p): p is GPU => p.category === "gpu");
  const motherboards = products.filter((p): p is Motherboard => p.category === "motherboard");
  const coolers = products.filter((p): p is Cooling => p.category === "cooling");
  const cases = products.filter((p): p is Case => p.category === "case");
  const psus = products.filter((p): p is PSU => p.category === "psu");
  const rams = products.filter((p): p is RAM => p.category === "ram");

  // CPU ↔ Motherboard socket compatibility
  for (const cpu of cpus) {
    for (const mobo of motherboards) {
      if (cpu.socket !== mobo.socket) {
        warnings.push({
          severity: "critical",
          title: "Socket Mismatch",
          description: `${cpu.name} uses ${cpu.socket} but ${mobo.name} has ${mobo.socket} socket.`,
          affectedProducts: [cpu.id, mobo.id],
          icon: "AlertTriangle",
        });
      }
    }
  }

  // Cooler ↔ Case height clearance
  for (const cooler of coolers) {
    for (const pc of cases) {
      if (cooler.height > pc.maxCoolerHeight) {
        warnings.push({
          severity: "critical",
          title: "Cooler Too Tall",
          description: `${cooler.name} is ${cooler.height}mm tall but ${pc.name} only supports up to ${pc.maxCoolerHeight}mm.`,
          affectedProducts: [cooler.id, pc.id],
          icon: "ArrowUpDown",
        });
      }
    }
  }

  // GPU ↔ Case length clearance
  for (const gpu of gpus) {
    for (const pc of cases) {
      if (gpu.length > pc.maxGpuLength) {
        warnings.push({
          severity: "critical",
          title: "GPU Too Long",
          description: `${gpu.name} is ${gpu.length}mm long but ${pc.name} only supports up to ${pc.maxGpuLength}mm.`,
          affectedProducts: [gpu.id, pc.id],
          icon: "Ruler",
        });
      }
    }
  }

  // PSU wattage check
  for (const psu of psus) {
    const totalTDP =
      cpus.reduce((sum, c) => sum + c.tdp, 0) +
      gpus.reduce((sum, g) => sum + g.tdp, 0);

    if (totalTDP > 0) {
      const recommended = Math.ceil(totalTDP * 1.25); // 25% headroom
      if (psu.wattage < recommended) {
        warnings.push({
          severity: "warning",
          title: "PSU May Be Underpowered",
          description: `Total TDP is ~${totalTDP}W. Recommended PSU: ${recommended}W+. ${psu.name} is ${psu.wattage}W.`,
          affectedProducts: [psu.id, ...cpus.map((c) => c.id), ...gpus.map((g) => g.id)],
          icon: "Zap",
        });
      }
    }
  }

  // RAM ↔ Motherboard DDR type
  for (const ram of rams) {
    for (const mobo of motherboards) {
      if (!mobo.memoryType.includes(ram.type)) {
        warnings.push({
          severity: "critical",
          title: "RAM Type Mismatch",
          description: `${ram.name} is ${ram.type} but ${mobo.name} supports ${mobo.memoryType.join(", ")}.`,
          affectedProducts: [ram.id, mobo.id],
          icon: "MemoryStick",
        });
      }
    }
  }

  // Cooler ↔ CPU socket support
  for (const cooler of coolers) {
    for (const cpu of cpus) {
      if (!cooler.socketSupport.includes(cpu.socket)) {
        warnings.push({
          severity: "warning",
          title: "Cooler Socket Compatibility",
          description: `${cooler.name} may not support ${cpu.socket}. Check mounting bracket availability.`,
          affectedProducts: [cooler.id, cpu.id],
          icon: "Wrench",
        });
      }
    }
  }

  return warnings;
}
