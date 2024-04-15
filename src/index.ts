import type { StopLoss } from "./types.js";
import { generateSummary } from "./utils/summaryUtils.js";
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
  const result = await prompt([
    {
      type: "list",
      choices: ["9EMA", "9MA", "21MA", "50MA"],
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
  const selectedStop: StopLoss = result.stop;
  const selectedTimeFrame: DurationUnits = timeframe.timeframe;
  executeTrades(candles, trades, tradeOutput, selectedStop);
  generateSummary(tradeOutput, selectedStop, selectedTimeFrame);
}
