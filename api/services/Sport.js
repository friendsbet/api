// Sport.js
//
// @description :: The sport service allows you to 
//                 simplify basic functionalities concerning
//                 the sport

var CurrentSport;

// ToDo
module.exports.initCurrentSport = function () {
  CurrentSport = require('./sports/' + sails.config.FriendsBet.currentSport);

  if(!CurrentSport) {
    CurrentSport = null;

    throw new Error(
      'This sport ('
      + sails.config.FriendsBet.currentSport
      + ') isn\'t implemented at the moment'
    );
  }
};

// Check if this score is possible
//
// @param score integer
// @return boolean isScorePossible
module.exports.checkTeamScore = function (score) {
  if(!CurrentSport) {
    throw new Error('Please init the sport before using this method (`initCurrentSport()`)');
  }

  return CurrentSport.checkTeamScore(score);
};