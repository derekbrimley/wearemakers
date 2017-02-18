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
var users;
var classes;
var volunteers;
var classStudents;
var classVolunteers;
import {Thing, User,Class,ClassStudent,Volunteer,ClassVolunteer,sequelize,Sequelize} from '../sqldb'
	sequelize.sync()
	.then(() => User.sync({force:true}))
	.then(() => Class.sync({force:true}))
	.then(() => ClassStudent.sync({force:true}))
	.then(() => Volunteer.sync({force:true}))
	.then(() => ClassVolunteer.sync({force:true}))
	.then(() => {
		User.bulkCreate([{
				provider: 'local',
                name: 'Albert Mesos1',
				email: 'volunteer1@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
				provider: 'local',
				name: 'Wilfred Cayas2',
				email: 'volunteer2@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
				provider: 'local',
				name: 'Jared Smith3',
				email: 'volunteer3@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Adobe'
			}, {
				provider: 'local',
				name: 'JD Michaels4',
				email: 'volunteer4@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Microsoft'
			}, {
				provider: 'local',
				name: 'Brock Nelson5',
				email: 'volunteer5@gmail.com',
				password: 'test',
				type: 'volunteer',
                organization: 'Microsoft'
			}, {
				provider: 'local',
				role: 'admin',
				name: 'Admin',
				email: 'admin@example.com',
				password: 'admin',
				type: 'volunteer'
			}, {
				provider: 'local',
				role: 'admin',
				name: 'Carter Hesterman',
				email: 'hestermancarter@gmail.com',
				password: 'test',
				type: 'volunteer'
			}, {
				provider: 'local',
				name: 'Deconteh Seneh1',
				email: 'student1@gmail.com',
				password: 'test',
				type: 'student',
                phone: '555-555-5555',
                community:'Pakistan',
                gender:'Female',
                grade:10,
                primaryLanguage: 'Urdu'
			}, {
				provider: 'local',
				name: 'Lazarus Smith2',
				email: 'student2@gmail.com',
				password: 'test',
				type: 'student',
                phone: '555-555-5555',
                community:'France',
                gender:'Male',
                grade:10,
                primaryLanguage: 'French'
			}, {
				provider: 'local',
				name: 'Olaf',
				email: 'olaf@gmail.com',
				password: 'test',
				type: 'student',
                phone: '555-555-5555',
                community:'Ice',
                gender:'Male',
                grade:11,
                primaryLanguage: 'English'
			}, {
				provider: 'local',
				name: 'Jerome George4',
				email: 'student4@gmail.com',
				password: 'test',
				type: 'student',
                phone: '555-555-5555',
                community:'Pakistan',
                gender:'Male',
                grade:11,
                primaryLanguage: 'French'
			},{
				provider: 'local',
				name: 'Ike Eclair5',
				email: 'student5@gmail.com',
				password: 'test',
				type: 'student',
                phone: '555-555-5555',
                community:'India',
                gender:'Female',
                grade:9,
                primaryLanguage: 'Hindi'
            }],{returning: true})
			.then(newUsers => users = newUsers)
			.then(initClasses)
			.then(nClasses => classes = nClasses)
			.then(initVolunteers)
			.then(newVolunteers => volunteers = newVolunteers)
            .then(initClassVolunteers)
			.then(nCVolunteers => classVolunteers = nCVolunteers)
            .then(initClassStudents)
			.then(nCStudents => classStudents = nCStudents)
	});



function initClasses(){
    return Class.bulkCreate([{
        name: 'Intro to programming',
        info: 'This course is designed to help students learn how to better program. It is designed for beginners',
        location: 'W221',
        startTime: new Date('1970-02-01T15:00:00.000Z'),
        endTime: new Date('1970-02-01T16:00:00.000Z'),
        day: 'Saturday'
    }, {
        name: 'Professional Development',
        info: 'Students in this course will learn professional skills including: making a resume, interviewing, and business communication.',
        location: 'Upper Meeting Room',
        startTime: new Date('1970-02-01T16:00:00.000Z'),
        endTime: new Date('1970-02-01T17:00:00.000Z'),
        day: 'Saturday'
    }, {
        name: 'Game Development',
        info: 'Students will learn to develop simple video games with the Unity Game Engine',
        location: 'A25',
        startTime: new Date('1970-02-01T15:00:00.000Z'),
        endTime: new Date('1970-02-01T17:00:00.000Z'),
        day: 'Saturday'
    }, {
        name: 'ESL',
        info: 'The primary focus of this course is to help students have a better command of the English language.',
        location: 'A25',
        startTime: new Date('1970-02-01T18:00:00.000Z'),
        endTime: new Date('1970-02-01T19:00:00.000Z'),
        day: 'Saturday'
    }],{returning: true})

}

function initVolunteers(){
    return Volunteer.sync()
        .then(function(){
            return Volunteer.destroy({where:{}})
            .then(function(){
                return Volunteer.bulkCreate([{
                    userID:users[0]._id,
                    status: 'active'
                },{
                    userID:users[1]._id,
                    status: 'active'
                },{
                    userID:users[2]._id,
                    status: 'pending'
                },{
                    userID:users[3]._id,
                    status: 'pending'
                },{
                    userID:users[4]._id,
                    status: 'pending'
                }],{returning: true})
            })
        })
}

function initClassStudents(){
    return ClassStudent.sync()
    .then(() => {
        return ClassStudent.bulkCreate([{
            classID: classes[0]._id,
            userID: users[7]._id,
            status: 'pending'
        }, {
            classID: classes[0]._id,
            userID: users[8]._id,
            status: 'pending'
        }, {
            classID: classes[1]._id,
            userID: users[7]._id,
            status: 'pending'
        }, {
            classID: classes[1]._id,
            userID: users[9]._id ,
            status: 'pending'
        }, {
            classID: classes[1]._id,
            userID: users[10]._id ,
            status: 'pending'
        }, {
            classID: classes[1]._id,
            userID: users[11]._id ,
            status: 'pending'
        },{
            classID: classes[2]._id,
            userID: users[11]._id ,
            status: 'pending'
        },{
            classID: classes[3]._id ,
            userID: users[7]._id,
            status: 'pending'
        },{
            classID: classes[3]._id ,
            userID: users[8]._id,
            status: 'pending'
        },{
            classID: classes[3]._id ,
            userID: users[9]._id ,
            status: 'pending'
        },{
            classID: classes[3]._id ,
            userID: users[10]._id ,
            status: 'pending'
        }],{returning: true})
    })
}

function initClassVolunteers(){
    return ClassVolunteer.sync()
    .then(() => {
        ClassVolunteer.bulkCreate([{
            classID: classes[0]._id,
            userID: users[0]._id,
            status: 'active'
        }, {
            classID: classes[0]._id,
            userID: users[1]._id,
            status: 'pending'
        }, {
            classID: classes[1]._id,
            userID: users[2]._id,
            status: 'active'
        }, {
            classID: classes[2]._id,
            userID: users[3]._id,
            status: 'pending'
        }, {
            classID: classes[3]._id,
            userID: users[4]._id,
            status: 'pending'
        }],{returning: true})
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
