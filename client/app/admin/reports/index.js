'use strict'
export class AdminReports {
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        this.$http.get('/api/users/countusersbytype/student')
        .then(function(res){
            ctrl.numOfStudents = res.data
        })

        this.$http.get('/api/users/countusersbytype/volunteer')
        .then(function(res){
            ctrl.numOfVolunteers = res.data
        })

        this.$http.get('/api/classes/')
        .then(function(res){
            ctrl.classes = res.data
        })

        this.$http.get('/api/volunteers')
        .then((res) => {
            console.log('volunteers',res.data);
            ctrl.volunteers = res.data;
        })
        
        this.$http.get('/api/users')
        .then((res) => {
            ctrl.students = _.filter(res.data,{type:'student'});;
            console.log('students',ctrl.students);
        })
    }

    //////////////classes tab//////////////
    // classes(courseID){
    //     var ctrl = this;
    //     this.$http.get('/api/classes/reports/classStudentCount/'+courseID)
    //     .then(function(res){
    //         // ctrl.classStudentCount = res.data
    //         return(res.data)
    //     })
    // }

    aggregateClasses() {
        var ctrl = this;
        var studentAttendance = {};
        var volunteerAttendance = {};
        var count;

        ctrl.attendances = [];

        angular.forEach(ctrl.classes, function(course, key) {
            
            ctrl.$http.get('/api/classes/reports/studentAttendance/'+course._id)
            .then(function(res){
                console.log("RES",res.data);
                studentAttendance[course.name]={
                    studentData: res.data,
                    studentAbsent : "",
                    studentAttended : "",
                    studentExcused : "",
                    studentAttendancePercent: "",
                }
                console.log("studentAttendance",studentAttendance);
            },function(err){
                console.log("ERR",err);
            }).then(function() {
                ctrl.$http.get('/api/classes/reports/volunteerAttendance/'+course._id)
                .then(function(res){
                    volunteerAttendance[course.name]={
                        volunteerData: res.data,
                        volunteerAbsent : "",
                        volunteerAttended : "",
                        volunteerExcused : "",
                        volunteerAttendancePercent: "",
                    }
//                    console.log("volunteerAttendance",res.data);
                    
                    for(count = 0; count < studentAttendance[course.name].studentData.length; count++){
                        if(studentAttendance[course.name].studentData[count].attendance == 'Absent'){
                            studentAttendance[course.name].studentAbsent = Number(studentAttendance[course.name].studentData[count].count)
                        } else if (studentAttendance[course.name].studentData[count].attendance == 'Attended'){
                            studentAttendance[course.name].studentAttended = Number(studentAttendance[course.name].studentData[count].count)
                        } else if (studentAttendance[course.name].studentData[count].attendance == 'Excused'){
                            studentAttendance[course.name].studentExcused = Number(studentAttendance[course.name].studentData[count].count)
                        } 
                    }
                    studentAttendance[course.name].studentAttendancePercent = Number(100 * (studentAttendance[course.name].studentAttended  / (studentAttendance[course.name].studentAbsent + studentAttendance[course.name].studentAttended + studentAttendance[course.name].studentExcused))).toFixed(2);
                
                    
                    for(count=0;count<volunteerAttendance[course.name].volunteerData.length;count++) {
                        if(volunteerAttendance[course.name].volunteerData[count].attendance == 'Absent'){
                            volunteerAttendance[course.name].volunteerAbsent = Number(volunteerAttendance[course.name].volunteerData[count].count)
                        } else if (volunteerAttendance[course.name].volunteerData[count].attendance == 'Attended'){
                            volunteerAttendance[course.name].volunteerAttended = Number(volunteerAttendance[course.name].volunteerData[count].count)
                        } else if (volunteerAttendance[course.name].volunteerData[count].attendance == 'Excused'){
                            volunteerAttendance[course.name].volunteerExcused = Number(volunteerAttendance[course.name].volunteerData[count].count)
                        } 
                    }
                    volunteerAttendance[course.name].volunteerAttendancePercent = Number(100 * (volunteerAttendance[course.name].volunteerAttended  / (volunteerAttendance[course.name].volunteerAbsent + volunteerAttendance[course.name].volunteerAttended + volunteerAttendance[course.name].volunteerExcused))).toFixed(2);
                    
                    var classAttendance = {
                        name: course.name,
                        numEnrolled: 1,
                        studentAttendancePercent: studentAttendance[course.name].studentAttendancePercent,
                        volunteerAttendancePercent: volunteerAttendance[course.name].volunteerAttendancePercent
                    }

                    ctrl.attendances.push(classAttendance);
                });
            })
        });
    
        console.log("attendances",ctrl.attendances)
        ctrl.studentAttendance =  studentAttendance;
        ctrl.volunteerAttendance =  volunteerAttendance;
        
        Object.assign(ctrl.studentAttendance,ctrl.volunteerAttendance);
        console.log("studentAttendance",ctrl.studentAttendance);
    }
    
    aggregateStudents() {
        var ctrl = this;
        ctrl.attendances = [];
        
        //ATTENDANCE PERCENTAGE = NUMBER OF SESSIONS ATTENDED / NUMBER OF SESSIONS TOTAL - NUMBER OF EXCUSED SESSIONS
        
        //GET NUMBER OF SESSIONS TOTAL
        
        angular.forEach(ctrl.students, function(student) {
            console.log("here");
           var student_id = student._id;
            
            ctrl.$http.get('/api/sessions/' + student_id + '/getSessionStudents')
            .then((res) => {
                
                //ALL SESSIONS
                var sessions = res.data;
                //GET NUMBER OF SESSIONS ATTENDED
                var attendedSessions = res.data.filter((session) => {
                    return session.attendance == 'Attended' ? true : false; 
                })
                
                //GET NUMBER OF SESSIONS EXCUSED
                var excusedSessions = res.data.filter((session) => {
                    return session.attendance == 'Excused' ? true : false; 
                })
                console.log("sessions",res.data);
                console.log("attended sessions",attendedSessions);
                console.log("excused sessions",excusedSessions);
                
                var sessionPercent = 100 * attendedSessions.length / (sessions.length - excusedSessions.length);
                console.log("sessionPercent", sessionPercent);
                
                
                ctrl.attendances.push({
                    name: student.name,
                    percent: isNaN(sessionPercent) ? null : sessionPercent
                })
            })
        });
    }
    
    aggregateVolunteers() {
        var ctrl = this;
        ctrl.attendances = [];
        
        //ATTENDANCE PERCENTAGE = NUMBER OF SESSIONS ATTENDED / NUMBER OF SESSIONS TOTAL - NUMBER OF EXCUSED SESSIONS
        
        //GET NUMBER OF SESSIONS TOTAL
        
        angular.forEach(ctrl.volunteers, function(volunteer) {
            
            var volunteer_user_id = volunteer.userID;
            
            ctrl.$http.get('/api/sessions/' + volunteer_user_id + '/getSessionVolunteers')
            .then((res) => {
                //ALL SESSIONS
                var sessions = res.data;
                //GET NUMBER OF SESSIONS ATTENDED
                var attendedSessions = res.data.filter((session) => {
                    return session.attendance == 'Attended' ? true : false; 
                })
                
                //GET NUMBER OF SESSIONS EXCUSED
                var excusedSessions = res.data.filter((session) => {
                    return session.attendance == 'Excused' ? true : false; 
                })
                console.log("sessions",res.data);
                console.log("attended sessions",attendedSessions);
                console.log("excused sessions",excusedSessions);
                
                var sessionPercent = 100 * attendedSessions.length / (sessions.length - excusedSessions.length);
                console.log("sessionPercent", sessionPercent);
                
                ctrl.attendances.push({
                    name: volunteer.User.name,
                    percent: isNaN(sessionPercent) ? null : sessionPercent
                })
            });
            
        });
    
    }
    
    
}

export default angular.module('refugeeApp.adminReports', ['refugeeApp.auth', 'ui.router'])
  .component('adminReports', {
      template: require('./index.html'),
      controller: AdminReports,
      controllerAs: 'ctrl'
  })
  .name;
