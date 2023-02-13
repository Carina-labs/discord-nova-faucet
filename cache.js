
const cache = new Map();
const CACHE_REFRESH_LIMIT_TIME = 60000 * 60 * 24; // 24H

/*
Cache structure(key-value store)
--------------------------------
  [key]    |       [value]
--------------------------------
{address1} | {time-milliseconds}
{address2} | {time-milliseconds}
{address3} | {time-milliseconds}
--------------------------------
 */

module.exports = {
  get: function get(k) {
    return cache.get(k);
  },
  add: function add(k, v) {
    if (!cache.has(k)) {
      const now = Date.now();
      console.log(`item is not in cache, k: ${k}, v: ${v}, time: ${now}`);
      cache.set(k, now);
      return true;
    } else {
      const addedTime = cache.get(k);
      const now = Date.now();
      if (now - addedTime > CACHE_REFRESH_LIMIT_TIME) {
        console.log(`item is replaced, k: ${k}, v: ${v}, time: ${now}`);
        cache.set(k, now);
        return true;
      } else {
        console.log(`user cannot request faucet because of limit, k: ${k}, v: ${v}, time: ${now}`);
        return false;
      }
    }
  }
}
