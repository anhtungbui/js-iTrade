import Cache from "./Cache.js";
import Config from "../Config.js";
import SearchMockData from "./mockdata/SearchMockData.js";

export default class SearchProxy {
  service;
  cache;
  isCacheEnabled = Boolean;
  isMockEnabled = Boolean;
  cacheKey = String;
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
    this.isCacheEnabled = Config.IS_CACHE_SEARCH_ENABLED;
    this.isMockEnabled = Config.IS_MOCK_SEARCH_ENABLED;
  }
  async getData(query) {
    this.cacheKey = this.setCacheKey(query);
    let data = this.isCacheEnabled ? this.cache.getCacheItem(this.cacheKey) : null;
    data = this.isMockEnabled ? this.getMockData() : data;

    if (data == null) {
      let dataPromise = this.service.getData(query);

      if (this.isCacheEnabled) {
        this.cache.addCacheItem(this.cacheKey, dataPromise);
      }
      data = dataPromise;
    }
    return data;
  }

  getMockData() {
    let mockData = SearchMockData.getData();
    if (this.isCacheEnabled) {
      this.cache.addCacheItem(this.cacheKey, mockData);
    }
    return mockData;
  }

  setCacheKey(query) {
    return this.isMockEnabled
      ? "MOCK-CACHE-SEARCH-KEY"
      : "SEARCH-"+query+"-SEARCH-KEY";
  }
}
