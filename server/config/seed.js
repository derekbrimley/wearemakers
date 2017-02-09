/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// import sqldb from '../sqldb';
// var Thing = sqldb.Thing;
// var User = sqldb.User;
// var Class = sqldb.Class;
// var ClassStudent = sqldb.ClassStudent;
// var Volunteer = sqldb.ClassStudent;
// var ClassVolunteer = sqldb.ClassVolunteer;
import {Thing, User,Class,ClassStudent,Volunteer,ClassVolunteer} from '../sqldb'
User.sync()
	.then(() => Class.sync())
	.then(() => ClassStudent.sync())
	.then(() => Volunteer.sync())
	.then(() => ClassVolunteer.sync())
	.then(() => ClassStudent.destroy({where:{}}))
	.then(() => Class.destroy({where:{}}))
	.then(() => Volunteer.destroy({where:{}}))
	.then(() => User.destroy({where:{}}))
	.then(() => {
		User.bulkCreate([{
                _id: 1,
				provider: 'local',
                name: 'Albert Mesos1',
				email: 'volunteer1@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
                _id: 2,
				provider: 'local',
				name: 'Wilfred Cayas2',
				email: 'volunteer2@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
                _id: 3,
				provider: 'local',
				name: 'Jared Smith3',
				email: 'volunteer3@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
                _id: 4,
				provider: 'local',
				name: 'JD Michaels4',
				email: 'volunteer4@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Microsoft'
			}, {
                _id: 5,
				provider: 'local',
				name: 'Brock Nelson5',
				email: 'volunteer5@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Microsoft'
			}, {
                _id: 6,
				provider: 'local',
				role: 'admin',
				name: 'Admin',
				email: 'admin@example.com',
				password: 'admin',
				type: 'volunteer'
			}, {
                _id: 7,
				provider: 'local',
				role: 'admin',
				name: 'Carter Hesterman',
				email: 'hestermancarter@gmail.com',
				password: 'test',
				type: 'volunteer'
			}, {
                _id: 8,
				provider: 'local',
				name: 'Deconteh Seneh1',
				email: 'student1@gmail.com',
				password: 'test',
				type: 'student',
                primaryLanguage: 'French'
			}, {
                _id: 9,
				provider: 'local',
				name: 'Lazarus Smith2',
				email: 'student2@gmail.com',
				password: 'test',
				type: 'student',
                primaryLanguage: 'French'
			}, {
                _id: 10,
				provider: 'local',
				name: 'Afaf Smith3',
				email: 'student3@gmail.com',
				password: 'test',
				type: 'student',
                primaryLanguage: 'French'
			}, {
                _id: 11,
				provider: 'local',
				name: 'Jerome George4',
				email: 'student4@gmail.com',
				password: 'test',
				type: 'student',
                primaryLanguage: 'French'
			},{
                _id: 12,
				provider: 'local',
				name: 'Ike Eclair5',
				email: 'student5@gmail.com',
				password: 'test',
				type: 'student',
                primaryLanguage: 'English'
            }])
			.then(initVolunteers)
            .then(initClasses)
            .then(initClassStudents)
	});



function initClasses(){
    return Class.sync()
    .then(function(){
        Class.destroy({where:{}})
        .then(function(){
            Class.bulkCreate([{
                _id: 1,
                name: 'Intro to programming',
                info: 'This course is designed to help students learn how to better program. It is designed for beginners',
                location: 'W221',
                startTime: new Date('1970-02-01T15:00:00.000Z'),
                endTime: new Date('1970-02-01T16:00:00.000Z'),
                day: 'Saturday'
            }, {
                _id: 2,
                name: 'Professional Development',
                info: 'Students in this course will learn professional skills including: making a resume, interviewing, and business communication.',
                location: 'Upper Meeting Room',
                startTime: new Date('1970-02-01T16:00:00.000Z'),
                endTime: new Date('1970-02-01T17:00:00.000Z'),
                day: 'Saturday'
            }, {
                _id: 3,
                name: 'Game Development',
                info: 'Students will learn to develop simple video games with the Unity Game Engine',
                location: 'A25',
                startTime: new Date('1970-02-01T15:00:00.000Z'),
                endTime: new Date('1970-02-01T17:00:00.000Z'),
                day: 'Saturday'
            }, {
                _id: 4,
                name: 'ESL',
                info: 'The primary focus of this course is to help students have a better command of the English language.',
                location: 'A25',
                startTime: new Date('1970-02-01T18:00:00.000Z'),
                endTime: new Date('1970-02-01T19:00:00.000Z'),
                day: 'Saturday'
            }])
        })
    })

}

function initVolunteers(){
    return Volunteer.sync()
        .then(function(){
            return Volunteer.destroy({where:{}})
            .then(function(){
                return Volunteer.bulkCreate([{
                    _id: 1,
                    userID:1,
                    status: 'pending'
                },{
                    _id: 2,
                    userID:2,
                    status: 'pending'
                },{
                    _id: 3,
                    userID:3,
                    status: 'pending'
                },{
                    _id: 4,
                    userID:4,
                    status: 'pending'
                },{
                    _id: 5,
                    userID:5,
                    status: 'pending'
                }])
            })
        })
}

function initClassStudents(){
    return ClassStudent.sync()
    .then(() => {
        ClassStudent.bulkCreate([{
            _id: 1,
            classID: 1,
            userID: 8,
            status: 'pending'
        }, {
            _id: 2,
            classID: 1,
            userID: 9,
            status: 'pending'
        }, {
            _id: 3,
            classID: 2,
            userID: 8,
            status: 'pending'
        }, {
            _id: 4,
            classID: 2,
            userID: 10,
            status: 'pending'
        }, {
            _id: 5,
            classID: 2,
            userID: 11,
            status: 'pending'
        }, {
            _id: 7,
            classID: 2,
            userID: 12,
            status: 'pending'
        },{
            _id: 8,
            classID: 3,
            userID: 12,
            status: 'pending'
        },{
            _id: 10,
            classID: 4,
            userID: 8,
            status: 'pending'
        },{
            _id: 11,
            classID: 4,
            userID: 9,
            status: 'pending'
        },{
            _id: 12,
            classID: 4,
            userID: 10,
            status: 'pending'
        },{
            _id: 13,
            classID: 4,
            userID: 11,
            status: 'pending'
        }])
    })
}

// Volunteer.sync()
// .then(function(){
//     Volunteer.destroy({where:{}})
//     .then(function(){
//         Volunteer.bulkCreate([{
//
//         },{
//
//         },{
//
//         },{
//
//         },{
//
//         }])
//     })
// })
