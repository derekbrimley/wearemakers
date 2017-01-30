/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.dbName,config.sequelize.user,config.sequelize.pass,{
      host:config.sequelize.host,
      dialect: 'postgres',
      pool: {
          max:5,
          min:0,
          idle: 10000
      }
  })
};
// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.Class = db.sequelize.import('../api/class/class.model');
    db.ClassStudent = db.sequelize.import('../api/class/student/student.model');
    db.ClassVolunteer = db.sequelize.import('../api/class/volunteer/volunteer.model');
db.PreSignup = db.sequelize.import('../api/pre_signup/pre_signup.model');
db.User = db.sequelize.import('../api/user/user.model');
db.RecoveryToken = db.sequelize.import('../auth/recovery/recoveryToken.model');


// Associations

db.ClassStudent.belongsTo(db.User,{foreignKey:'userID'});
db.ClassStudent.belongsTo(db.Class,{foreignKey:'classID'});

db.ClassVolunteer.belongsTo(db.User,{foreignKey:'userID'});
db.ClassVolunteer.belongsTo(db.Class,{foreignKey:'classID'});

db.Class.hasMany(db.ClassStudent,{foreignKey:'classID'});
db.Class.hasMany(db.ClassVolunteer,{foreignKey:'classID'});

module.exports = db;
