// Rugby.js
//
// @description :: The Rugby Service

// Check if this Rugby score is possible
//
// See
//  http://stackoverflow.com/questions/3464820/sum-of-numbers-making-a-sequence
//  for more informations about the Frobenius coin problem
//
// @param score integer
// @return boolean isScorePossible
module.exports.checkTeamScore = function (score) {
  return score > 4 || score === 0 || score === 3;
};
