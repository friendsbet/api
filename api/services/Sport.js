// Sport.js
//
// @description :: The sport service allows you to 
//                 simplify basic functionalities concerning
//                 the sport

var CurrentSport = require('./sports/' + sails.config.currentSport);

if(!CurrentSport) {
  throw new Error(
    'This sport ('
    + sails.config.currentSport
    + ') isn\'t implemented for the moment'
  );
}

// Check if this score is possible
//
// @param score integer
// @return boolean isScorePossible
module.exports.checkTeamScore = function (score) {
  return CurrentSport.checkTeamScore(score);
};