export interface ForexData {
  usdIdr: number;
  usdEur: number;
  usdGbp: number;
  usdJpy: number;
  usdAud: number;
  usdCny: number;
  usdSgd: number;
  usdMyr: number;
  usdKrw: number;
  usdInr: number;
}

export interface CryptoData {
  [key: string]: { usd: number; usd_24h_change: number; volume?: number; market_cap?: number };
}

export interface GoldData {
  price: number;
  high: number;
  low: number;
  open: number;
  close: number;
  change: number;
  changePercent: number;
}
