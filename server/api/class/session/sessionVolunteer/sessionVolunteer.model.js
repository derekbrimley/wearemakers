'use strict';

export default function(sequelize, DataTypes) {
	return sequelize.define('SessionVolunteer', {
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
		sessionID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.ClassSession
		},
		volunteerID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.Volunteer
		}
	});
}
