// Data instance
module.exports.getATeam = function (id, cb) {
  Team
    .findOne(id)
    .populateAll()
    .exec(cb);
};

module.exports.getAMatch = function (id, cb) {
  Match
    .findOne(id)
    .populateAll()
    .exec(cb);
};

module.exports.getABet = function (id, cb) {
  Bet
    .findOne(id)
    .populateAll()
    .exec(cb);
};

module.exports.getAUser = function (id, cb) {
  User
    .findOne(id)
    .populateAll()
    .exec(cb);
};

module.exports.getAMembership = function (id, cb) {
  Membership
    .findOne(id)
    .populateAll()
    .exec(cb);
};

module.exports.getAGroup = function (id, cb) {
  Group
    .findOne(id)
    .populateAll()
    .exec(cb);
};

// Data list
module.exports.getAllTeams = function (cb) {
  Team
    .find()
    .limit(0)
    .populateAll()
    .exec(cb);
};

module.exports.getAllMatches = function (cb) {
  Match
    .find()
    .limit(0)
    .populateAll()
    .exec(cb);
};

module.exports.getAllUsers = function (cb) {
  User
    .find()
    .limit(0)
    .populateAll()
    .exec(cb);
};

module.exports.getAllGroups = function (cb) {
  Group
    .find()
    .limit(0)
    .populateAll()
    .exec(cb);
};
