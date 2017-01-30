'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Class', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    info: DataTypes.STRING,
    location: DataTypes.STRING,
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    days: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
  });
}
