'use strict';

export default function(sequelize, DataTypes) {
	return sequelize.define('ClassStudent', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		classID: {
			type: DataTypes.INTEGER,
			model: sequelize.models.Class,
			allowNull: false
		},
		userID: {
			type: DataTypes.INTEGER,
			model: sequelize.models.User,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		status: DataTypes.STRING
	});
}
