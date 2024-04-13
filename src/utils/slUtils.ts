import { Candle, StopLoss, TradeOutcome } from "../types.js";

/**
 * Set stop loss info when the stop loss is hit.
 * @param {TradeOutcome} tradeOutput - Current trade we are testing.
 * @param {Candle} currentCandle - Current currentCandle point.
 * @returns {true}
 */
function setSLInfo(tradeOutput: TradeOutcome, currentCandle: Candle): true {
  tradeOutput.slHit = true;
  tradeOutput.slHitCandle = currentCandle;
  return true;
}

/**
 * Check if the defined stop loss was hit.
 * @param {TradeOutcome} tradeOutput - Current trade we are testing.
 * @param {Candle} currentCandle - Current currentCandle point.
 * @param {StopLoss} selectedStop - Selected stop loss to test the trades against.
 * @returns {boolean}
 */
function checkStopLoss(
  tradeOutput: TradeOutcome,
  currentCandle: Candle,
  selectedStop: StopLoss,
  tradeDirection: "L" | "S"
): boolean {
  if (tradeDirection === "L") {
    if (
      selectedStop === "9EMA" &&
      currentCandle["9EMA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "9MA" &&
      currentCandle["9MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "21MA" &&
      currentCandle["21MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "50MA" &&
      currentCandle["50MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    }
  } else {
    if (
      selectedStop === "9EMA" &&
      currentCandle["9EMA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "9MA" &&
      currentCandle["9MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "21MA" &&
      currentCandle["21MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    } else if (
      selectedStop === "50MA" &&
      currentCandle["50MA"] >= currentCandle.close
    ) {
      return setSLInfo(tradeOutput, currentCandle);
    }
  }
  return false;
}

export { checkStopLoss };
