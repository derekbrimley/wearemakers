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
        attendance: {
            type: DataTypes.STRING
        },
        plannedAttendance: {
            type: DataTypes.STRING
        },
		sessionID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.ClassSession
		},
		userID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.User,
            validate:
                {isUnique: function(value,next){
                    sequelize.models.User.find({where:{_id:value}})
                    .then(function(entity){
                        if(entity.type != 'volunteer'){
                            next('User is not a volunteer');
                        }
                        next();
                    })
                }}
		}
	});
}
