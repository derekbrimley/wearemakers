'use strict'
import moment from 'moment'
import _ from 'lodash'
export class AdminScheduling {

    /*@ngInject*/
    constructor($http){
        'ngInject'
        var ctrl = this;
        ctrl.attendance_options = ['Attended','Absent','Excused'];
    }

    assignToSession(volunteer){
        var ctrl = this;
        console.log(ctrl.selectedSession);
        ctrl.$http.post('/api/classes/'+ctrl.selectedSession.classID+'/sessions/'+ctrl.selectedSession._id+'/volunteers',{userID:volunteer.User._id})
        .then(function(res){
            console.log("RES",res);
            volunteer._id = res.data._id
            ctrl.selectedSession.SessionVolunteers.push(volunteer);
        },function(err){
            console.log("ERR",err);
        })
    }

    removeFromSession(volunteer){
        var ctrl = this;
        ctrl.$http.delete('/api/classes/'+ctrl.selectedSession.classID+'/sessions/'+ctrl.selectedSession._id+'/volunteers/'+volunteer._id)
        .then(function(res){
            console.log("RES",res)
            ctrl.selectedSession.SessionVolunteers.splice(ctrl.selectedSession.SessionVolunteers.indexOf(volunteer),1);
        },function(err){
            console.log("ERR",err);
        })
    }

    notInSession(volunteer){
        return !_.find(this.selectedSession.SessionVolunteers, {userID: volunteer.User._id})
    }

    getAttendance(volunteer) {
        var ctrl = this;
        var sessionVolunteer = _.find(ctrl.selectedSession.SessionVolunteers,{userID: volunteer.User._id})
        console.log(sessionVolunteer.attendance);
    }

    markAttendance(volunteer) {
        var ctrl = this;
        var body = {
            attendance: volunteer.attendance
        }
        ctrl.selectedVolunteer = volunteer._id;
        console.log("MARK ATTENDANCE",body);
        ctrl.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/' + volunteer._id, body)
        .then(function(res) {
            console.log("RES", res);
            volunteer.showSave = true;
        })
    }

    saveAttendance(volunteer) {
        volunteer.saved = true;
        console.log(volunteer.showSave);
    }

    editAttendance(volunteer) {
        var ctrl = this;
        volunteer.saved = false;
        ctrl.selectedVolunteer = volunteer._id;
    }

    attendanceMarked(volunteer) {
        var ctrl = this;

        ctrl.$http.get('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/' + volunteer._id)
        .then(function(res) {
            console.log("RES", res);
            return true;
        })
    }
}

export default angular.module('refugeeApp.adminScheduling', ['refugeeApp.auth', 'ui.router'])
  .component('adminScheduling', {
      template: require('./index.html'),
      controller: AdminScheduling,
      controllerAs: 'ctrl'
  })
  .name;
