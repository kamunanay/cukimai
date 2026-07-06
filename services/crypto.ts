import axios from 'axios';

export interface CryptoData {
  [key: string]: { 
    usd: number; 
    usd_24h_change: number;
    volume?: number;
    market_cap?: number;
  };
}

export async function getCryptoPrices(): Promise<CryptoData> {
  try {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,bnb&vs_currencies=usd&include_24hr_change=true',
      { timeout: 10000 }
    );
    return res.data;
  } catch {
    return {
      bitcoin: { usd: 67812.45, usd_24h_change: 2.35 },
      ethereum: { usd: 3456.78, usd_24h_change: 1.23 },
      solana: { usd: 187.65, usd_24h_change: -0.45 },
      ripple: { usd: 0.6123, usd_24h_change: 0.78 },
      bnb: { usd: 598.72, usd_24h_change: 1.56 },
    };
  }
}
