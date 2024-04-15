import type { StopLoss } from "./types.js";
import { generateSummary } from "./utils/summaryUtils.js";
import { generateCandles, generateTrades } from "./utils/inputUtils.js";
import { executeTrades } from "./utils/tradingUtils.js";
import inquirer from "inquirer";

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
  const selectedStop: StopLoss = result.stop;
  executeTrades(candles, trades, tradeOutput, selectedStop);
  generateSummary(tradeOutput, selectedStop);
}
