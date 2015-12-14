var should = require('should');

describe('BetModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with bets', function (done) {
    Bet
      .find()
      .exec(function (err, bets) {
        should(err).be.null;
        should(bets).not.be.undefined;

        bets.length.should.be.eql(fixtures['bet'].length);

        return done();
    });
  });

  describe('#beforeValidate()', function () {

    it('should convert team scores to integers', function (done) {
      Bet.beforeValidate({
          scoreTeamA: '7',
          scoreTeamB: '5'
        }, function (err) {
          should(err).be.undefined;

          return done();
      });

    });

    it('should convert score to integer if existing', function (done) {

      Bet.beforeValidate({
          score: '7',
        }, function (err) {
          should(err).be.undefined;

          return done();
      });

    });

  });

  describe('#afterValidate()', function () {

    it('should return a double error if each team score is not valid', function (done) {

      Bet.afterValidate({
          scoreTeamA: -1,
          scoreTeamB: 2
        }, function (err) {
          should(err).not.be.undefined;

          err.should.be.an.Array;
          err.should.have.lengthOf(2);

          return done();
      });

    });

    it('should return an error if teamA score is not valid', function (done) {

      Bet.afterValidate({
          scoreTeamA: 4,
          scoreTeamB: 0
        }, function (err) {
          should(err).not.be.undefined;

          err.should.be.an.Array;
          err.should.have.lengthOf(1);

          return done();
      });

    });

    it('should return an error if teamB score is not valid', function (done) {

      Bet.afterValidate({
          scoreTeamA: 0,
          scoreTeamB: -5
        }, function (err) {
          should(err).not.be.undefined;

          err.should.be.an.Array;
          err.should.have.lengthOf(1);

          return done();
      });

    });

    it('should succeed if both scores are valid', function (done) {

      async.parallel([

        function (next) {
          Bet.afterValidate({
              scoreTeamA: 0,
              scoreTeamB: 0
            }, next);
        },

        function (next) {
          Bet.afterValidate({
              scoreTeamA: 5,
              scoreTeamB: 0
            }, next);
        },

        function (next) {
          Bet.afterValidate({
              scoreTeamA: 7,
              scoreTeamB: 15
            }, next);
        },

      ], function (err) {
        should(err).be.undefined;

        return done();
      });

    });

  });

});
