// Friends Bet global settings
//
// Configuration of this instance of Friends Bet

/* global sails */

module.exports.FriendsBet = {

  // What sport is currently in use?
  currentSport: 'Football',

  // The Friends Bet log method
  log: function (str) {
    sails.log.info('[FriendsBet] ' + str);
  },

  // Points given per bet
  score: {
    betWinnerIsMatchWinner: 100,
    maximumPerTeamScoreDifference: 50
  }

};