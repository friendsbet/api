
/* global Team, Match, Bet, User, Notification, Membership, Group */

// Data instance
function getAnInstance(Model, id, cb) {
  Model
    .findOne(id)
    .populateAll()
    .exec(cb);
}

module.exports.getATeam = function (id, cb) {
  getAnInstance(Team, id, cb);
};

module.exports.getAMatch = function (id, cb) {
  getAnInstance(Match, id, cb);
};

module.exports.getABet = function (id, cb) {
  getAnInstance(Bet, id, cb);
};

module.exports.getAUser = function (id, cb) {
  getAnInstance(User, id, cb);
};

module.exports.getANotification = function (id, cb) {
  getAnInstance(Notification, id, cb);
};

module.exports.getAMembership = function (id, cb) {
  getAnInstance(Membership, id, cb);
};

module.exports.getAGroup = function (id, cb) {
  getAnInstance(Group, id, cb);
};

// Data list
function getAllInstances(Model, cb) {
  Model
    .find()
    .limit(0)
    .populateAll()
    .exec(cb);
}

module.exports.getAllTeams = function (cb) {
  getAllInstances(Team, cb);
};

module.exports.getAllMatches = function (cb) {
  getAllInstances(Match, cb);
};

module.exports.getAllUsers = function (cb) {
  getAllInstances(User, cb);
};

module.exports.getAllGroups = function (cb) {
  getAllInstances(Group, cb);
};
