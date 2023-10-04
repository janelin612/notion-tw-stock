import "dotenv/config";

const API_KEY = process.env.NOTION_API_KEY;
const API_HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-02-22",
};

export default {
  async getStocks(dbid) {
    let output = [];
    let more = false;
    let cursor;
    do {
      let resp = await NotionApi.getAll(dbid, cursor);
      more = resp.has_more;
      cursor = resp.next_cursor;
      output = output.concat(resp.results);
    } while (more);
    return output;
  },
  async updateStock(id, props) {
    return await NotionApi.updatePage(id, props);
  },
};

var NotionApi = {
  async getAll(dbid, cursor) {
    return await (
      await fetch(`https://api.notion.com/v1/databases/${dbid}/query`, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({
          page_size: 100,
          start_cursor: cursor,
        }),
      })
    ).json();
  },
  async updatePage(id, porps) {
    const config = {
      method: "PATCH",
      headers: API_HEADERS,
      body: JSON.stringify({
        properties: porps,
      }),
    };
    return await (
      await fetch(`https://api.notion.com/v1/pages/${id}`, config)
    ).json();
  },
};
