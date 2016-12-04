var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var swapi = require('swapi-node');

var Main = require('../index');

describe('EntryMethod', function() {
    // different senarios will be tested, with search result having 1, 0 and more than 1.
    var searchResultCount = 1;
    beforeEach(function() {
        sinon.stub(swapi, 'get', function(url) {
            if (url.indexOf("search=") >= 0) {
                return new Promise(function(resolve, reject) {
                    if (searchResultCount === 1) {
                        resolve({
                            "count": 1,
                            "results": [
                                {
                                    "name": "Luke Skywalker", 
                                    "url": "http://swapi.co/api/people/1/"
                                }
                            ]
                        });
                    } else if (searchResultCount === 0) {
                        resolve({
                            "count": 0,
                            "results": []
                        });
                    } else {
                        resolve({
                            "count": 2,
                            "results": [
                                {
                                    "name": "C-3PO", 
                                    "url": "http://swapi.co/api/people/2/"
                                },
                                {
                                    "name": "Luke Skywalker", 
                                    "url": "http://swapi.co/api/people/1/"
                                }
                            ]
                        });
                    }
                    
                });
            }

            if (url === 'http://swapi.co/api/people/2/') {
                return new Promise(function(resolve, reject) {
                    resolve({
                        "name": "C-3PO", 
                        "height": "172", 
                        "mass": "77", 
                        "hair_color": "blond", 
                        "skin_color": "fair", 
                        "eye_color": "blue", 
                        "birth_year": "19BBY", 
                        "gender": "male", 
                        "homeworld": "http://swapi.co/api/planets/1/", 
                        "films": [
                            "http://swapi.co/api/films/6/", 
                            "http://swapi.co/api/films/3/", 
                            "http://swapi.co/api/films/2/", 
                            "http://swapi.co/api/films/1/", 
                            "http://swapi.co/api/films/7/"
                        ], 
                        "species": [
                            "http://swapi.co/api/species/1/"
                        ], 
                        "vehicles": [
                            "http://swapi.co/api/vehicles/14/", 
                            "http://swapi.co/api/vehicles/30/"
                        ], 
                        "starships": [
                            "http://swapi.co/api/starships/12/", 
                            "http://swapi.co/api/starships/22/"
                        ], 
                        "created": "2014-12-09T13:50:51.644000Z", 
                        "edited": "2014-12-20T21:17:56.891000Z", 
                        "url": "http://swapi.co/api/people/1/",
                        getHomeworld: function() {
                            return {
                                "name": "Tatooine"
                            };
                        },
                        getFilms: function () {
                            return [{"title": "Revenge of the Sith"}, {"title": "Revenge of the Sith 2"}]
                        },
                        getSpecies: function() {
                            return [];
                        },
                        getStarships: function() {
                            return [];
                        },
                        getVehicles: function() {
                            return [];
                        }
                    });
                });
            }
            return new Promise(function(resolve, reject) {
                resolve({
                    "name": "Luke Skywalker", 
                    "height": "172", 
                    "mass": "77", 
                    "hair_color": "blond", 
                    "skin_color": "fair", 
                    "eye_color": "blue", 
                    "birth_year": "19BBY", 
                    "gender": "male", 
                    "homeworld": "http://swapi.co/api/planets/1/", 
                    "films": [
                        "http://swapi.co/api/films/6/", 
                        "http://swapi.co/api/films/3/", 
                        "http://swapi.co/api/films/2/", 
                        "http://swapi.co/api/films/1/", 
                        "http://swapi.co/api/films/7/"
                    ], 
                    "species": [
                        "http://swapi.co/api/species/1/"
                    ], 
                    "vehicles": [
                        "http://swapi.co/api/vehicles/14/", 
                        "http://swapi.co/api/vehicles/30/"
                    ], 
                    "starships": [
                        "http://swapi.co/api/starships/12/", 
                        "http://swapi.co/api/starships/22/"
                    ], 
                    "created": "2014-12-09T13:50:51.644000Z", 
                    "edited": "2014-12-20T21:17:56.891000Z", 
                    "url": "http://swapi.co/api/people/1/",
                    getHomeworld: function() {
                        return {
                            "name": "Tatooine"
                        };
                    },
                    getFilms: function () {
                        return [{"title": "Revenge of the Sith"}, {"title": "Revenge of the Sith 2"}]
                    },
                    getSpecies: function() {
                        return [];
                    },
                    getStarships: function() {
                        return [];
                    },
                    getVehicles: function() {
                        return [];
                    }
                });
            });
            
        });
    });
    afterEach(function() {
        swapi.get.restore();
    });
    
    it('testing search with 1 result.', function(done) {
        searchResultCount = 1;
        Main.handler({queryStringParameters: {name: 'Luke'}}, null, function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.statusCode).to.equal('200');
                expect(result.headers['Content-Type']).to.equal('application/json');
                expect(JSON.parse(result.body).name).to.equal('Luke Skywalker');
                done();
            }
        });
    });
    it('testing search with 0 result.', function(done) {
        searchResultCount = 0;
        Main.handler({queryStringParameters: {name: 'Luke'}}, null, function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.statusCode).to.equal('200');
                expect(result.headers['Content-Type']).to.equal('application/json');
                expect(JSON.parse(result.body).name).to.equal(undefined);
                done();
            }
        });
    });
    it('testing search with 2 result.', function(done) {
        searchResultCount = 2;
        Main.handler({queryStringParameters: {name: 'Luke'}}, null, function(err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.statusCode).to.equal('200');
                expect(result.headers['Content-Type']).to.equal('application/json');
                expect(JSON.parse(result.body).name).to.equal('C-3PO');
                done();
            }
        });
    });
});