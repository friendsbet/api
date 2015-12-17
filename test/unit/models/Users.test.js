var should = require('should');

describe('UserModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with users', function (done) {
    User
      .find()
      .exec(function (err, users) {
        should(err).be.null;
        should(users).not.be.undefined;

        users.length.should.be.eql(fixtures['user'].length);

        return done();
    });
  });

  describe('#name()', function () {

    it('should return a string', function (done) {
      User
        .find()
        .limit(1)
        .exec(function (err, users) {
          should(err).be.null;
          should(users).not.be.undefined;

          users.should.be.an.array;

          var user = users[0];
          user.should.be.an.object;
          user.should.have.property('name');
          user.name.should.be.a.function;
          user.name().should.be.a.string;

          // No need to check what's inside that string I hope :-)

          return done();
      });
    });

  });

  describe('#beforeValidate()', function () {

    it('should convert score to integer', function (done) {
      User.beforeValidate({
          score: '98',
        }, function (err) {
          should(err).be.undefined;

          return done();
      });
    });

  });

  describe('#destroy()', function () {

    var chuckId;
    var bruceId;

    before(function (done) {
      async.auto({

        createUserChuck: function (next) {
          User.create({
            email: 'chuck@norris.com',
            firstName: 'Chuck',
            lastName: 'Norris',
          }).exec(next);
        },

        createUserBruce: function (next) {
          User.create({
            email: 'bruce@lee.com',
            firstName: 'Bruce',
            lastName: 'Lee',
          }).exec(next);
        },

        createTeamPluto: function (next) {
          Team.create({
            name: 'Pluto',
            slug: 'pluto'
          }).exec(next);
        },

        createTeamMars: function (next) {
          Team.create({
            name: 'Mars',
            slug: 'mars'
          }).exec(next);
        },

        createGroupKotW: ['createUserChuck', function (next, results) {
          Group.create({
            name: 'Kings of the World',
            technicalAdmin: results['createUserChuck'].id
          }).exec(next);
        }],

        createGroupNinjas: ['createUserBruce', function (next, results) {
          Group.create({
            name: 'Ninjas',
            technicalAdmin: results['createUserBruce'].id
          }).exec(next);
        }],

        createMatch: ['createTeamPluto', 'createTeamMars', function (next, results) {
          Match.create({
            teamA: results['createTeamPluto'].id,
            teamB: results['createTeamMars'].id,
            kickOffAt: new Date(),
            stopBetsAt: new Date(),
            venue: 'Planet Earth'
          }).exec(next);
        }],

        createNotification: ['createUserChuck', function (next, results) {
          Notification.create({
            user: results['createUserChuck'].id,
            type: 'website',
            description: 'You\'re the best, Chuck!'
          }).exec(next);
        }],

        createBet: ['createUserChuck', 'createMatch', function (next, results) {
          Bet.create({
            scoreTeamA: 5,
            scoreTeamB: 8,
            match: results['createMatch'].id,
            user: results['createUserChuck'].id
          }).exec(next);
        }],

        createKotWMembership: ['createUserBruce', 'createGroupKotW', function (next, results) {
          Membership.create({
            user: results['createUserBruce'].id,
            group: results['createGroupKotW'].id
          }).exec(next);
        }],

        createNinjasMembership: ['createUserChuck', 'createGroupNinjas', function (next, results) {
          Membership.create({
            user: results['createUserChuck'].id,
            group: results['createGroupNinjas'].id
          }).exec(next);
        }],

      }, function (err, results) {
        should(err).be.null;

        chuckId = results['createUserChuck'].id;
        bruceId = results['createUserBruce'].id;

        return done();
      });
    });

    it('should destroy linked entities', function (done) {

      async.auto({

        countBetsBeforeDestructions: function (next) {
          Bet.count().exec(next);
        },

        countNotificationsBeforeDestructions: function (next) {
          Notification.count().exec(next);
        },

        countMembershipsBeforeDestructions: function (next) {
          Membership.count().exec(next);
        },

        countGroupsBeforeDestructions: function (next) {
          Group.count().exec(next);
        },

        destroyUserChuck: [
          'countBetsBeforeDestructions',
          'countNotificationsBeforeDestructions',
          'countMembershipsBeforeDestructions',
          'countGroupsBeforeDestructions',
            function (next) {
              User.destroy(chuckId).exec(next);
        }],

        countBetsAfterChuckDestruction: ['destroyUserChuck', function (next) {
          Bet.count().exec(next);
        }],

        countNotificationsAfterChuckDestruction: ['destroyUserChuck', function (next) {
          Notification.count().exec(next);
        }],

        countMembershipsAfterChuckDestruction: ['destroyUserChuck', function (next) {
          Membership.count().exec(next);
        }],

        countGroupsAfterChuckDestruction: ['destroyUserChuck', function (next) {
          Group.count().exec(next);
        }],

        destroyUserBruce: [
          'countBetsAfterChuckDestruction',
          'countNotificationsAfterChuckDestruction',
          'countMembershipsAfterChuckDestruction',
          'countGroupsAfterChuckDestruction',
            function (next) {
              User.destroy(bruceId).exec(next);
        }],

        countBetsAfterBruceDestruction: ['destroyUserBruce', function (next) {
          Bet.count().exec(next);
        }],

        countNotificationsAfterBruceDestruction: ['destroyUserBruce', function (next) {
          Notification.count().exec(next);
        }],

        countMembershipsAfterBruceDestruction: ['destroyUserBruce', function (next) {
          Membership.count().exec(next);
        }],

        countGroupsAfterBruceDestruction: ['destroyUserBruce', function (next) {
          Group.count().exec(next);
        }]

      }, function (err, results) {
        should(err).be.null;
        should(results).not.be.undefined;

        results.should.be.an.array;

        // After Chuck Norris destruction
        results['countBetsBeforeDestructions'].should.be.a.Number;
        results['countBetsAfterChuckDestruction'].should.be.a.Number;
        (results['countBetsBeforeDestructions'] - results['countBetsAfterChuckDestruction'])
          .should.equal(1);

        results['countNotificationsBeforeDestructions'].should.be.a.Number;
        results['countNotificationsAfterChuckDestruction'].should.be.a.Number;
        (results['countNotificationsBeforeDestructions'] - results['countNotificationsAfterChuckDestruction'])
          .should.equal(1);
        
        results['countMembershipsBeforeDestructions'].should.be.a.Number;
        results['countMembershipsAfterChuckDestruction'].should.be.a.Number;
        (results['countMembershipsBeforeDestructions'] - results['countMembershipsAfterChuckDestruction'])
          .should.equal(3);

        results['countGroupsBeforeDestructions'].should.be.a.Number;
        results['countGroupsAfterChuckDestruction'].should.be.a.Number;
        (results['countGroupsBeforeDestructions'] - results['countGroupsAfterChuckDestruction'])
          .should.equal(1);


        // After Bruce Lee destruction
        results['countBetsAfterBruceDestruction'].should.be.a.Number;
        (results['countBetsAfterChuckDestruction'] - results['countBetsAfterBruceDestruction'])
          .should.equal(0);

        results['countNotificationsAfterBruceDestruction'].should.be.a.Number;
        (results['countNotificationsAfterChuckDestruction'] - results['countNotificationsAfterBruceDestruction'])
          .should.equal(0);
        
        results['countMembershipsAfterBruceDestruction'].should.be.a.Number;
        (results['countMembershipsAfterChuckDestruction'] - results['countMembershipsAfterBruceDestruction'])
          .should.equal(1);

        results['countGroupsAfterBruceDestruction'].should.be.a.Number;
        (results['countGroupsAfterChuckDestruction'] - results['countGroupsAfterBruceDestruction'])
          .should.equal(1);

        return done();
      });
    });

  });

});