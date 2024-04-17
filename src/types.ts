import { DateTime } from "luxon";

export type Candle = {
  time: DateTime;
  open: number;
  high: number;
  low: number;
  close: number;
  "9MA": number;
  "21MA": number;
  "50MA": number;
  "9EMA": number;
};

export type StopLoss =
  | "9EMA"
  | "9MA"
  | "21MA"
  | "50MA"
  | "Zone"
  | "Optimize - Run all available trailing stops";

export type Trade = {
  CandleDate: DateTime;
  price: number;
  direction: "L" | "S";
  exit1: number;
  exit2?: number;
  exit3?: number;
};

export type TradeOutcome = {
  trade: Trade;
  slHit: boolean;
  slHitCandle?: Candle;
  tp1Hit: boolean;
  tp1HitCandle?: Candle;
  tp2Hit: boolean | undefined;
  tp2HitCandle?: Candle;
  tp3Hit: boolean | undefined;
  tp3HitCandle?: Candle;
  MAE: number;
  MFE: number;
  invalidTrade: boolean;
};

export type GenerateTradesOutput = {
  trades: Trade[];
  tradeOutput: TradeOutcome[];
};

export type TimeFrame = "M" | "W" | "D" | "1H" | "15m" | "5m" | "1m";

export type StrategyOutcome = {
  wins: number;
  losses: number;
  numTP2s: number;
  numTP3s: number;
  numTP2sHit: number;
  numTP3sHit: number;
  tp2WinRate?: number;
  tp3WinRate?: number;
  numberOfTrades: number;
  averageTimeInTrade: number;
  averageMAE: number;
  averageMFE: number;
  selectedStop: StopLoss;
}
