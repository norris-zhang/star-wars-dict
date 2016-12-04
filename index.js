'use strict';

var swapi = require('swapi-node');
var cache = require('./cache');

/**
 * Get character info from Star Wars API, according to character names.
 */
exports.handler = (event, context, callback) => {
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var name = event.queryStringParameters["name"];

    /*
     * If character name is in cache, return character info from cache.
     * Otherwise, fetch character info from SWAPI, then put it into cache.
     */
    var cachedObject = cache.get(name);
    if (cachedObject) {
        done(null, cachedObject);
        return;
    }
    console.log("visiting SWAPI...");

    swapi.get("http://swapi.co/api/people/?search=" + name).then(function (result) {
        // search result is multiple, required output is single.
        if (result.count === 0) {
            done(null, {});
        } else {
            var charURL = getSingleCharacterURL(name, result.results);
            processURL(charURL, done);
        }
    }).catch(function(reason){ // handle exception.
        console.log("Handle rejection: " + JSON.stringify(reason, null, 2));
        done(reason, null);
    });
};

/**
 * SWAPI search result returns a set of people.
 * To pick a single person, the rule is:
 * if the person name is exactly the same as given, select it,
 * otherwise, pick the first record.
 */
var getSingleCharacterURL = function (name, results) {
    if (results.length == 1) {
        return results[0].url;
    }
    var url = results[0].url;
    for (var i = 0; i < results.length; i++) {
        if (name === results[i].name) {
            return results[i].url;
        }
    }
    return url;
}

/**
 * arg url is a character url.
 * visit SWAPI with this url and fill the dest object as required format.
 * Deeper information is fetched.
 */
var processURL = function (url, callback) {
    // object skeleton to be returned.
    var character = {
        birth_year: "",
        eye_color: "",
        films: [],
        gender: "",
        hair_color: "",
        homeworld: "",
        name: "",
        skin_color: "",
        species: [],
        starships: [],
        vehicles: []
    };

    // store the character result temporarily,
    // used to fetch deeper information.
    var tempResult = null;

    swapi.get(url).then(function (result) {
        tempResult = result;
        character.birth_year = result.birth_year;
        character.eye_color = result.eye_color;
        character.gender = result.gender;
        character.hair_color = result.hair_color;
        character.name = result.name;
        character.skin_color = result.skin_color;

        return result.getHomeworld();
    }).then(function(hw) { // get homeworld information
        character.homeworld = hw.name;
        return tempResult.getFilms();
    }).then(function (films) { // get films information
        for (var i = 0; i < films.length; i++) {
            character.films.push(films[i].title);
        }
        
        return tempResult.getSpecies();
    }).then(function (species) { // get species information
        for (var i = 0; i < species.length; i++) {
            character.species.push(species[i].name);
        }
        return tempResult.getStarships();
    }).then(function(starships){ // get starships information
        for (var i = 0; i < starships.length; i++) {
            character.starships.push(starships[i].name);
        }
        return tempResult.getVehicles();
    }).then(function(vehicles) { // get vehicles information
        for (var i = 0; i < vehicles.length; i++) {
            character.vehicles.push(vehicles[i].name);
        }
        return character;
    }).then(function(result){ // push into cache before returning.
        cache.push(result.name, result);
        callback(null, result);
    }).catch(function(reason){ // handle exception.
        console.log("Handle rejection: " + JSON.stringify(reason, null, 2));
        callback(reason, null);
    });
}
