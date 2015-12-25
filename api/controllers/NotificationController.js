// NotificationController
//
// @description :: Server-side logic for managing notifications
// @help        :: See http://links.sailsjs.org/docs/controllers

/* global Notification, async, BackOffice */

module.exports = {

  boFind: function (req, res) {
    Notification
      .find()
      .populate('user')
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ notifications: instances }, 'notifications/find');
      });
  },

  boFindOne: function (req, res) {
    var notification = {};
    var users = [];

    async.parallel([

      function getNotification(next) {
        BackOffice
          .getANotification(req.param('id'), function (err, instance) {
            if(err) return next(err);

            notification = instance;

            return next();
          });
      },

      function getUsers(next) {
        BackOffice
          .getAllUsers(function (err, instances) {
            if(err) return next(err);

            users = instances;

            return next();
          });
      }

    ], function (err) {
      if(err) return res.negotiate(err);
      if(!notification) return res.notFound(req.param('id'));

      return res.ok({ users: users, notification: notification }, 'notifications/findOne');
    });
  },

  boNew: function (req, res) {
    BackOffice
      .getAllUsers(function (err, users) {
        if(err) return res.negotiate(err);

        var data = {
          noUsers: true
        };

        if(users.length > 1) {
          data.users = users;
          data.noUsers = false;
        } else {
          data.somethingIsMissing = true;
        }

        return res.ok(data, 'notifications/new');
      });
  }

};
