var chai = require('chai');
var expect = chai.expect;

var cache = require('../cache');
describe('test cache', function() {
    beforeEach(function() {
        cache.push("Luke", {"name": "Luke", "gender": "male"});
        cache.push("John", {"name": "John", "gender": "male"});
        cache.push("Mark", {"name": "Mark", "gender": "male"});
        cache.push("Yan", {"name": "Yan", "gender": "female"});
        cache.push("Glenis", {"name": "Glenis", "gender": "female"});
    });
    afterEach(function() {
        cache.clear();
    });
    it('test get.', function() {
        expect(cache.get("Luke").gender).to.equal('male');
        expect(cache.get("John").gender).to.equal('male');
        expect(cache.get("Mark").gender).to.equal('male');
        expect(cache.get("Yan").gender).to.equal('female');
        expect(cache.get("Glenis").gender).to.equal('female');
    });
    it('test push.', function() {
        expect(cache.get("Paul")).to.be.null;
        cache.push("Paul", {"name": "Paul", "gender": "male"});
        expect(cache.get("Paul")).to.not.be.null;
        expect(cache.get("Paul").gender).to.equal('male');
    });
    it('test expiry.', function() {
        expect(cache.get("John")).to.not.be.null;
        cache.expire("John");
        expect(cache.get("John")).to.be.null;
    });
});