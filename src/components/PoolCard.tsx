import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Save } from "lucide-react";
import type { PoolData } from "@/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PoolCardProps {
  pool: PoolData;
  onUpdate: (id: number, updates: Partial<PoolData>) => void;
  onAddTax: (id: number) => void;
  onAddAporte: (id: number) => void;
  onClosePool?: (id: number) => void;
  onSave: () => void;
  isSaving: boolean;
  profitPercent: number;
}

export function PoolCard({
  pool,
  onUpdate,
  onAddTax,
  onAddAporte,
  onClosePool,
  onSave,
  isSaving,
  profitPercent,
}: PoolCardProps) {
  const isMobile = useIsMobile();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pool.pair);

  const handleInputChange = (field: keyof PoolData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdate(pool.id, { [field]: numValue });
  };

  const handleNameSave = () => {
    onUpdate(pool.id, { pair: tempName.toUpperCase() });
    setIsEditingName(false);
  };

  const isProfit = profitPercent >= 0;

  return (
    <div className="bg-[#1a1a1a] rounded-3xl p-5 sm:p-6 border border-[#2a2a2a]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">{pool.id}</span>
          {isEditingName ? (
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              autoFocus
              className="w-48 h-9 bg-[#2a2a2a] border-[#3a3a3a] text-white text-base rounded-lg"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-white font-semibold text-lg uppercase tracking-wide hover:text-[#4ade80] transition-colors"
            >
              {pool.pair || "SEM NOME"}
            </button>
          )}
        </div>

        {onClosePool && (
          <>
            {!showCloseConfirm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCloseConfirm(true)}
                className="text-[#f87171] hover:text-white border-[#f87171] hover:border-[#f87171] text-xs font-medium h-8 px-4 rounded-xl"
              >
                Fechar Pool
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-1.5">
                <span className="text-[#f87171] text-xs">Fechar pool?</span>
                <button onClick={() => { onClosePool(pool.id); setShowCloseConfirm(false); }} className="text-[#f87171] text-xs font-bold hover:underline">Sim</button>
                <button onClick={() => setShowCloseConfirm(false)} className="text-[#666] text-xs hover:text-white">Não</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Campos principais - responsivo */}
      <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-4"} mb-8`}>
        <div className="space-y-2">
          <label className="text-[#888] text-xs">Valor Inicial</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-lg font-semibold">$</span>
            <Input
              type="number"
              value={pool.valorInicial || ""}
              onChange={(e) => handleInputChange("valorInicial", e.target.value)}
              className="pl-8 h-14 bg-[#0d0d0d] border-[#2a2a2a] rounded-xl text-white text-xl font-semibold focus:border-[#4ade80]"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#888] text-xs">Valor Atual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-lg font-semibold">$</span>
            <Input
              type="number"
              value={pool.valorAtual || ""}
              onChange={(e) => handleInputChange("valorAtual", e.target.value)}
              className="pl-8 h-14 bg-[#0d0d0d] border-[#2a2a2a] rounded-xl text-white text-xl font-semibold focus:border-[#4ade80]"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#888] text-xs">Lucro/Perda %</label>
          <div className="flex items-center justify-between h-14 px-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl">
            <span className={cn("text-xl font-bold", isProfit ? "text-[#4ade80]" : "text-[#f87171]")}>
              {isProfit ? "+" : ""}{profitPercent.toFixed(2)}%
            </span>
            {isProfit ? <TrendingUp className="w-5 h-5 text-[#4ade80]" /> : <TrendingDown className="w-5 h-5 text-[#f87171]" />}
          </div>
        </div>
      </div>

      {/* Aporte e Taxas - empilhado no mobile */}
      <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-5 mb-6">
        <div className={`grid ${isMobile ? "grid-cols-1 gap-6" : "grid-cols-2 gap-6"}`}>
          {/* Aporte */}
          <div className="space-y-3">
            <label className="text-[#888] text-xs font-medium">APORTE ATUAL</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={pool.aporteAtual || ""}
                onChange={(e) => handleInputChange("aporteAtual", e.target.value)}
                className="h-12 bg-[#1a1a1a] border-[#3a3a3a] text-white text-lg font-semibold flex-1"
                placeholder="0,00"
              />
              <Button onClick={() => onAddAporte(pool.id)} disabled={pool.aporteAtual <= 0} className="h-12 px-6 bg-[#a855f7] hover:bg-[#9333ea] text-white font-medium">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
          </div>

          {/* Taxas */}
          <div className="space-y-3">
            <label className="text-[#888] text-xs font-medium">SAQUE TAXAS</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={pool.saqueTaxas || ""}
                onChange={(e) => handleInputChange("saqueTaxas", e.target.value)}
                className="h-12 bg-[#1a1a1a] border-[#3a3a3a] text-white text-lg font-semibold flex-1"
                placeholder="0,00"
              />
              <Button onClick={() => onAddTax(pool.id)} disabled={pool.saqueTaxas <= 0} className="h-12 px-6 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-medium">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Salvar Tudo */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="h-12 px-10 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-70 w-full sm:w-auto"
        >
          {isSaving ? <>Salvando...</> : <><Save className="w-4 h-4 mr-2" />Salvar Tudo</>}
        </Button>
      </div>

      {/* Totais */}
      {(pool.totalAportes > 0 || pool.totalTaxas > 0) && (
        <div className="mt-6 pt-4 border-t border-[#2a2a2a] flex flex-wrap gap-6 text-sm">
          {pool.totalAportes > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[#666]">Total Aportes:</span>
              <span className="text-[#a855f7] font-bold">${pool.totalAportes.toFixed(2)}</span>
            </div>
          )}
          {pool.totalTaxas > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[#666]">Total Taxas:</span>
              <span className="text-[#fbbf24] font-bold">${pool.totalTaxas.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}