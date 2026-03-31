export interface PoolData {
  id: number;
  pair: string;
  valorInicial: number;
  valorAtual: number;
  saqueTaxas: number;
  totalTaxas: number;
  aporteAtual: number;
  totalAportes: number;
  fechada: boolean;
  dataFechamento?: string;
}

export interface SummaryData {
  totalEmPools: number;
  lucroPerdaPercentual: number;
  taxasTotal: number;
  aportesTotal: number;
}

export const POOL_PAIRS = [
  "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT",
  "DOT/USDT", "AVAX/USDT", "MATIC/USDT", "LINK/USDT", "UNI/USDT",
  "ATOM/USDT", "FTM/USDT", "ALGO/USDT", "VET/USDT", "FIL/USDT",
  "TRX/USDT", "XRP/USDT", "DOGE/USDT", "SHIB/USDT", "PEPE/USDT",
] as const;

export type PoolPair = (typeof POOL_PAIRS)[number];
