import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-400">
              SpecNexus
            </span>
          </div>
          <p className="text-xs text-zinc-600">
            Parametric hardware comparison engine. Data is illustrative.
          </p>
        </div>
      </div>
    </footer>
  );
}
