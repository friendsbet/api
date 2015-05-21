// Team.js
//
// @description :: A Team object contains information about
//                 a sport squad
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,

  attributes: {

    // The complete name of the Team
    // e.g 'England'
    name: {
      type: 'text',
      notEmpty: true,
      required: true,
      unique: true
    },

    // A slug is a short name given to a Team
    // This slug should be unique
    // e.g 'eng'
    slug: {
      type: 'text',
      alphanumericdashed: true,
      notEmpty: true,
      required: true,
      unique: true
    },

    // Everything you need to know about this team
    // e.g 'The England national rugby union team represents England in rugby union.'
    description: {
      type: 'text'
    },

    // The Matches list associated with this Team as teamA
    // References to Match objects
    matchesAsTeamA: {
      collection: 'match',
      via: 'teamA'
    },

    // Same thing as teamB
    // References to Match objects
    matchesAsTeamB: {
      collection: 'match',
      via: 'teamB'
    }

  }
};

