// BetController.js
//
// @description :: Server-side logic for managing bets
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {
	
  boFind: function (req, res) {
    Bet
      .find()
      .populate('user')
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        Match
          .find({ id: _.uniq(_.pluck(instances, 'match')) })//, ['id', 'teamA', 'teamB'])
          .populate('teamA')
          .populate('teamB')
          .exec(function (err, matches) {
            if(err) return res.negotiate(err);

            _.forEach(instances, function (bet) {
              bet.match = _.find(matches, function (match) {
                return bet.match === match.id;
              });
            });

            return res.ok({ bets: instances }, 'bets/find');
        });
    });
  },

  boFindOne: function (req, res) {
    var users = [];
    var matches = [];
    var bet = {};

    async.parallel([

      function getUsers(next) {
        User
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);

            users = instances;

            return next();
        });
      },

      function getMatches(next) {
        Match
          .find()
          .limit(0)
          .populate('teamA')
          .populate('teamB')
          .exec(function (err, instances) {
            if(err) return next(err);

            matches = instances;

            return next();
        });
      },

      function getBet(next) {
        Bet
          .findOne(req.param('id'))
          .populate('user')
          .populate('match')
          .exec(function (err, instance) {
            if(err) return next(err);

            bet = instance;

            return next();
        });
      }

    ], function (err) {
      if(err) return res.negotiate(err);

      return res.ok({ users: users, matches: matches, bet: bet }, 'bets/findOne');
    });
  },

  boNew: function (req, res) {
    var users = [];
    var matches = [];

    async.parallel([

      function getUsers(next) {
        User
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);

            users = instances;

            return next();
        });
      },

      function getMatches(next) {
        Match
          .find()
          .limit(0)
          .populate('teamA')
          .populate('teamB')
          .exec(function (err, instances) {
            if(err) return next(err);

            matches = instances;

            return next();
        });
      }

    ], function (err) {
      if(err) return res.negotiate(err);

      return res.ok({ users: users, matches: matches }, 'bets/new');
    });
  }

};
