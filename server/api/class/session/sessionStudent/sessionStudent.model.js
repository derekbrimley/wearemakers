'use strict';

export default function(sequelize, DataTypes) {
	return sequelize.define('SessionStudent', {
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
		attendance: DataTypes.STRING,
		userID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			model: sequelize.models.User,
            validate:
                {isUnique: function(value,next){
                    sequelize.models.User.find({where:{_id:value}})
                    .then(function(entity){
                        if(entity.type != 'student'){
                            next('User is not a student');
                        }
                        next();
                    })
                }}
		}
	});
}
