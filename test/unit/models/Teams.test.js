var should = require('should');

describe('TeamModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with teams', function (done) {
    Team
      .find()
      .exec(function (err, teams) {
        should(err).be.null;
        should(teams).not.be.undefined;

        teams.length.should.be.eql(fixtures['team'].length);

        return done();
    });
  });

  describe('#destroy()', function () {

    var teamAId;
    var teamBId;
    var teamCId;
    var firstMatchId;
    var secondMatchId;

    before(function (done) {
      async.auto({

        createTeamA: function (next) {
          Team.create({
            name: 'Team A',
            slug: 'team-a'
          }).exec(next);
        },

        createTeamB: function (next) {
          Team.create({
            name: 'Team B',
            slug: 'team-b'
          }).exec(next);
        },

        createTeamC: function (next) {
          Team.create({
            name: 'Team C',
            slug: 'team-c'
          }).exec(next);
        },

        createFirstMatch: ['createTeamA', 'createTeamB', function (next, results) {
          Match.create({
            teamA: results['createTeamA'].id,
            teamB: results['createTeamB'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Nantes, France'
          }).exec(next);
        }],

        createSecondMatch: ['createTeamA', 'createTeamC', function (next, results) {
          Match.create({
            teamA: results['createTeamC'].id,
            teamB: results['createTeamA'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Brest, France'
          }).exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;

        teamAId = results['createTeamA'].id;
        teamBId = results['createTeamB'].id;
        teamCId = results['createTeamC'].id;
        firstMatchId = results['createFirstMatch'].id;
        secondMatchId = results['createSecondMatch'].id;

        return done();
      });
    });

    after(function (done) {
      async.auto({
        destroyTeamA: function (next) {
          Team.destroy(teamAId).exec(next);
        },
        destroyTeamB: function (next) {
          Team.destroy(teamBId).exec(next);
        },
        destroyTeamC: function (next) {
          Team.destroy(teamCId).exec(next);
        },
        destroyFirstMatch: function (next) {
          Match.destroy(firstMatchId).exec(next);
        },
        destroySecondMatch: function (next) {
          Match.destroy(secondMatchId).exec(next);
        }
      }, done);
    });

    it('should destroy linked matches', function (done) {

      async.auto({

        countMatchesBeforeDestruction: function (next) {
          Match.count().exec(next);
        },

        destroyTeamA: ['countMatchesBeforeDestruction', function (next) {
          Team.destroy(teamAId).exec(next);
        }],

        countMatchesAfterDestruction: ['destroyTeamA', function (next) {
          Match.count().exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;
        should(results).not.be.undefined;

        results.should.be.an.array;
        results['countMatchesBeforeDestruction'].should.be.a.Number;
        results['countMatchesAfterDestruction'].should.be.a.Number;

        numberOfMatchesBeforeDestruction = results['countMatchesBeforeDestruction'];
        numberOfMatchesAfterDestruction = results['countMatchesAfterDestruction'];

        (numberOfMatchesBeforeDestruction - numberOfMatchesAfterDestruction)
          .should.equal(2);

        return done();
      });
    });

  });

});
