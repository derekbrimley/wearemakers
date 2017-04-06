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
            ctrl.myUser = res;

            $http.get('/api/sessions/'+ctrl.myUser._id+'/getSessionVolunteers')
            .then(function(res){
                ctrl.myUpcomingSessions = [];
                _.filter(res.data,function(value) {
                    var sessDate = new Date(value.ClassSession.date);
                    var today = new Date ();
                    if(sessDate > today) {
                        ctrl.myUpcomingSessions.push(value);
                    }
                });
            })
        });

        $http.get('/api/classes/')
        .then(function(res) {
            ctrl.classes = res.data;
            _.forEach(ctrl.classes, course => {
                course.startTime = new Date(course.startTime);
                course.endTime = new Date(course.endTime);
            })
        });

        ctrl.userSessions = {};

        $http.get('/api/sessions/')
        .then(function(res) {

            ctrl.upcomingSessions = [];
            _.filter(res.data, function(value) {
                var sessDate = new Date(value.date);
                var today = new Date ();
                if(sessDate > today) {
                    ctrl.upcomingSessions.push(value);
                }
            })
            ctrl.upcomingSessions.sort(function(a,b) {
                return new Date(a.date) - new Date(b.date); 
            });
            
            ctrl.totalSessions = ctrl.upcomingSessions.length;
            ctrl.currentPage = 1;
            ctrl.itemsPerPage = 10;
            ctrl.itemsPerPageOptions = [10,20,50,100];
            
            ctrl.sessions = res.data;
            ctrl.sessions.forEach(function(session) {
                session.SessionVolunteers.forEach(function(sessionVolunteer) {
                    if(sessionVolunteer.userID == ctrl.myUser._id) {
                        ctrl.userSessions[sessionVolunteer.sessionID] = {
                            id: sessionVolunteer._id,
                            plannedAttendance: sessionVolunteer.plannedAttendance,
                        }
                    }
                })
            });
        });

        ctrl.attendanceOptions = ['Yes','No','On Call'];
        ctrl.currentPage = 1;
        ctrl.itemsPerPage = 10;
    }
    
    setPage(pageNum) {
        var ctrl = this;
        ctrl.currentPage = pageNum;
    }
    
    pageChanged() {
        var ctrl = this;
    }

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
        .then(res => {
            this.refreshSessions();
        })

    }

    createAttendance(session) {
        var ctrl = this;

        var body = {
            userID: ctrl.myUser._id,
            sessionID: session._id,
            plannedAttendance: ctrl.userSessions[session._id].plannedAttendance
        }

        this.$http.post('/api/classes/' + session.Class._id + '/sessions/' + session._id + '/volunteers/', body)
        .then(res => {
            this.refreshSessions();
        })

    }
    refreshSessions() {
        var ctrl = this;
        ctrl.$http.get('/api/sessions/'+ctrl.myUser._id+'/getSessionVolunteers')
        .then(function(res){
            ctrl.myUpcomingSessions = [];
            _.filter(res.data,function(value) {
                var sessDate = new Date(value.ClassSession.date);
                var today = new Date ();
                if(sessDate > today) {
                    ctrl.myUpcomingSessions.push(value);
                }
            });
        })
      
    }
  
    showDetails(course) {
        var ctrl = this;
        ctrl.selectedCourse = course;
    }

    showRequest(course) {
        var ctrl = this;
        var volunteers = [];
        course.ClassVolunteers.forEach(function(res) {
            volunteers.push(res.userID);
        })
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

        this.$http.put('/api/users/me' ,ctrl.myUser)
        .then(res => {
        })

        this.$http.put('/api/volunteers/' + ctrl.myUser._id, ctrl.myUser)
        .then(function(res) {
        })

    }
    
    onSelect(session){
        
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
