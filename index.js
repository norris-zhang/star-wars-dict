'use strict';

console.log('Loading function');

var cache = require('./cache').cache;
var swapi = require('swapi-node');


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
    console.log("Norris: 111111");
    /*swapi.getPerson(1, function(err, result){
        console.log("Norris: 3333333" + result);
        done(null, result);
    });*/

    swapi.getPerson(1).then(function (result) {
        console.log(result);
        done(null, result);
    });
    console.log("Norris: 2222222");
    //done(null, nameList);
    var now = new Date().getTime();
    while (new Date().getTime() - now < 1000) {

    }
};
