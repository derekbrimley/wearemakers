'use strict'
import moment from 'moment'
import _ from 'lodash'
export class AdminScheduling {

    /*@ngInject*/
    constructor($http){
        'ngInject'
        var ctrl = this;
        this.$http = $http;

        ctrl.attendance_options = ['Attended','Absent','Excused'];

        ctrl.planned_attendance_options = ['Yes','On Call'];
    }

    select(vol,saved) {
        var ctrl = this;

        ctrl.selectedVolunteerEdit = vol;
//        vol.plannedAttendance = ctrl.selectedVolunteerEdit.plannedAttendance;
        vol.saved = saved;
    }

    changePlannedAttendance(vol) {
        var ctrl = this;

        var body = {
            userID: vol.User._id,
            sessionID: ctrl.selectedSession._id,
            plannedAttendance: vol.plannedAttendance
        }

        this.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/' + vol._id, body)
        .then(function(res) {
            console.log("UPDATE sessionvolunteer RES", res);
        })
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

    saveStudentAttendance(student) {
        student.saved = true;
        console.log(student.showSave);
    }

    markStudentAttendance(student) {
        var ctrl = this;
        var body = {
            attendance: student.SessionStudent.attendance
        }
        ctrl.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/students/' + student.SessionStudent._id, body)
        .then(function(res) {
            console.log("RES", res);
        })
    }

    editStudentAttendance(student) {
        var ctrl = this;
        student.saved = false;
        ctrl.selectedStudent = student._id;
    }

    sessionSelected(session){
        if(!session.SessionStudents){
            return;
        }
        for(var i in session.SessionStudents){
            var sessionStudent = session.SessionStudents[i];
            var student = _.find(session.Class.ClassStudents,{userID:sessionStudent.userID})
            student.SessionStudent = sessionStudent;
        }
    }

    createStudentSession(student){
        this.$http.post('/api/classes/'+this.selectedSession.Class._id+'/sessions/'+this.selectedSession._id+'/students/register' ,{userID:student.userID,attendance:student.SessionStudent.attendance})
        .then(res=>{
            console.log("RES",res);
            student.SessionStudent = res.data;
        })
    }

    updateAttendance(student){
        if(student.SessionStudent._id){
            this.markStudentAttendance(student)
        }
        else{
            this.createStudentSession(student);
        }
    }
}

export default angular.module('refugeeApp.adminScheduling', ['refugeeApp.auth', 'ui.router'])
  .component('adminScheduling', {
      template: require('./index.html'),
      controller: AdminScheduling,
      controllerAs: 'ctrl'
  })
  .name;
