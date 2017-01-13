'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('PreSignup', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The specified email address is already in use.'
      },
      validate: {
        isEmail: true
      }
    }
  });
}
