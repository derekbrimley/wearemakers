'use strict'
import moment from 'moment'
import _ from 'lodash'
export class AdminScheduling {

    /*@ngInject*/
    constructor($http){
        'ngInject'
        var ctrl = this;

        // Get current week
        var startOfWeek = moment().startOf('week');
        var endOfWeek = moment().endOf('week');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        ctrl.days = days;

        this.$http = $http;

        $http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;

        })
        
        ctrl.attendance_options = ['Attended','Absent','Excused'];
    }

    previousWeek(){
        // Get current week
        var startOfWeek = this.days[0].subtract(7,'d');
        var endOfWeek =  this.days[0].clone().add(6,'d');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
    }

    currentWeek(){
        // Get current week
        var startOfWeek = moment().startOf('week');
        var endOfWeek = moment().endOf('week');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
    }

    nextWeek(){
        // Get current week
        var startOfWeek = this.days[0].add(7,'d');
        var endOfWeek =  startOfWeek.clone().add(6,'d');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
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

    createSession(course,date){
        var ctrl = this;
        var body = {
            classID:course._id,
            date:date.toDate()
        }
        ctrl.$http.post('/api/classes/'+course._id+'/sessions',body)
        .then(function(res){
            console.log("RES",res);
            res.data.Class = _.cloneDeep(course);
            res.data.Class.startTime = new Date(course.startTime);
            ctrl.selectedDate = date;
            ctrl.selectedSession = res.data;
            ctrl.selectedSession.SessionVolunteers = [];
        },function(err){
            console.log("ERR",err);
            var selectedCourse = _.cloneDeep(course);
            selectedCourse.startTime = new Date(course.startTime);
            err.data.session.Class = selectedCourse;
            ctrl.selectedDate = date;
            ctrl.selectedSession = err.data.session;
        })
    }
    
    getAttendance(volunteer) {
        var ctrl = this;
        var sessionVolunteer = _.find(ctrl.selectedSession.SessionVolunteers,{userID: volunteer.User._id})
        console.log(sessionVolunteer.attendance);
    }
    
    markAttendance(volunteer) {
        var ctrl = this;
        var body = {
            attendance: ctrl.selected_attendance
        }
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
        volunteer.saved = false;
    }
//    
//    attendanceMarked(volunteer) {
//        var sessionvolunteer = _.find(this.selectedSession.SessionVolunteers, {userID: volunteer.User._id})
//        console.log('here',sessionvolunteer);
//        return true;
//    }
    
    attendanceMarked(volunteer) {
        var ctrl = this;
        
        ctrl.$http.get('/api/classes/' + ctrl.selectedSession.Class._id + '/sessions/' + ctrl.selectedSession._id + '/volunteers/' + volunteer._id)
        .then(function(res) {
            console.log("RES", res);
            return true;
//            if(res.data.attendance) {
//                return true;
//            } else {
//                return false;
//            }
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
