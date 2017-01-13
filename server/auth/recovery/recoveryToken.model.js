'use strict';
import {User} from '../../sqldb';
import moment from 'moment'
import crypto from 'crypto'

export default function(sequelize, DataTypes) {
    var test = moment().add(1, 'days').unix()
  var model = sequelize.define('RecoveryToken', {
        _id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            model: sequelize.models.User
        },
        token: {
            type: DataTypes.STRING
        },
        expirationDate: {
            type: DataTypes.DATE
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        instanceMethods: {
            /**
             * Encrypt password
             *
             * @param {String} password
             * @param {String} salt
             * @return {String}
             * @api public
             */
            encryptToken(text,userSalt) {

              var defaultIterations = 10000;
              var defaultKeyLength = 64;
              var salt = new Buffer(userSalt, 'base64');

                return crypto.pbkdf2Sync(text, salt, defaultIterations, defaultKeyLength)
                             .toString('base64');

            },
            /**
             * Encrypt password
             *
             * @param {Date} date
             * @return {Boolean}
             * @api public
             */
            isExpired(date){
                return moment().diff(date) > 0;
            }
        }
    });
  return model;
}
