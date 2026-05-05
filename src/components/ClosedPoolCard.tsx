import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { TrendingUp, TrendingDown, Coins, Calendar } from "lucide-react";
import type { PoolData } from "@/types";
import { cn } from "@/lib/utils";

interface ClosedPoolCardProps {
  pool: PoolData;
  profitPercent: number;
  profitPurePercent: number;
}

export function ClosedPoolCard({ pool, profitPercent, profitPurePercent }: ClosedPoolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const isProfit = profitPercent >= 0;
  const isPureProfit = profitPurePercent >= 0;

  return (
    <div
      ref={cardRef}
      className="w-full max-w-full bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 border border-[#2a2a2a] opacity-80 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Nome e Data */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-white font-bold shrink-0">
            {pool.id}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-semibold uppercase tracking-wide truncate">
              {pool.pair || "Sem nome"}
            </h3>
            {pool.dataFechamento && (
              <div className="flex items-center gap-1 text-[#666] text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(pool.dataFechamento).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </div>

        {/* Resumo em linha */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-6 min-w-0">
          {/* Lucro/Perda */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className={cn(
              "hidden sm:flex p-2 rounded-lg shrink-0",
              isPureProfit ? "bg-[#4ade80]/20" : "bg-[#f87171]/20"
            )}>
              {isPureProfit ? (
                <TrendingUp className="w-4 h-4 text-[#4ade80]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#f87171]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#666] uppercase truncate">
                <span className="sm:hidden">Lucro</span>
                <span className="hidden sm:inline">Lucro/Perda</span>
              </p>
              <p className={cn(
                "text-[15px] sm:text-lg font-bold tabular-nums whitespace-nowrap",
                isPureProfit ? "text-[#4ade80]" : "text-[#f87171]"
              )}>
                {isPureProfit ? "+" : ""}{profitPurePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Lucro/Perda/Taxas */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className={cn(
              "hidden sm:flex p-2 rounded-lg shrink-0",
              isProfit ? "bg-[#4ade80]/20" : "bg-[#f87171]/20"
            )}>
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-[#4ade80]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#f87171]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#666] uppercase truncate">
                <span className="sm:hidden">Com Taxas</span>
                <span className="hidden sm:inline">Lucro/Perda/Taxas</span>
              </p>
              <p className={cn(
                "text-[15px] sm:text-lg font-bold tabular-nums whitespace-nowrap",
                isProfit ? "text-[#4ade80]" : "text-[#f87171]"
              )}>
                {isProfit ? "+" : ""}{profitPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Taxas */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="hidden sm:flex p-2 rounded-lg bg-[#fbbf24]/20 shrink-0">
              <Coins className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#666] uppercase truncate">Taxas</p>
              <p className="text-[15px] sm:text-lg font-bold text-[#fbbf24] tabular-nums whitespace-nowrap">
                ${pool.totalTaxas.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
