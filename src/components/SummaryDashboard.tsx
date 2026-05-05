import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { SummaryData } from "@/types";

interface SummaryDashboardProps {
  summary: SummaryData;
}

export function SummaryDashboard({ summary }: SummaryDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-4 w-full">
      {/* Total em Pools */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-4 border border-[#2a2a2a] min-h-[128px] sm:min-h-0 flex flex-col justify-center">
        <p className="text-[#888] text-sm sm:text-xs mb-2 sm:mb-1">Total em Pools</p>
        <p className="text-white text-3xl sm:text-2xl font-semibold">
          ${summary.totalEmPools.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Taxas Total - AMARELO */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-4 border border-[#2a2a2a] min-h-[128px] sm:min-h-0 flex flex-col justify-center">
        <p className="text-[#888] text-sm sm:text-xs mb-2 sm:mb-1">Taxas Total</p>
        <p className="text-[#fbbf24] text-3xl sm:text-2xl font-semibold">
          ${summary.taxasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
