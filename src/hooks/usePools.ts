import { useState, useEffect, useCallback, useMemo } from "react";
import type { PoolData, SummaryData, ClosedSummaryData } from "@/types";

const STORAGE_KEY = "pool-liquidity-manager-data-v5";

const createEmptyPool = (id: number): PoolData => ({
  id,
  pair: "",
  valorInicial: 0,
  valorAtual: 0,
  saqueTaxas: 0,
  totalTaxas: 0,
  fechada: false,
});

const generateId = (existingPools: PoolData[]): number => {
  const maxId = Math.max(...existingPools.map(p => p.id), 0);
  return maxId + 1;
};

const isPoolRecord = (value: unknown): value is Partial<PoolData> => (
  typeof value === "object" && value !== null
);

const normalizePool = (value: unknown, index: number): PoolData => {
  const pool = isPoolRecord(value) ? value : {};
  const parsedId = Number(pool.id);
  const id = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : index + 1;

  return {
    ...createEmptyPool(id),
    ...pool,
    id,
  };
};

export function usePools() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loadedPools = Array.isArray(parsed)
          ? parsed.map(normalizePool)
          : Array.from({ length: 8 }, (_, i) => createEmptyPool(i + 1));
        setPools(loadedPools);
      } else {
        setPools(Array.from({ length: 8 }, (_, i) => createEmptyPool(i + 1)));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setPools(Array.from({ length: 8 }, (_, i) => createEmptyPool(i + 1)));
    }
    setIsLoaded(true);
  }, []);

  const savePools = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pools));
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      return false;
    }
  }, [pools]);

  const createNewPool = useCallback(() => {
    const newId = generateId(pools);
    const newPool = createEmptyPool(newId);
    setPools((prev) => [...prev, newPool]);
    return newId;
  }, [pools]);

  // 🔥 FECHAR POOL COM SALVAMENTO AUTOMÁTICO
  const closePool = useCallback((id: number) => {
    setPools((prev) => {
      const updatedPools = prev.map((pool) =>
        pool.id === id
          ? {
              ...pool,
              fechada: true,
              dataFechamento: new Date().toISOString(),
            }
          : pool
      );

      // Salva automaticamente ao fechar a pool
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPools));
      } catch (error) {
        console.error("Erro ao salvar automaticamente ao fechar pool:", error);
      }

      return updatedPools;
    });
  }, []);

  const poolsAtivas = useMemo(() => 
    pools.filter((p) => !p.fechada), 
  [pools]);

  const poolsFechadas = useMemo(() => 
    pools.filter((p) => p.fechada), 
  [pools]);

  const updatePool = useCallback((id: number, updates: Partial<PoolData>) => {
    setPools((prev) =>
      prev.map((pool) =>
        pool.id === id ? { ...pool, ...updates } : pool
      )
    );
  }, []);

  const summary: SummaryData = useMemo(() => {
    const activePools = poolsAtivas.filter(
      (p) => p.valorInicial > 0 || p.valorAtual > 0
    );

    // Taxas Total inclui TODAS as pools (ativas + fechadas)
    const taxasTotal = pools.reduce((sum, p) => sum + p.totalTaxas, 0);

    if (activePools.length === 0) {
      return {
        totalEmPools: 0,
        lucroPerdaPercentual: 0,
        taxasTotal,
      };
    }

    const totalEmPools = activePools.reduce((sum, p) => sum + p.valorAtual, 0);
    const totalInicial = activePools.reduce((sum, p) => sum + p.valorInicial, 0);

    const lucroPerdaPercentual =
      totalInicial > 0
        ? ((totalEmPools - totalInicial) / totalInicial) * 100
        : 0;

    return {
      totalEmPools,
      lucroPerdaPercentual,
      taxasTotal,
    };
  }, [poolsAtivas, pools]);

  const summaryFechadas: ClosedSummaryData = useMemo(() => {
    const closedPools = poolsFechadas.filter(
      (p) => p.valorInicial > 0 || p.valorAtual > 0 || p.totalTaxas > 0
    );

    if (closedPools.length === 0) {
      return {
        totalEmPools: 0,
        taxasTotal: 0,
        desempenhoPercentual: 0,
        poolsComLucro: 0,
        totalPools: 0,
        taxaAcerto: 0,
      };
    }

    const taxasTotal = closedPools.reduce((sum, p) => sum + p.totalTaxas, 0);
    const totalInicial = closedPools.reduce((sum, p) => sum + p.valorInicial, 0);
    const totalAtual = closedPools.reduce((sum, p) => sum + p.valorAtual, 0);
    const poolsComLucro = closedPools.filter((p) => p.valorInicial > 0 && (p.valorAtual + p.totalTaxas) >= p.valorInicial).length;
    const totalPools = closedPools.length;
    const taxaAcerto = totalPools > 0 ? (poolsComLucro / totalPools) * 100 : 0;

    const desempenhoPercentual =
      totalInicial > 0
        ? ((totalAtual + taxasTotal - totalInicial) / totalInicial) * 100
        : 0;

    return {
      totalEmPools: totalAtual,
      taxasTotal,
      desempenhoPercentual,
      poolsComLucro,
      totalPools,
      taxaAcerto,
    };
  }, [poolsFechadas]);

  const calculatePoolProfit = useCallback((pool: PoolData): number => {
    if (pool.valorInicial === 0) return 0;
    return ((pool.valorAtual + pool.totalTaxas - pool.valorInicial) / pool.valorInicial) * 100;
  }, []);

  const calculatePoolProfitPure = useCallback((pool: PoolData): number => {
    if (pool.valorInicial === 0) return 0;
    return ((pool.valorAtual - pool.valorInicial) / pool.valorInicial) * 100;
  }, []);

  const addTaxToPool = useCallback((id: number) => {
    setPools((prev) =>
      prev.map((pool) => {
        if (pool.id === id) {
          const newTotalTaxas = pool.totalTaxas + pool.saqueTaxas;
          return {
            ...pool,
            totalTaxas: newTotalTaxas,
            saqueTaxas: 0,
          };
        }
        return pool;
      })
    );
  }, []);

  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(pools, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `pool-liquidity-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      return false;
    }
  }, [pools]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);

      if (!Array.isArray(parsed)) {
        throw new Error("Formato inválido: esperado um array");
      }

      const importedPools = parsed.map(normalizePool);

      setPools(importedPools);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedPools));

      return true;
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      return false;
    }
  }, []);

  return {
    pools,
    poolsAtivas,
    poolsFechadas,
    summary,
    summaryFechadas,
    isLoaded,
    createNewPool,
    closePool,
    updatePool,
    savePools,
    calculatePoolProfit,
    calculatePoolProfitPure,
    addTaxToPool,
    exportData,
    importData,
  };
}
