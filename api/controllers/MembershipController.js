// MembershipController.js
//
// @description :: Server-side logic for managing memberships
// @help        :: See http://links.sailsjs.org/docs/controllers

/* global Membership, async, BackOffice */

module.exports = {

  boFind: function (req, res) {
    Membership
      .find()
      .populate('user')
      .populate('group')
      .exec(function (err, instances) {
        if (err) return res.negotiate(err);

        return res.ok({ memberships: instances }, 'memberships/find');
      });
  },

  boFindOne: function (req, res) {
    var membership = {};
    var users = [];
    var groups = [];

    async.parallel([

      function getMembership(next) {
        BackOffice
          .getAMembership(req.param('id'), function (err, instance) {
            if (err) return next(err);

            membership = instance;

            return next();
          });
      },

      function getUsers(next) {
        BackOffice
          .getAllUsers(function (err, instances) {
            if (err) return next(err);

            users = instances;

            return next();
          });
      },

      function getGroups(next) {
        BackOffice
          .getAllGroups(function (err, instances) {
            if (err) return next(err);

            groups = instances;

            return next();
          });
      }

    ], function (err) {
      if (err) return res.negotiate(err);
      if (!membership) return res.notFound(req.param('id'));

      return res.ok({ users: users, groups: groups, membership: membership }, 'memberships/findOne');
    });
  },

  boNew: function (req, res) {
    var users = [];
    var groups = [];

    async.parallel([

      function getUsers(next) {
        BackOffice
          .getAllUsers(function (err, instances) {
            if (err) return next(err);

            users = instances;

            return next();
          });
      },

      function getGroups(next) {
        BackOffice
          .getAllGroups(function (err, instances) {
            if (err) return next(err);

            groups = instances;

            return next();
          });
      }

    ], function (err) {
      if (err) return res.negotiate(err);

      var data = {
        noUsers: true,
        noGroups: true
      };

      if (users.length) {
        data.users = users;
        data.noUsers = false;
      }

      if (groups.length) {
        data.groups = groups;
        data.noGroups = false;
      }

      if (data.noUsers || data.noGroups)
        data.somethingIsMissing = true;

      if (data.noUsers && data.noGroups)
        data.everythingIsMissing = true;

      return res.ok(data, 'memberships/new');
    });
  }

};
