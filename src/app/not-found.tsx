import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-secondary border border-border mb-6">
          <AlertCircle className="w-7 h-7 text-accent-cyan" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">Page Not Found</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          The hardware comparison or category you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet text-white font-semibold text-sm shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/30 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
