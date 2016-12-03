cacheExpiry = 12 * 60 * 60 * 1000;
namecache = {};
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
exports.push = function (key, value) {
    console.log("push to cache key = " + key + ", value = " + JSON.stringify(value, null, 2));
    namecache[key] = {timestamp: new Date().getTime(), data: value};
}
