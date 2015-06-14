// Score.js
//
// @description :: A service to manage scores of Bet, User and Group models

// getMatch
// 
// @description :: Get a match from its id
// @param       :: matchId (required): the match's id concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getMatch(matchId, cb, checkExistence) {
  Match
    .findOne(matchId)
    .exec(function (err, match) {
      if(err) {
        return cb(err);
      }

      if(checkExistence && !match) {
        return cb(new Error('No match for id "' + matchId + '"'));
      }

      return cb(null, match);
  });
}

// getUser
// 
// @description :: Get a user from its id
// @param       :: userId (required): the user's id concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getUser(userId, cb, checkExistence) {
  User
    .findOne(userId)
    .exec(function (err, user) {
      if(err) {
        return cb(err);
      }
      
      if(checkExistence && !user) {
        return cb(new Error('No user for id "' + userId + '"'));
      }

      return cb(null, user);
  });
}


// getGroups
// 
// @description :: Get all the groups from a list of ids
// @param       :: groupsIds (required): the groups' ids concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getGroups(groupsIds, cb, checkExistence) {
  Group
    .find(groupsIds)
    .limit(0)
    .exec(function (err, groups) {
      if(err) {
        return cb(err);
      }
      
      if(checkExistence && !groups) {
        return cb(new Error('No groups for ids "' + groupsIds + '"'));
      }

      return cb(null, groups);
  });
}



// getBetsFromMatch
// 
// @description :: Find all the bets of a single match
// @param       :: matchId (required): the match concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getBetsFromMatch(matchId, cb, checkExistence) {
  Bet
    .find({ match: matchId })
    .populate('user')
    .limit(0)
    .exec(function (err, bets) {
      if(err) {
        return cb(err);
      }
      
      if(checkExistence && !bets) {
        return cb(new Error('No bets for match "' + matchId + '"'));
      }

      return cb(null, bets);
  });
}



// getUserGroups
// 
// @description :: Find all the groups of a single user
// @param       :: userId (required): the user concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getUserGroups(userId, cb, checkExistence) {
  Membership
    .find({ user: userId })
    .populate('group')
    .limit(0)
    .exec(function (err, memberships) {
      if(err) {
        return cb(err);
      }

      if(checkExistence && !memberships) {
        return cb(new Error('No membership found for user "' + userId + '"'));
      }
      
      getGroups(_.pluck(_.pluck(memberships, 'group'), 'id'), cb);
  });
}


// updateBetScore
// 
// @description :: Update a bet's score attribute in db
// @param       :: match (required): the match to update
//                 bet (required): the single bet concerned
//                 cb (required): the function called when it's done or an
//                 error occured
function updateBetScore(match, bet, cb) {
  var score = 0;

  var goodWinner =
    (match.scoreTeamA >= match.scoreTeamB &&
    bet.scoreTeamA >= bet.scoreTeamB) ||
    (match.scoreTeamA < match.scoreTeamB &&
    bet.scoreTeamA < match.scoreTeamB);

  if(goodWinner) {
    score += 100;
  }

  var teams = ['A', 'B'];
  var perfectScore = 0;
  _.each(teams, function (team) {
    perfectScore = (match['scoreTeam' + team] === bet['scoreTeam' + team]);
    
    if(perfectScore === 1) {
      score += 50;
    } else if (perfectScore === 2) {
      score += 25;
    } else if (perfectScore === 3) {
      score += 10;
    }
  });

  var scoreDifference =
    (bet.scoreTeamA / bet.scoreTeamB) -
    (match.scoreTeamA / match.scoreTeamB); 

  score *= match.importance;
  score = intval(score); // ?

  bet.score = match.importance; // ToDo

  bet.save(cb);
}


// increaseUserScore
// 
// @description :: Update a user's score attribute in db
// @param       :: user (required): the user to update
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function increaseUserScore(user, betScore, cb) {
  user.score += betScore;

  user.save(cb);
}

// increaseGroupsScore
// 
// @description :: Update a group's score attribute in db
// @param       :: group (required): the group to update
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function increaseGroupsScore(group, betScore, cb) {
  group.score += betScore;

  group.save(cb);
}



// updateUserScoreFromBet
// 
// @description :: Increment a user's score attribute
// @param       :: userId (required): the user concerned
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function updateUserScoreFromBet(userId, betScore, cb) {
  getUser(userId, function (err, user) {
    if(err) {
      return cb(err);
    }

    increaseUserScore(user, betScore, cb);
  });
}



// updateGroupsScores
// 
// @description :: Increment each groups score attribute
// @param       :: groups (required): the list of groups to update
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function updateGroupsScores(groups, betScore, cb) {
  async.each(groups, function (group, next) {
    increaseGroupsScore(group, betScore, next);
  }, cb);
}


// updateGroupsScoresFromBet
// 
// @description :: Update each groups scores attributes from a user
// @param       :: userId (required): the user concerned
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function updateGroupsScoresFromBet(userId, betScore, cb) {
  getUserGroups(userId, function (err, groups) {
    if(err) {
      return cb(err);
    }

    updateGroupsScores(groups, betScore, cb);
  });
}




// updateUsersAndGroupsScoresFromBet
// 
// @description :: Update the scores attributes from a bet
// @param       :: bet (required): a single bet
//                 cb (required): the function called when it's done or an
//                 error occured
function updateUsersAndGroupsScoresFromBet(bet, cb) {
  async.parallel([
    function (next) {
      updateUserScoreFromBet(bet.user.id, bet.score, next);
    },
    function (next) {
      updateGroupsScoresFromBet(bet.user.id, bet.score, next);
    },
  ], cb);
}

// updateScores
// 
// @description :: Update all the scores attributes
// @param       :: match (required): the match concerned
//                 bets (required): the list of bets to update
//                 cb (required): the function called when it's done or an
//                 error occured
function updateScores(match, bets, cb) {
  async.each(bets, function (bet, next) {
    updateBetScore(match, bet, function (err, newBet) {
      if(err || !newBet) {
        return next(err);
      }

      updateUsersAndGroupsScoresFromBet(newBet, next);
    });
  }, cb);
}

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
      return cb(new Error('Missing param'));
    }

    if(typeof cb !== 'function') {
      return cb(new Error('Invalid param'));
    }

    // 1. Get the match informations
    // 2. Get the bets concerned
    // 3. Update each of them
    // 4. Update users' scores
    // 5. Update users' groups' scores
    async.waterfall([
      function (next) {
        getMatch(matchId, next);
      },
      function (match, next) {
        getBetsFromMatch(matchId, function (err, bets) {
          return next(err, match, bets);
        });
      },
      function (match, bets, next) {
        updateScores(match, bets, next);
      }
    ], cb);
  }

};
