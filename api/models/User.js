// User.js
//
// @description :: Contains informations about a User
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,

  attributes: {

    // The email adress of the User
    // Each User has an unique information
    // e.g 'yann@example.com'
    email: {
      type: 'email',
      notEmpty: true,
      required: true,
      unique: true
    },

    // The first name of the User
    // e.g 'Yann'
    firstName: {
      type: 'text',
      notEmpty: true,
      required: true
    },

    // His/Her last name
    // e.g 'Bertrand'
    lastName: {
      type: 'text',
      notEmpty: true,
      required: true
    },

    // The cumulative score of this User
    // Updated at the end of a Match    // e.g 256
    score: {
      type: 'integer',
      min: 0,
      defaultsTo: 0
    },

    // Everything the User want you to know
    // e.g 'The founder of Friends Bet'
    description: {
      type: 'text',
      defaultsTo: ''
    },

    // The collection of the User Bets
    // References to Bet objects
    bets: {
      collection: 'bet',
      via: 'user'
    },

    // The Groups in which the User participates
    // References to Membership objects
    memberships: {
      collection: 'membership',
      via: 'user'
    },

    // The Notifications the user has
    // References to Notification objects
    notifications: {
      collection: 'notification',
      via: 'user'
    },

    // The full name of the user
    // e.g 'Yann Bertrand'
    name: function () {
      return this.firstName + ' ' + this.lastName;
    }

  },
  
  // Convert strings to correct types
  beforeValidate: function parseParameters(values, cb) {
    values.score = values.score? parseInt(values.score): 0;

    return cb();
  },

  // Remove user's bets, notifications and memberships
  afterDestroy: function destroyAssociations(instances, cb) {
    async.each(instances, function (instance, nextInstance) {
      async.parallel([
        function destroyBets(nextFn) {
          Bet
            .destroy({ user: instance.id })
            .exec(nextFn);
        },
        function destroyNotifications(nextFn) {
          Notification
            .destroy({ user: instance.id })
            .exec(nextFn);
        },
        function destroyMemberships(nextFn) {
          Membership
            .destroy({ user: instance.id })
            .exec(nextFn);
        },
        function destroyGroups(nextFn) {
          Group
            .destroy({ technicalAdmin: instance.id })
            .exec(nextFn);
        },
      ], nextInstance);
    }, cb);
  }
  
};
