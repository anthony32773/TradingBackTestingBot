import ExcelJS from "exceljs";
import { Candle, GenerateTradesOutput, Trade, TradeOutcome } from "../types.js";
import { DateTime } from "luxon";

/**
 * Generate candles from input chart data.
 * @param {string} fileLocation - Location of the file to read.
 * @returns {Promise<Candle[] | undefined>}
 */
async function generateCandles(
  fileLocation: string
): Promise<Candle[] | undefined> {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.csv.readFile(fileLocation);
    const candles: Candle[] = [];
    workbook.worksheets[0].eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        if (!isNaN(row.getCell(13).value as number)) {
          candles.push({
            time:
              typeof row.getCell(1).value === "object"
                ? DateTime.fromJSDate(new Date(row.getCell(1).value as string))
                : DateTime.fromISO(row.getCell(1).value as string),
            open: row.getCell(2).value as number,
            high: row.getCell(3).value as number,
            low: row.getCell(4).value as number,
            close: row.getCell(5).value as number,
            "9MA":
              Math.round(
                ((row.getCell(11).value as number) + Number.EPSILON) * 100
              ) / 100,
            "21MA":
              Math.round(
                ((row.getCell(12).value as number) + Number.EPSILON) * 100
              ) / 100,
            "50MA":
              Math.round(
                ((row.getCell(13).value as number) + Number.EPSILON) * 100
              ) / 100,
            "9EMA":
              Math.round(
                ((row.getCell(10).value as number) + Number.EPSILON) * 100
              ) / 100,
          });
        }
      }
    });
    return candles;
  } catch (err) {
    console.error("Could not read candle data.", err);
  }
}

/**
 * Generate trades and tradeOutput arrays from trade input sheet.
 * @returns {Promise<GenerateTradesOutput | undefined>}
 */
async function generateTrades(): Promise<GenerateTradesOutput | undefined> {
  try {
    const inputWorkbook = new ExcelJS.Workbook();
    await inputWorkbook.csv.readFile(
      "/Users/anthony/Documents/Codebases/TradingBackTesting/input.csv"
    );
    const trades: Trade[] = [];
    const tradeOutput: TradeOutcome[] = [];
    inputWorkbook.worksheets[0].eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        if (typeof row.getCell(6).value === "number") {
          const tempFormat = (row.getCell(2).value as string).split("/");
          let format = "";
          for (let i = 0; i < tempFormat.length; i++) {
            for (let j = 0; j < tempFormat[i].length; j++) {
              if (i === 0) {
                format += "M";
              } else if (i === 1) {
                format += "d";
              } else {
                format += "y";
              }
            }
            format += "/";
          }
          format = format.substring(0, format.length - 1);
          const tempTrade: Trade = {
            CandleDate: DateTime.fromFormat(
              row.getCell(2).value as string,
              format
            ),
            price: row.getCell(6).value as number,
            direction: row.getCell(8).value as "L" | "S",
            exit1: row.getCell(16).value as number,
          };
          if (typeof row.getCell(18).value === "number") {
            tempTrade.exit2 = row.getCell(18).value as number;
          }
          if (typeof row.getCell(20).value === "number") {
            tempTrade.exit3 = row.getCell(20).value as number;
          }
          trades.push(tempTrade);
          tradeOutput.push({
            trade: tempTrade,
            slHit: false,
            tp1Hit: false,
            tp2Hit: tempTrade.exit2 ? false : undefined,
            tp3Hit: tempTrade.exit3 ? false : undefined,
            MAE: tempTrade.price,
            MFE: tempTrade.price,
            invalidTrade: !tempTrade.CandleDate.isValid,
          });
        }
      }
    });
    return { trades, tradeOutput };
  } catch (err) {
    console.error("Could not read input trade data.", err);
  }
}

export { generateCandles, generateTrades };
