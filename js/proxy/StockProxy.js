import Cache from "./Cache.js";
import Config from "../Config.js";
import StockMockData from "./mockdata/StockMockData.js";

export default class StockProxy {
  service;
  cache;
  timeFrom = String;
  isCache  = Boolean;
  isMock   = Boolean;
  cacheKey = String;
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
    this.isCacheEnabled = Config.IS_CACHE_STOCK_ENABLED;
    this.isMock = Config.IS_MOCK_STOCK_ENABLED;
    this.timeFrom = Date.parse("2020-01-01T00:00:00") / 1000;
  }
  async getData(companySymbol) {
    let timeTo = new Date().getTime();
    this.cacheKey = this.setCacheKey(companySymbol, this.timeFrom, timeTo);
    let data = this.isCacheEnabled
      ? this.cache.getCacheItem(this.cacheKey)
      : null;
    data = this.isMock ? this.getMockData() : data;

    if (data == null) {
      let dataPromise = this.service.getData(companySymbol, this.timeFrom, timeTo);

      if (this.isCacheEnabled) {
        this.cache.addCacheItem(this.cacheKey, dataPromise);
      }
      data = dataPromise;
    }
    return data;
  }

  getMockData() {
    let mockData = StockMockData.getData();
    if (this.isCacheEnabled) {
      this.cache.addCacheItem(this.cacheKey, mockData);
    }
    return mockData;
  }

  setCacheKey(companySymbol, timeFrom, timeTo) {
    let fixedTimeTo = this.setTimeToZeroMinSecMill(timeTo);
    return this.isMock
      ? "MOCK-STOCK-CACHE-KEY"
      : "STOCK-" + companySymbol + "-" + timeFrom + "-" + fixedTimeTo;
  }

  setTimeToZeroMinSecMill(time) {
    const dateObject = new Date(time);
    // time cache invalidation is 1 hour
    return dateObject.setMinutes(0, 0, 0);
  }
}
