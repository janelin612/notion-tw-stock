import Notion from "./lib/Notion.js";
import "dotenv/config";

(async () => {
  let lists = await Notion.getStocks(process.env.DATABASE_ID);

  const FIELD_NAME_PRICE = "現價";
  lists.forEach(async (item) => {
    let code = item.properties.Code.title[0].plain_text;

    const result = await callStockApi(code);
    let price = result.closePrice ? result.closePrice : result.previousClose;
    item.properties[FIELD_NAME_PRICE].number = parseFloat(price);
    let props = {};
    props[FIELD_NAME_PRICE] = item.properties[FIELD_NAME_PRICE];
    await Notion.updateStock(item.id, props);
  });
})();

async function callStockApi(stockCode) {
  const API_KEY = process.env.FUGLE_API_KEY;
  const endpoint = "https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/";
  const resp = await fetch(endpoint + stockCode, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });
  return await resp.json();
}
