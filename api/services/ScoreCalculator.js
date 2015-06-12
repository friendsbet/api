// Score.js
//
// @description :: A service to manage scores of Bet, User and Group models

function getMatch(matchId, cb) {
  Match
    .findOne(matchId)
    .exec(cb);
}

function getUser(userId, cb) {
  User
    .findOne(userId)
    .exec(cb);
}


function getGroups(groupsIds, cb) {
  Group
    .find(groupsIds)
    .limit(0)
    .exec(cb);
}



function getBetsFromMatch(matchId, cb) {
  Bet
    .find({ match: matchId })
    .populate('user')
    .limit(0)
    .exec(function (err, bets) {
      return cb(err, bets);
  });
}



function getUserGroups(userId, cb) {
  Membership
    .find({ user: userId })
    .populate('group')
    .limit(0)
    .exec(function (err, memberships) {
      if(err || !memberships) {
        return cb(err);
      }
      
      getGroups(_.pluck(_.pluck(memberships, 'group'), 'id'), cb);
  });
}



function updateBetScore(match, bet, cb) {
  bet.score = match.importance; // ToDo

  bet.save(cb);
}



function increaseUserScore(user, betScore, cb) {
  user.score += betScore;

  user.save(cb);
}

function increaseGroupsScore(group, betScore, cb) {
  group.score += betScore;

  group.save(cb);
}



function updateUserScoreFromBet(userId, betScore, cb) {
  getUser(userId, function (err, user) {
    if(err || !user) {
      return cb(err);
    }

    increaseUserScore(user, betScore, cb);
  });
}



function updateGroupsScores(groups, betScore, cb) {
  async.each(groups, function (group, next) {
    increaseGroupsScore(group, betScore, cb);
  }, cb);
}


function updateGroupsScoresFromBet(userId, betScore, cb) {
  getUserGroups(userId, function (err, groups) {
    if(err) {
      return cb(err);
    }

    updateGroupsScores(groups, betScore, cb);
  })
}



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

function updateScores(match, bets) {
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
    async.waterfall([
      function (next) {
        getMatch(matchId, function (err, match) {
          return next(err, match);
        });
      },
      function (match, next) {
        getBetsFromMatch(matchId, function (err, bets) {
          return next(err, match, bets);
        });
      },
      function (match, bets, next) {
        updateScores(match, bets, function (err) {
          return next(err);
        });
      }
    ], cb);
  }

};
