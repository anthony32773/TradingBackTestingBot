import { Candle, Trade, TradeOutcome } from "../types.js";

/**
 * Check if all TPs have been hit.
 * @param {TradeOutcome} tradeOutput - Current status of trade.
 * @returns {boolean}
 */
function checkIfProfit(tradeOutput: TradeOutcome): boolean {
  if (tradeOutput.tp1Hit) {
    if (typeof tradeOutput.tp2Hit === "undefined") {
      return true;
    } else if (tradeOutput.tp2Hit) {
      if (typeof tradeOutput.tp3Hit === "undefined") {
        return true;
      } else if (tradeOutput.tp3Hit) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
  return false;
}

/**
 * Try to take profit on the trade and check if each TP level was hit. Record results on the trade outcome.
 * @param {TradeOutcome} tradeOutput
 * @param {Candle} currentCandle
 * @param {Trade} currentTrade
 * @returns {void}
 */
function tryTakeProfit(
  tradeOutput: TradeOutcome,
  currentCandle: Candle,
  currentTrade: Trade
): void {
  if (currentTrade.direction === "L") {
    tradeOutput.MAE = Math.min(tradeOutput.MAE, currentCandle.low);
    tradeOutput.MFE = Math.max(tradeOutput.MFE, currentCandle.high);
    if (
      !tradeOutput.tp1Hit &&
      currentCandle.low <= currentTrade.exit1 &&
      currentCandle.high >= currentTrade.exit1
    ) {
      tradeOutput.tp1Hit = true;
      tradeOutput.tp1HitCandle = currentCandle;
    }

    if (
      typeof currentTrade.exit2 !== "undefined" &&
      !tradeOutput.tp2Hit &&
      currentCandle.low <= (currentTrade.exit2 as number) &&
      currentCandle.high >= (currentTrade.exit2 as number)
    ) {
      tradeOutput.tp2Hit = true;
      tradeOutput.tp2HitCandle = currentCandle;
    }
    if (
      typeof currentTrade.exit3 !== "undefined" &&
      !tradeOutput.tp3Hit &&
      currentCandle.low <= (currentTrade.exit3 as number) &&
      currentCandle.high >= (currentTrade.exit3 as number)
    ) {
      tradeOutput.tp3Hit = true;
      tradeOutput.tp3HitCandle = currentCandle;
    }
  }
}

export { checkIfProfit, tryTakeProfit };
