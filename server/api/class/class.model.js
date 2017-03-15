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
    volunteerInfo: DataTypes.STRING,
    location: DataTypes.STRING,
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    documentURL: DataTypes.STRING,
    documentName: DataTypes.STRING
  });
}
