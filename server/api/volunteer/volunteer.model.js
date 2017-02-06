'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Volunteer', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userID: {
      type: DataTypes.INTEGER,
      model: sequelize.models.User,
      allowNull: false
    },
    status: DataTypes.STRING,
    availability: DataTypes.JSON,
    active: DataTypes.BOOLEAN
  });
}
