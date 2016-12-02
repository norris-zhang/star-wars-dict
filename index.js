'use strict';

console.log('Loading function');

var cache = require('./cache').cache;


/**
 * Get character info from Star Wars API, according to character names.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log("Norris: finished.");
    console.log("Norris: cache - " + cache.length);
    var nameList = new Array();
    nameList.push("Norris");
    nameList.push("Yan");
    if (cache.length % 2 == 0) {
        nameList.push("Chenchen");
        nameList.push("Yuyu");
    }
    cache.push('haha');
    done(null, nameList);
    
};
