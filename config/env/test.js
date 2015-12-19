/**
 * Test environment settings
 *
 * Just the environment for testing purpose
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  bootstrap: null,

  models: {
    connection: 'mongoTest',
    migrate: 'drop'
  },

  FriendsBet: {
    currentSport: 'Football'
  }

};
