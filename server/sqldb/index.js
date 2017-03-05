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
    db.ClassSession = db.sequelize.import('../api/class/session/session.model');
        db.SessionVolunteer = db.sequelize.import('../api/class/session/sessionVolunteer/sessionVolunteer.model');
        db.SessionStudent = db.sequelize.import('../api/class/session/sessionStudent/sessionStudent.model');
db.PreSignup = db.sequelize.import('../api/pre_signup/pre_signup.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Volunteer = db.sequelize.import('../api/volunteer/volunteer.model');
db.RecoveryToken = db.sequelize.import('../auth/recovery/recoveryToken.model');


// Associations

db.ClassStudent.belongsTo(db.User,{foreignKey:'userID'});
db.ClassStudent.belongsTo(db.Class,{foreignKey:'classID'});

db.ClassVolunteer.belongsTo(db.User,{foreignKey:'userID'});
db.ClassVolunteer.belongsTo(db.Class,{foreignKey:'classID'});

db.SessionVolunteer.belongsTo(db.User,{foreignKey:'userID'});
db.SessionVolunteer.belongsTo(db.ClassSession,{foreignKey:'sessionID'});
db.SessionStudent.belongsTo(db.User,{foreignKey:'userID'});
db.SessionStudent.belongsTo(db.ClassSession,{foreignKey:'sessionID'});

db.SessionStudent.belongsTo(db.User,{foreignKey:'userID'});
db.SessionStudent.belongsTo(db.ClassSession,{foreignKey:'sessionID'});

db.Class.hasMany(db.ClassStudent,{foreignKey:'classID'});
db.Class.hasMany(db.ClassVolunteer,{foreignKey:'classID'});
db.Class.hasMany(db.ClassSession,{foreignKey:'classID'});

db.ClassSession.hasMany(db.SessionVolunteer,{foreignKey:'sessionID'});
db.ClassSession.hasMany(db.SessionStudent,{foreignKey:'sessionID'});
db.ClassSession.belongsTo(db.Class,{foreignKey:'classID'});

db.Volunteer.belongsTo(db.User,{foreignKey:'userID'});

module.exports = db;
