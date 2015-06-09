// Score.js
//
// @description :: A service to manage scores of Bet, User and Group models

function checkParams(params) {
  var invalidParam = false;

  _.each(params, function (param) {
    if(!param.value) {
      throw new Error('Missing param');
    }

    switch(param.type) {
      case 'string':
      case 'function':
        if(typeof param.value !== param.type) {
          invalidParam = true;
        }
      case 'array':
        if(param.value.constructor !== Array) {
          invalidParam = true;
        }
      default:
        throw new Error('Not implemented yet');
    }

    if(invalidParam) {
      throw new Error(
        'Invalid param "'
        + param.value +
        '". It\'s supposed to be a "'
        + param.type
        + '"'
      );
    }
  });
}

module.exports = {

  // computeBet
  // 
  // @description :: Compute the bet score attribute from a its id
  // @param       :: betId (required): the bet concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeBet: function (betId, cb) {
    // Check the params
    checkParams([
      {
        value: betId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    // 1. Find the bet details
    // 2. Compute the score
    // 3. Update the score
    async.waterfall([
      function getBet(next) {
        Bet
          .findOne(betId)
          .populate('match')
          .exec(function (err, instance) {
            if(err) {
              return next(err);
            }

            if(!instance) {
              return next(
                new Error(
                  'Error trying to find bet with betId "'
                  + betId
                  + '"'
                )
              );
            }

            return next(null, instance);
        });
      },
      function computeBetScore(bet, next) {
        // bet.match.importance
        // bet.match.scoreTeamA
        // bet.match.scoreTeamB
        // bet.scoreTeamA
        // bet.scoreTeamB
        bet.score = 0; // ToDo

        return next(null, bet);
      },
      function updateBet(bet, next) {
        bet
          .save()
          .exec(function (err, newInstance) {
            if(err) {
              return next(err);
            }

            if(!newInstance) {
              return next(
                new Error(
                  'Error trying to update bet with betId "'
                  + betId
                  + '"'
                )
              );
            }
        });
      }
    ], cb);
  },

  // computeUser
  // 
  // @description :: Compute a user score attribute from his bets
  // @param       :: userId (required): the user concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeUser: function (userId, cb) {
    var bets = [],
        user = {};

    // Check params
    checkParams([
      {
        value: userId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

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
                if(err) {
                  return next2(err);
                }

                if(!instances) {
                  return next2(
                    new Error(
                      'Error trying to find bets with userId "'
                      + userId
                      + '"'
                    )
                  );
                }

                bets = instances;

                return next2();
            });
          },
          function getUser(next2) {
            User
              .findOne(userId, { fields: ['id', 'score'] })
              .exec(function (err, instance) {
                if(err) {
                  return next2(err);
                }

                if(!instance) {
                  return next2(
                    new Error(
                      'Error trying to find user "'
                      + userId
                      + '"'
                    )
                  );
                }

                user = instance;

                return next2();
            });
          }
        ], next);
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
            if(err) {
              return next(err);
            }

            if(!instance) {
              return next(
                new Error(
                  'Error trying to update user "'
                  + userId
                  + '" with score "'
                  + score
                  + '"'
                )
              );
            }
        
            return next();
        });
      }
    ], cb);
  },

  // computeGroup
  // 
  // @description :: Compute a group score attribute from its users score
  // @param       :: groupId (required): the group concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeGroup: function (groupId, cb) {
    var users = [],
        group = {};

    // Check params
    checkParams([
      {
        value: groupId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

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
                if(err) {
                  return next2(err);
                }

                if(!instances) {
                  return next2(
                    new Error(
                      'Error trying to find memberships with groupId "'
                      + groupId
                      + '"'
                    )
                  );
                }

                users = _.pluck(instances, 'user');

                return next2();
            });
          },
          function getGroup(next2) {
            Group
              .findOne(groupId, { fields: ['id', 'score'] })
              .exec(function (err, instance) {
                if(err) {
                  return next2(err);
                }

                // Group not found
                // Is that an error?
                if(!instance) {
                  return next2(
                    new Error(
                      'Error trying to find group "'
                      + groupId
                      + '"'
                    )
                  );
                }

                group = instance;

                return next2();
            });
          }
        ], next);
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
            if(err) {
              return next(err);
            }

            if(!instance) {
              return next(
                new Error(
                  'Error trying to update group "'
                  + groupId
                  + '" with score "'
                  + score
                  + '"'
                )
              );
            }
        
            return next();
        });
      }
    ], cb);
  },

  // computeBets
  // 
  // @description :: Compute each bets score attribute from a list of bets
  // @param       :: betsIds (required): the bets concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeBets: function (betsIds, cb) {
    // Check the params
    checkParams([
      {
        value: betsIds,
        type: 'array'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    // Compute each bet
    async.each(betsIds, function (betId, next) {
      this.computeBet(betId, next);
    });
  },

  // computeUsers
  // 
  // @description :: Compute a list of users' score attribute from its bets
  // @param       :: usersIds (required): the users concerned
  //                 cb (required): the function called when it's done or
  //                 an error occured
  computeUsers: function (usersIds, cb) {
    // Check params
    checkParams([
      {
        value: usersIds,
        type: 'array'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    // Compute each user score
    async.each(usersIds, function (userId, next) {
      this.computeUser(userId, next);
    }, cb);
  },

  // computeGroups
  // 
  // @description :: Compute a list of groups' score attribute from its users'
  //                 scores attributes
  // @param       :: groupsIds (required): the groups concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeGroups: function (groupsIds, cb) {
    // Check params
    checkParams([
      {
        value: groupsIds,
        type: 'array'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    // Compte each group score
    async.each(groupsIds, function (groupId, next) {
      this.computeGroup(groupId, next);
    }, cb);
  },

  // computeBetsFromMatch
  // 
  // @description :: Compute each bets score attribute of a single match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  computeBetsFromMatch: function (matchId, cb) {
    checkParams([
      {
        value: matchId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    // Find all bets related to this matchId
    Bet
      .find({ match: matchId }, { fields: ['id'] })
      .exec(function (err, instances) {
        if(err) {
          return cb(err);
        }

        if(!instances) {
          return next(
            new Error(
              'Error trying to find bets with matchId "'
              + matchId
              + '"'
            )
          );
        }

        var bets = _.pluck(instances, 'id');

        // Then compute all the bets
        this.computeBets(bets, cb);
    });
  },

  // computeUsersFromMatch
  // 
  // @description :: Compute a list of users' score attribute from a match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or
  //                 an error occured
  computeUsersFromMatch: function (matchId, cb) {
    // Check params
    checkParams([
      {
        value: matchId,
        type: 'array'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    throw new Error('ToDo');
  },

  // computeGroupsFromUser
  // 
  // @description :: Compute a list of groups' score attribute from a user
  // @param       :: userId (required): the user concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  function computeGroupsFromUser: function (userId, cb) {
    // Check params
    checkParams([
      {
        value: userId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    Membership
      .find({ user: userId }, { fields: ['group'] })
      .populate('group')
      .limit(0)
      .exec(function (err, instances) {
        if(err) {
          return cb(err);
        }

        if(!instances) {
          return cb(
            new Error(
              'Error trying to find user "'
              + userId
              + '"\'s groups'
            );
          );
        }

        var groupsIds = _.pluck(_.pluck(instances, 'group'), 'id');

        this.computeGroups(groupsIds);
    });
  }

  // computeGroupsFromMatch
  // 
  // @description :: Compute a list of groups' score attribute from a match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
  function computeGroupsFromMatch: function (matchId, cb) {
    // Check params
    checkParams([
      {
        value: matchId,
        type: 'string'
      },
      {
        value: cb,
        type: 'function'
      }
    ]);

    throw new Error('ToDo');
  }

};
