import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { SummaryData } from "@/types";

interface SummaryDashboardProps {
  summary: SummaryData;
}

export function SummaryDashboard({ summary }: SummaryDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalEmPoolsText = `$${summary.totalEmPools.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  const taxasTotalText = `$${summary.taxasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const amountTextSize = (value: string) => {
    if (value.length > 13) return "text-lg md:text-3xl";
    if (value.length > 10) return "text-xl md:text-3xl";
    return "text-2xl md:text-3xl";
  };

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
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-4 border border-[#2a2a2a] min-h-[128px] sm:min-h-0 flex flex-col justify-center min-w-0 overflow-hidden">
        <p className="text-[#888] text-sm sm:text-xs mb-2 sm:mb-1">Total em Pools</p>
        <p className={`text-white ${amountTextSize(totalEmPoolsText)} font-semibold tabular-nums whitespace-nowrap leading-tight`}>
          {totalEmPoolsText}
        </p>
      </div>

      {/* Taxas Total - AMARELO */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-4 border border-[#2a2a2a] min-h-[128px] sm:min-h-0 flex flex-col justify-center min-w-0 overflow-hidden">
        <p className="text-[#888] text-sm sm:text-xs mb-2 sm:mb-1">Taxas Total</p>
        <p className={`text-[#fbbf24] ${amountTextSize(taxasTotalText)} font-semibold tabular-nums whitespace-nowrap leading-tight`}>
          {taxasTotalText}
        </p>
      </div>
    </div>
  );
}
