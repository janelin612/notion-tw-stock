import "dotenv/config";
import { Client } from "@notionhq/client";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default {
  async getStocks(dbid) {
    const pages = await notion.databases.query({
      database_id: dbid,
    });
    return pages.results;
  },
  async updateStock(id, diff, props) {
    const icon = diff > 0 ? ICON.UP : diff < 0 ? ICON.DOWN : ICON.FLAT;
    return await notion.pages.update({
      page_id: id,
      icon: { type: "emoji", emoji: icon },
      properties: props,
    });
  },
};

const ICON = {
  UP: "🟥",
  DOWN: "🟩",
  FLAT: "⬜",
};
