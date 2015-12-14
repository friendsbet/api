var should = require('should');

describe('MatchModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with matches', function (done) {
    Match
      .find()
      .exec(function (err, matches) {
        should(err).be.null;
        should(matches).not.be.undefined;

        matches.length.should.be.eql(fixtures['match'].length);

        return done();
    });
  });

});
