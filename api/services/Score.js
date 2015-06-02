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
  }

};
