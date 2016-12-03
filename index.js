'use strict';

console.log('Loading function');

var swapi = require('swapi-node');

/**
 * Get character info from Star Wars API, according to character names.
 */
exports.handler = (event, context, callback) => {
    //console.log("Norris: Received event:", JSON.stringify(event, null, 2));
    console.log("begin....");
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var name = event.queryStringParameters["name"];

    swapi.get("http://swapi.co/api/people/?search=" + name).then(function (result) {
        if (result.count === 0) {
            done(null, {});
        } else {
            var charURL = getSingleCharacterURL(name, result.results);
            processURL(charURL, done);
        }
    }).catch(function(reason){
        console.log("Handle rejection: " + JSON.stringify(reason, null, 2));
        done(reason, null);
    });
};
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
var processURL = function (url, callback) {
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
        vehicles: [] // TODO
    };
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
    }).then(function(hw) {
        character.homeworld = hw.name;
        return tempResult.getFilms();
    }).then(function (films) {
        for (var i = 0; i < films.length; i++) {
            character.films.push(films[i].title);
        }
        
        return tempResult.getSpecies();
    }).then(function (species) {
        for (var i = 0; i < species.length; i++) {
            character.species.push(species[i].name);
        }
        return tempResult.getStarships();
    }).then(function(starships){
        for (var i = 0; i < starships.length; i++) {
            character.starships.push(starships[i].name);
        }
        return tempResult.getVehicles();
    }).then(function(vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            character.vehicles.push(vehicles[i].name);
        }
        return character;
    }).then(function(result){
        callback(null, result);
    }).catch(function(reason){
        console.log("Handle rejection: " + JSON.stringify(reason, null, 2));
        callback(reason, null);
    });
}

module.exports.handler({queryStringParameters: {name: "r5"}}, null, (err, result) => {
    console.log("Norris: " + JSON.stringify(result, null, 2));
});