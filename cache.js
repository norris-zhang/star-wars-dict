cacheExpiry = 12 * 60 * 60 * 1000;
namecache = {};

/**
 * return the cached value according to the key.
 * If the cache value has expired, return null;
 */
exports.get = function (key) {
    console.log("get from cache, key = " + key);
    var cacheValue = namecache[key];
    if (cacheValue) {
        if (new Date().getTime() - cacheValue.timestamp >= cacheExpiry) {
            console.log("cache data expired.");
            namecache[key] = undefined;
            return null;
        }
        console.log("cache hit.");
        cacheValue.timestamp = new Date().getTime();
        return cacheValue.data;
    }
    console.log("cache not hit.");
    return null;
}

/**
 * add the key-value to cache with current timestamp.
 */
exports.push = function (key, value) {
    console.log("push to cache key = " + key + ", value = " + JSON.stringify(value, null, 2));
    namecache[key] = {timestamp: new Date().getTime(), data: value};
}

/**
 * re-create the cache.
 */
exports.clear = function () {
    namecache = {};
}

/**
 * expires one cached value according to the given key.
 */
exports.expire = function (key) {
    var cacheValue = namecache[key];
    if (cacheValue) {
        cacheValue.timestamp = new Date().getTime() - cacheExpiry - 1 * 60 * 60 * 1000;
    }
}