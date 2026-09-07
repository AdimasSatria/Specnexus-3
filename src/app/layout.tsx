import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/ui/command-palette";

export const metadata: Metadata = {
  title: "SpecNexus — Hardware & Peripherals Comparison",
  description:
    "The definitive parametric comparison engine for CPUs, GPUs, gaming mice, keyboards, monitors, and studio gear. Compare specs, benchmarks, and compatibility in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-primary text-zinc-100 antialiased">
        <Header />
        <CommandPalette />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
