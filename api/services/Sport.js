// Sport.js
//
// @description :: The sport service allows you to 
//                 simplify basic functionalities concerning
//                 the sport

var CurrentSport;

// Set the current sport if it exists
//
// @param sport string
module.exports.initCurrentSport = function (sport) {
  try {
    CurrentSport = require('./sports/' + sport);
    console.log('friendsbet: Set the current sport to ' + sport);
  } catch (err) {
    CurrentSport = null;
    throw new Error(
      'This sport ('
      + sport
      + ') isn\'t implemented at the moment. '
      + 'Please change the name of the current sport '
      + 'in the `config/friendsbet.js` file'
    );
  }
  
  
};

// Check if this score is possible
//
// @param score integer
// @return boolean isScorePossible
module.exports.checkTeamScore = function (score) {
  if(!CurrentSport) {
    console.log('coucou');
    throw new Error('Please init the sport before using this method (`initCurrentSport()`)');
  }

  return CurrentSport.checkTeamScore(score);
};