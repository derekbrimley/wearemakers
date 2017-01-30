/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';
import Umzug from 'umzug';
// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed');
}
// run migrations
var umzug = new Umzug({
    storage: "sequelize",
    storageOptions: {
        sequelize: sqldb.sequelize,
        // tableName: "migrations"
        tableName: "SequelizeData" // default table name for sequelize-cli `seeder`
    },
     migrations: {
         params: [sqldb.sequelize.getQueryInterface(), sqldb.Sequelize]
        },
    path:'server/migrations'
 });

umzug.up().then(function (migrations) {
  console.log(migrations);
});

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express').default(app);
require('./routes').default(app);
require('./params').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;
