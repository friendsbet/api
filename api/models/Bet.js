// Bet.js
//
// @description :: A Bet is done by a User for a Game.
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

    // The Game concerned
    // It's a reference to the Game object
    game: {
      model: 'game',
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

  }
};

