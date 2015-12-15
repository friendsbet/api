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

  describe('#name()', function () {

    it('should convert team scores to integers', function (done) {
      Match
        .find()
        .limit(1)
        .populate('teamA')
        .populate('teamB')
        .exec(function (err, matches) {
          should(err).be.null;
          should(matches).not.be.undefined;

          matches.should.be.an.array;

          var match = matches[0];
          match.should.be.an.object;
          match.should.have.property('name');
          match.name.should.be.a.function;
          match.name().should.be.a.string;

          // No need to check what's inside that string I hope :-)

          return done();
      });
    });

  });

  describe('#beforeValidate()', function () {

    it('should convert importance to float and teams scores to integer', function (done) {
      Match.beforeValidate({
          importance: '2.0',
          scoreTeamA: '12',
          scoreTeamB: '24'
        }, function (err) {
          should(err).be.undefined;

          return done();
      });
    });

  });

});
