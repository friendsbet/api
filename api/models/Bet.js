// Bet.js
//
// @description :: A Bet is done by a User for a Match.
//                 It requires a score (a number) for each team.
// @docs        :: http://sailsjs.org/#!documentation/models

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

    // The points earned with this bet
    // e.g 157
    score: {
      type: 'integer',
      defaultsTo: 0
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
      if(!Sport.checkTeamScore(values['scoreTeam' + teamKey])) {
        err.push(
          new Error('Team ' + teamKey + ' score ('
            + values['scoreTeam'+ teamKey]
            + ') is not a valid rugby score.'));
      }
      
      return;
    });

    return cb((err.length)? err: null);
  }

};
