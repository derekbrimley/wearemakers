'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './routes';
import _ from 'lodash';

export class VolunteerController {

    constructor(Auth, $state, $http) {
        'ngInject';
        var ctrl = this;

        this.$http = $http;

        Auth.getCurrentUser()
        .then(function(res){
            console.log("user",res);
            ctrl.myUser = res;
        });
        
        
        
//        $http.get('/api/classes/' + ctrl.myUser._id + '/mine')
//        .then(function(res){
//            console.log("my sessions",res);
//            ctrl.my_sessions = res.data;
//        });
        /api/classes/:class/sessions/:session/volunteers
        $http.get('/api/sessions/mine')

        $http.get('/api/classes/')
        .then(function(res) {
            console.log('not my classes',res);
            ctrl.classes = res.data;
            _.forEach(ctrl.classes, course => {
                course.startTime = new Date(course.startTime);
                course.endTime = new Date(course.endTime);
            })
        });

        
        
        ctrl.userSessions = {};
        
        $http.get('/api/sessions/')
        .then(function(res) {
            console.log("SESSIONS",res);
            
            ctrl.sessions = res.data;
            
            res.data.forEach(function(session) {

                session.SessionVolunteers.forEach(function(sessionVolunteer) {
                    if(sessionVolunteer.userID == ctrl.myUser._id) {
                        ctrl.userSessions[sessionVolunteer.sessionID] = {
                            id: sessionVolunteer._id,
                            plannedAttendance: sessionVolunteer.plannedAttendance,
                        }
                    }
                })
            });
            console.log("User sessions",ctrl.userSessions);
        });
        console.log(ctrl.myUser);
//        this.$http.get('/api/classes/' + ctrl.session.Class._id + '/sessions/' + ctrl.session._id + '/volunteers/')
//        .then(function(res) {
//            console.log("SESSION Volunteers", res);
//            ctrl.sessionVolunteers = res;
//        })
        
        ctrl.attendanceOptions = ['Yes','No','On Call'];
    }

//    checkSession(session) {
//        this.$http.get('/api/classes/' + session.Class._id + '/sessions/' + session._id + '/volunteers/')
//        .then(function(res) {
//            console.log("SESSION Volunteers", res);
//        })
//        return true;
//    }
//    
    checkSession(id) {
        var ctrl = this;
        return id in ctrl.userSessions;
    }
    
    updateAttendance(session) {
        var ctrl = this;
        
        var body = {
            userID: ctrl.myUser._id,
            sessionID: session._id,
            plannedAttendance: ctrl.userSessions[session._id].plannedAttendance
        }
        
        this.$http.put('/api/classes/' + session.Class._id + '/sessions/' + session._id + '/volunteers/' + ctrl.userSessions[session._id].id, body)
        .then(function(res) {
            console.log("UPDATE sessionvolunteer RES", res);
        })
        
//        this.$http.post('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/', body)
//        .then(function(res) {
//            console.log("RES", res);
//            ctrl.attendanceMarked = true;
//        })
        
//        this.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/')
    }
    
    createAttendance(session) {
        var ctrl = this;
        
        var body = {
            userID: ctrl.myUser._id,
            sessionID: session._id,
            plannedAttendance: ctrl.userSessions[session._id].plannedAttendance
        }
        
        this.$http.post('/api/classes/' + session.Class._id + '/sessions/' + session._id + '/volunteers/', body)
        .then(function(res) {
            console.log("CREATE sessionvolunteer RES", res);
        })
        
    }
    
    showDetails(course) {
        var ctrl = this;
        ctrl.selectedCourse = course;
        console.log("course",ctrl.selectedCourse);
    }
    
    showRequest(course) {
        var ctrl = this;
        var volunteers = [];
        course.ClassVolunteers.forEach(function(res) {
            volunteers.push(res.userID);
        })
//        console.log("user id",ctrl.myUser._id);
//        console.log("volunteers",volunteers);
        if(volunteers.indexOf(ctrl.myUser._id) > -1) {
            return true;
        }
        return false;
    }

    request_course(course) {
        var ctrl = this;
        var body = {
            classID: course._id,
            userID: this.myUser._id
        }

        this.$http.get('/api/classes/'+course._id+'/volunteers/register', body)
        .then(function(res) {
            console.log("RES Request", res)
            course.added=true
        })
    }

    updateProfile() {
        var ctrl = this;
        console.log("myUser",ctrl.myUser);

        this.$http.put('/api/users/me' ,ctrl.myUser)
        .then(res => {
            console.log("RES User update", res);
        })

        this.$http.put('/api/volunteers/' + ctrl.myUser._id, ctrl.myUser)
        .then(function(res) {
            console.log("UPDATE",res)
        })

    }

}

export default angular.module('refugeeApp.volunteer', [uiRouter])
  .config(routes)
  .component('volunteer', {
    template: require('./index.html'),
    controller: VolunteerController,
    controllerAs: 'ctrl'
  })
  .name;
