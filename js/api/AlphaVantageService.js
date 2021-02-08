import Config from "../Config.js";

export default class AlphaVantageService {
  token = String;
  constructor() {
    this.token = Config.ALPHA_VANtAGE_TOKEN;
  }
  async getData(query) {
    const res = await fetch(
      "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
        query +
        "&apikey=" +
        this.token
    );

    const data = await res.json();
    return data.bestMatches;
  }
}