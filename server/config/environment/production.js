'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

    sequelize: {
      dbName: 'wearemakers',
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      host: process.env.DB_URL
    }
  }
