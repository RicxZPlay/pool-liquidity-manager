import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { TrendingUp, TrendingDown, Coins, PiggyBank, Calendar } from "lucide-react";
import type { PoolData } from "@/types";
import { cn } from "@/lib/utils";

interface ClosedPoolCardProps {
  pool: PoolData;
  profitPercent: number;
}

export function ClosedPoolCard({ pool, profitPercent }: ClosedPoolCardProps) {
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

  return (
    <div
      ref={cardRef}
      className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a] opacity-80"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Nome e Data */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-white font-bold">
            {pool.id}
          </div>
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wide">
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
        <div className="flex items-center gap-6">
          {/* Lucro/Perda */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg",
              isProfit ? "bg-[#4ade80]/20" : "bg-[#f87171]/20"
            )}>
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-[#4ade80]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#f87171]" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-[#666] uppercase">Lucro/Perda</p>
              <p className={cn(
                "text-lg font-bold",
                isProfit ? "text-[#4ade80]" : "text-[#f87171]"
              )}>
                {isProfit ? "+" : ""}{profitPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Taxas */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#fbbf24]/20">
              <Coins className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-[10px] text-[#666] uppercase">Taxas</p>
              <p className="text-lg font-bold text-[#fbbf24]">
                ${pool.totalTaxas.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Aportes */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#a855f7]/20">
              <PiggyBank className="w-4 h-4 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-[10px] text-[#666] uppercase">Aportes</p>
              <p className="text-lg font-bold text-[#a855f7]">
                ${pool.totalAportes.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
