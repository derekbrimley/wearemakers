'use strict';
import _ from 'lodash';

export default class AdminController {
  list='users';
  /*@ngInject*/
  constructor(User, $http, $state) {
    // Use the User $resource to fetch all users
    var ctrl = this;
    this.users = User.query(function(users){
        ctrl.admins = _.filter(users,{role:'admin'})
    })
    this.$http = $http;
      
    ctrl.attendance_options = ['Attended','Absent','Excused'];

    ctrl.planned_attendance_options = ['Yes','On Call'];

    switch($state.current.name){
        case 'admin.classes':
            ctrl.tab = 1;
            break;
        case 'admin.students':
            ctrl.tab = 2;
            break;
        case 'admin.volunteers':
            ctrl.tab = 3;
            break;
        case 'admin.users':
            ctrl.tab = 4;
            break;
        case 'admin.admins':
            ctrl.tab = 5;
            break;
        case 'admin.scheduling':
            ctrl.tab = 0;
            break;
        case 'admin.reports':
            ctrl.tab = 6;
            break;
        default:
            ctrl.tab = 0;
    }
  }

    select(vol,saved) {
        var ctrl = this;

        ctrl.selectedVolunteerEdit = vol;
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
        })
    }

    assignToSession(volunteer){
        var ctrl = this;
        ctrl.$http.post('/api/classes/'+ctrl.selectedSession.classID+'/sessions/'+ctrl.selectedSession._id+'/volunteers',{userID:volunteer.User._id})
        .then(function(res){
            volunteer._id = res.data._id
            ctrl.selectedSession.SessionVolunteers.push(volunteer);
        },function(err){
        })
    }

    removeFromSession(volunteer){
        var ctrl = this;
        ctrl.$http.delete('/api/classes/'+ctrl.selectedSession.classID+'/sessions/'+ctrl.selectedSession._id+'/volunteers/'+volunteer._id)
        .then(function(res){
            ctrl.selectedSession.SessionVolunteers.splice(ctrl.selectedSession.SessionVolunteers.indexOf(volunteer),1);
        },function(err){
        })
    }

    notInSession(volunteer){
        return !_.find(this.selectedSession.SessionVolunteers, {userID: volunteer.User._id})
    }

    getAttendance(volunteer) {
        var ctrl = this;
        var sessionVolunteer = _.find(ctrl.selectedSession.SessionVolunteers,{userID: volunteer.User._id})
    }

    markAttendance(volunteer) {
        var ctrl = this;
        var body = {
            attendance: volunteer.attendance
        }
        ctrl.selectedVolunteer = volunteer._id;
        ctrl.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/' + volunteer._id, body)
        .then(function(res) {
            volunteer.showSave = true;
        })
    }

    saveAttendance(volunteer) {
        volunteer.saved = true;
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
            return true;
        })
    }

    saveStudentAttendance(student) {
        student.saved = true;
    }

    markStudentAttendance(student) {
        var ctrl = this;
        var body = {
            attendance: student.SessionStudent.attendance
        }
        ctrl.$http.put('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/students/' + student.SessionStudent._id, body)
        .then(function(res) {
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
