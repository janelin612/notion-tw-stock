import fetch from "node-fetch";
import Notion from "./lib/Notion.js";
import "dotenv/config";

(async () => {
  let lists = await Notion.getStocks(process.env.DATABASE_ID);
  let stocks = lists
    .map((item) => "tse_" + item.properties.Code.title[0].plain_text + ".tw")
    .join("|");

  let params = new URLSearchParams();
  params.append("delay", 0);
  params.append("json", 1);
  params.append("ex_ch", stocks);

  let resp = await (
    await fetch(
      "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?" + params.toString()
    )
  ).json();

  const FIELD_NAME_PRICE = "現價";
  lists.forEach(async (item) => {
    let code = item.properties.Code.title[0].plain_text;
    let price = resp.msgArray.find((item) => item.c == code).z;
    item.properties[FIELD_NAME_PRICE].number = parseFloat(price);
    let props = {};
    props[FIELD_NAME_PRICE] = item.properties[FIELD_NAME_PRICE];
    await Notion.updateStock(item.id, props);
  });
})();
