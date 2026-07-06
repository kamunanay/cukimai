import axios from 'axios';
import { ForexData } from '../types';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export async function getForexRates(): Promise<ForexData> {
  try {
    const res = await axios.get(API_URL, { timeout: 10000 });
    if (res.status !== 200 || !res.data?.rates) return getFallbackData();
    const r = res.data.rates;
    return {
      usdIdr: r.IDR || 16322.45,
      usdEur: r.EUR || 0.92,
      usdGbp: r.GBP || 0.78,
      usdJpy: r.JPY || 154.50,
      usdAud: r.AUD || 1.50,
      usdCny: r.CNY || 7.20,
      usdSgd: r.SGD || 1.35,
      usdMyr: r.MYR || 4.70,
      usdKrw: r.KRW || 1380.00,
      usdInr: r.INR || 83.50,
    };
  } catch {
    return getFallbackData();
  }
}

function getFallbackData(): ForexData {
  return {
    usdIdr: 16322.45,
    usdEur: 0.92,
    usdGbp: 0.78,
    usdJpy: 154.50,
    usdAud: 1.50,
    usdCny: 7.20,
    usdSgd: 1.35,
    usdMyr: 4.70,
    usdKrw: 1380.00,
    usdInr: 83.50,
  };
}
