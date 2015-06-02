// Score.js
//
// @description :: A service to manage scores of Bet, User and Group model

module.exports = {

  // computeBets
  // 
  // @description :: Compute each bets score attribute of a single match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or an error occured
  computeBets: function (matchId, cb) {
    var bets = [],
        scoreA = 0,
        scoreB = 0,
        importance = 1.0;

    if(!matchId || !cb)
      throw new Error('Missing param');
    if(!matchId.length || typeof cb !== 'function')
      throw new Error('Invalid param');

    // 1. In parallel,
    //    - Find all bets related to this matchId
    //    - Get this match informations
    // 2. For each bet
    //    1. Compute its score
    //    2. Save it
    async.series([
      function findBetsAndGetMatch(next) {
        async.parallel([
          function findBets(next2) {
            Bet
              .find({ match: matchId }, { fields: ['id', 'scoreTeamA', 'scoreTeamB', 'score'] })
              .limit(0)
              .exec(function (err, instances) {
                if(err)
                  return next2(err);

                if(!instances)
                  return next2('Error trying to find bets with matchId "' + matchId + '"');

                bets = instances;

                return next2();
            });
          },
          function getMatch(next2) {
            Match
              .findOne(matchId, { fields: ['importance', 'scoreTeamA', 'scoreTeamB'] })
              .exec(function (err, instance) {
                if(err)
                  return next2(err);

                if(!instance)
                  return next2('Error trying to find match "' + matchId + '"');

                importance = instance.importance;
                scoreA = instance.scoreTeamA;
                scoreB = instance.scoreTeamB;

                return next2();
            });
          }
        ], function (err) {
          return next((err)? err: null);
        });
      },
      function updateEachBet(next) {
        var score = 0;

        async.each(bets, function (bet, nextBet) {
          score = 0;

          async.waterfall([
            function computeBetScore(next2) {
              // ToDo
              score = 10;

              return next2();
            },
            function updateBet(score, next2) {
              bet.score = score;

              bet
                .save()
                .exec(function (err, instance) {
                  if(err)
                    return next2(err);

                  if(!instance)
                    return next2('Error trying to update bet "' + bet.id + '" with score "' + score + '"');
              
                  return next2();
              });
            }
          ], function (err) {
            return nextBet((err)? err: null);
          });
        }, next);
      }
    ], function (err) {
      return cb((err)? err: null);
    });
  },

  // computeUser
  // 
  // @description :: Compute a user score attribute from his bets
  // @param       :: userId (required): the user concerned
  //                 cb (required): the function called when it's done or an error occured
  computeUser: function (userId, cb) {
    var bets = [],
        user = {};

    if(!userId || !cb)
      throw new Error('Missing param');
    if(!userId.length || typeof cb !== 'function')
      throw new Error('Invalid param');

    // 1. In parallel,
    //    - Find all bets related to this userId
    //    - Get this user informations (to check he exists)
    // 2. Sum his bets' scores
    // 3. Save it
    async.waterfall([
      function findBetsAndGetUser(next) {
        async.parallel([
          function findBets(next2) {
            Bet
              .find({ user: userId }, { fields: ['score'] })
              .limit(0)
              .exec(function (err, instances) {
                if(err)
                  return next2(err);

                if(!instances)
                  return next2('Error trying to find bets with userId "' + userId + '"');

                bets = instances;

                return next2();
            });
          },
          function getUser(next2) {
            User
              .findOne(userId, { fields: ['id', 'score'] })
              .exec(function (err, instance) {
                if(err)
                  return next2(err);

                if(!instance)
                  return next2('Error trying to find user "' + userId + '"');

                user = instance;

                return next2();
            });
          }
        ], function (err) {
          return next((err)? err: null);
        });
      },
      function sumBetsScores(next) {
        var score = _.sum(_.pluck(bets, 'score'));

        return next(null, score);
      },
      function updateUser(score, next) {
        user.score = score;

        user
          .save()
          .exec(function (err, instance) {
            if(err)
              return next(err);

            if(!instance)
              return next('Error trying to update user "' + userId + '" with score "' + score + '"');
        
            return next();
        });
      }
    ], function (err) {
      return cb((err)? err: null);
    });
  },

  // computeGroup
  // 
  // @description :: Compute a group score attribute from its users score
  // @param       :: groupId (required): the group concerned
  //                 cb (required): the function called when it's done or an error occured
  computeGroup: function (groupId, cb) {
    var users = [],
        group = {};

    if(!groupId || !cb)
      throw new Error('Missing param');
    if(!groupId.length || typeof cb !== 'function')
      throw new Error('Invalid param');

    // 1. In parallel,
    //    - Find all users related to this groupId
    //    - Get this group informations (to check it exists)
    // 2. Sum the users' scores
    // 3. Save it
    async.waterfall([
      function findUsersAndGetGroup(next) {
        async.parallel([
          function findUsers(next2) {
            Membership
              .find({ group: groupId }, { fields: ['id'] })
              .populate('user')
              .limit(0)
              .exec(function (err, instances) {
                if(err)
                  return next2(err);

                if(!instances)
                  return next2('Error trying to find memberships with groupId "' + groupId + '"');

                users = _.pluck(instances, 'user');

                return next2();
            });
          },
          function getGroup(next2) {
            Group
              .findOne(groupId, { fields: ['id', 'score'] })
              .exec(function (err, instance) {
                if(err)
                  return next2(err);

                if(!instance)
                  return next2('Error trying to find gruop "' + gruopId + '"');

                group = instance;

                return next2();
            });
          }
        ], function (err) {
          return next((err)? err: null);
        });
      },
      function sumUsersScores(next) {
        var score = _.sum(_.pluck(users, 'score'));

        return next(null, score);
      },
      function updateGroup(score, next) {
        group.score = score;

        group
          .save()
          .exec(function (err, instance) {
            if(err)
              return next(err);

            if(!instance)
              return next('Error trying to update group "' + groupId + '" with score "' + score + '"');
        
            return next();
        });
      }
    ], function (err) {
      return cb((err)? err: null);
    });
  }

};
