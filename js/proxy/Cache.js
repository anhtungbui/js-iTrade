export default class Cache {
  addCacheItem(key, data) {
    data.then((d) => {
      localStorage.setItem(key, JSON.stringify(d));
    });
  }

  getCacheItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}
