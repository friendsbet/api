// Score.js
//
// @description :: A service to manage scores of Bet, User and Group models

module.exports = {

  // computeAllScoresFromMatch
  // 
  // @description :: Compute all scores attributes after the end of a match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeAllScoresFromMatch: function (matchId, cb) {
    // Check params
    if(!matchId || !cb) {
      throw new Error('Missing param');
    }

    if(typeof cb !== 'function') {
      throw new Error('Invalid param');
    }

    // 1. Get the match informations
    // 2. Get the bets concerned
    // 3. Update each of them
    // 4. Update users' scores
    // 5. Update users' groups' scores
    async.series([

    ], cb);
  }

};
