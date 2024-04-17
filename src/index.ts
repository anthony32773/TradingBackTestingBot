import chalk from "chalk";
import type { StopLoss, StrategyOutcome } from "./types.js";
import { generateSummary, generateSummaryText } from "./utils/summaryUtils.js";
import { generateCandles, generateTrades } from "./utils/inputUtils.js";
import { executeTrades } from "./utils/tradingUtils.js";
import inquirer from "inquirer";
import { DurationUnits } from "luxon";

const setupData = await Promise.all([
  generateCandles(
    "/Users/anthony/Documents/Codebases/TradingBackTesting/daily.csv"
  ),
  generateTrades(),
]);

if (setupData[0] && setupData[1]) {
  const candles = setupData[0];
  const { trades, tradeOutput } = setupData[1];
  const prompt = inquirer.createPromptModule();
  const allTrailingStops = ["9EMA", "9MA", "21MA", "50MA"];
  const result = await prompt([
    {
      type: "list",
      choices: [
        "9EMA",
        "9MA",
        "21MA",
        "50MA",
        "Optimize - Run all available trailing stops",
      ],
      name: "stop",
      message: "Choose what stop you'd like to test against",
    },
  ]);
  const timeframe = await prompt([
    {
      type: "list",
      choices: [
        { name: "Seconds (1s, 5s, 10s, etc...)", value: "seconds" },
        { name: "Minutes (1m, 3m, 5m, etc...)", value: "minutes" },
        { name: "Hourly (1H, 4H)", value: "hours" },
        { name: "Daily", value: "days" },
        { name: "Weekly", value: "weeks" },
        { name: "Monthly", value: "months" },
      ],
      name: "timeframe",
      message: "What timeframe were your trades developed on?",
    },
  ]);
  const timeFrameMap: Map<string, string> = new Map<string, string>([
    ["seconds", "Per Second"],
    ["minutes", "Per Minute"],
    ["hours", "Hourly"],
    ["days", "Daily"],
    ["weeks", "Weekly"],
    ["months", "Monthly"],
  ]);
  const selectedStop: StopLoss = result.stop;
  const selectedTimeFrame: DurationUnits = timeframe.timeframe;
  if (selectedStop.startsWith("Optimize")) {
    const results: StrategyOutcome[] = [];
    for (let i = 0; i < allTrailingStops.length; i++) {
      const tempTradeOutput = [...tradeOutput];
      executeTrades(
        candles,
        trades,
        tempTradeOutput,
        allTrailingStops[i] as StopLoss
      );
      results.push(
        generateSummary(
          tempTradeOutput,
          allTrailingStops[i] as StopLoss,
          selectedTimeFrame,
          true
        ) as StrategyOutcome
      );
    }
    results.sort((outcome1: StrategyOutcome, outcome2: StrategyOutcome) => {
      const result = outcome2.wins - outcome1.wins;
      if (result !== 0) {
        return result;
      }
      return outcome1.averageMAE - outcome2.averageMAE;
    });
    console.log(
      `\n${chalk.bgBlue(
        `Best Perfoming Stop: ${timeFrameMap.get(
          selectedTimeFrame as string
        )} ${results[0].selectedStop}`
      )}\n`
    );
    generateSummaryText(results[0], selectedTimeFrame as string);
  } else {
    executeTrades(candles, trades, tradeOutput, selectedStop);
    generateSummary(tradeOutput, selectedStop, selectedTimeFrame, false);
  }
}
