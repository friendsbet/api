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
      type: 'text',
      notEmpty: true,
      required: true,
      unique: true,
      email: true
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

    // Everything the User want you to know
    // e.g 'The founder of Friends Bet'
    description: {
      type: 'text'
    },

    // The collection of the User Bets
    // References to Bet objects
    bets: {
      collection: 'bet',
      via: 'user'
    },

    // The Group in which the User participate
    // References to Group objects
    groups: {
      collection: 'group',
      via: 'members'
    }

  }
};
