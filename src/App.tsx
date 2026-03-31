import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Droplets, RefreshCcw, Download, Upload, X, AlertTriangle, Archive } from "lucide-react";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { SummaryDashboard } from "@/components/SummaryDashboard";
import { PoolCard } from "@/components/PoolCard";
import { PoolNavigation } from "@/components/PoolNavigation";
import { ClosedPoolCard } from "@/components/ClosedPoolCard";
import { usePools } from "@/hooks/usePools";
import { useIsMobile } from "@/hooks/use-mobile";

function App() {
  const { 
    pools, poolsAtivas, poolsFechadas, summary, summaryFechadas,
    isLoaded, createNewPool, closePool, updatePool, savePools,
    calculatePoolProfit, addTaxToPool, addAporteToPool, exportData, importData 
  } = usePools();

  const isMobile = useIsMobile();

  const [activePoolId, setActivePoolId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"ativas" | "fechadas">("ativas");
  const [isSaving, setIsSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === "ativas") {
      const poolsList = poolsAtivas;
      if (poolsList.length > 0 && (!activePoolId || !poolsList.find(p => p.id === activePoolId))) {
        setActivePoolId(poolsList[0].id);
      } else if (poolsList.length === 0) {
        setActivePoolId(null);
      }
    }
  }, [activeTab, poolsAtivas, activePoolId]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = savePools();
    setIsSaving(false);
    if (success) toast.success("Dados salvos com sucesso!");
  };

  const handleClosePool = (id: number) => {
    closePool(id);
    toast.success("Pool fechada!");
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      toast.error("Cole o conteúdo JSON");
      return;
    }
    setIsImporting(true);
    const success = importData(importText);
    setIsImporting(false);
    if (success) {
      toast.success("Dados importados!");
      setShowImportModal(false);
      setImportText("");
    }
  };

  const currentPools = activeTab === "ativas" ? poolsAtivas : poolsFechadas;
  const activePool = currentPools.find((p) => p.id === activePoolId);

  const sortedClosedPools = [...poolsFechadas].sort((a, b) => {
    if (!a.dataFechamento) return 1;
    if (!b.dataFechamento) return -1;
    return new Date(b.dataFechamento).getTime() - new Date(a.dataFechamento).getTime();
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#666]">
        <RefreshCcw className="w-6 h-6 animate-spin mr-2" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <AnimatedBackground />
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff' } }} />

      {/* Modais (mantidos iguais) */}
      {showClearModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-[#f87171] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Limpar todos os dados?</h3>
              <p className="text-[#888] text-sm mb-6">Todas as pools serão removidas permanentemente.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowClearModal(false)} className="flex-1 bg-transparent border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">Cancelar</Button>
                <Button onClick={() => { localStorage.removeItem("pool-liquidity-manager-data-v5"); window.location.reload(); }} className="flex-1 bg-[#f87171] hover:bg-[#ef4444] text-white">Limpar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Importar Dados</h3>
              <button onClick={() => setShowImportModal(false)}><X className="w-5 h-5 text-[#666]" /></button>
            </div>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Cole o JSON aqui..." className="w-full h-40 p-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white text-sm font-mono mb-4 resize-none" />
            <div className="flex gap-2">
              <input type="file" accept=".json" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setImportText(ev.target?.result as string); reader.readAsText(file); } }} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-transparent border-[#2a2a2a]">Carregar Arquivo</Button>
              <Button onClick={handleImport} disabled={isImporting} className="flex-1 bg-[#4ade80] text-black font-semibold">{isImporting ? "Importando..." : "Importar"}</Button>
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 px-4 ${isMobile ? "py-4" : "py-6"} max-w-6xl mx-auto`}>
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center shadow-lg shadow-[#4ade80]/20">
                <Droplets className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-2xl font-bold">Pool Liquidity Manager</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportData} className="bg-transparent border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#3a3a3a]"><Download className="w-4 h-4 mr-1.5" />Exportar</Button>
              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} className="bg-transparent border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#3a3a3a]"><Upload className="w-4 h-4 mr-1.5" />Importar</Button>
              <Button variant="outline" size="sm" onClick={() => setShowClearModal(true)} className="bg-transparent border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#3a3a3a]"><RefreshCcw className="w-4 h-4 mr-1.5" />Limpar</Button>
            </div>
          </div>

          {activeTab === "ativas" && <SummaryDashboard summary={summary} />}
          {activeTab === "fechadas" && (
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <div className="flex items-center gap-2 mb-4 text-[#888]">
                <Archive className="w-4 h-4" />
                <span className="text-sm">Resumo das Pools Fechadas</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[#666] text-xs mb-1">Taxas Total</p>
                  <p className="text-xl font-bold text-[#fbbf24]">${summaryFechadas.taxasTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[#666] text-xs mb-1">Aportes Total</p>
                  <p className="text-xl font-bold text-[#a855f7]">${summaryFechadas.aportesTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[#666] text-xs mb-1">Lucro/Perda Est.</p>
                  <p className={`text-xl font-bold ${summaryFechadas.lucroPerdaPercentual >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {summaryFechadas.lucroPerdaPercentual >= 0 ? "+" : ""}{summaryFechadas.lucroPerdaPercentual.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        <PoolNavigation 
          pools={activeTab === "ativas" ? poolsAtivas : poolsFechadas} 
          activePoolId={activePoolId || 0} 
          onSelectPool={setActivePoolId} 
          onCreatePool={createNewPool} 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
        />

        <div className="mt-6">
          {activeTab === "ativas" && activePool ? (
            <PoolCard 
              pool={activePool} 
              onUpdate={updatePool} 
              onAddTax={addTaxToPool} 
              onAddAporte={addAporteToPool} 
              onClosePool={handleClosePool} 
              onSave={handleSave} 
              isSaving={isSaving} 
              profitPercent={calculatePoolProfit(activePool)} 
            />
          ) : activeTab === "fechadas" ? (
            <div className="space-y-4">
              {sortedClosedPools.length > 0 ? (
                sortedClosedPools.map((pool) => (
                  <ClosedPoolCard 
                    key={pool.id} 
                    pool={pool} 
                    profitPercent={calculatePoolProfit(pool)} 
                  />
                ))
              ) : (
                <div className="text-center py-20 text-[#666]">
                  <Archive className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma pool fechada ainda.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-[#666]">
              <Droplets className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Nenhuma pool ativa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;