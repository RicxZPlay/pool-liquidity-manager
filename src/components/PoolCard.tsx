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
  onClosePool?: (id: number) => void;
  onSave: () => void;
  isSaving: boolean;
  profitPercent: number;
  profitPurePercent: number;
}

type DecimalPoolField = "valorInicial" | "valorAtual" | "saqueTaxas";

const formatDecimalInput = (value: number) => value === 0 ? "" : String(value);

const parseDecimalInput = (value: string) => {
  const normalizedValue = value.trim().replace(",", ".");

  if (
    normalizedValue === "" ||
    normalizedValue === "." ||
    normalizedValue === "-"
  ) {
    return 0;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export function PoolCard({
  pool,
  onUpdate,
  onAddTax,
  onClosePool,
  onSave,
  isSaving,
  profitPercent,
  profitPurePercent,
}: PoolCardProps) {
  const isMobile = useIsMobile();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pool.pair);
  const [valorInicialText, setValorInicialText] = useState(formatDecimalInput(pool.valorInicial));
  const [valorAtualText, setValorAtualText] = useState(formatDecimalInput(pool.valorAtual));
  const [saqueTaxasText, setSaqueTaxasText] = useState(formatDecimalInput(pool.saqueTaxas));

  const handleDecimalInputChange = (
    field: DecimalPoolField,
    value: string,
    setText: (value: string) => void
  ) => {
    setText(value);
    const numValue = parseDecimalInput(value);
    if (numValue !== null) {
      onUpdate(pool.id, { [field]: numValue });
    }
  };

  const handleNameSave = () => {
    onUpdate(pool.id, { pair: tempName.toUpperCase() });
    setIsEditingName(false);
  };

  const handleAddTax = () => {
    onAddTax(pool.id);
    setSaqueTaxasText("");
  };

  const isProfit = profitPercent >= 0;
  const isPureProfit = profitPurePercent >= 0;

  return (
    <div className={`bg-[#1a1a1a] border border-[#2a2a2a] ${isMobile ? "rounded-2xl p-3" : "rounded-3xl p-6"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? "mb-3" : "mb-6"}`}>
        <div className="flex items-center gap-3">
          <span className={`text-white font-bold ${isMobile ? "text-base" : "text-lg"}`}>{pool.id}</span>
          {isEditingName ? (
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              autoFocus
              className={`${isMobile ? "w-36 h-8 text-sm" : "w-48 h-9 text-base"} bg-[#2a2a2a] border-[#3a3a3a] text-white rounded-lg`}
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className={`text-white font-semibold uppercase tracking-wide hover:text-[#4ade80] transition-colors ${isMobile ? "text-base" : "text-lg"}`}
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
                className={`text-[#f87171] hover:text-white border-[#f87171] hover:border-[#f87171] text-xs font-medium rounded-xl ${isMobile ? "h-7 px-3" : "h-8 px-4"}`}
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
      <div className={`grid ${isMobile ? "grid-cols-2 gap-2 mb-3" : "grid-cols-2 gap-4 mb-8"}`}>
        <div className={isMobile ? "space-y-1.5 min-w-0" : "space-y-2"}>
          <label className="text-[#888] text-xs leading-tight">Valor Inicial</label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-white font-semibold ${isMobile ? "text-base" : "text-lg"}`}>$</span>
            <Input
              type="text"
              inputMode="decimal"
              value={valorInicialText}
              onChange={(e) => handleDecimalInputChange("valorInicial", e.target.value, setValorInicialText)}
              className={`pl-8 bg-[#0d0d0d] border-[#2a2a2a] rounded-xl text-white font-semibold focus:border-[#4ade80] ${isMobile ? "h-10 text-base" : "h-14 text-xl"}`}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className={isMobile ? "space-y-1.5 min-w-0" : "space-y-2"}>
          <label className="text-[#888] text-xs leading-tight">Valor Atual</label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-white font-semibold ${isMobile ? "text-base" : "text-lg"}`}>$</span>
            <Input
              type="text"
              inputMode="decimal"
              value={valorAtualText}
              onChange={(e) => handleDecimalInputChange("valorAtual", e.target.value, setValorAtualText)}
              className={`pl-8 bg-[#0d0d0d] border-[#2a2a2a] rounded-xl text-white font-semibold focus:border-[#4ade80] ${isMobile ? "h-10 text-base" : "h-14 text-xl"}`}
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      {/* Indicadores de Lucro/Perda */}
      <div className={`grid ${isMobile ? "grid-cols-2 gap-2 mb-3" : "grid-cols-2 gap-4 mb-8"}`}>
        <div className={isMobile ? "space-y-1.5 min-w-0" : "space-y-2"}>
          <label className="text-[#888] text-xs leading-tight">Lucro/Perda %</label>
          <div className={`flex items-center justify-between bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl ${isMobile ? "h-10 px-3" : "h-14 px-4"}`}>
            <span className={cn(isMobile ? "text-sm font-bold" : "text-xl font-bold", isPureProfit ? "text-[#4ade80]" : "text-[#f87171]")}>
              {isPureProfit ? "+" : ""}{profitPurePercent.toFixed(2)}%
            </span>
            {isPureProfit ? <TrendingUp className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-[#4ade80] shrink-0`} /> : <TrendingDown className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-[#f87171] shrink-0`} />}
          </div>
        </div>

        <div className={isMobile ? "space-y-1.5 min-w-0" : "space-y-2"}>
          <label className="text-[#888] text-xs leading-tight">Lucro/Perda/Taxas %</label>
          <div className={`flex items-center justify-between bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl ${isMobile ? "h-10 px-3" : "h-14 px-4"}`}>
            <span className={cn(isMobile ? "text-sm font-bold" : "text-xl font-bold", isProfit ? "text-[#4ade80]" : "text-[#f87171]")}>
              {isProfit ? "+" : ""}{profitPercent.toFixed(2)}%
            </span>
            {isProfit ? <TrendingUp className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-[#4ade80] shrink-0`} /> : <TrendingDown className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-[#f87171] shrink-0`} />}
          </div>
        </div>
      </div>

      {/* Taxas */}
      <div className={`bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl ${isMobile ? "p-3 mb-3" : "p-5 mb-6"}`}>
        <div className={isMobile ? "space-y-2" : "space-y-3"}>
          <div className={`grid items-center gap-2 ${isMobile ? "grid-cols-[minmax(0,1fr)_124px]" : "grid-cols-[minmax(0,1fr)_146px]"}`}>
            <label className="text-[#888] text-xs font-medium">SAQUE TAXAS</label>
            {pool.totalTaxas > 0 && (
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="text-[#666]">Total Taxas:</span>
                <span className="text-[#fbbf24] font-bold">${pool.totalTaxas.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className={`grid gap-2 ${isMobile ? "grid-cols-[minmax(0,1fr)_124px]" : "grid-cols-[minmax(0,1fr)_146px]"}`}>
            <Input
              type="text"
              inputMode="decimal"
              value={saqueTaxasText}
              onChange={(e) => handleDecimalInputChange("saqueTaxas", e.target.value, setSaqueTaxasText)}
              className={`bg-[#1a1a1a] border-[#3a3a3a] text-white font-semibold min-w-0 ${isMobile ? "h-10 text-base" : "h-12 text-lg"}`}
              placeholder="0,00"
            />
            <Button onClick={handleAddTax} disabled={pool.saqueTaxas <= 0} className={`${isMobile ? "h-10 px-3" : "h-12 px-6"} w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-medium`}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Salvar Tudo */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`${isMobile ? "h-10 px-6" : "h-12 px-10"} bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-70 w-full sm:w-auto`}
        >
          {isSaving ? <>Salvando...</> : <><Save className="w-4 h-4 mr-2" />Salvar Tudo</>}
        </Button>
      </div>
    </div>
  );
}
