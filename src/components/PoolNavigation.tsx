import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Plus } from "lucide-react";
import type { PoolData } from "@/types";
import { cn } from "@/lib/utils";

interface PoolNavigationProps {
  pools: PoolData[];
  activePoolId: number;
  onSelectPool: (id: number) => void;
  onCreatePool: () => void;
  activeTab: "ativas" | "fechadas";
  onChangeTab: (tab: "ativas" | "fechadas") => void;
}

export function PoolNavigation({
  pools,
  activePoolId,
  onSelectPool,
  onCreatePool,
  activeTab,
  onChangeTab,
}: PoolNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Tabs Ativas / Fechadas + Nova Pool */}
      <div className="flex items-center justify-between">
        <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
          <button
            onClick={() => onChangeTab("ativas")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "ativas"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#666] hover:text-[#999]"
            )}
          >
            Ativas
          </button>
          <button
            onClick={() => onChangeTab("fechadas")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "fechadas"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#666] hover:text-[#999]"
            )}
          >
            Fechadas
          </button>
        </div>

        {activeTab === "ativas" && (
          <button
            onClick={onCreatePool}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-xl text-sm font-medium transition-colors border border-[#333]"
          >
            <Plus className="w-4 h-4" />
            Pool
          </button>
        )}
      </div>

      {/* LISTA HORIZONTAL DE POOLS → SÓ MOSTRA NAS ATIVAS */}
      {activeTab === "ativas" && (
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {pools.map((pool) => {
            const isActive = pool.id === activePoolId;
            const displayName = pool.pair || `Pool ${pool.id}`;

            return (
              <button
                key={pool.id}
                onClick={() => onSelectPool(pool.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  isActive
                    ? "bg-[#2a2a2a] text-white border-[#3a3a3a]"
                    : "bg-transparent text-[#666] border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-[#999]"
                )}
              >
                <span className="truncate max-w-[100px]">{displayName}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
