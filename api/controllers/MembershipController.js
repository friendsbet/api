// MembershipController.js
//
// @description :: Server-side logic for managing memberships
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {

  boFind: function (req, res) {
    Membership
      .find()
      .populate('user')
      .populate('group')
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ memberships: instances }, 'memberships/find');
    });
  },

  boFindOne: function (req, res) {
    var membership = {};
    var users = [];
    var groups = [];

    async.parallel([

      function getMembership(next) {
        Membership
          .findOne(req.param('id'))
          .populate('user')
          .populate('group')
          .exec(function (err, instance) {
            if(err) return next(err);

            membership = instance;

            return next();
        });
      },

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

      function getGroups(next) {
        Group
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);

            groups = instances;

            return next();
        });
      }

    ], function (err) {
      if(err) return res.negotiate(err);
      if(!membership) return res.notFound(req.param('id'));

      return res.ok({ users: users, groups: groups, membership: membership }, 'memberships/findOne');
    });
  },

  boNew: function (req, res) {
    var users = [];
    var groups = [];

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

      function getGroups(next) {
        Group
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);

            groups = instances;

            return next();
        });
      }

    ], function (err) {
      if(err) return res.negotiate(err);

      return res.ok({ users: users, groups: groups }, 'memberships/new');
    });
  },

};
