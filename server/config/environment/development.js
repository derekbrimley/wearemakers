'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    dbName:'refugee',
    user: 'testo2',
    pass: 'test',
    host: 'localhost'
  },
  domain:'localhost:3000',
  // Seed database on startup
  seedDB: false
};
