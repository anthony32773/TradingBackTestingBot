import { Candle, StopLoss, Trade, TradeOutcome } from "../types.js";
import { checkStopLoss } from "./slUtils.js";
import { tryTakeProfit, checkIfProfit } from "./tpUtils.js";

/**
 * Execute all trades. Test the exits and stop losses against the candle data provided.
 * @param {Candle[]} candles - Candle data.
 * @param {Trade[]} trades - Trades to execute.
 * @param {TradeOutcome[]} tradeOutput - Trade outcomes for each trade.
 * @param {StopLoss} selectedStop - Selected stop loss to test against.
 * @returns {void}
 */
function executeTrades(
  candles: Candle[],
  trades: Trade[],
  tradeOutput: TradeOutcome[],
  selectedStop: StopLoss
): void {
  for (let i = 0; i < trades.length; i++) {
    if (tradeOutput[i].invalidTrade) {
      continue;
    }
    let index = -1;
    for (let j = 0; j < candles.length; j++) {
      if (trades[i].CandleDate.hasSame(candles[j].time, "day")) {
        if (
          candles[j].low <= trades[i].price &&
          candles[j].high >= trades[i].price
        ) {
          tradeOutput[i].trade.CandleDate = candles[j].time;
          index = j;
          break;
        }
      }
    }
    if (index === -1) {
      tradeOutput[i].invalidTrade = true;
      continue;
    }
    for (let j = index; j < candles.length; j++) {
      tryTakeProfit(tradeOutput[i], candles[j], trades[i]);
      if (checkIfProfit(tradeOutput[i])) {
        break;
      }
      if (
        checkStopLoss(
          tradeOutput[i],
          candles[j],
          selectedStop,
          trades[i].direction
        )
      ) {
        break;
      }
    }
  }
}

export { executeTrades };
