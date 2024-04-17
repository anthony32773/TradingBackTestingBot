import chalk from "chalk";
import { StopLoss, StrategyOutcome, TradeOutcome } from "../types.js";
import { Duration, DurationUnits } from "luxon";

/**
 * Generate win rate summary text for each TP level.
 * @param {number} winRate - Win rate percentage.
 * @param {1 | 2 | 3} whichTP - Which TP level is the win rate for.
 * @returns {void}
 */
function generateWinRateText(winRate: number, whichTP: 1 | 2 | 3): void {
  if (winRate < 50) {
    console.log(`TP ${whichTP} Win Rate: ${chalk.redBright(`${winRate}%`)}`);
  } else if (winRate < 70) {
    console.log(`TP ${whichTP} Win Rate: ${chalk.yellowBright(`${winRate}%`)}`);
  } else {
    console.log(`TP ${whichTP} Win Rate: ${chalk.greenBright(`${winRate}%`)}`);
  }
}

/**
 * Generate the win loss summary for the trades tested.
 * @param {TradeOutcome[]} allTradeOutcomes - Outcomes of all trades.
 * @returns {StrategyOutcome | undefined}
 */
function generateSummary(
  allTradeOutcomes: TradeOutcome[],
  selectedStop: StopLoss,
  selectedTimeFrame: DurationUnits,
  optimize: boolean
): StrategyOutcome | undefined {
  let wins = 0;
  let losses = 0;
  let numTP2sHit = 0;
  let numTP3sHit = 0;
  let numTP2s = 0;
  let numTP3s = 0;
  let averageMFE = 0;
  let averageMAE = 0;
  let averageTimeInTrade = 0;
  for (let i = 0; i < allTradeOutcomes.length; i++) {
    if (allTradeOutcomes[i].tp1Hit) {
      wins++;
    } else {
      losses++;
    }
    if (typeof allTradeOutcomes[i].tp2Hit !== "undefined") {
      numTP2s++;
      if (allTradeOutcomes[i].tp2Hit) {
        numTP2sHit++;
      }
    }
    if (typeof allTradeOutcomes[i].tp3Hit !== "undefined") {
      numTP3s++;
      if (allTradeOutcomes[i].tp3Hit) {
        numTP3sHit++;
      }
    }
    let tempMFEPercentage = 0;
    let tempMAEPercentage = 0;
    if (allTradeOutcomes[i].trade.direction === "L") {
      tempMFEPercentage =
        ((allTradeOutcomes[i].MFE - allTradeOutcomes[i].trade.price) /
          allTradeOutcomes[i].trade.price) *
        100;
      tempMAEPercentage =
        ((allTradeOutcomes[i].trade.price - allTradeOutcomes[i].MAE) /
          allTradeOutcomes[i].trade.price) *
        100;
    } else {
      tempMFEPercentage =
        ((allTradeOutcomes[i].trade.price - allTradeOutcomes[i].MFE) /
          allTradeOutcomes[i].trade.price) *
        100;
      tempMAEPercentage =
        ((allTradeOutcomes[i].MAE - allTradeOutcomes[i].trade.price) /
          allTradeOutcomes[i].trade.price) *
        100;
    }
    averageMAE += tempMAEPercentage;
    averageMFE += tempMFEPercentage;
    let diff: Duration<boolean> | undefined = undefined;
    if (allTradeOutcomes[i].slHit && allTradeOutcomes[i].slHitCandle) {
      diff = allTradeOutcomes[i].slHitCandle?.time.diff(
        allTradeOutcomes[i].trade.CandleDate,
        selectedTimeFrame
      );
    } else if (allTradeOutcomes[i].tp3Hit) {
      diff = allTradeOutcomes[i].tp3HitCandle!.time.diff(
        allTradeOutcomes[i].trade.CandleDate,
        selectedTimeFrame
      );
    } else if (allTradeOutcomes[i].tp2Hit) {
      diff = allTradeOutcomes[i].tp2HitCandle!.time.diff(
        allTradeOutcomes[i].trade.CandleDate,
        selectedTimeFrame
      );
    } else {
      diff = allTradeOutcomes[i].tp1HitCandle!.time.diff(
        allTradeOutcomes[i].trade.CandleDate,
        selectedTimeFrame
      );
    }
    if (diff) {
      averageTimeInTrade += diff[selectedTimeFrame as keyof Duration] as number;
    }
  }
  const finalOutcome: StrategyOutcome = {
    wins,
    losses,
    averageTimeInTrade,
    averageMAE,
    averageMFE,
    numberOfTrades: allTradeOutcomes.length,
    numTP2s,
    numTP2sHit,
    numTP3s,
    numTP3sHit,
    selectedStop,
  };
  if (!optimize) {
    generateSummaryText(finalOutcome, selectedTimeFrame as string);
  } else {
    return finalOutcome;
  }
}

/**
 * Generate final summary text.
 * @param {StrategyOutcome} outcome - Final result of all trades.
 * @param {string} selectedTimeFrame - What time frame were the trades developed on.
 */
function generateSummaryText(
  outcome: StrategyOutcome,
  selectedTimeFrame: string
) {
  const winRate = Number(
    ((outcome.wins / outcome.numberOfTrades) * 100).toFixed(2)
  );
  console.log(chalk.bold("Summary:"));
  console.log(
    `${chalk.greenBright(`Wins: ${outcome.wins}`)}  ${chalk.redBright(
      `Losses: ${outcome.losses}`
    )}\n`
  );
  console.log(chalk.yellowBright(`Selected Stop: ${outcome.selectedStop}`));
  generateWinRateText(winRate, 1);
  if (outcome.numTP2s) {
    const tp2WinRate = Number(
      ((outcome.numTP2sHit / outcome.numTP2s) * 100).toFixed(2)
    );
    generateWinRateText(tp2WinRate, 2);
  }
  if (outcome.numTP3s) {
    const tp3WinRate = Number(
      ((outcome.numTP3sHit / outcome.numTP3s) * 100).toFixed(2)
    );
    generateWinRateText(tp3WinRate, 3);
  }
  console.log(
    chalk.cyanBright(
      `Average MFE: ${(outcome.averageMFE / outcome.numberOfTrades).toFixed(
        2
      )}%`
    )
  );
  console.log(
    chalk.magentaBright(
      `Average MAE: ${(outcome.averageMAE / outcome.numberOfTrades).toFixed(
        2
      )}%`
    )
  );
  console.log(
    chalk.blueBright(
      `Average Time in Trades: ${Math.round(
        outcome.averageTimeInTrade / outcome.numberOfTrades
      )} ${selectedTimeFrame[0].toUpperCase()}${selectedTimeFrame.substring(1)}`
    )
  );
}

export { generateSummary, generateSummaryText };
