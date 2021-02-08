import Config from "../Config.js";

export default class FinnHubService {
  token    = String;
  timeFrom = String;
  timeTo   = String;
  constructor() {
    this.token = Config.FINN_HUB_TOKEN;
    this.timeFrom = Date.parse("2020-01-01T00:00:00") / 1000;
    this.timeTo = new Date().getTime();
  }
  async getData(companySymbol) {
    let url =
      "https://finnhub.io/api/v1/stock/candle?symbol=" +
      companySymbol +
      "&resolution=D&from=" +
      this.timeFrom +
      "&to=" +
      this.timeTo +
      "&token=" +
      this.token;
    const res = await fetch(url);
    const originalData = await res.json();
    const marketPrice = originalData.c[originalData.c.length - 1].toFixed(2);

    let dataSet = this.convertChartData(originalData);
    return { companySymbol, dataSet, marketPrice };
  }

  convertChartData(data) {
    const chartData = [];
    for (let i = 0; i < data.t.length; i++) {
      chartData.push([data.t[i] * 1000, parseFloat(data.c[i].toFixed(2))]);
    }
    return chartData;
  }
}
