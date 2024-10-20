export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  isFavorite?: boolean;
  supply?: string;
  volumeUsd24Hr?: string;
}

export interface PriceDataPoint {
  x: number;
  y: number;
}
export interface CryptoIndexApiResponse {
  data: Cryptocurrency[];
}
export interface pricingData {
  priceUsd: string;
  time: number;
}
export interface CryptoHistoryApiResponse {
  data: pricingData[];
}
