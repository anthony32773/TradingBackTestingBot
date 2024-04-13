import chalk, { Chalk } from "chalk";
import { StopLoss, TradeOutcome } from "../types.js";

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
 * @returns {void}
 */
function generateSummary(
  allTradeOutcomes: TradeOutcome[],
  selectedStop: StopLoss
): void {
  let wins = 0;
  let losses = 0;
  let numTP2sHit = 0;
  let numTP3sHit = 0;
  let numTP2s = 0;
  let numTP3s = 0;
  let averageMFE = 0;
  let averageMAE = 0;
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
    averageMAE += allTradeOutcomes[i].MAE;
    averageMFE += allTradeOutcomes[i].MFE;
  }
  const winRate = Number(((wins / allTradeOutcomes.length) * 100).toFixed(2));

  console.log(chalk.bold("Summary:"));
  console.log(
    `${chalk.greenBright(`Wins: ${wins}`)}  ${chalk.redBright(
      `Losses: ${losses}`
    )}\n`
  );
  console.log(
    `${chalk.yellowBright("Selected Stop:")} ${chalk.blueBright(selectedStop)}`
  );
  generateWinRateText(winRate, 1);
  if (numTP2s) {
    const tp2WinRate = Number(((numTP2sHit / numTP2s) * 100).toFixed(2));
    generateWinRateText(tp2WinRate, 2);
  }
  if (numTP3s) {
    const tp3WinRate = Number(((numTP3sHit / numTP3s) * 100).toFixed(2));
    generateWinRateText(tp3WinRate, 3);
  }
  console.log(
    chalk.cyanBright(
      `Average MAE: ${((averageMAE / allTradeOutcomes.length) * 100).toFixed(
        2
      )}%`
    )
  );
  console.log(
    chalk.magentaBright(
      `Average MFE: ${((averageMFE / allTradeOutcomes.length) * 100).toFixed(
        2
      )}%`
    )
  );
}

export { generateSummary };
