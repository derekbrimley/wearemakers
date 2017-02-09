'use strict';

export default function(sequelize, DataTypes) {
	return sequelize.define('ClassSession', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		classID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.Class
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	});
}
