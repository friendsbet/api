// Sport.js
//
// @description :: The sport service allows you to 
//                 simplify basic functionalities concerning
//                 the sport

var CurrentSport;

// Initialize the sport with
module.exports.initCurrentSport = function (sport) {
  CurrentSport = require('./sports/' + sport);

  if(!CurrentSport) {
    CurrentSport = null;

    throw new Error(
      'This sport ('
      + sport
      + ') isn\'t implemented at the moment'
    );
  }
  
  console.log('friendsbet: Set the current sport to ' + sport);
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