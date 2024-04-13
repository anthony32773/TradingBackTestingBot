import type { StopLoss } from "./types.js";
import { generateSummary } from "./utils/summaryUtils.js";
import { generateCandles, generateTrades } from "./utils/inputUtils.js";
import { executeTrades } from "./utils/tradingUtils.js";

const setupData = await Promise.all([
  generateCandles(
    "/Users/anthony/Documents/Codebases/TradingBackTesting/daily.csv"
  ),
  generateTrades(),
]);

if (setupData[0] && setupData[1]) {
  const candles = setupData[0];
  const { trades, tradeOutput } = setupData[1];
  const selectedStop: StopLoss = "50MA";
  executeTrades(candles, trades, tradeOutput, selectedStop);
  generateSummary(tradeOutput, selectedStop);
}
