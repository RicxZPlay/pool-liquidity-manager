import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { SummaryData } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

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

  const isProfit = summary.lucroPerdaPercentual >= 0;

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total em Pools */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
        <p className="text-[#888] text-xs mb-1">Total em Pools</p>
        <p className="text-white text-2xl font-semibold">
          ${summary.totalEmPools.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Lucro/Perda % */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
        <p className="text-[#888] text-xs mb-1">Lucro/Perda %</p>
        <div className="flex items-center gap-2">
          <p className={`text-2xl font-semibold ${isProfit ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {isProfit ? "+" : ""}{summary.lucroPerdaPercentual.toFixed(2)}%
          </p>
          {isProfit ? (
            <TrendingUp className="w-5 h-5 text-[#4ade80]" />
          ) : (
            <TrendingDown className="w-5 h-5 text-[#f87171]" />
          )}
        </div>
      </div>

      {/* Taxas Total - AMARELO */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
        <p className="text-[#888] text-xs mb-1">Taxas Total</p>
        <p className="text-[#fbbf24] text-2xl font-semibold">
          ${summary.taxasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Aportes Total - ROXO */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
        <p className="text-[#888] text-xs mb-1">Aportes Total</p>
        <p className="text-[#a855f7] text-2xl font-semibold">
          ${summary.aportesTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}