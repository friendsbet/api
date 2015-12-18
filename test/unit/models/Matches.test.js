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

    it('should return a string', function (done) {
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

    it('should return an error if at least one of the teams is not populated', function (done) {
      Match
        .find()
        .limit(1)
        .populate('teamA')
        .exec(function (err, matches) {
          should(err).be.null;
          should(matches).not.be.undefined;

          matches.should.be.an.array;

          var match = matches[0];
          match.should.be.an.object;
          match.should.have.property('name');
          match.name.should.be.a.function;
          match.name().should.be.an.error;

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

  describe('#beforeUpdate(matchThatHasNotEnded)', function () {

    it('should throw an error if the match is not ended', function (done) {
      var match = { isEnded: false };

      Match.beforeUpdate(match, function (err) {
        should(err).not.be.undefined;
        err.should.be.an.error;

        return done();
      });
    });

  });

  describe('#beforeUpdate(matchThatDoesNotExist)', function () {

    it('should throw an error if the match doesn\'t exist', function (done) {
      var match = { id: '', isEnded: true };

      Match.beforeUpdate(match, function (err) {
        should(err).not.be.undefined;
        err.should.be.an.error;

        return done();
      });
    });

  });

  describe('#beforeUpdate(matchThatWasAlreadyEnded)', function () {

    var teamSKTT1Id;
    var teamOrigenId;
    var matchId;
    var match;

    before(function (done) {
      async.auto({

        createTeamSKTT1: function (next) {
          Team.create({
            name: 'SKT T1',
            slug: 'skt-t1'
          }).exec(next);
        },

        createTeamOrigen: function (next) {
          Team.create({
            name: 'Origen',
            slug: 'origen'
          }).exec(next);
        },

        createMatch: ['createTeamSKTT1', 'createTeamOrigen', function (next, results) {
          Match.create({
            teamA: results['createTeamSKTT1'].id,
            teamB: results['createTeamOrigen'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Seoul, South Korea',
            isEnded: true
          }).exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;
        
        teamSKTT1Id = results['createTeamSKTT1'].id;
        teamOrigenId = results['createTeamOrigen'].id;
        matchId = results['createMatch'].id;
        match = results['createMatch'];

        return done();
      });
    });

    after(function (done) {
      async.auto({
        destroyTeamSKTT1: function (next) {
          Team.destroy(teamSKTT1Id).exec(next);
        },
        destroyTeamOrigen: function (next) {
          Team.destroy(teamOrigenId).exec(next);
        },
        destroyMatch: function (next) {
          Match.destroy(matchId).exec(next);
        }
      }, done);
    });

    it('should throw an error if the match was already ended', function (done) {
      match.scoreTeamA = 3;

      Match.beforeUpdate(match, function (err) {
        should(err).not.be.undefined;
        err.should.be.an.error;

        return done();
      });
    });

  });

  describe('#beforeUpdate(match)', function () {

    var teamSKTT1Id;
    var teamOrigenId;
    var matchId;

    before(function (done) {
      async.auto({

        createTeamOrigen: function (next) {
          Team.create({
            name: 'Origen',
            slug: 'origen'
          }).exec(next);
        },

        createTeamSKTT1: function (next) {
          Team.create({
            name: 'SKT T1',
            slug: 'skt-t1'
          }).exec(next);
        },

        createMatch: ['createTeamSKTT1', 'createTeamOrigen', function (next, results) {
          Match.create({
            teamA: results['createTeamOrigen'].id,
            teamB: results['createTeamSKTT1'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Madrid, Spain'
          }).exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;

        teamOrigenId = results['createTeamOrigen'].id;
        teamSKTT1Id = results['createTeamSKTT1'].id;
        matchId = results['createMatch'].id;

        return done();
      });
    });

    after(function (done) {
      async.auto({
        destroyTeamOrigen: function (next) {
          Team.destroy(teamOrigenId).exec(next);
        },
        destroyTeamSKTT1: function (next) {
          Team.destroy(teamSKTT1Id).exec(next);
        },
        destroyMatch: function (next) {
          Match.destroy(matchId).exec(next);
        }
      }, done);
    });

    it('should not throw an error when everything is fine', function (done) {
      var match = {
        id: matchId,
        scoreTeamA: 0,
        scoreTeamB: 3,
        isEnded: true
      };

      Match.beforeUpdate(match, function (err) {
        should(err).be.undefined;

        return done();
      });
    });

  });

  describe('#destroy()', function () {

    var taylorId;
    var teamFnaticId;
    var teamEnVyUsId;
    var matchId;
    var betId;

    before(function (done) {
      async.auto({

        createUserTaylor: function (next) {
          User.create({
            email: 'taylor@swift.com',
            firstName: 'Taylor',
            lastName: 'Swift',
          }).exec(next);
        },

        createTeamFnatic: function (next) {
          Team.create({
            name: 'Fnatic',
            slug: 'fnatic'
          }).exec(next);
        },

        createTeamEnVyUs: function (next) {
          Team.create({
            name: 'EnVyUs',
            slug: 'envyus'
          }).exec(next);
        },

        createMatch: ['createTeamFnatic', 'createTeamEnVyUs', function (next, results) {
          Match.create({
            teamA: results['createTeamFnatic'].id,
            teamB: results['createTeamEnVyUs'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Cluj-Napoca, Romania'
          }).exec(next);
        }],

        createBet: ['createUserTaylor', 'createMatch', function (next, results) {
          Bet.create({
            scoreTeamA: 3,
            scoreTeamB: 0,
            match: results['createMatch'].id,
            user: results['createUserTaylor'].id
          }).exec(next);
        }],

      }, function (err, results) {
        should(err).be.null;

        taylorId = results['createUserTaylor'].id;
        teamFnaticId = results['createTeamFnatic'].id;
        teamEnVyUsId = results['createTeamEnVyUs'].id;
        matchId = results['createMatch'].id;
        betId = results['createBet'].id;

        return done();
      });
    });

    after(function (done) {
      async.auto({
        destroyUserTaylor: function (next) {
          User.destroy(taylorId).exec(next);
        },
        destroyTeamFnatic: function (next) {
          Team.destroy(teamFnaticId).exec(next);
        },
        destroyTeamEnVyUs: function (next) {
          Team.destroy(teamEnVyUsId).exec(next);
        },
        destroyMatch: function (next) {
          Match.destroy(matchId).exec(next);
        },
        destroyBet: function (next) {
          Bet.destroy(betId).exec(next);
        }
      }, done);
    });

    it('should destroy linked bets', function (done) {

      async.auto({

        countBetsBeforeDestruction: function (next) {
          Bet.count().exec(next);
        },

        destroyMatch: ['countBetsBeforeDestruction', function (next) {
          Match.destroy(matchId).exec(next);
        }],

        countBetsAfterDestruction: ['destroyMatch', function (next) {
          Bet.count().exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;
        should(results).not.be.undefined;

        results.should.be.an.array;

        results['countBetsBeforeDestruction'].should.be.a.Number;
        results['countBetsAfterDestruction'].should.be.a.Number;
        (results['countBetsBeforeDestruction'] - results['countBetsAfterDestruction'])
          .should.equal(1);

        return done();
      });
    });

  });

});
