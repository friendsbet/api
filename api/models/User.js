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

    name: function () {
      return this.firstName + ' ' + this.lastName;
    }

  },

  // Remove user's bets and memberships
  afterDestroy: function destroyAssociations(values, cb) {
    async.parallel([
      function destroyBets(next) {
        Bet
          .destroy({ user: values.id })
          .exec(next);
      },
      function destroyMemberships(next) {
        Membership
          .destroy({ user: values.id })
          .exec(next);
      },
    ], cb);
  }
  
};
