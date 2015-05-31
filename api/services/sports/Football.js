// Football.js
//
// @description :: The Football Service

// Check if this Football score is possible
//
// @param score integer
// @return boolean isScorePossible
module.exports.checkTeamScore = function (score) {
  return score > -1;
}