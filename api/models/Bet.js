// Bet.js
//
// @description :: A Bet is done by a User for a Match.
//                 It requires a score (a number) for each team.
// @docs        :: http://sailsjs.org/#!documentation/models

// Check if this Rugby score is possible
//
// See http://stackoverflow.com/questions/3464820/sum-of-numbers-making-a-sequence
//  for more informations about the Frobenius coin problem
//
// @param score integer
// @return boolean isScorePossible
function checkRugbyScore(score) {
  return score > 4 || score === 3;
}

// Check if this Football score is possible
//
// @param score integer
// @return boolean isScorePossible
function checkFootballScore(score) {
  return score > -1;
}

// Check if this score is possible
//
// @param score integer
// @return boolean isScorePossible
function checkScore(score) {
  return checkRugbyScore(score);
}

module.exports = {

  schema: true,

  attributes: {

    // The score bet on Team A
    // e.g 15
    scoreTeamA: {
      type: 'int',
      notEmpty: true,
      required: true
    },

    // The score bet on Team B
    // e.g 7
    scoreTeamB: {
      type: 'int',
      notEmpty: true,
      required: true
    },

    // The Match concerned
    // It's a reference to the Match object
    match: {
      model: 'match',
      notEmpty: true,
      required: true
    },

    // The User who's done the Bet
    // It's a reference to the User object
    user: {
      model: 'user',
      notEmpty: true,
      required: true
    }

  },

  // Check both Team scores after validating the values
  afterValidate: function checkTeamScores(values, cb) {
    var err = [];

    _.forEach(['A', 'B'], function checkTeamScore(teamKey) {
      if(!checkScore(values['scoreTeam' + teamKey]))
        err.push({ msg: 'Team ' + teamKey + ' score (' + values['scoreTeam' + teamKey] + ') is not a valid rugby score.', });
      
      return;
    });

    return cb((err.length)? err: null);
  }

};

